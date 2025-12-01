'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

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
  const isUpdatingRef = useRef(false)

  // Load favorites from localStorage on mount and listen for changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Listen for storage events (changes from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY && e.newValue && !isUpdatingRef.current) {
        try {
          const newFavorites = JSON.parse(e.newValue)
          isUpdatingRef.current = true
          setFavorites(newFavorites)
          setTimeout(() => {
            isUpdatingRef.current = false
          }, 100)
        } catch (error) {
          console.error('Error parsing favorites from storage:', error)
        }
      }
    }

    // Listen for custom event (changes from same tab)
    const handleCustomStorageChange = () => {
      if (!isUpdatingRef.current) {
        const stored = getFavoritesFromStorage()
        isUpdatingRef.current = true
        setFavorites(stored)
        setTimeout(() => {
          isUpdatingRef.current = false
        }, 100)
      }
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
    if (typeof window === 'undefined' || isUpdatingRef.current) return

    const currentStored = getFavoritesFromStorage()
    // Only save and dispatch if favorites actually changed
    if (JSON.stringify(currentStored) !== JSON.stringify(favorites)) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
      // Dispatch custom event to notify other components in the same tab
      // Use requestAnimationFrame to avoid infinite loops
      requestAnimationFrame(() => {
        if (!isUpdatingRef.current) {
          window.dispatchEvent(new Event('favorites-changed'))
        }
      })
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


