import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import allProducts from '../data/all.json'

const TABS = ['All','Food','Beauty','Crafts','Decor','Fashion','Wellness']

function ProductCard({ product, onAdd }) {
  return (
    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="card p-4 flex flex-col">
      <div className="aspect-video rounded-xl bg-white/60 border border-white/40 mb-3 flex items-center justify-center text-sm text-slate-500">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
        ) : (
          <span>No image</span>
        )}
      </div>
      <h3 className="font-semibold text-slate-800">{product.name}</h3>
      <p className="text-sm text-slate-600">{product.business}</p>
      <p className="mt-1 text-slate-800">{product.price} <span className="text-sm text-slate-500">• {product.quantity}</span></p>
      <p className="mt-2 text-sm text-slate-700 line-clamp-2">{product.description}</p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => onAdd(product)} className="btn-primary flex-1">Add to Cart</button>
        <span className="px-3 py-2 rounded-xl text-xs bg-white/70 border border-white/50">{product.category}</span>
      </div>
    </motion.div>
  )
}

export default function Shop() {
  const [active, setActive] = useState('All')
  const [addedMsg, setAddedMsg] = useState('')

  const products = useMemo(() => {
    if (active === 'All') return allProducts
    return allProducts.filter(p => p.category === active)
  }, [active])

  function addToCart(item) {
    const existing = JSON.parse(localStorage.getItem('sherise_cart') || '[]')
    const found = existing.find(x => x.name === item.name && x.business === item.business)
    if (found) {
      found.count = (found.count || 1) + 1
    } else {
      existing.push({ ...item, count: 1 })
    }
    localStorage.setItem('sherise_cart', JSON.stringify(existing))
    setAddedMsg(`${item.name} added to cart`)
    setTimeout(()=>setAddedMsg(''), 1200)
  }

  return (
    <section>
      <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="text-3xl font-bold mb-4 text-slate-800">Shop</motion.h1>
      <p className="text-slate-600 mb-4">Discover products from women-led home businesses.</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map(tab => (
          <button key={tab} onClick={()=>setActive(tab)} className={`px-4 py-2 rounded-xl border ${active===tab? 'bg-pastel-lavender text-slate-800 border-white/0' : 'bg-white/70 text-slate-700 border-white/60'} transition`}>
            {tab}
          </button>
        ))}
      </div>

      {addedMsg && <div className="mb-4 text-sm text-slate-700">{addedMsg}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, idx) => (
          <ProductCard key={`${p.category}-${idx}-${p.id||idx}`} product={p} onAdd={addToCart} />
        ))}
      </div>
    </section>
  )
}


