import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Profile() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    // If no ID in URL (viewing /profile), load current user from localStorage
    if (!id) {
      try {
        const currentUser = JSON.parse(localStorage.getItem('sherise_current_user') || 'null')
        if (currentUser) {
          setUser(currentUser)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      }
      setLoading(false)
      return
    }

    // If ID is provided (viewing /profile/:id), find that specific user
    const storedUsers = (() => {
      try { return JSON.parse(localStorage.getItem('sherise_users') || '[]') } catch { return [] }
    })()

    const localUser = storedUsers.find(u => String(u.id) === String(id))

    if (localUser) {
      setUser(localUser)
      setLoading(false)
    } else {
      fetch('/users.json')
        .then(r => r.json())
        .then(arr => {
          const u = arr.find(x => String(x.id) === String(id))
          setUser(u || null)
        })
        .catch(() => {
          setUser(null)
        })
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) return <div className="text-slate-700">Loading…</div>
  if (!user) return <div className="text-slate-700">Profile not found.</div>

  const avatarFallback = '/avatar-mock.svg'

  // Handle both flat structure (from users.json) and nested structure (from localStorage signup)
  const name = user.name || user.account?.fullName || 'User'
  const city = user.city || user.profile?.cityState || ''
  const business = user.business || user.profile?.businessName || user.profile?.category || ''
  const bio = user.bio || user.profile?.bio || ''
  const avatar = user.avatar || avatarFallback

  return (
    <section className="max-w-4xl mx-auto">
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="card p-6">
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <img
              src={avatar}
              alt={name}
              className="w-20 h-20 rounded-full border border-white/60"
              onError={(e) => { e.currentTarget.src = avatarFallback }}
            />
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{name}</h1>
              <p className="text-slate-600">{city} {city && business ? '•' : ''} {business}</p>
            </div>
          </div>
          <a href={`/messages/${user.id}`} className="btn-primary">Connect</a>
        </div>

        <p className="mt-4 text-slate-700">{bio}</p>

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
              <li>Experience: {user.experience || user.profile?.experience || 'Not specified'}</li>
              <li>Stage: {user.stage || user.profile?.businessStage || 'Not specified'}</li>
              {user.goals && user.goals.length > 0 && (
                <li>Goals: {user.goals.join(', ')}</li>
              )}
              {user.profile?.goals && user.profile.goals.length > 0 && (
                <li>Goals: {user.profile.goals.join(', ')}</li>
              )}
            </ul>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold text-slate-800">Contact</h3>
            <p className="mt-2 text-sm text-slate-700">Email: {user.email || user.account?.email || 'Not provided'}</p>
            {(user.phone || user.account?.phone) && (
              <p className="text-sm text-slate-700">Phone: {user.phone || user.account?.phone}</p>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  )
}


