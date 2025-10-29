import React, { useEffect, useState } from 'react'

import placeholderImg from '../assets/images/food.jpg'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ConfettiBurst from '../components/ConfettiBurst'

export default function Explore() {
  const [items, setItems] = useState([])
  const [users, setUsers] = useState({})
  const [loading, setLoading] = useState(true)
  const [likes, setLikes] = useState({})
  const [saved, setSaved] = useState({})
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('/explore.json').then(r => r.json()),
      fetch('/users.json').then(r => r.json())
    ]).then(([explore, usersArr]) => {
      const map = Object.fromEntries(usersArr.map(u => [u.id, u]))
      setUsers(map)
      setItems(explore)
    }).finally(() => setLoading(false))
  }, [])

  // Load likes and saved from localStorage
  useEffect(() => {
    try {
      const l = JSON.parse(localStorage.getItem('explore_likes') || '{}')
      const s = JSON.parse(localStorage.getItem('explore_saved') || '{}')
      setLikes(l)
      setSaved(s)
    } catch {}
  }, [])

  function toggleLike(id) {
    setLikes(prev => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem('explore_likes', JSON.stringify(next))
      // trigger confetti by setting a transient flag (handled locally per item)
      return next
    })
  }

  function toggleSave(id) {
    setSaved(prev => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem('explore_saved', JSON.stringify(next))
      return next
    })
  }

  function openDetail(item) {
    setSelected(item)
    document.body.style.overflow = 'hidden'
  }

  function closeDetail() {
    setSelected(null)
    document.body.style.overflow = ''
  }

  return (
    <section>
      <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="text-3xl font-bold mb-6 text-slate-800">Explore</motion.h1>
      {loading ? (
        <div className="text-slate-700">Loading…</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map(item => {
            const owner = users[item.ownerId]
            const liked = !!likes[item.id]
            const isSaved = !!saved[item.id]
            return (
              <motion.div key={item.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="relative rounded-xl overflow-hidden bg-white/5 shadow-sm">
                <div onClick={() => openDetail(item)} role="button" tabIndex={0} onKeyDown={(e)=>{ if(e.key==='Enter') openDetail(item)}} className="group relative w-full aspect-square overflow-hidden cursor-pointer">
                  <img src={item.image} alt={item.title} onError={(e)=>{e.currentTarget.src = placeholderImg}} className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105" />

                  {/* Top-right actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <div className="relative">
                      <ConfettiBurst active={liked} />
                      <motion.button onClick={(e) => { e.stopPropagation(); toggleLike(item.id) }} aria-label="Like" initial={false} animate={liked ? { scale: [1, 1.25, 1], rotate: [0, -8, 0] } : { scale: 1, rotate: 0 }} transition={{ duration: 0.35 }} whileTap={{ scale: 0.9 }} className={`w-9 h-9 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm shadow ${liked ? 'text-pastel-pink' : 'text-slate-700'}`}>
                      {liked ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.54 0 3.04.99 3.57 2.36h.87C14.46 4.99 15.96 4 17.5 4 20 4 22 6 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364 4.318 12.682a4.5 4.5 0 010-6.364z" />
                        </svg>
                      )}
                    </motion.button>
                    </div>
                    <button onClick={(e)=>{e.stopPropagation(); toggleSave(item.id)}} aria-label="Save" className={`w-9 h-9 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm shadow ${isSaved ? 'text-pastel-lavender' : 'text-slate-700'}`}>
                      {isSaved ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M6 2a2 2 0 00-2 2v18l8-4 8 4V4a2 2 0 00-2-2H6z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5v14l7-3 7 3V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Bottom overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex items-center gap-3">
                    <Link to={`/profile/${owner?.id}`} className="shrink-0">
                      <img src={owner?.avatar} alt={owner?.name} onError={(e)=>{e.currentTarget.src = placeholderImg}} className="w-10 h-10 rounded-full border-2 border-white/60" />
                    </Link>
                    <div className="text-sm text-white">
                      <div className="font-semibold leading-tight">{item.title} <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">{item.category}</span></div>
                      <div className="text-xs opacity-80">by {owner?.name} • {item.category} • <span className="italic">{(item.tags||[]).slice(0,3).join(' • ')}</span></div>
                      <div className="mt-1 text-xs opacity-90">{item.shortDescription || (item.description && item.description.slice(0,80) + (item.description.length>80?'...':''))}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <div onClick={closeDetail} className="absolute inset-0 bg-black/50" />
            <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} exit={{y:20, opacity:0}} className="relative z-10 max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-xl">
              <div className="grid md:grid-cols-2">
                <div className="md:col-span-1">
                  <img src={selected.image} alt={selected.title} onError={(e)=>{e.currentTarget.src = placeholderImg}} className="w-full h-96 object-cover" />
                </div>
                <div className="p-6 md:col-span-1">
                  <div className="flex items-start gap-4">
                    <img src={users[selected.ownerId]?.avatar} alt={users[selected.ownerId]?.name} onError={(e)=>{e.currentTarget.src = placeholderImg}} className="w-14 h-14 rounded-full" />
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">{selected.title} <span className="text-pastel-pink">✨</span></h2>
                      <p className="text-sm text-slate-600">by <Link to={`/profile/${users[selected.ownerId]?.id}`} className="font-medium underline">{users[selected.ownerId]?.name}</Link> • {selected.category}</p>
                    </div>
                  </div>

                  <div className="mt-4 text-slate-700 leading-relaxed">
                    <p className="mb-3"><strong>About the business:</strong> {selected.business || selected.title} — {selected.longDescription || selected.description || 'No extended description provided.'}</p>
                    <p className="mb-3"><strong>Owner says:</strong> {users[selected.ownerId]?.bio || 'No bio available.'}</p>
                    <p className="mb-3 text-sm text-slate-500">Contact: <a href={`mailto:${users[selected.ownerId]?.email}`} className="underline">{users[selected.ownerId]?.email}</a></p>
                    {users[selected.ownerId]?.website && (
                      <p className="mb-3 text-sm text-slate-500">Website: <a href={users[selected.ownerId]?.website} target="_blank" rel="noreferrer" className="underline">{users[selected.ownerId]?.website}</a></p>
                    )}
                  </div>

                    <div className="mt-4 flex items-center gap-3">
                    <motion.button onClick={() => { toggleLike(selected.id) }} initial={false} animate={likes[selected.id] ? { scale: [1, 1.2, 1] } : { scale: 1 }} transition={{ duration: 0.35 }} className={`btn-primary px-4 py-2 ${likes[selected.id] ? 'bg-pastel-pink' : ''}`}>{likes[selected.id] ? 'Liked ❤️' : 'Like'}</motion.button>
                    <button onClick={() => { toggleSave(selected.id) }} className="btn-secondary px-4 py-2">{saved[selected.id] ? 'Saved' : 'Save'}</button>
                    <button onClick={closeDetail} className="px-4 py-2 border rounded-lg">Close</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}


