import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HiringForm({ isOpen, onClose }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [budget, setBudget] = useState('')
  const [contact, setContact] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    
    const userData = JSON.parse(localStorage.getItem('sherise_current_user') || '{}')
    const hiringPost = {
      id: Date.now(),
      userId: userData.id,
      userName: userData.account?.fullName,
      userEmail: userData.account?.email,
      title,
      description,
      category,
      budget,
      contact,
      timestamp: new Date().toISOString()
    }

    const existing = JSON.parse(localStorage.getItem('sherise_hirings') || '[]')
    existing.push(hiringPost)
    localStorage.setItem('sherise_hirings', JSON.stringify(existing))

    // Reset form
    setTitle('')
    setDescription('')
    setCategory('')
    setBudget('')
    setContact('')
    onClose()
    
    // Trigger refresh of hiring list
    window.dispatchEvent(new CustomEvent('hiringUpdated'))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          className="card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Post a Hiring Request</h2>
          <p className="text-sm text-slate-600 mb-4">Looking for collaboration or need help with your business? Post your requirements here!</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">What are you looking for? *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                placeholder="e.g., Need help with product photography or Looking for suppliers"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                placeholder="Describe what you need help with. For example: 'I run a small clothing brand and need someone to help with social media management and content creation.'"
                rows={5}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                required
              >
                <option value="">Select category</option>
                <option value="Food & Beverages">Food & Beverages</option>
                <option value="Cosmetics & Beauty">Cosmetics & Beauty</option>
                <option value="Clothing & Fashion">Clothing & Fashion</option>
                <option value="Handicrafts">Handicrafts</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Services">Services</option>
                <option value="Marketing & Social Media">Marketing & Social Media</option>
                <option value="Photography & Design">Photography & Design</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Payment/Budget Range</label>
              <input
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                placeholder="e.g., ₹5,000 - ₹15,000 per project or per month"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Info *</label>
              <input
                value={contact}
                onChange={e => setContact(e.target.value)}
                className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                placeholder="Email or phone number"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1">Post Hiring Request</button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

