// ai.js
export const generateAIResponse = async (prompt) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const model = "gemini-2.0-flash-exp";

  // If no API key is configured, return a helpful fallback so the UI remains usable
  if (!apiKey) {
    return `I don't have access to the AI service in this environment. Try setting VITE_GEMINI_API_KEY in your .env for better answers — meanwhile, here's a starter tip:\n\n• Define your top 3 products and one sentence value proposition.\n• Post one photo + one customer quote each week.`
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // Parse Gemini’s output
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                 "Sorry, I couldn’t generate a response right now.";
    return text;
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    return "Error contacting AI service. Please try again later.";
  }
};


// Legacy placeholder AI suggestion function
export async function getAiSuggestions(userBusinessText) {
  const text = (userBusinessText || '').toLowerCase().trim()
  const trends = await fetch('/trends.json').then(r => r.json()).catch(() => [])

  const relatedTrends = trends.filter(t => text.includes(t.category.toLowerCase()) || t.keywords.some(k => text.includes(k.toLowerCase())))

  const genericTips = [
    'Define a simple weekly content plan (1 product post, 1 story, 1 customer quote).',
    'Bundle 2+ items for a limited-time offer to increase average order value.',
    'Ask 3 recent customers for a short testimonial; share with a photo.',
    'Offer local delivery/pickup and mention city name in posts for discovery.'
  ]

  const trendText = relatedTrends.length
    ? `Trending insight: ${relatedTrends.map(t => `${t.name} (${t.momentum})`).slice(0,2).join(', ')}. Consider aligning your offer or content with these.`
    : 'No direct trends matched, but you can still ride seasonal moments and local events.'

  return [
    `I read: "${userBusinessText}"`,
    trendText,
    `Audience hook: Share your origin story in 3 lines and a photo.`,
    genericTips[Math.floor(Math.random() * genericTips.length)]
  ]
}


