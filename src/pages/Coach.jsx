import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getAiSuggestions } from '../lib/ai'

export default function Coach() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('sherise_current_user') || 'null')
    if (userData && !initialized) {
      const business = userData.profile?.businessName || 'your business'
      const category = userData.profile?.category ? ` in ${userData.profile.category}` : ''
      const greeting = `Hi ${userData.account?.fullName || 'there'}! 👋 I see you're working on ${business}${category}. How can I help you grow today?`
      setMessages([{ role: 'ai', text: greeting }])
      setInitialized(true)
    } else if (!initialized) {
      setMessages([{ role: 'ai', text: 'Hi! Tell me about your business (e.g., "I sell handmade jewelry").' }])
      setInitialized(true)
    }
  }, [initialized])

  async function handleSend(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    setMessages(prev => [...prev, { role: 'user', text: trimmed }])
    setInput('')
    setLoading(true)
    try {
      const suggestions = await getAiSuggestions(trimmed)
      const reply = suggestions.map(s => `• ${s}`).join('\n')
      setMessages(prev => [...prev, { role: 'ai', text: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I had trouble fetching ideas. Try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-3xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold mb-4 text-slate-800"
      >
        AI Coach
      </motion.h1>

      <div className="card p-4 md:p-6">
        <div className="space-y-3 max-h-[48vh] overflow-y-auto pr-1">
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`${m.role === 'user' ? 'bg-pastel-lavender' : 'bg-white/80'} rounded-xl px-4 py-3 shadow-soft max-w-[80%] whitespace-pre-wrap`}>{m.text}</div>
            </motion.div>
          ))}
          {loading && (
            <div className="text-slate-600 text-sm">Thinking…</div>
          )}
        </div>
        <form onSubmit={handleSend} className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Describe your business…"
            className="flex-1 rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
          />
          <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Sending…' : 'Send'}</button>
        </form>
      </div>
      <p className="mt-3 text-sm text-slate-600">This is a demo using a placeholder AI function. You can swap in Gemini/OpenAI later.</p>
    </section>
  )
}
