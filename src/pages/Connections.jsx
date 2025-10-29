import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import placeholderImg from '../assets/images/food.jpg'

export default function Connections() {
  const [users, setUsers] = useState([])
  const [connections, setConnections] = useState({})
  const [convos, setConvos] = useState({})
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      fetch('/users.json').then(r => r.json()).catch(()=>[]),
      // local users if any
    ]).then(([remoteUsers]) => {
      const localUsers = (() => { try { return JSON.parse(localStorage.getItem('sherise_users')||'[]') } catch { return [] } })()
      const merged = [...localUsers, ...remoteUsers].filter(Boolean)
      const byId = Object.fromEntries(merged.map(u => [String(u.id), u]))
      setUsers(Object.values(byId))
    })

    try { setConnections(JSON.parse(localStorage.getItem('sherise_follows')||'{}')) } catch {}
    try { setConvos(JSON.parse(localStorage.getItem('sherise_conversations')||'{}')) } catch {}
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const connected = users.filter(u => connections[String(u.id)])
    if (!q) return connected
    return connected.filter(u => (u.name||'').toLowerCase().includes(q) || (u.business||'').toLowerCase().includes(q) || (u.city||'').toLowerCase().includes(q))
  }, [users, connections, query])

  function toggleFollow(id) {
    const next = { ...connections, [id]: !connections[id] }
    setConnections(next)
    localStorage.setItem('sherise_follows', JSON.stringify(next))
  }

  function lastMessagePreview(id) {
    const msgs = convos[String(id)] || []
    if (!msgs.length) return null
    const last = msgs[msgs.length-1]
    return { text: last.text || last, ts: last.ts || null }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Connections</h1>
          <p className="text-sm text-slate-600">People you follow — message them directly or view profiles.</p>
        </div>

        <div className="flex items-center gap-3">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search connections…" className="rounded-full border border-white/60 bg-white/80 px-4 py-2 focus:outline-none" />
          <Link to="/profiles" className="btn-ghost">Browse</Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-6">
          <p className="text-slate-700">No connections match your search. Try browsing profiles to follow people.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map(u => {
            const preview = lastMessagePreview(u.id)
            return (
              <div key={u.id} className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-3 flex flex-col items-center gap-3 text-center shadow-sm hover:shadow-2xl hover:-translate-y-1 transform transition duration-200 group">
                <div className="relative">
                  <div className="absolute -top-2 -left-2 bg-white/80 rounded-full p-1 text-xs shadow-sm">✨</div>
                  <img src={u.avatar || placeholderImg} onError={(e)=>{e.currentTarget.src = placeholderImg}} alt={u.name} className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover group-hover:scale-105 transition-transform duration-200" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white" style={{background: connections[u.id] ? '#A78BFA' : '#34D399'}} title={connections[u.id] ? 'Connected' : 'Not connected'} />
                </div>

                <div className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <span className="text-pink-400">💕</span>
                  <span>{u.name}</span>
                </div>
                <div className="text-xs text-slate-600 line-clamp-2" style={{maxWidth: 160}}>{preview?.text || u.business || u.city || (u.bio || '').slice(0,60)}</div>

                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => navigate(`/messages/${u.id}`)} className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-300 to-purple-300 text-white text-sm shadow">Message</button>
                  <button onClick={() => toggleFollow(u.id)} className={`px-3 py-1 rounded-full text-sm border ${connections[u.id] ? 'bg-white/80 text-slate-800' : 'bg-white/90 text-slate-800'}`}>{connections[u.id] ? 'Following' : 'Follow'}</button>
                </div>

                <div className="absolute top-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs">{u.city}</div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
