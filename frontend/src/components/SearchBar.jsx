import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { getAutocomplete } from '../services/api'
import { useSearchStore } from '../store/store'

const SearchBar = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const inputRef = useRef(null)
  const { addSearch, recentSearches } = useSearchStore()
  
  // Debounce query for autocomplete
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [query])
  
  // Fetch autocomplete suggestions
  const { data: suggestions } = useQuery({
    queryKey: ['autocomplete', debouncedQuery],
    queryFn: () => getAutocomplete(debouncedQuery),
    enabled: debouncedQuery.length > 2,
  })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      addSearch(query.trim())
      onSearch(query.trim())
      setShowSuggestions(false)
    }
  }
  
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    addSearch(suggestion)
    onSearch(suggestion)
    setShowSuggestions(false)
  }
  
  const clearQuery = () => {
    setQuery('')
    inputRef.current?.focus()
  }
  
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        {/* Advanced Search Container with Glassmorphism */}
        <div className="relative group">
          {/* Glow Effect on Focus */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full blur-xl opacity-0 group-hover:opacity-30 group-focus-within:opacity-50 transition duration-500" />
          
          {/* Main Search Input */}
          <div className="relative flex items-center bg-slate-900/60 backdrop-blur-2xl border-2 border-emerald-500/30 rounded-full shadow-2xl group-hover:border-emerald-400/50 group-focus-within:border-emerald-400 transition-all duration-300">
            {/* Search Icon with Animation */}
            <motion.div
              animate={{ rotate: query ? 0 : [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="absolute left-6 z-10"
            >
              <Search className="w-6 h-6 text-emerald-400" strokeWidth={2.5} />
            </motion.div>
            
            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search the world... (e.g., Mountains, Oceans, Architecture)"
              className="w-full pl-16 pr-32 py-6 bg-transparent text-white text-lg placeholder-slate-400 focus:outline-none font-medium"
            />
            
            {/* Action Buttons */}
            <div className="absolute right-4 flex items-center gap-2">
              {query && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  type="button"
                  onClick={clearQuery}
                  className="p-2 hover:bg-slate-800/50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400 hover:text-white" />
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-emerald-500/50 transition-all duration-300"
              >
                Search
              </motion.button>
            </div>
          </div>
        </div>
      </form>
      
      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (query.length > 0 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute w-full mt-2 bg-slate-800/95 backdrop-blur-lg border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Autocomplete suggestions */}
            {suggestions?.suggestions && suggestions.suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-slate-400 px-3 py-2 font-medium">
                  Suggestions
                </div>
                {suggestions.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-200"
                  >
                    <Search className="inline w-4 h-4 mr-2 text-slate-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            
            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div className="p-2 border-t border-slate-700">
                <div className="text-xs text-slate-400 px-3 py-2 font-medium">
                  Recent Searches
                </div>
                {recentSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-200"
                  >
                    <Search className="inline w-4 h-4 mr-2 text-slate-400" />
                    {search}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar
