import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (image) => {
        const favorites = get().favorites
        const exists = favorites.find(fav => fav.id === image.id)
        
        if (!exists) {
          set({ favorites: [...favorites, image] })
          return true
        }
        return false
      },
      
      removeFavorite: (imageId) => {
        set(state => ({
          favorites: state.favorites.filter(fav => fav.id !== imageId)
        }))
      },
      
      isFavorite: (imageId) => {
        return get().favorites.some(fav => fav.id === imageId)
      },
      
      clearFavorites: () => {
        set({ favorites: [] })
      }
    }),
    {
      name: 'exploreidea-favorites',
    }
  )
)

export const useSearchStore = create((set) => ({
  recentSearches: [],
  currentQuery: '',
  
  addSearch: (query) => {
    set(state => ({
      recentSearches: [
        query,
        ...state.recentSearches.filter(q => q !== query)
      ].slice(0, 10)
    }))
  },
  
  setCurrentQuery: (query) => {
    set({ currentQuery: query })
  },
  
  clearSearches: () => {
    set({ recentSearches: [] })
  }
}))
