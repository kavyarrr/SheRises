import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ProfileSetup() {
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('sherise_current_user')
    if (stored) {
      try { setUserData(JSON.parse(stored)) } catch {}
    } else {
      // If no current user, default to profile 1 from users.json for demo
      fetch('/users.json').then(r => r.json()).then(arr => {
        if (arr && arr[0]) {
          const defaultUser = arr[0]
          localStorage.setItem('sherise_current_user', JSON.stringify(defaultUser))
          setUserData(defaultUser)
        }
      }).catch(() => {})
    }
  }, [])

  function handleSetUpHiring() {
    navigate('/community')
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openHiringForm'))
    }, 120)
  }

  const name = userData?.name || userData?.account?.fullName || 'User'
  const email = userData?.email || userData?.account?.email || ''
  const phone = userData?.phone || userData?.account?.phone || ''
  const business = userData?.business || userData?.profile?.businessName || ''
  const category = userData?.category || userData?.profile?.category || ''
  const city = userData?.city || userData?.profile?.cityState || ''
  const bio = userData?.bio || userData?.profile?.bio || ''
  const experience = userData?.experience || userData?.profile?.experience || ''
  const stage = userData?.stage || userData?.profile?.businessStage || ''
  const goals = userData?.goals || userData?.profile?.goals || []

  return (
    <section className="max-w-5xl mx-auto">
      {/* Header/Profile Card - Unique Design */}
      <motion.div 
        initial={{opacity:0,y:10}} 
        animate={{opacity:1,y:0}} 
        transition={{duration:0.4}} 
        className="card p-6 mb-4 relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pastel-lavender/30 to-pastel-pink/30 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pastel-peach/30 to-pastel-yellow/30 rounded-full blur-3xl -z-0"></div>
        
        {/* Floating decorative shapes */}
        <div className="absolute top-4 right-8 w-12 h-12 opacity-20">
          <svg viewBox="0 0 100 100" className="text-pastel-lavender fill-current">
            <circle cx="50" cy="50" r="45" />
          </svg>
        </div>
        <div className="absolute bottom-8 right-20 w-8 h-8 opacity-20">
          <svg viewBox="0 0 100 100" className="text-pastel-peach fill-current">
            <polygon points="50,5 95,95 5,95" />
          </svg>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Photo - Side by side layout */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-pastel-lavender via-pastel-pink to-pastel-peach shadow-xl overflow-hidden flex items-center justify-center transform hover:scale-105 transition-transform">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Face */}
                  <circle cx="100" cy="90" r="45" fill="#FFE4D6"/>
                  {/* Hair */}
                  <path d="M 55 70 Q 45 30, 100 25 Q 155 30, 145 70 Q 145 85, 140 95 L 135 80 Q 130 60, 100 55 Q 70 60, 65 80 L 60 95 Q 55 85, 55 70 Z" fill="#3D2817"/>
                  {/* Eyes */}
                  <circle cx="85" cy="85" r="4" fill="#2D1810"/>
                  <circle cx="115" cy="85" r="4" fill="#2D1810"/>
                  {/* Smile */}
                  <path d="M 85 100 Q 100 108, 115 100" stroke="#D4847C" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  {/* Blush */}
                  <circle cx="75" cy="95" r="6" fill="#FFB5B5" opacity="0.4"/>
                  <circle cx="125" cy="95" r="6" fill="#FFB5B5" opacity="0.4"/>
                  {/* Body/Neck */}
                  <rect x="85" y="125" width="30" height="20" fill="#FFE4D6"/>
                  {/* Clothing */}
                  <path d="M 70 140 L 85 135 L 100 145 L 115 135 L 130 140 L 130 200 L 70 200 Z" fill="#9b87c4"/>
                </svg>
              </div>
              {/* Badge */}
              <div className="mt-2 px-3 py-1 bg-gradient-to-r from-pastel-lavender to-pastel-pink rounded-full text-xs font-semibold text-slate-700 text-center">
                ✨ Verified Seller
              </div>
            </div>

            {/* Name and Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-slate-800 mb-2 leading-tight">{name}</h1>
                  {business && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/70 rounded-full mb-3">
                      <span className="text-xl">🏪</span>
                      <span className="font-semibold text-slate-700">{business}</span>
                      {category && (
                        <>
                          <span className="text-slate-400">•</span>
                          <span className="text-sm text-slate-600">{category}</span>
                        </>
                      )}
                    </div>
                  )}
                  {bio && (
                    <p className="text-base text-slate-700 leading-relaxed mb-3">{bio}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                    {city && (
                      <div className="flex items-center gap-1">
                        <span>📍</span>
                        <span>{city}</span>
                      </div>
                    )}
                    {email && (
                      <div className="flex items-center gap-1">
                        <span>✉️</span>
                        <span className="text-blue-600 hover:underline cursor-pointer">{email}</span>
                      </div>
                    )}
                    {stage && (
                      <div className="flex items-center gap-1">
                        <span>🚀</span>
                        <span>{stage} Stage</span>
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/signup')}
                  className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-pastel-lavender to-pastel-pink hover:shadow-lg text-slate-800 rounded-xl font-semibold transition-all hover:scale-105"
                >
                  ✏️ Edit
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Link to="/profiles" className="btn-secondary px-5 py-2 text-sm">👥 Browse Community</Link>
                <button onClick={handleSetUpHiring} className="btn-primary px-5 py-2 text-sm">💼 Post Opportunity</button>
                <button className="px-5 py-2 bg-white/70 rounded-xl text-slate-800 font-medium hover:bg-white transition text-sm">📤 Share Profile</button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Business Stats */}
      <motion.div 
        initial={{opacity:0,y:10}} 
        animate={{opacity:1,y:0}} 
        transition={{duration:0.4, delay:0.05}} 
        className="card p-6 mb-4"
      >
        <h3 className="font-semibold text-slate-800 text-xl mb-4">Business at a Glance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-pastel-lavender to-pastel-pink rounded-xl">
            <p className="text-3xl font-bold text-slate-800">2.5K+</p>
            <p className="text-sm text-slate-600 mt-1">Products Sold</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-pastel-peach to-pastel-yellow rounded-xl">
            <p className="text-3xl font-bold text-slate-800">4.8⭐</p>
            <p className="text-sm text-slate-600 mt-1">Avg Rating</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-pastel-mint to-pastel-sky rounded-xl">
            <p className="text-3xl font-bold text-slate-800">500+</p>
            <p className="text-sm text-slate-600 mt-1">Happy Customers</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-pastel-pink to-pastel-lavender rounded-xl">
            <p className="text-3xl font-bold text-slate-800">{experience || '2+Years'}</p>
            <p className="text-sm text-slate-600 mt-1">Experience</p>
          </div>
        </div>
      </motion.div>

      {/* Shop/Products Section */}
      <motion.div 
        initial={{opacity:0,y:10}} 
        animate={{opacity:1,y:0}} 
        transition={{duration:0.4, delay:0.1}} 
        className="card p-6 mb-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800 text-xl">Featured Products</h3>
          <button className="text-sm text-blue-600 hover:underline">View All</button>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="group cursor-pointer">
            <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&auto=format&fit=crop" 
                alt="Product 1" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <h4 className="font-medium text-slate-800">Handcrafted Necklace</h4>
            <p className="text-sm text-slate-600">₹1,299</p>
          </div>
          <div className="group cursor-pointer">
            <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1516637090014-cb1ab0d08fc7?q=80&w=400&auto=format&fit=crop" 
                alt="Product 2" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <h4 className="font-medium text-slate-800">Silver Earrings Set</h4>
            <p className="text-sm text-slate-600">₹899</p>
          </div>
          <div className="group cursor-pointer">
            <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1490111718993-d98654ce6cf7?q=80&w=400&auto=format&fit=crop" 
                alt="Product 3" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <h4 className="font-medium text-slate-800">Bracelet Collection</h4>
            <p className="text-sm text-slate-600">₹1,599</p>
          </div>
        </div>
      </motion.div>

      {/* What I Offer / Services */}
      <motion.div 
        initial={{opacity:0,y:10}} 
        animate={{opacity:1,y:0}} 
        transition={{duration:0.4, delay:0.15}} 
        className="card p-6 mb-4"
      >
        <h3 className="font-semibold text-slate-800 text-xl mb-4">What I Offer</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex gap-3 p-4 bg-pastel-lavender/20 rounded-xl">
            <div className="w-12 h-12 bg-pastel-lavender rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🛍️</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Custom Orders</h4>
              <p className="text-sm text-slate-600">Get personalized {category?.toLowerCase() || 'products'} made just for you</p>
            </div>
          </div>
          <div className="flex gap-3 p-4 bg-pastel-peach/20 rounded-xl">
            <div className="w-12 h-12 bg-pastel-peach rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📦</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Bulk Orders</h4>
              <p className="text-sm text-slate-600">Special pricing for wholesale & events</p>
            </div>
          </div>
          <div className="flex gap-3 p-4 bg-pastel-mint/20 rounded-xl">
            <div className="w-12 h-12 bg-pastel-mint rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🎁</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Gift Wrapping</h4>
              <p className="text-sm text-slate-600">Beautiful packaging for special occasions</p>
            </div>
          </div>
          <div className="flex gap-3 p-4 bg-pastel-sky/20 rounded-xl">
            <div className="w-12 h-12 bg-pastel-sky rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🚚</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Pan-India Delivery</h4>
              <p className="text-sm text-slate-600">Fast & secure shipping across India</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Customer Reviews */}
      <motion.div 
        initial={{opacity:0,y:10}} 
        animate={{opacity:1,y:0}} 
        transition={{duration:0.4, delay:0.2}} 
        className="card p-6 mb-4"
      >
        <h3 className="font-semibold text-slate-800 text-xl mb-4">What Customers Say</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-pastel-lavender pl-4 py-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-500">⭐⭐⭐⭐⭐</div>
            </div>
            <p className="text-slate-700 mb-2">"Absolutely love the quality! The craftsmanship is amazing and the packaging was so beautiful. Highly recommend!"</p>
            <p className="text-sm text-slate-500">- Priya S., Mumbai</p>
          </div>
          <div className="border-l-4 border-pastel-peach pl-4 py-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-500">⭐⭐⭐⭐⭐</div>
            </div>
            <p className="text-slate-700 mb-2">"Ordered custom pieces for my wedding and they turned out perfect! Great communication and fast delivery."</p>
            <p className="text-sm text-slate-500">- Anjali K., Delhi</p>
          </div>
          <div className="border-l-4 border-pastel-mint pl-4 py-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-500">⭐⭐⭐⭐⭐</div>
            </div>
            <p className="text-slate-700 mb-2">"Beautiful products at reasonable prices. Supporting women entrepreneurs feels even better! Will definitely order again."</p>
            <p className="text-sm text-slate-500">- Ritika M., Bangalore</p>
          </div>
        </div>
      </motion.div>

      {/* Posts/Activity Section */}
      <motion.div 
        initial={{opacity:0,y:10}} 
        animate={{opacity:1,y:0}} 
        transition={{duration:0.4, delay:0.2}} 
        className="card p-6 mt-4"
      >
        <h3 className="font-semibold text-slate-800 text-xl mb-4">Activity</h3>
        <div className="space-y-6">
          {/* Post 1 - Hiring */}
          <div className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-start gap-3 mb-3">
              <img 
                src="/avatar-mock.svg" 
                alt={name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{name}</p>
                <p className="text-xs text-slate-500">2 days ago</p>
              </div>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-3 rounded">
              <p className="text-sm font-semibold text-green-800 mb-1">🚀 WE'RE HIRING!</p>
              <p className="text-slate-700">
                Looking for a talented <strong>{category || 'Product'} Assistant</strong> to join our growing {business || 'business'} team! 
              </p>
            </div>
            <p className="text-slate-700 mb-3">
              We're expanding and need passionate individuals who love {category?.toLowerCase() || 'what we do'}! 
              <br/><br/>
              <strong>What we're looking for:</strong>
              <br/>• Experience in {category || 'the field'}
              <br/>• Self-motivated and creative
              <br/>• Ready to grow with us
              <br/><br/>
              DM me if you're interested or know someone perfect for this role! 💼✨
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>Like</span>
              </button>
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Comment</span>
              </button>
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-sm text-slate-600">
                <span className="font-semibold">42 likes</span> · <span className="font-semibold">8 comments</span>
              </p>
            </div>
          </div>

          {/* Post 2 - Product Launch */}
          <div className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-start gap-3 mb-3">
              <img 
                src="/avatar-mock.svg" 
                alt={name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{name}</p>
                <p className="text-xs text-slate-500">1 week ago</p>
              </div>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-3 rounded">
              <p className="text-sm font-semibold text-blue-800 mb-1">🎉 NEW PRODUCT LAUNCH!</p>
            </div>
            <p className="text-slate-700 mb-3">
              I'm thrilled to introduce our latest collection! 🌟
              <br/><br/>
              After months of hard work, we're finally launching our premium {category?.toLowerCase() || 'products'} line. 
              Each piece is handcrafted with love and attention to detail.
              <br/><br/>
              <strong>✨ Special Launch Offer:</strong>
              <br/>Get 20% OFF on your first order! Use code: <span className="bg-yellow-200 px-2 py-1 rounded font-mono">LAUNCH20</span>
              <br/><br/>
              🛒 Check out our website or DM me to place your order!
              <br/>
              Limited stock available - don't miss out! 🔥
            </p>
            <div className="bg-slate-100 rounded-lg h-48 mb-3 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop" 
                alt="Product" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>Like</span>
              </button>
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Comment</span>
              </button>
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-sm text-slate-600">
                <span className="font-semibold">27 likes</span> · <span className="font-semibold">5 comments</span>
              </p>
            </div>
          </div>

          {/* Post 3 - Collaboration Request */}
          <div className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-start gap-3 mb-3">
              <img 
                src="/avatar-mock.svg" 
                alt={name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{name}</p>
                <p className="text-xs text-slate-500">2 weeks ago</p>
              </div>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-3 rounded">
              <p className="text-sm font-semibold text-purple-800 mb-1">🤝 LOOKING FOR COLLABORATIONS!</p>
            </div>
            <p className="text-slate-700 mb-3">
              Hey everyone! I'm looking to partner with fellow entrepreneurs in the {category || 'business'} space. 
              <br/><br/>
              <strong>What I'm offering:</strong>
              <br/>• Cross-promotion opportunities
              <br/>• Bulk order discounts for resellers
              <br/>• Co-branded product lines
              <br/><br/>
              <strong>Who I want to connect with:</strong>
              <br/>• Content creators & influencers
              <br/>• Retail stores & boutiques
              <br/>• Event organizers
              <br/><br/>
              Let's grow together! 🌱 Drop a comment or send me a message if you're interested.
            </p>
            <div className="bg-slate-100 rounded-lg h-48 mb-3 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=800&auto=format&fit=crop" 
                alt="Collaboration" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>Like</span>
              </button>
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Comment</span>
              </button>
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-sm text-slate-600">
                <span className="font-semibold">35 likes</span> · <span className="font-semibold">12 comments</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}




