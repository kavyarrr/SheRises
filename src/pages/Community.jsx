import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Community() {
  const [activeTab, setActiveTab] = useState('feed')
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [hirings, setHirings] = useState([])
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

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
          <div className="space-y-4">
            {posts.map(post => {
              const author = usersMap[post.userId]
              return (
                <motion.div key={post.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="card p-4">
                  <div className="flex items-center gap-3">
                    <Link to={`/profile/${author?.id}`}><img src={author?.avatar} alt={author?.name} className="w-10 h-10 rounded-full border border-white/60" /></Link>
                    <div>
                      <Link to={`/profile/${author?.id}`} className="font-semibold text-slate-800 hover:underline">{author?.name}</Link>
                      <p className="text-xs text-slate-600">{new Date(post.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-slate-800 whitespace-pre-wrap">{post.content}</p>
                  <div className="mt-3 border-t border-white/50 pt-3">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Comments</h4>
                    <div className="space-y-2">
                      {post.comments.map((c, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <img src={usersMap[c.userId]?.avatar} alt="" className="w-6 h-6 rounded-full border border-white/60 mt-1" />
                          <div className="bg-white/70 rounded-lg px-3 py-2 text-sm text-slate-800"><span className="font-medium">{usersMap[c.userId]?.name}:</span> {c.text}</div>
                        </div>
                      ))}
                    </div>
                    <CommentBox onSubmit={(text) => addComment(post.id, text)} />
                  </div>
                </motion.div>
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


