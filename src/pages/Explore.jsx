import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Explore() {
  const [items, setItems] = useState([])
  const [users, setUsers] = useState({})
  const [loading, setLoading] = useState(true)

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

  return (
    <section>
      <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="text-3xl font-bold mb-6 text-slate-800">Explore</motion.h1>
      {loading ? (
        <div className="text-slate-700">Loading…</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => {
            const owner = users[item.ownerId]
            return (
              <motion.div key={item.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="card overflow-hidden">
                <div className="aspect-video w-full bg-white/50" style={{backgroundImage:`url(${item.image})`, backgroundSize:'cover', backgroundPosition:'center'}} />
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <Link to={`/profile/${owner?.id}`}><img src={owner?.avatar} alt={owner?.name} className="w-10 h-10 rounded-full border border-white/60" /></Link>
                    <div>
                      <h3 className="font-semibold text-slate-800">{item.title}</h3>
                      <p className="text-xs text-slate-600">by <Link to={`/profile/${owner?.id}`} className="underline underline-offset-2">{owner?.name}</Link> • {item.category}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </section>
  )
}


