import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home() {
  const [users, setUsers] = useState([])
  const [hirings, setHirings] = useState([])
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    Promise.all([
      fetch('/users.json').then(r => r.json()).catch(() => []),
      fetch('/hirings.json').then(r => r.json()).catch(() => [])
    ]).then(([u, h]) => {
      if (Array.isArray(u)) setUsers(u.slice(0, 6))
      if (Array.isArray(h)) setHirings(h)
    })
  }, [])

  const inspiringStories = [
    { name: 'Aisha Khan', role: 'Handmade Jewelry', quote: 'From home hobbyist to selling 100+ pieces monthly', avatar: 'https://i.pravatar.cc/100?img=5' },
    { name: 'Neha Verma', role: 'Organic Spices', quote: 'Connected with 5 rural suppliers through SheRise', avatar: 'https://i.pravatar.cc/100?img=8' },
    { name: 'Sara Ali', role: 'Natural Soaps', quote: 'Found my first wholesale client here', avatar: 'https://i.pravatar.cc/100?img=12' },
  ]

  const testimonials = [
    { name: 'Priya Sharma', business: 'Home Bakery', text: 'SheRise helped me connect with women who understood my journey. The AI coach gave practical tips I could implement immediately.', avatar: 'https://i.pravatar.cc/100?img=47' },
    { name: 'Meera Patel', business: 'Handicrafts', text: 'The community support here is incredible. I\'ve found collaborators and customers, all while working from home.', avatar: 'https://i.pravatar.cc/100?img=33' },
    { name: 'Sunita Reddy', business: 'Organic Products', text: 'From zero to first sale in 30 days. The mentorship resources and networking made all the difference.', avatar: 'https://i.pravatar.cc/100?img=20' },
  ]

  const filteredHirings = React.useMemo(() => {
    if (!Array.isArray(hirings)) return []
    if (activeTab === 'all') return hirings
    return hirings.filter(h => h.category?.toLowerCase().includes(activeTab.toLowerCase()))
  }, [hirings, activeTab])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pastel-pink/30 via-pastel-lavender/20 to-pastel-beige/40" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <span className="text-6xl md:text-8xl">🌺</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
            Empowering Women Entrepreneurs<br />
            <span className="bg-gradient-to-r from-pastel-pink to-pastel-lavender bg-clip-text text-transparent">to Rise Together</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 mb-8 max-w-3xl mx-auto">
            Connecting women from homes to global opportunities. Build your business, grow your skills, and thrive in a supportive community.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-lg px-8 py-4 shadow-lg hover:scale-105 transition-transform">
              Join the Community
            </Link>
            <Link to="/profiles" className="btn-secondary text-lg px-8 py-4 shadow-lg hover:scale-105 transition-transform">
              Explore Profiles
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl"
          >
            ↓
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 md:px-8 bg-white/40">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">What is SheRise?</h2>
            <div className="grid md:grid-cols-3 gap-12 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-3">Learn</h3>
                <p className="text-slate-700">Access AI-powered coaching, workshops, and resources tailored for home-based entrepreneurs.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">🤝</div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-3">Connect</h3>
                <p className="text-slate-700">Network with like-minded women, find collaborators, mentors, and customers who believe in your vision.</p>
              </motion.div>
              <motion.div
      initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-3">Grow</h3>
                <p className="text-slate-700">Scale your business with tools, insights, and a community that celebrates every milestone.</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
      transition={{ duration: 0.6 }}
            className="card p-8 md:p-12 text-center"
          >
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-4">
              SheRise is a platform designed specifically for home-based women entrepreneurs and small business owners. 
              We understand the unique challenges you face — balancing family, managing time, and building something meaningful from home.
            </p>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
              Our mission is to empower you with AI coaching, market insights, collaborative opportunities, and a supportive network 
              of women who are on the same journey. Together, we rise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Inspiring Stories Section */}
      <section className="py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-pastel-lavender/20 to-pastel-pink/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Inspiring Stories</h2>
            <p className="text-xl text-slate-700">Real women building real businesses from home</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {inspiringStories.map((story, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="card p-6 hover:shadow-xl transition-shadow"
              >
                <img src={story.avatar} alt={story.name} className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-pastel-pink/50" />
                <h3 className="text-xl font-semibold text-slate-800 mb-1">{story.name}</h3>
                <p className="text-sm text-pastel-pink mb-3">{story.role}</p>
                <p className="text-slate-700 italic">"{story.quote}"</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link to="/community" className="btn-primary text-lg px-8 py-3">
              Read More Stories
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Opportunities Section */}
      <section className="py-20 px-4 sm:px-6 md:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Featured Opportunities</h2>
            <p className="text-xl text-slate-700">Discover collaborations, partnerships, and job opportunities</p>
          </motion.div>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {['all', 'Business', 'Collaboration', 'Jobs'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  activeTab === tab.toLowerCase()
                    ? 'bg-pastel-pink text-slate-800 shadow-md'
                    : 'bg-white/70 text-slate-700 hover:bg-white/90'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {filteredHirings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHirings.slice(0, 6).map((hiring, idx) => (
                <motion.div
                  key={hiring.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="card p-6 hover:shadow-xl transition-shadow"
                >
                  <span className="inline-block text-xs bg-pastel-lavender px-3 py-1 rounded-full mb-3">
                    {hiring.category || 'General'}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{hiring.title}</h3>
                  <p className="text-sm text-slate-700 mb-4 line-clamp-3">{hiring.description}</p>
                  {hiring.budget && (
                    <p className="text-sm font-medium text-pastel-pink mb-3">💰 {hiring.budget}</p>
                  )}
                  <Link to={`/messages/${hiring.userId}`} className="btn-secondary text-sm">
                    Connect
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center text-slate-600">
              <p>No opportunities available at the moment. Check back soon!</p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link to="/community" className="btn-primary text-lg px-8 py-3">
              View All Opportunities
            </Link>
          </motion.div>
      </div>
      </section>

      {/* Mentorship and Learning Section */}
      <section className="py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-pastel-beige/30 to-pastel-mint/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Mentorship & Learning</h2>
            <p className="text-xl text-slate-700">Grow your skills and business with our resources</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card p-8 text-center hover:shadow-xl transition-shadow"
            >
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-3">AI Coach</h3>
              <p className="text-slate-700 mb-4">Get personalized business advice, strategy tips, and growth insights powered by AI.</p>
              <Link to="/coach" className="btn-primary">Try AI Coach</Link>
            </motion.div>

      <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
              className="card p-8 text-center hover:shadow-xl transition-shadow"
            >
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-3">Workshops</h3>
              <p className="text-slate-700 mb-4">Join live sessions on marketing, finance, e-commerce, and business scaling.</p>
              <Link to="/community" className="btn-secondary">Explore Workshops</Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card p-8 text-center hover:shadow-xl transition-shadow"
            >
              <div className="text-6xl mb-4">👩‍🏫</div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-3">Mentorship</h3>
              <p className="text-slate-700 mb-4">Connect with experienced entrepreneurs who've been where you are.</p>
              <Link to="/profiles" className="btn-secondary">Find Mentors</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4 sm:px-6 md:px-8 bg-white/40">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Our Community</h2>
            <p className="text-xl text-slate-700">Meet the amazing women building their dreams</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {users.map((user, idx) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="card p-5 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-3">
                  <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-pastel-lavender" />
                  <div>
                    <h3 className="font-semibold text-slate-800">{user.name}</h3>
                    <p className="text-sm text-slate-600">{user.business}</p>
                    <p className="text-xs text-slate-500">{user.city}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 line-clamp-2 mb-4">{user.bio}</p>
                <Link to={`/profile/${user.id}`} className="btn-secondary text-sm w-full text-center">
                  View Profile
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link to="/profiles" className="btn-primary text-lg px-8 py-3">
              View All Profiles
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-pastel-pink/20 to-pastel-lavender/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">What Our Community Says</h2>
            <p className="text-xl text-slate-700">Real stories from real entrepreneurs</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="card p-6 relative"
              >
                <div className="text-4xl text-pastel-pink mb-4 absolute top-4 right-4 opacity-20">"</div>
                <p className="text-slate-700 mb-6 relative z-10 italic">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full border-2 border-pastel-lavender" />
                  <div>
                    <p className="font-semibold text-slate-800">{testimonial.name}</p>
                    <p className="text-sm text-slate-600">{testimonial.business}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-20 px-4 sm:px-6 md:px-8 bg-white/60">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card p-10 md:p-16 text-center"
          >
            <div className="text-6xl mb-6">📧</div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Stay Updated</h2>
            <p className="text-lg text-slate-700 mb-8 max-w-2xl mx-auto">
              Get the latest opportunities, workshops, and community updates delivered to your inbox.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Newsletter signup coming soon!') }} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-white/60 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                required
              />
              <button type="submit" className="btn-primary px-8 py-3 whitespace-nowrap">
                Subscribe
              </button>
            </form>
      </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800/90 text-white py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">SheRise</h3>
              <p className="text-slate-300 text-sm">Empowering women entrepreneurs to build their dreams from home.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><Link to="/" className="hover:text-white transition">Our Story</Link></li>
                <li><Link to="/community" className="hover:text-white transition">Community</Link></li>
                <li><Link to="/profiles" className="hover:text-white transition">Profiles</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><Link to="/coach" className="hover:text-white transition">AI Coach</Link></li>
                <li><Link to="/explore" className="hover:text-white transition">Explore</Link></li>
                <li><Link to="/community" className="hover:text-white transition">Opportunities</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-2xl hover:scale-110 transition-transform">📘</a>
                <a href="#" className="text-2xl hover:scale-110 transition-transform">📷</a>
                <a href="#" className="text-2xl hover:scale-110 transition-transform">🐦</a>
                <a href="#" className="text-2xl hover:scale-110 transition-transform">💼</a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2025 SheRise. All rights reserved. Built with 💖 for women entrepreneurs.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
