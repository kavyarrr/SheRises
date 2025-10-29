import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProfileDropdown({ isOpen, onClose, onLogout }) {
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('sherise_current_user')
    if (stored) {
      try {
        setUserData(JSON.parse(stored))
      } catch {}
    }
  }, [])

  function handleSetUpHiring() {
    onClose()
    navigate('/community')
    // Small delay to ensure navigation completes before opening form
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openHiringForm'))
    }, 100)
  }

  function goToSignup() {
    onClose()
    navigate('/signup')
  }

  function goToProfiles() {
    onClose()
    navigate('/profiles')
  }

  function goToProfileSetup() {
    onClose()
    navigate('/profile-setup')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute right-0 top-full mt-2 w-80 card p-4 shadow-lg z-50"
      >
        {userData ? (
          <>
            <div className="border-b border-white/50 pb-3 mb-3">
              <h3 className="font-semibold text-lg text-slate-800">{userData.account?.fullName || 'User'}</h3>
              <p className="text-sm text-slate-600">{userData.account?.email}</p>
            </div>

            {userData.profile?.bio && (
              <div className="mb-3">
                <p className="text-xs font-medium text-slate-600 mb-1">Bio</p>
                <p className="text-sm text-slate-700">{userData.profile.bio}</p>
              </div>
            )}

            <div className="border-t border-white/50 pt-3 space-y-2">
              <button onClick={goToProfileSetup} className="w-full btn-secondary text-left">Profile Setup</button>
              <button onClick={goToProfiles} className="w-full btn-secondary text-left">View Profiles</button>
              <button onClick={handleSetUpHiring} className="w-full btn-secondary text-left">Set up hire request</button>
              <button onClick={goToSignup} className="w-full btn-secondary text-left">Add business</button>
              <button onClick={goToSignup} className="w-full btn-secondary text-left">Edit profile</button>
              <button onClick={onLogout} className="w-full btn-secondary text-left">Logout</button>
            </div>
          </>
        ) : (
          <div className="text-sm text-slate-600">No profile data available</div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

