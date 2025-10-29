import React, { useEffect, useState } from 'react'
import placeholderImg from '../assets/images/food.jpg'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Profile() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [follows, setFollows] = useState({})
  const [posts, setPosts] = useState([])
  const [postsPage, setPostsPage] = useState(1)
  const POSTS_PER_PAGE = 6

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

  // Load follows map from localStorage
  useEffect(() => {
    try {
      const f = JSON.parse(localStorage.getItem('sherise_follows') || '{}')
      setFollows(f)
    } catch {}
  }, [])

  // Ensure body overflow restored (in case a modal left it hidden) so profile pages can scroll
  useEffect(() => {
    document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [])

  // When a user is loaded, try to collect their gallery from explore.json if not present
  useEffect(() => {
    if (!user) return
    // If user already has a gallery array, keep it. Otherwise try to populate from explore.json
    if (Array.isArray(user.gallery) && user.gallery.length > 0) return

    fetch('/explore.json')
      .then(r => r.json())
      .then(posts => {
        const gallery = posts.filter(p => String(p.ownerId) === String(user.id)).map(p => p.image).filter(Boolean)
        if (gallery.length > 0) {
          setUser(prev => ({ ...prev, gallery }))
        }
        // also keep a list of posts objects for "Previous posts"
        const userPosts = posts.filter(p => String(p.ownerId) === String(user.id)).sort((a,b)=> (b.id||0)-(a.id||0))
        setPosts(userPosts)
      })
      .catch(() => {})
  }, [user])

  if (loading) return <div className="text-slate-700">Loading…</div>
  if (!user) return <div className="text-slate-700">Profile not found.</div>

  const avatarFallback = '/avatar-mock.svg'

  // Handle both flat structure (from users.json) and nested structure (from localStorage signup)
  const name = user.name || user.account?.fullName || 'User'
  const city = user.city || user.profile?.cityState || ''
  const business = user.business || user.profile?.businessName || user.profile?.category || ''
  const bio = user.bio || user.profile?.bio || ''
  const avatar = user.avatar || avatarFallback

  const isFollowing = !!follows[user.id]

  function toggleFollow() {
    setFollows(prev => {
      const next = { ...prev, [user.id]: !prev[user.id] }
      localStorage.setItem('sherise_follows', JSON.stringify(next))
      return next
    })
  }

  return (
    <section className="max-w-4xl mx-auto">
      {/* Cover banner */}
      <div className="w-full h-40 rounded-xl overflow-hidden mb-4">
        <div className="w-full h-full bg-slate-200" style={{backgroundImage:`url(${(user.gallery && user.gallery[0]) || placeholderImg})`, backgroundSize:'cover', backgroundPosition:'center'}} />
      </div>
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
          <div className="flex items-center gap-3">
            <button onClick={toggleFollow} className={`px-4 py-2 rounded-lg border ${isFollowing ? 'bg-pastel-lavender text-white' : 'bg-white/80'}`}>
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <a href={`/messages/${user.id}`} className="btn-primary">Connect</a>
          </div>
        </div>

        <p className="mt-4 text-slate-700">{bio}</p>

        {Array.isArray(user.gallery) && user.gallery.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-slate-800 mb-3">Posts</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {user.gallery.map((url, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden border border-white/50 shadow-soft aspect-square bg-white/50">
                  <img src={url} alt={`post-${idx}`} onError={(e)=>{e.currentTarget.src = placeholderImg}} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Previous posts (from explore.json) */}
        {posts.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-slate-800 mb-3">Previous posts</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {posts.slice(0, postsPage * POSTS_PER_PAGE).map(p => (
                <div key={p.id} className="rounded-2xl overflow-hidden border border-white/50 shadow-soft aspect-square bg-white/50">
                  <img src={p.image} alt={p.title || `post-${p.id}`} onError={(e)=>{e.currentTarget.src = placeholderImg}} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            {posts.length > postsPage * POSTS_PER_PAGE && (
              <div className="mt-4 text-center">
                <button onClick={() => setPostsPage(prev => prev + 1)} className="px-4 py-2 rounded-lg border bg-white/80">Load more</button>
              </div>
            )}
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


