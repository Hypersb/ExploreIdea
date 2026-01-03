import { motion } from 'framer-motion'
import { Heart, Trash2 } from 'lucide-react'
import { useFavoritesStore } from '../store/store'
import ImageGallery from '../components/ImageGallery'
import Background3D from '../components/Background3D'
import toast from 'react-hot-toast'

const Favorites = () => {
  const { favorites, clearFavorites } = useFavoritesStore()
  
  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all favorites?')) {
      clearFavorites()
      toast.success('All favorites cleared')
    }
  }
  
  return (
    <div className="space-y-8 relative">
      {/* 3D Background */}
      <Background3D variant="favorites" />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <Heart className="w-8 h-8 text-red-500" fill="currentColor" />
          <div>
            <h1 className="text-3xl font-bold text-white">Favorites</h1>
            <p className="text-slate-400">
              {favorites.length} {favorites.length === 1 ? 'image' : 'images'} saved
            </p>
          </div>
        </div>
        
        {favorites.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span>Clear All</span>
          </button>
        )}
      </motion.div>
      
      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ImageGallery images={favorites} isLoading={false} />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Heart className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-300 mb-2">
            No favorites yet
          </h2>
          <p className="text-slate-400">
            Start searching and save your favorite images
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default Favorites
