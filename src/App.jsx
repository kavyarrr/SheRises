import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Community from './pages/Community'
import Coach from './pages/Coach'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Explore from './pages/Explore'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import Chat from './pages/Chat'
import Profiles from './pages/Profiles'
import ProfileSetup from './pages/ProfileSetup'
import HiringForm from './components/HiringForm'
import Shop from './pages/Shop'
import Connections from './pages/Connections'

function RequireAuth({ children }) {
  const isAuthed = typeof window !== 'undefined' && localStorage.getItem('sherise_auth') === 'true'
  if (!isAuthed) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const [showHiringForm, setShowHiringForm] = useState(false)

  useEffect(() => {
    const handleOpenHiringForm = () => {
      setShowHiringForm(true)
    }
    window.addEventListener('openHiringForm', handleOpenHiringForm)
    return () => window.removeEventListener('openHiringForm', handleOpenHiringForm)
  }, [])

  return (
    <div className="min-h-full">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/explore" element={<RequireAuth><Explore /></RequireAuth>} />
          <Route path="/shop" element={<RequireAuth><Shop /></RequireAuth>} />
          <Route path="/community" element={<RequireAuth><Community /></RequireAuth>} />
          <Route path="/coach" element={<RequireAuth><Coach /></RequireAuth>} />
          <Route path="/chat" element={<RequireAuth><Chat /></RequireAuth>} />
          <Route path="/profiles" element={<RequireAuth><Profiles /></RequireAuth>} />
          <Route path="/connections" element={<RequireAuth><Connections /></RequireAuth>} />
          <Route path="/profile-setup" element={<RequireAuth><ProfileSetup /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/profile/:id" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/messages/:id" element={<RequireAuth><Messages /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      <HiringForm isOpen={showHiringForm} onClose={() => setShowHiringForm(false)} />
    </div>
  )
}


