import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Signup() {
  const navigate = useNavigate()
  
  // Basic Account Info
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // Profile for Personalization
  const [businessName, setBusinessName] = useState('')
  const [category, setCategory] = useState('')
  const [experience, setExperience] = useState('')
  const [cityState, setCityState] = useState('')
  const [businessStage, setBusinessStage] = useState('')
  const [goals, setGoals] = useState([])
  const [bio, setBio] = useState('')

  const goalOptions = [
    'Grow sales online',
    'Learn marketing',
    'Find suppliers',
    'Automate tasks',
    'Get mentorship'
  ]

  useEffect(() => {
    // If user is already logged in, prefill the form for editing their profile
    const stored = localStorage.getItem('sherise_current_user')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        // Handle both flat structure (from users.json) and nested structure
        setFullName(data.name || data.account?.fullName || '')
        setEmail(data.email || data.account?.email || '')
        setPhone(data.phone || data.account?.phone || '')

        setBusinessName(data.business || data.profile?.businessName || '')
        setCategory(data.category || data.profile?.category || '')
        setExperience(data.experience || data.profile?.experience || '')
        setCityState(data.city || data.profile?.cityState || '')
        setBusinessStage(data.stage || data.profile?.businessStage || '')
        setGoals(data.goals || data.profile?.goals || [])
        setBio(data.bio || data.profile?.bio || '')

        // keep editing id in state via a hidden variable on submit
        // if no stored current user, leave as signup flow
      } catch {}
    }
  }, [navigate])

  function handleGoalToggle(goal) {
    setGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    )
  }

  function handleSignup(e) {
    e.preventDefault()
    
    // Get current user if editing
    let currentUserId = null
    const current = localStorage.getItem('sherise_current_user')
    if (current) {
      try {
        const parsed = JSON.parse(current)
        currentUserId = parsed.id
      } catch {}
    }

    // Build the updated user object - use flat structure like users.json
    const signupData = {
      id: currentUserId || Date.now(),
      name: fullName,
      email: email,
      phone: phone || null,
      city: cityState,
      business: businessName,
      category: category,
      experience: experience,
      stage: businessStage,
      goals: goals,
      bio: bio || '',
      avatar: '/avatar-mock.svg', // Use mock avatar
      gallery: [] // Can be updated later
    }

    // Update localStorage users list
    const existingUsers = JSON.parse(localStorage.getItem('sherise_users') || '[]')
    const idx = existingUsers.findIndex(u => String(u.id) === String(signupData.id))
    
    if (idx >= 0) {
      // Update existing user
      existingUsers[idx] = signupData
      console.log('✅ Updated existing profile:', signupData.id)
    } else {
      // Add new user
      existingUsers.push(signupData)
      console.log('✅ Created new profile:', signupData.id)
    }

    // Persist
    localStorage.setItem('sherise_users', JSON.stringify(existingUsers))
    localStorage.setItem('sherise_auth', 'true')
    localStorage.setItem('sherise_user_name', fullName)
    localStorage.setItem('sherise_user_email', email)
    localStorage.setItem('sherise_current_user', JSON.stringify(signupData))

    console.log('✅ Saved to localStorage. Navigating to /profile-setup')

    // Navigate to the profile setup page
    navigate('/profile-setup')
  }

  return (
    <div className="min-h-[70vh] grid place-items-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-8 max-w-2xl w-full"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Join SheRise</h1>
          <p className="mt-2 text-slate-700">Create your account to get started</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Basic Account Info */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-white/50 pb-2">Basic Account Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email ID *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700">Password *</label>
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="text-sm text-slate-600 hover:underline">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                  placeholder="+91 1234567890"
                />
              </div>
            </div>
          </div>

          {/* Profile for Personalization */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-white/50 pb-2">Profile for Personalization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Name (or "Idea Stage") *</label>
                <input
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                  placeholder="Your business name or idea"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category / Domain *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Handicrafts">Handicrafts</option>
                  <option value="Food">Food</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Services">Services</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Home Decor">Home Decor</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience *</label>
                <select
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                  required
                >
                  <option value="">Select experience</option>
                  <option value="Beginner">Beginner</option>
                  <option value="1-3 yrs">1–3 yrs</option>
                  <option value="3+ yrs">3+ yrs</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City / State *</label>
                <input
                  value={cityState}
                  onChange={e => setCityState(e.target.value)}
                  className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                  placeholder="e.g., Mumbai, Maharashtra"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Stage *</label>
                <select
                  value={businessStage}
                  onChange={e => setBusinessStage(e.target.value)}
                  className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                  required
                >
                  <option value="">Select stage</option>
                  <option value="Idea">Idea</option>
                  <option value="Early">Early</option>
                  <option value="Established">Established</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Key Goals</label>
                <div className="space-y-2">
                  {goalOptions.map(goal => (
                    <label key={goal} className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={goals.includes(goal)}
                        onChange={() => handleGoalToggle(goal)}
                        className="rounded"
                      />
                      <span className="text-sm text-slate-700">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Short Bio / Describe your business or idea</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                  placeholder="Describe your business or idea in one line..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full mt-6">{localStorage.getItem('sherise_current_user') ? 'Save Changes' : 'Create Account'}</button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-pastel-lavender hover:underline font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}

