import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Messages() {
  const { id } = useParams()
  const [users, setUsers] = useState([])
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'them', text: 'Hi! Thanks for reaching out ✨' }
  ])
  const endRef = useRef(null)

  useEffect(() => {
    fetch('/users.json').then(r => r.json()).then(setUsers)
  }, [])

  const them = useMemo(() => users.find(u => String(u.id) === String(id)), [users, id])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setMessages(prev => [...prev, { role: 'me', text }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'them', text: 'Thanks! I will get back to you shortly.' }])
    }, 600)
  }

  return (
    <section className="max-w-3xl mx-auto">
      <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="text-3xl font-bold mb-4 text-slate-800">Messages</motion.h1>
      <div className="card p-4 md:p-6">
        <div className="flex items-center gap-3 border-b border-white/50 pb-3 mb-3">
          {them && <img src={them.avatar} alt={them.name} className="w-10 h-10 rounded-full border border-white/60" />}
          <div>
            <p className="font-semibold text-slate-800">{them?.name || 'Loading…'}</p>
            <p className="text-xs text-slate-600">{them?.business}</p>
          </div>
        </div>
        <div className="space-y-3 max-h-[48vh] overflow-y-auto pr-1">
          {messages.map((m, idx) => (
            <motion.div key={idx} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className={`flex ${m.role === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`${m.role === 'me' ? 'bg-pastel-lavender' : 'bg-white/80'} rounded-xl px-4 py-3 shadow-soft max-w-[80%] whitespace-pre-wrap`}>{m.text}</div>
            </motion.div>
          ))}
          <div ref={endRef} />
        </div>
        <form onSubmit={send} className="mt-4 flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message…" className="flex-1 rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender" />
          <button className="btn-primary" type="submit">Send</button>
        </form>
      </div>
    </section>
  )
}


