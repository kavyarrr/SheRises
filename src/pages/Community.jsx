import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import placeholderImg from '../assets/images/food.jpg'
import ConfettiBurst from '../components/ConfettiBurst'

export default function Community() {
  const [activeTab, setActiveTab] = useState('feed')
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [hirings, setHirings] = useState([])
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [likes, setLikes] = useState({})
  const [confettiActive, setConfettiActive] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('/users.json').then(r => r.json()),
      fetch('/posts.json').then(r => r.json()),
      fetch('/hirings.json').then(r => r.json()).catch(() => [])
    ]).then(([u, p, h]) => {
      setUsers(u)
      setPosts(p)
      setHirings(h)
    }).finally(() => setLoading(false))

    // Load hirings from localStorage too
    const localHirings = JSON.parse(localStorage.getItem('sherise_hirings') || '[]')
    if (localHirings.length > 0) {
      setHirings(prev => [...prev, ...localHirings])
    }

    // Listen for hiring updates
    const handleHiringUpdate = () => {
      const updated = JSON.parse(localStorage.getItem('sherise_hirings') || '[]')
      setHirings(prev => {
        const existingIds = new Set(prev.map(h => h.id))
        const newOnes = updated.filter(h => !existingIds.has(h.id))
        return [...prev, ...newOnes]
      })
    }
    window.addEventListener('hiringUpdated', handleHiringUpdate)

    // Listen for hiring form open - switch to Get Hired tab
    const handleOpenHiringForm = () => {
      setActiveTab('hiring')
    }
    window.addEventListener('openHiringForm', handleOpenHiringForm)

    // load likes for community posts
    try {
      const l = JSON.parse(localStorage.getItem('sherise_post_likes') || '{}')
      setLikes(l)
    } catch {}

    return () => {
      window.removeEventListener('hiringUpdated', handleHiringUpdate)
      window.removeEventListener('openHiringForm', handleOpenHiringForm)
    }
  }, [])

  const usersMap = useMemo(() => Object.fromEntries(users.map(u => [u.id, u])), [users])

  function addComment(postId, text) {
    if (!text.trim()) return
    const currentUser = users[0] || { id: 999, name: 'You' }
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, { userId: currentUser.id, text }] } : p))
  }

  function addPost() {
    if (!newPost.trim()) return
    const currentUser = users[0] || { id: 999, name: 'You' }
    setPosts(prev => [{ id: Date.now(), userId: currentUser.id, content: newPost, timestamp: new Date().toISOString(), comments: [] }, ...prev])
    setNewPost('')
  }

  function toggleLike(postId) {
    setLikes(prev => {
      const next = { ...prev, [postId]: !prev[postId] }
      localStorage.setItem('sherise_post_likes', JSON.stringify(next))

      // trigger a short confetti burst when the post is liked
      if (next[postId]) {
        setConfettiActive(postId)
        setTimeout(() => setConfettiActive(null), 900)
      }
      return next
    })
  }

  return (
    <section className="max-w-3xl mx-auto">
      <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="text-3xl font-bold mb-6 text-slate-800">Community</motion.h1>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/50">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-2 font-medium transition ${activeTab === 'feed' ? 'text-slate-800 border-b-2 border-pastel-lavender' : 'text-slate-600'}`}
        >
          Feed
        </button>
        <button
          onClick={() => setActiveTab('hiring')}
          className={`px-4 py-2 font-medium transition ${activeTab === 'hiring' ? 'text-slate-800 border-b-2 border-pastel-lavender' : 'text-slate-600'}`}
        >
          Get Hired
        </button>
      </div>

      {loading ? (
        <div className="text-slate-700">Loading…</div>
      ) : activeTab === 'feed' ? (
        <>
          <div className="card p-4 mb-6">
            <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Share an update…" className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"></textarea>
            <div className="mt-3 flex justify-end"><button onClick={addPost} className="btn-primary">Post</button></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {posts.map(post => {
              const author = usersMap[post.userId]
              const image = post.image || author?.gallery?.[0] || placeholderImg
              const liked = !!likes[post.id]
              return (
                <motion.article key={post.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="rounded-2xl overflow-hidden shadow-lg bg-white">
                  <div className="relative">
                    <img src={image} onError={(e)=>{e.currentTarget.src = placeholderImg}} alt={post.content.slice(0,40)} className="w-full h-44 object-cover" />
                    <div className="absolute left-3 top-3 bg-white/80 rounded-full p-1">
                      <Link to={`/profile/${author?.id}`}><img src={author?.avatar} onError={(e)=>{e.currentTarget.src = placeholderImg}} alt={author?.name} className="w-9 h-9 rounded-full border" /></Link>
                    </div>
                    <div className="absolute right-3 top-3 flex gap-2">
                          <div className="relative">
                            <motion.button onClick={() => toggleLike(post.id)} initial={false} animate={liked ? { scale: [1, 1.25, 1] } : { scale: 1 }} transition={{ duration: 0.35 }} whileTap={{ scale: 0.9 }} className={`w-9 h-9 rounded-full flex items-center justify-center ${liked ? 'bg-pink-200 text-pink-600' : 'bg-white/80'}`}>❤</motion.button>
                            <div className="pointer-events-none absolute -right-1 -top-1">
                              <ConfettiBurst active={confettiActive === post.id} />
                            </div>
                          </div>
                          <Link to={`/messages/${author?.id}`} className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center">✉️</Link>
                        </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Link to={`/profile/${author?.id}`} className="font-semibold text-slate-800 hover:underline">{author?.name}</Link>
                        <div className="text-xs text-slate-500">{new Date(post.timestamp).toLocaleString()}</div>
                      </div>
                      <div className="text-sm text-slate-600">{post.tags ? post.tags.map(t => <span key={t} className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">#{t}</span>) : null}</div>
                    </div>

                    <p className="mt-3 text-slate-800">{post.content}</p>
                    {post.shortDescription && <p className="mt-2 text-sm text-slate-600">{post.shortDescription}</p>}

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-600">{(post.comments||[]).length} comments • {liked ? 'You liked this' : ''}</div>
                      <div>
                        <CommentBox onSubmit={(text) => addComment(post.id, text)} />
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="card p-4 bg-pastel-lavender/30">
            <p className="text-sm text-slate-700">
              <strong>Looking for work?</strong> Browse collaboration opportunities and connect with women-led ventures. Find partners, gigs, or projects that match your skills and help your home business grow!
            </p>
          </div>

          {/* Category filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap
                ${selectedCategory === 'All' 
                  ? 'bg-pink-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
            >
              All Opportunities
            </button>
            {[...new Set(hirings.map(h => h.category))].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap
                  ${selectedCategory === category 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
              >
                {category}
              </button>
            ))}
          </div>

          {hirings.length === 0 ? (
            <div className="card p-6 text-center text-slate-600">
              <p>No hiring requests yet. Be the first to post one!</p>
            </div>
          ) : (
            hirings
              .filter(hiring => selectedCategory === 'All' || hiring.category === selectedCategory)
              .map(hiring => (
              <motion.div key={hiring.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-pastel-pink px-2 py-1 rounded">{hiring.category}</span>
                      <span className="text-xs text-slate-500">{new Date(hiring.timestamp).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-semibold text-lg text-slate-800 mb-2">{hiring.title}</h3>
                    <p className="text-slate-700 mb-3">{hiring.description}</p>
                    {hiring.budget && (
                      <p className="text-sm text-slate-600 mb-2"><span className="font-medium">Budget:</span> {hiring.budget}</p>
                    )}
                    <p className="text-sm text-slate-600"><span className="font-medium">Posted by:</span> {hiring.userName}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/50">
                  <a href={`/messages/${hiring.userId}`} className="btn-primary">Connect with me</a>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

    </section>
  )
}

function CommentBox({ onSubmit }) {
  const [text, setText] = useState('')
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSubmit(text); setText('')}} className="mt-3 flex gap-2">
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a comment…" className="flex-1 rounded-xl border border-white/60 bg-white/80 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pastel-lavender" />
      <button className="btn-secondary" type="submit">Comment</button>
    </form>
  )
}


