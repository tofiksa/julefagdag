'use client'

import { useState, useEffect, useCallback } from 'react'

const FAVORITES_KEY = 'julefagdag-favorites'

function getFavoritesFromStorage(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading favorites:', error)
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => getFavoritesFromStorage())

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Load initial favorites
    const stored = getFavoritesFromStorage()
    if (JSON.stringify(stored) !== JSON.stringify(favorites)) {
      setFavorites(stored)
    }

    // Listen for storage events (changes from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY && e.newValue) {
        try {
          const newFavorites = JSON.parse(e.newValue)
          if (JSON.stringify(newFavorites) !== JSON.stringify(favorites)) {
            setFavorites(newFavorites)
          }
        } catch (error) {
          console.error('Error parsing favorites from storage:', error)
        }
      }
    }

    // Listen for custom event (changes from same tab)
    const handleCustomStorageChange = () => {
      const stored = getFavoritesFromStorage()
      if (JSON.stringify(stored) !== JSON.stringify(favorites)) {
        setFavorites(stored)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('favorites-changed', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('favorites-changed', handleCustomStorageChange)
    }
  }, [favorites])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (typeof window === 'undefined') return

    const currentStored = getFavoritesFromStorage()
    // Only save and dispatch if favorites actually changed
    if (JSON.stringify(currentStored) !== JSON.stringify(favorites)) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
      // Dispatch custom event to notify other components in the same tab
      // Use a small delay to avoid infinite loops
      setTimeout(() => {
        window.dispatchEvent(new Event('favorites-changed'))
      }, 0)
    }
  }, [favorites])

  const toggleFavorite = useCallback((sessionId: string) => {
    setFavorites((prev) => {
      if (prev.includes(sessionId)) {
        return prev.filter((id) => id !== sessionId)
      } else {
        return [...prev, sessionId]
      }
    })
  }, [])

  const isFavorite = useCallback(
    (sessionId: string) => {
      return favorites.includes(sessionId)
    },
    [favorites]
  )

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  }
}


