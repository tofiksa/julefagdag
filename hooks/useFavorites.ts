'use client'

import { useState, useEffect, useCallback } from 'react'

const FAVORITES_KEY = 'julefagdag-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(FAVORITES_KEY)
      if (stored) {
        try {
          setFavorites(JSON.parse(stored))
        } catch (error) {
          console.error('Error loading favorites:', error)
        }
      }
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
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

