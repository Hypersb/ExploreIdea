import { motion } from 'framer-motion'
import { X, Heart, Download, ExternalLink, MapPin, Tag } from 'lucide-react'
import { useFavoritesStore } from '../store/store'
import toast from 'react-hot-toast'

const ImageModal = ({ image, onClose }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore()
  
  const handleFavoriteClick = () => {
    if (isFavorite(image.id)) {
      removeFavorite(image.id)
      toast.success('Removed from favorites')
    } else {
      addFavorite(image)
      toast.success('Added to favorites')
    }
  }
  
  const handleDownload = async () => {
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `exploreidea-${image.id}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Download started')
    } catch (error) {
      toast.error('Download failed')
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-6xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative bg-black">
            <img
              src={image.url}
              alt={image.metadata.title || 'Image'}
              className="w-full h-full object-contain max-h-[80vh]"
            />
          </div>
          
          {/* Details */}
          <div className="p-8 overflow-y-auto max-h-[80vh]">
            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-2">
              {image.metadata.title || 'Untitled'}
            </h2>
            
            {/* Photographer */}
            {image.metadata.photographer && (
              <p className="text-slate-400 mb-4">
                Photo by <span className="text-primary-400">{image.metadata.photographer}</span>
              </p>
            )}
            
            {/* Similarity Score */}
            <div className="inline-block px-3 py-1 bg-primary-600/20 border border-primary-500/30 rounded-full mb-6">
              <span className="text-primary-400 font-medium text-sm">
                {(image.similarity_score * 100).toFixed(1)}% Match
              </span>
            </div>
            
            {/* Description */}
            {image.metadata.description && (
              <div className="mb-6">
                <h3 className="text-slate-300 font-medium mb-2">Description</h3>
                <p className="text-slate-400">{image.metadata.description}</p>
              </div>
            )}
            
            {/* Location */}
            {image.metadata.location && (
              <div className="flex items-start space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <h3 className="text-slate-300 font-medium">Location</h3>
                  <p className="text-slate-400">{image.metadata.location}</p>
                </div>
              </div>
            )}
            
            {/* Tags */}
            {image.metadata.tags && image.metadata.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Tag className="w-5 h-5 text-slate-400" />
                  <h3 className="text-slate-300 font-medium">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {image.metadata.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-slate-500 text-sm">Dimensions</p>
                <p className="text-white font-medium">
                  {image.metadata.width} × {image.metadata.height}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Source</p>
                <p className="text-white font-medium capitalize">
                  {image.metadata.source}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleFavoriteClick}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isFavorite(image.id)
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                <Heart
                  className="w-5 h-5"
                  fill={isFavorite(image.id) ? 'currentColor' : 'none'}
                />
                <span>{isFavorite(image.id) ? 'Unfavorite' : 'Favorite'}</span>
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
              
              {image.download_url && (
                <a
                  href={image.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>View Source</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ImageModal
