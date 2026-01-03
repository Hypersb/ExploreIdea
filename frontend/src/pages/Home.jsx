import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import ImageGallery from '../components/ImageGallery'
import Hero3D from '../components/Hero3D'
import { searchImages, getTrending } from '../services/api'
import { useSearchStore } from '../store/store'

const Home = () => {
  const [query, setQuery] = useState('')
  const { setCurrentQuery } = useSearchStore()
  
  // Fetch trending searches
  const { data: trendingData } = useQuery({
    queryKey: ['trending'],
    queryFn: () => getTrending(),
  })
  
  // Search images query
  const { data: searchData, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchImages(query),
    enabled: query.length > 0, // Auto-fetch when query exists
  })
  
  const handleSearch = (searchQuery) => {
    setQuery(searchQuery)
    setCurrentQuery(searchQuery)
  }
  
  const handleTrendingClick = (trendingQuery) => {
    handleSearch(trendingQuery)
  }
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative text-center space-y-10 py-24"
      >
        {/* 3D Hero Background */}
        <Hero3D />
        
        {/* Animated Background Effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-blue-500/10 blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-cyan-500/10 blur-3xl"
          />
        </div>
        
        {/* Floating Icon with Glow */}
        <motion.div 
          className="flex items-center justify-center mb-8"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-emerald-400/30 to-cyan-400/30 rounded-full blur-2xl"
            />
            <Sparkles className="w-24 h-24 text-emerald-400 relative z-10 drop-shadow-2xl" strokeWidth={1.5} />
          </div>
        </motion.div>
        
        {/* Main Title with Advanced Typography */}
        <div className="space-y-6">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-8xl md:text-9xl font-black tracking-tight"
          >
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">Explore</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent drop-shadow-2xl">Ida</span>
          </motion.h1>
          
          {/* Subtitle with Decorative Elements */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
            <p className="text-2xl font-semibold text-emerald-300/90 tracking-wide uppercase">
              Visual Intelligence Platform
            </p>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
          </motion.div>
          
          {/* Feature Tags */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-8"
          >
            {['AI-Powered', '50+ Images', 'Real-time', 'Global Sources'].map((tag, i) => (
              <span 
                key={i}
                className="px-4 py-2 bg-emerald-500/10 border border-emerald-400/30 rounded-full text-emerald-300 text-sm font-medium backdrop-blur-sm hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all cursor-default"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
        
        {/* Description */}
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xl text-slate-300/80 max-w-3xl mx-auto leading-relaxed font-light"
        >
          Harness the power of advanced AI to discover stunning imagery from across the globe.
          <br />
          From breathtaking landscapes to architectural marvels - explore limitless possibilities.
        </motion.p>
      </motion.div>
      
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SearchBar onSearch={handleSearch} initialQuery={query} />
      </motion.div>
      
      {/* Trending Searches */}
      {!query && trendingData?.trending && trendingData.trending.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-semibold text-white">Trending Searches</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {trendingData.trending.slice(0, 10).map((item, index) => (
              <button
                key={index}
                onClick={() => handleTrendingClick(item.query)}
                className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-300 hover:text-white transition-colors"
              >
                {item.query} <span className="text-primary-400 ml-1">({item.count})</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Search Stats */}
      {searchData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-3xl mx-auto flex items-center justify-between text-sm text-slate-400"
        >
          <span>
            Found {searchData.total_results} results for "{searchData.query}"
          </span>
          <span>
            in {searchData.query_time.toFixed(2)}s
          </span>
        </motion.div>
      )}
      
      {/* Results */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {query ? (
          <ImageGallery images={searchData?.results} isLoading={isLoading} />
        ) : (
          <div className="text-center space-y-12 py-20">
            <div>
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <Sparkles className="w-16 h-16 text-primary-400/50 mx-auto mb-4" />
              </motion.div>
              <p className="text-slate-400 text-lg mb-8">
                Start searching to discover amazing images
              </p>
            </div>
            
            {/* Featured Search Suggestions */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-emerald-400 text-sm font-semibold mb-6 tracking-wider uppercase">
                Try These Popular Searches
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { emoji: '🌊', text: 'Ocean Waves', gradient: 'from-blue-500 to-cyan-500' },
                  { emoji: '🏔️', text: 'Mountain Peak', gradient: 'from-slate-500 to-emerald-500' },
                  { emoji: '🌆', text: 'City Skyline', gradient: 'from-purple-500 to-pink-500' },
                  { emoji: '🌲', text: 'Forest Path', gradient: 'from-green-600 to-emerald-500' },
                  { emoji: '🏜️', text: 'Desert Sunset', gradient: 'from-orange-500 to-red-500' },
                  { emoji: '✨', text: 'Aurora Lights', gradient: 'from-green-400 to-blue-500' },
                  { emoji: '🏖️', text: 'Beach Paradise', gradient: 'from-yellow-400 to-cyan-500' },
                  { emoji: '❄️', text: 'Snowy Village', gradient: 'from-blue-300 to-slate-300' },
                ].map((item, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSearch(item.text)}
                    className={`group relative p-6 rounded-2xl bg-gradient-to-br ${item.gradient} overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="relative z-10 text-center space-y-2">
                      <div className="text-4xl mb-2">{item.emoji}</div>
                      <div className="text-white font-semibold text-sm">{item.text}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Home
