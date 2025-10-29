#!/usr/bin/env python3
"""
update_trends.py

Fetches Google Trends data (India) for a set of product/category keywords,
computes a 7-day average popularity score, picks top 5 trending categories,
and writes the results to public/trends.json. The script can run once (for
testing) or schedule itself to run daily at 10:00 local time.

Requirements:
  pip install -r requirements.txt

Usage:
  python scripts/update_trends.py --once   # run one-time and exit
  python scripts/update_trends.py          # run scheduler (daily at 10:00)

The script is robust to Google Trends failures: on error it preserves the
previous public/trends.json and logs an error message.
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime
import random

try:
    import schedule
    from pytrends.request import TrendReq
except ImportError as e:
    print("Missing Python dependency. Please run: pip install -r requirements.txt")
    raise


# --- Configuration ---------------------------------------------------------
# Categories used on the platform (restrict trend checks to these)
CATEGORIES = [
    "Embroidery",
    "Weaving",
    "Jewelry Making",
    "Handicrafts",
    "Pottery",
    "Textile Design",
    "Knitting",
    "Home Decor",
]

# Timeframe to fetch from Google Trends: past 7 days
TIMEFRAME = "now 7-d"

# Geo: India
GEO = "IN"

# Output file (relative to project root)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUTPUT_PATH = os.path.join(BASE_DIR, "public", "trends.json")

# Scheduler time (local) - 24-hour format
DAILY_TIME = "10:00"


def momentum_label(score: float) -> str:
    """Return an emoji label based on a numeric score (0-100).

    - score > 70 → "🔥 Rising"
    - 40–70 → "💎 Popular"
    - <40 → "✨ Niche"
    """
    if score > 70:
        return "🔥 Rising"
    if score >= 40:
        return "💎 Popular"
    return "✨ Niche"


def read_previous() -> list:
    """Read the previous trends.json if present. Returns parsed list or [] on error."""
    try:
        with open(OUTPUT_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except Exception:
        # If the file exists but is corrupted, don't propagate — return empty list
        return []


def write_output(data: list):
    """Write the trends list to OUTPUT_PATH atomically.

    We write to a temp file first then rename so partial writes won't corrupt the
    previous data if something goes wrong.
    """
    tmp_path = OUTPUT_PATH + ".tmp"
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    os.replace(tmp_path, OUTPUT_PATH)


def fetch_trends() -> list:
    """Fetch trends for CATEGORIES and return top-5 list suitable for JSON output.

    Returns a list of objects: { name, trendScore, momentum }
    """
    print(f"{datetime.now().isoformat()} - Starting Google Trends fetch for {len(CATEGORIES)} categories...")
    pytrends = TrendReq(hl="en-US", tz=330)  # tz=330 for IST

    results = []

    # To reduce 429 errors, request multiple keywords per payload (up to 5 per
    # request). pytrends supports up to 5 keywords in a single build_payload.
    BATCH_SIZE = 5
    MAX_RETRIES = 3

    # Create batches of keywords
    batches = [CATEGORIES[i:i + BATCH_SIZE] for i in range(0, len(CATEGORIES), BATCH_SIZE)]

    for batch in batches:
        attempt = 0
        while attempt < MAX_RETRIES:
            try:
                attempt += 1
                pytrends.build_payload(batch, timeframe=TIMEFRAME, geo=GEO)
                df = pytrends.interest_over_time()

                # If the dataframe is empty or None, set zeros for these keywords
                if df is None or df.empty:
                    for kw in batch:
                        results.append({"name": kw, "trendScore": 0})
                else:
                    for kw in batch:
                        if kw in df.columns:
                            series = df[kw]
                            avg = float(series.mean()) if not series.empty else 0.0
                        else:
                            avg = 0.0
                        results.append({"name": kw, "trendScore": int(round(avg))})

                # Successful batch fetch — break retry loop
                break

            except Exception as e:
                # Check if it looks like a rate-limit (HTTP 429) and retry with backoff
                msg = str(e).lower()
                is_rate_limit = "429" in msg or "rate" in msg or "limit" in msg

                if attempt < MAX_RETRIES and is_rate_limit:
                    backoff = (2 ** attempt) * 5 + random.uniform(0, 2)
                    print(f"Rate-limited or temporary error on batch {batch}. Retrying in {backoff:.1f}s (attempt {attempt}/{MAX_RETRIES})...")
                    time.sleep(backoff)
                    continue

                # On final failure for this batch, raise to let caller handle (preserve previous file)
                raise RuntimeError(f"Error fetching trends for batch {batch}: {e}") from e

        # Gentle pause between batches
        time.sleep(1 + random.uniform(0, 1))

    # sort descending and pick top 5
    results.sort(key=lambda x: x["trendScore"], reverse=True)
    top5 = results[:5]

    # attach momentum labels
    for item in top5:
        item["momentum"] = momentum_label(item["trendScore"])

    return top5


def job(verbose: bool = True):
    """Scheduled job: fetch trends and update OUTPUT_PATH. On error preserve previous file."""
    prev = read_previous()
    try:
        top5 = fetch_trends()
        write_output(top5)

        if verbose:
            print("📊 Updated top trending product categories:")
            for i, it in enumerate(top5, start=1):
                print(f"{i}. {it['name']} ({it['momentum']})")

    except Exception as e:
        print(f"[ERROR] Failed to update trends.json: {e}")
        if prev:
            print("Keeping previous trends.json unchanged.")
        else:
            print("No previous trends.json available to keep.")


def main():
    parser = argparse.ArgumentParser(description="Update public/trends.json using Google Trends (pytrends).")
    parser.add_argument("--once", action="store_true", help="Run the update job once and exit (useful for testing)")
    parser.add_argument("--time", default=DAILY_TIME, help="Daily time to run (HH:MM, 24h). Default: 10:00")
    args = parser.parse_args()

    if args.once:
        job()
        return

    # schedule daily job
    schedule.every().day.at(args.time).do(job)
    print(f"Scheduler started — will update trends daily at {args.time}. Press Ctrl+C to stop.")
    try:
        while True:
            schedule.run_pending()
            time.sleep(30)
    except KeyboardInterrupt:
        print("Scheduler stopped by user.")


if __name__ == "__main__":
    main()
