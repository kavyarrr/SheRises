import React from 'react'
import { motion } from 'framer-motion'

const colors = ['#FFB6C1','#FBCFE8','#C4B5FD','#A7F3D0','#FDE68A']

export default function ConfettiBurst({ active }) {
  if (!active) return null
  const pieces = Array.from({ length: 8 })
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {pieces.map((_, i) => (
        <motion.div key={i}
          initial={{ opacity: 1, scale: 1, x:0, y:0 }}
          animate={{ opacity: 0, scale: 0.6, x: (Math.random()*2-1)*120, y: -120 - Math.random()*80 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            width: 8 + Math.random()*8,
            height: 8 + Math.random()*8,
            background: colors[i % colors.length],
            borderRadius: 4,
            position: 'absolute'
          }}
        />
      ))}
    </div>
  )
}
