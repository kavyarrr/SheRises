import React, { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import allProducts from '../data/all.json'
import placeholderImg from '../assets/images/food.jpg'

const TABS = ['All','Food','Beauty','Crafts','Decor','Fashion','Wellness']

function ProductCard({ product, onAdd }) {
  return (
    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="card p-4 flex flex-col">
      <div className="aspect-video rounded-xl bg-white/60 border border-white/40 mb-3 flex items-center justify-center text-sm text-slate-500 overflow-hidden">
        <img
          src={product.image || placeholderImg}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl"
          onError={(e) => { e.currentTarget.src = placeholderImg }}
        />
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
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [orderNote, setOrderNote] = useState('')

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('sherise_cart') || '[]')
      setCart(existing)
    } catch { setCart([]) }
  }, [])

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
    setCart(existing)
    setAddedMsg(`${item.name} added to cart`)
    setTimeout(()=>setAddedMsg(''), 1200)
  }

  function updateQty(idx, delta) {
    setCart(prev => {
      const next = [...prev]
      next[idx].count = Math.max(1, (next[idx].count || 1) + delta)
      try { localStorage.setItem('sherise_cart', JSON.stringify(next)) } catch {}
      return next
    })
  }

  function removeItem(idx) {
    setCart(prev => {
      const next = prev.filter((_, i) => i !== idx)
      try { localStorage.setItem('sherise_cart', JSON.stringify(next)) } catch {}
      return next
    })
  }

  const cartCount = cart.reduce((s, i) => s + (i.count || 1), 0)
  const cartSubtotal = cart.reduce((s, i) => {
    const n = parseInt((i.price || '0').replace(/[^0-9]/g, '')) || 0
    return s + n * (i.count || 1)
  }, 0)

  function placeOrder(details) {
    const orders = JSON.parse(localStorage.getItem('sherise_orders') || '[]')
    const order = { id: Date.now(), items: cart, total: cartSubtotal, details, note: orderNote, timestamp: new Date().toISOString() }
    orders.push(order)
    localStorage.setItem('sherise_orders', JSON.stringify(orders))
    // clear cart
    setCart([])
    try { localStorage.removeItem('sherise_cart') } catch {}
    setCheckoutOpen(false)
    setCartOpen(false)
    setOrderNote('')
    setAddedMsg('Order placed successfully 🎉')
    setTimeout(()=>setAddedMsg(''), 2000)
  }

  return (
    <section>
      <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="text-3xl font-bold mb-4 text-slate-800">Shop</motion.h1>
      <p className="text-slate-600 mb-4">Discover products from women-led home businesses.</p>

      <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
        {TABS.map(tab => (
          <button key={tab} onClick={()=>setActive(tab)} className={`px-4 py-2 rounded-xl border ${active===tab? 'bg-pastel-lavender text-slate-800 border-white/0' : 'bg-white/70 text-slate-700 border-white/60'} transition`}>
            {tab}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <button onClick={()=>setCartOpen(true)} className="relative px-3 py-2 bg-white/80 rounded-xl border">
            🛒 <span className="ml-2">Cart</span>
            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>}
          </button>
          <button onClick={()=>{ setCheckoutOpen(true); setCartOpen(true) }} className="px-3 py-2 bg-pastel-lavender text-slate-800 rounded-xl">Buy Now</button>
        </div>
      </div>

      {addedMsg && <div className="mb-4 text-sm text-slate-700">{addedMsg}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, idx) => (
          <ProductCard key={`${p.category}-${idx}-${p.id||idx}`} product={p} onAdd={addToCart} />
        ))}
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setCartOpen(false)} />
          <div className="ml-auto w-full sm:w-96 bg-white h-full shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Cart</h3>
              <div className="flex items-center gap-2">
                <button onClick={()=>setCheckoutOpen(true)} className="btn-primary">Checkout</button>
                <button onClick={()=>setCartOpen(false)} className="text-sm px-3 py-1">Close</button>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="text-center text-slate-500 mt-8">Your cart is empty.</div>
            ) : (
              <div className="space-y-4">
                {cart.map((it, i) => (
                  <div key={i} className="flex items-center gap-3 border-b pb-3">
                    <img src={it.image || placeholderImg} onError={e=>e.currentTarget.src=placeholderImg} alt={it.name} className="w-16 h-16 object-cover rounded-md" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-800">{it.name}</div>
                          <div className="text-sm text-slate-600">{it.business}</div>
                        </div>
                        <div className="text-sm text-slate-700">{it.price}</div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <button onClick={()=>updateQty(i, -1)} className="px-2 py-1 bg-gray-100 rounded">−</button>
                        <div className="px-3 py-1 border rounded">{it.count || 1}</div>
                        <button onClick={()=>updateQty(i, 1)} className="px-2 py-1 bg-gray-100 rounded">+</button>
                        <button onClick={()=>removeItem(i)} className="ml-3 text-sm text-rose-600">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">Subtotal</div>
                    <div className="font-semibold">₹{cartSubtotal}</div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={()=>setCheckoutOpen(true)} className="btn-primary flex-1">Proceed to checkout</button>
                    <button onClick={()=>{ setCart([]); localStorage.removeItem('sherise_cart') }} className="btn-secondary">Clear</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setCheckoutOpen(false)} />
          <div className="bg-white rounded-xl shadow-xl z-70 p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-2">Checkout</h3>
            <p className="text-sm text-slate-600 mb-4">Confirm your shipping details and place the order.</p>
            <CheckoutForm onPlace={(details)=>placeOrder(details)} onClose={()=>setCheckoutOpen(false)} note={orderNote} setNote={setOrderNote} />
          </div>
        </div>
      )}
    </section>
  )
}

function CheckoutForm({ onPlace, onClose, note, setNote }) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')

  return (
    <div>
      <div className="grid gap-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="border rounded px-3 py-2" />
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone" className="border rounded px-3 py-2" />
        <input value={city} onChange={e=>setCity(e.target.value)} placeholder="City" className="border rounded px-3 py-2" />
        <textarea value={address} onChange={e=>setAddress(e.target.value)} placeholder="Full address" className="border rounded px-3 py-2" />
        <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Order note (optional)" className="border rounded px-3 py-2" />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button onClick={()=>{ onPlace({ name, phone, city, address }); }} className="btn-primary">Place order</button>
        <button onClick={onClose} className="btn-secondary">Cancel</button>
      </div>
    </div>
  )
}


