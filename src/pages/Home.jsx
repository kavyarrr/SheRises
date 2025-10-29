import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid md:grid-cols-2 gap-8 items-center"
    >
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-800">
          Empowering home-based women entrepreneurs with friendly AI and community
        </h1>
        <p className="text-lg text-slate-700">
          SheRise helps you grow your business with an AI coach, market trends, and a supportive community of women.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/coach" className="btn-primary">Meet the AI Coach</Link>
          <Link to="/community" className="btn-secondary">Explore Community</Link>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="card p-6"
      >
        <div className="grid grid-cols-3 gap-4">
          <div className="h-28 rounded-2xl" style={{ background: 'linear-gradient(135deg,#F8C8DC,#FFFFFF)' }} />
          <div className="h-28 rounded-2xl" style={{ background: 'linear-gradient(135deg,#C7C5F4,#FFFFFF)' }} />
          <div className="h-28 rounded-2xl" style={{ background: 'linear-gradient(135deg,#F3E9DC,#FFFFFF)' }} />
          <div className="h-28 rounded-2xl" style={{ background: 'linear-gradient(135deg,#D6F5E5,#FFFFFF)' }} />
          <div className="h-28 rounded-2xl" style={{ background: 'linear-gradient(135deg,#D7E8FF,#FFFFFF)' }} />
          <div className="h-28 rounded-2xl" style={{ background: 'linear-gradient(135deg,#F8C8DC,#FFFFFF)' }} />
        </div>
        <p className="mt-6 text-sm text-slate-600">
          Soft pastel visuals and smooth transitions make SheRise calm, modern, and friendly.
        </p>
      </motion.div>
    </motion.section>
  )
}


