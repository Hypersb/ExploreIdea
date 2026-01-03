import { Link, useLocation } from 'react-router-dom'
import { Search, Heart, BarChart3, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const Navbar = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: Search, label: 'Search' },
    { path: '/favorites', icon: Heart, label: 'Favorites' },
    { path: '/dashboard', icon: BarChart3, label: 'Analytics' },
  ]
  
  return (
    <nav className="backdrop-blur-xl bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-teal-950/95 border-b border-emerald-500/20 shadow-2xl shadow-emerald-500/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Sparkles className="w-8 h-8 text-emerald-400" />
              <div className="absolute inset-0 w-8 h-8 bg-emerald-400/20 rounded-full blur-lg" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Explore Ida
            </span>
          </Link>
          
          {/* Nav Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium hidden md:inline">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
