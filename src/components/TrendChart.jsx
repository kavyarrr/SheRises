import React, { useEffect, useMemo, useState, useCallback } from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend
} from 'recharts'

// Modern vibrant color palette
const COLORS = [
  '#FF3366', // Neon Pink
  '#FF6B6B', // Coral
  '#4ECDC4', // Turquoise
  '#45B7D1', // Ocean Blue
  '#96C3EB'  // Sky Blue
]

// Extract an emoji (first character) from momentum string like "🔥 Rising"
function momentumEmoji(momentum) {
  if (!momentum) return ''
  return momentum.trim().split(' ')[0]
}

export default function TrendChart() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch('/trends.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((json) => {
        if (!mounted) return
        // ensure shape: [{ name, trendScore, momentum }]
        const normalized = (Array.isArray(json) ? json : []).map((item) => ({
          name: item.name || 'Unknown',
          trendScore: typeof item.trendScore === 'number' ? item.trendScore : Number(item.trendScore) || 0,
          momentum: item.momentum || '',
        }))
        setData(normalized)
      })
      .catch((err) => {
        console.error('Failed to load trends.json', err)
        if (mounted) setError(err)
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  const total = useMemo(() => (data || []).reduce((s, d) => s + (d.trendScore || 0), 0), [data])

  if (loading) return (
    <div className="card bg-white rounded-lg shadow-md p-4">
      <p className="text-sm text-slate-600">Loading trends…</p>
    </div>
  )

  if (error) return (
    <div className="card bg-white rounded-lg shadow-md p-4">
      <p className="text-sm text-red-600">Failed to load trends. Please try again later.</p>
    </div>
  )

  if (!data || data.length === 0) return (
    <div className="card bg-white rounded-lg shadow-md p-4">
      <h4 className="text-md font-semibold mb-2">📊 Trending Product Categories</h4>
      <p className="text-sm text-slate-600">No new trends available today. Check back soon!</p>
    </div>
  )

  return (
    <div className="card bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500">
          ✨ Latest Product Trends
        </h4>
        <div className="text-sm bg-white/80 backdrop-blur px-4 py-1.5 rounded-full shadow-sm border border-blue-100/50">
          Total score: <span className="font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">{total}</span>
        </div>
      </div>

      <div className="w-full h-56 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {/* Radial gradient definition for each slice */}
              {COLORS.map((color, index) => (
                <radialGradient key={`gradient-${index}`} id={`gradient-${index}`}>
                  <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                </radialGradient>
              ))}
            </defs>
            <Pie
              data={data}
              dataKey="trendScore"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="70%"
              paddingAngle={2}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient-${index % COLORS.length})`}
                  className="transition-opacity duration-300 hover:opacity-80"
                  stroke="#fff"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl p-4 border border-blue-100/50">
                      <p className="text-lg font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent mb-1">
                        {momentumEmoji(data.momentum)} {data.name}
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm bg-gradient-to-r from-pink-100 to-blue-100 px-3 py-1 rounded-full inline-block">
                          Score: <span className="font-bold">{data.trendScore}</span>
                        </p>
                        <p className="text-xs text-blue-500/80 font-medium">
                          {data.momentum}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              verticalAlign="bottom"
              height={36}
              content={({ payload }) => (
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {payload.map((entry, index) => (
                    <div 
                      key={`legend-${index}`} 
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-sm border border-blue-100/50 transition-all duration-300 hover:scale-105 hover:shadow-md"
                    >
                      <div 
                        className="w-3 h-3 rounded-full shadow-inner" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                        {momentumEmoji(data[index]?.momentum)} {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Small list showing momentum badges next to category names (mobile-friendly) */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.map((d, i) => (
          <div 
            key={d.name} 
            className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-white/80 to-blue-50/30 backdrop-blur-sm border border-blue-100/50 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{momentumEmoji(d.momentum)}</span>
            <div className="space-y-1">
              <div className="font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                {d.name}
              </div>
              <div className="text-xs space-x-2">
                <span className="bg-gradient-to-r from-pink-100 to-blue-100 px-2 py-0.5 rounded-full">
                  Score: <span className="font-bold">{d.trendScore}</span>
                </span>
                <span className="text-blue-500/80 font-medium">{d.momentum}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
