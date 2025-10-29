import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Profile() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/users.json').then(r => r.json()).then(arr => {
      const u = arr.find(x => String(x.id) === String(id))
      setUser(u || null)
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-slate-700">Loading…</div>
  if (!user) return <div className="text-slate-700">Profile not found.</div>

  return (
    <section className="max-w-4xl mx-auto">
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="card p-6">
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full border border-white/60" />
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{user.name}</h1>
              <p className="text-slate-600">{user.city} • {user.business}</p>
            </div>
          </div>
          <a href={`/messages/${user.id}`} className="btn-primary">Connect</a>
        </div>

        <p className="mt-4 text-slate-700">{user.bio}</p>

        {Array.isArray(user.gallery) && user.gallery.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-slate-800 mb-3">Posts</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {user.gallery.map((url, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden border border-white/50 shadow-soft aspect-square bg-white/50" style={{backgroundImage:`url(${url})`, backgroundSize:'cover', backgroundPosition:'center'}} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="card p-4">
            <h3 className="font-semibold text-slate-800">Highlights</h3>
            <ul className="mt-2 text-sm text-slate-700 list-disc list-inside">
              <li>Featured in local craft fair</li>
              <li>100+ happy customers</li>
              <li>Sustainable packaging</li>
            </ul>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold text-slate-800">Contact</h3>
            <p className="mt-2 text-sm text-slate-700">Email: hello@example.com</p>
            <p className="text-sm text-slate-700">Instagram: @sherise_demo</p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}


