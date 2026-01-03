import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Download, ExternalLink, X, Sparkles, Box, Grid3x3 } from 'lucide-react'
import { useFavoritesStore } from '../store/store'
import toast from 'react-hot-toast'
import ImageModal from './ImageModal'
import ImageGallery3D from './ImageGallery3D'

const ImageGallery = ({ images, isLoading }) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [is3DMode, setIs3DMode] = useState(true) // Default to 3D mode
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore()
  
  const handleFavoriteClick = (e, image) => {
    e.stopPropagation()
    
    if (isFavorite(image.id)) {
      removeFavorite(image.id)
      toast.success('Removed from favorites')
    } else {
      addFavorite(image)
      toast.success('Added to favorites')
    }
  }
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="aspect-square rounded-xl skeleton" />
        ))}
      </div>
    )
  }
  
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-lg">No results found. Try a different search!</p>
      </div>
    )
  }
  
  // 3D Mode
  if (is3DMode) {
    return (
      <>
        {/* View Toggle Button */}
        <div className="mb-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIs3DMode(false)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/50 transition-all duration-300"
          >
            <Grid3x3 className="w-5 h-5" />
            Switch to 2D Grid
          </motion.button>
        </div>
        
        <ImageGallery3D
          images={images}
          isLoading={isLoading}
          onImageClick={(image) => setSelectedImage(image)}
        />
        
        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <ImageModal
              image={selectedImage}
              onClose={() => setSelectedImage(null)}
            />
          )}
        </AnimatePresence>
      </>
    )
  }
  
  // 2D Mode (Original Grid)
  
  return (
    <>
      {/* View Toggle Button */}
      <div className="mb-6 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIs3DMode(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
        >
          <Box className="w-5 h-5" />
          Switch to 3D View
        </motion.button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            whileHover={{ scale: 1.05, y: -12, rotateY: 5 }}
            transition={{ 
              delay: index * 0.03,
              duration: 0.6,
              type: "spring",
              stiffness: 200,
            }}
            className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-emerald-950/30 shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 border-2 border-slate-700/50 hover:border-emerald-500/80"
            onClick={() => setSelectedImage(image)}
          >
            {/* Image */}
            <img
              src={image.thumbnail_url}
              alt={image.metadata.title || 'Image'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Professional Overlay with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
              {/* Top Action Bar */}
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-emerald-500/80 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                    {Math.round(image.similarity_score * 100)}% Match
                  </span>
                  <button
                    onClick={(e) => handleFavoriteClick(e, image)}
                    className="p-2 bg-slate-900/80 backdrop-blur-sm rounded-full hover:bg-emerald-500/80 transition-all duration-300 hover:scale-110"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorite(image.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-white'
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              {/* Bottom Info Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="text-white font-bold text-base mb-1 truncate">
                  {image.metadata.title || 'Untitled'}
                </h3>
                {image.metadata.photographer && (
                  <p className="text-emerald-300 text-sm mb-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    {image.metadata.photographer}
                  </p>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <a
                    href={image.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500/90 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                  <a
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-slate-800/90 hover:bg-slate-700 text-white rounded-lg transition-all duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageGallery
