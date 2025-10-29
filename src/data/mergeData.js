import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataDir = __dirname
const files = [
  { name: 'food.json', category: 'Food' },
  { name: 'beauty.json', category: 'Beauty' },
  { name: 'crafts.json', category: 'Crafts' },
  { name: 'decor.json', category: 'Decor' },
  { name: 'fashion.json', category: 'Fashion' },
  { name: 'wellness.json', category: 'Wellness' },
]

function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to read', filePath, e.message)
    return []
  }
}

function main() {
  const merged = []
  for (const f of files) {
    const p = path.join(dataDir, f.name)
    const arr = readJson(p)
    if (Array.isArray(arr)) {
      for (const item of arr) {
        merged.push({ ...item, category: f.category })
      }
    }
  }
  const outPath = path.join(dataDir, 'all.json')
  fs.writeFileSync(outPath, JSON.stringify(merged, null, 2), 'utf-8')
  console.log(`Wrote ${merged.length} items to`, outPath)
}

main()


