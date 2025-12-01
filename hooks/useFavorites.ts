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

  // Load favorites from localStorage on mount and listen for changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Load initial favorites
    const stored = getFavoritesFromStorage()
    setFavorites(stored)

    // Listen for storage events (changes from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY) {
        const newFavorites = e.newValue ? JSON.parse(e.newValue) : []
        setFavorites(newFavorites)
      }
    }

    // Listen for custom event (changes from same tab)
    const handleCustomStorageChange = () => {
      const stored = getFavoritesFromStorage()
      setFavorites(stored)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('favorites-changed', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('favorites-changed', handleCustomStorageChange)
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
      // Dispatch custom event to notify other components in the same tab
      window.dispatchEvent(new Event('favorites-changed'))
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

