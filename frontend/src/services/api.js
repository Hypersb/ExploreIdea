import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for AI processing
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token')
    }
    return Promise.reject(error)
  }
)

// API functions
export const searchImages = async (query, limit = 20) => {
  console.log('🔍 Searching for:', query, 'Limit:', limit)
  console.log('📡 API URL:', API_BASE_URL)
  
  if (!query || query.trim().length === 0) {
    console.warn('⚠️ Empty query, skipping search')
    return { results: [], total_results: 0, query: '', query_time: 0 }
  }
  
  try {
    const response = await api.post('/api/search', { 
      query, 
      limit: 20,  // Always request 20 images
      offset: 0,
      query_type: 'text'
    })
    console.log('✅ Search results:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Search error:', error)
    console.error('Error details:', error.response?.data || error.message)
    throw error
  }
}

export const getAutocomplete = async (query) => {
  const response = await api.get('/api/autocomplete', { params: { q: query } })
  return response.data
}

export const getTrending = async (limit = 10) => {
  const response = await api.get('/api/trending', { params: { limit } })
  return response.data
}

export const addFavorite = async (imageData) => {
  const response = await api.post('/api/favorites', imageData)
  return response.data
}

export const getFavorites = async () => {
  const response = await api.get('/api/favorites')
  return response.data
}

export const deleteFavorite = async (favoriteId) => {
  const response = await api.delete(`/api/favorites/${favoriteId}`)
  return response.data
}

export const getAnalytics = async (days = 7) => {
  const response = await api.get('/api/analytics', { params: { days } })
  return response.data
}

export const getPerformanceMetrics = async () => {
  const response = await api.get('/api/analytics/performance')
  return response.data
}

export const getQueryStats = async () => {
  const response = await api.get('/api/analytics/queries')
  return response.data
}

export default api
