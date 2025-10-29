import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Messages() {
  const { id } = useParams()
  const [users, setUsers] = useState([])
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'them', text: 'Hi! Thanks for reaching out ✨', ts: Date.now() }
  ])
  const [typing, setTyping] = useState(false)
  const [follows, setFollows] = useState({})
  const endRef = useRef(null)

  useEffect(() => {
    fetch('/users.json').then(r => r.json()).then(setUsers)
  }, [])

  useEffect(() => {
    try { setFollows(JSON.parse(localStorage.getItem('sherise_follows')||'{}')) } catch { }
  }, [])

  const them = useMemo(() => users.find(u => String(u.id) === String(id)), [users, id])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function pushMessage(role, text) {
    const msg = { role, text, ts: Date.now() }
    setMessages(prev => [...prev, msg])
    return msg
  }

  function send(e) {
    if (e && e.preventDefault) e.preventDefault()
    const text = input.trim()
    if (!text) return
    pushMessage('me', text)
    setInput('')

    // simulate typing / reply
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      pushMessage('them', 'Thanks! I will get back to you shortly.')
    }, 900)
  }

  function sendProjectBrief() {
    const brief = `Hi! I'm interested in collaborating — here's a short brief:\n- Project: Collaborative pop-up market\n- Timeline: Next month\n- Need: 3 artisans and promo support\nWould you be open to discussing?`;
    pushMessage('me', brief)
    setTimeout(() => {
      setTyping(true)
      setTimeout(() => { setTyping(false); pushMessage('them', 'This sounds interesting — let\'s discuss timing!') }, 1000)
    }, 300)
  }

  return (
    <section className="max-w-3xl mx-auto">
      <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="text-3xl font-bold mb-4 text-slate-800">Messages</motion.h1>

      <div className="card p-0 md:p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <div className="flex items-center gap-3">
            {them ? (
              <img src={them.avatar} alt={them.name} className="w-12 h-12 rounded-full border border-white/60" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/10" />
            )}
            <div>
              <p className="font-semibold text-slate-800">{them?.name || 'Loading…'}</p>
              <p className="text-xs text-slate-600">{them?.business}</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => {
              const next = { ...follows, [them?.id]: !follows[them?.id] }
              setFollows(next); localStorage.setItem('sherise_follows', JSON.stringify(next))
            }} className={`px-3 py-1 rounded ${follows[them?.id] ? 'bg-pastel-lavender text-white' : 'bg-white/80'}`}>
              {follows[them?.id] ? 'Following' : 'Follow'}
            </button>
            <Link to={`/profile/${them?.id}`} className="text-sm text-slate-600 underline">View profile</Link>
            <button onClick={sendProjectBrief} title="Send a quick project brief" className="px-3 py-1 rounded bg-white/80">Send brief</button>
          </div>
        </div>

        {/* Messages area */}
        <div className="p-4" style={{maxHeight:'60vh'}}>
          <div className="space-y-3 max-h-[56vh] overflow-y-auto pr-1">
            {messages.map((m, idx) => (
              <motion.div key={idx} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className={`flex ${m.role === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${m.role === 'me' ? 'bg-pastel-lavender text-white' : 'bg-white/80 text-slate-800'} rounded-xl px-4 py-3 shadow-soft max-w-[80%] whitespace-pre-wrap`}>
                  <div className="text-sm leading-relaxed">{m.text}</div>
                  <div className="text-[11px] opacity-70 mt-1 text-right">{new Date(m.ts).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                </div>
              </motion.div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-white/80 rounded-xl px-4 py-3 shadow-soft">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />Typing…</div>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>
        </div>

        {/* Composer */}
        <form onSubmit={send} className="p-4 border-t bg-white flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); } }} placeholder="Type a message… (Shift+Enter for newline)" className="flex-1 rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender resize-none h-20" />
            <div className="flex flex-col gap-2">
              <label className="btn-ghost px-3 py-2 rounded" title="Attach file">
                <input type="file" className="hidden" />
                📎
              </label>
              <button className="btn-primary px-4 py-2" type="submit">Send</button>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span>Quick actions:</span>
            <button type="button" onClick={() => { setInput(prev => prev + ' Hi — I\'m interested in collaborating. Can we schedule a quick call?') }} className="underline">Suggest call</button>
            <button type="button" onClick={() => { setInput(prev => prev + ' Please share pricing details.' ) }} className="underline">Ask pricing</button>
          </div>
        </form>
      </div>
    </section>
  )
}


