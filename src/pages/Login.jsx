import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Login() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const isAuthed = localStorage.getItem('sherise_auth') === 'true'
    if (isAuthed) navigate('/')
  }, [navigate])

  function handleLogin(e) {
    e.preventDefault()
    // Check against stored users
    const storedUsers = JSON.parse(localStorage.getItem('sherise_users') || '[]')
    const user = storedUsers.find(u => u.account?.email === email)
    
    if (user) {
      // Set current user data
      localStorage.setItem('sherise_current_user', JSON.stringify(user))
      localStorage.setItem('sherise_user_name', user.account?.fullName || name)
      localStorage.setItem('sherise_user_email', email)
    } else {
      // Create a minimal user entry for login-only users
      const tempUser = {
        id: Date.now(),
        account: { fullName: name, email, phone: null },
        profile: {}
      }
      localStorage.setItem('sherise_current_user', JSON.stringify(tempUser))
      localStorage.setItem('sherise_user_name', name)
      localStorage.setItem('sherise_user_email', email)
    }
    
    // Set auth
    if (remember) {
      localStorage.setItem('sherise_auth', 'true')
    } else {
      sessionStorage.setItem('sherise_auth', 'true')
    }
    navigate('/')
  }

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-8 max-w-md w-full text-center"
      >
        <h1 className="text-3xl font-bold text-slate-800">Welcome to SheRise</h1>
        <p className="mt-2 text-slate-700">Sign in to continue</p>
        <form onSubmit={handleLogin} className="mt-6 text-left">
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
            placeholder="Your name"
            autoComplete="name"
          />

          <label className="block mt-4 text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <button type="button" onClick={() => setShowPassword(v => !v)} className="text-sm text-slate-600 hover:underline">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" className="rounded" checked={remember} onChange={e => setRemember(e.target.checked)} />
              Remember me
            </label>
            <button type="button" onClick={() => alert('This is a demo. No password reset.')} className="text-sm text-slate-600 hover:underline">Forgot password?</button>
          </div>

          <button type="submit" className="btn-primary w-full mt-6">Sign in</button>
        </form>
        
        <p className="mt-4 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-pastel-lavender hover:underline font-medium">Sign up</Link>
        </p>
      </motion.div>
    </div>
  )
}


