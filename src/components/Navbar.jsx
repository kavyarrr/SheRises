import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import ProfileDropdown from './ProfileDropdown'

export default function Navbar() {
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleLogout() {
    try {
      localStorage.removeItem('sherise_auth')
      localStorage.removeItem('sherise_user_name')
      localStorage.removeItem('sherise_user_email')
      localStorage.removeItem('sherise_current_user')
      sessionStorage.removeItem('sherise_auth')
    } catch {}
    setShowProfile(false)
    navigate('/login')
  }

  const userData = JSON.parse(localStorage.getItem('sherise_current_user') || 'null')
  const userName = userData?.account?.fullName || localStorage.getItem('sherise_user_name') || 'User'
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <header className="sticky top-0 z-40">
      <div className="backdrop-blur bg-white/60 border-b border-white/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="font-semibold text-xl text-slate-800">SheRise</Link>
          <nav className="flex gap-3 items-center">
            <NavLink to="/" className={({isActive}) => `btn-secondary ${isActive ? 'ring-2 ring-pastel-lavender' : ''}`}>Home</NavLink>
            <NavLink to="/explore" className={({isActive}) => `btn-secondary ${isActive ? 'ring-2 ring-pastel-lavender' : ''}`}>Explore</NavLink>
            <NavLink to="/shop" className={({isActive}) => `btn-secondary ${isActive ? 'ring-2 ring-pastel-lavender' : ''}`}>Shop</NavLink>
            <NavLink to="/community" className={({isActive}) => `btn-secondary ${isActive ? 'ring-2 ring-pastel-lavender' : ''}`}>Community</NavLink>
            <NavLink to="/chat" className={({isActive}) => `btn-primary ${isActive ? 'ring-2 ring-pastel-pink' : ''}`}>AI Coach</NavLink>
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="w-10 h-10 rounded-full bg-pastel-lavender text-slate-800 font-semibold flex items-center justify-center hover:ring-2 ring-pastel-pink transition"
              >
                {initials}
              </button>
              <ProfileDropdown isOpen={showProfile} onClose={() => setShowProfile(false)} onLogout={handleLogout} />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}


