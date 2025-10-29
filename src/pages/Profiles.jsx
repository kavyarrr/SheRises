import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import placeholderImg from '../assets/images/food.jpg'

export default function Profiles() {
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [follows, setFollows] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/users.json').then(r => r.json()).then(setUsers).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    try {
      const f = JSON.parse(localStorage.getItem('sherise_follows') || '{}')
      setFollows(f)
    } catch {}
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.city || '').toLowerCase().includes(q) ||
      (u.business || '').toLowerCase().includes(q)
    )
  }, [users, query])

  function initialsOf(name) {
    const parts = String(name || 'User').split(' ').filter(Boolean)
    return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2)
  }

  function toggleFollow(id) {
    setFollows(prev => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem('sherise_follows', JSON.stringify(next))
      return next
    })
  }

  return (
    <section>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold mb-4 text-slate-800"
      >
        Profiles Directory
      </motion.h1>

      <div className="card p-4 mb-6">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name, city, or business…"
          className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
        />
      </div>

      {loading ? (
        <div className="text-slate-700">Loading…</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((u, idx) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.25) }}
              className="card overflow-hidden hover:shadow-soft hover:brightness-105 transition"
            >
              {/* small cover/banner to match user profile look */}
              <div className="w-full h-28" style={{backgroundImage:`url(${u.gallery?.[0] || u.avatar || placeholderImg})`, backgroundSize:'cover', backgroundPosition:'center'}} />

              <div className="p-5">
                <div className="flex items-center gap-3">
                  {u.avatar ? (
                    <img src={u.avatar} alt={u.name} onError={(e)=>{e.currentTarget.src = placeholderImg}} className="w-12 h-12 rounded-full border border-white/60" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-pastel-lavender text-slate-800 font-semibold grid place-items-center">
                      {initialsOf(u.name)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-slate-800">{u.name}</h3>
                    <p className="text-xs text-slate-600">{u.city} {u.city && u.business ? '•' : ''} {u.business}</p>
                  </div>
                </div>
                {u.bio && (
                  <p className="mt-3 text-sm text-slate-700 line-clamp-3">{u.bio}</p>
                )}
                <div className="mt-4 flex gap-2">
                  <button onClick={() => toggleFollow(u.id)} className={`px-3 py-1 rounded ${follows[u.id] ? 'bg-pastel-lavender text-white' : 'bg-white/80'}`}>{follows[u.id] ? 'Following' : 'Follow'}</button>
                  <Link to={`/profile/${u.id}`} className="btn-secondary flex-1 text-center">View Details</Link>
                  <button onClick={() => navigate(`/messages/${u.id}`)} className="btn-primary flex-1">Connect</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}






