'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    let updateInterval: NodeJS.Timeout | null = null

    // Register service worker in both dev and production
    // In development, it helps test notifications
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope)
        
        // Check for updates every 5 minutes
        updateInterval = setInterval(() => {
          registration.update()
        }, 5 * 60 * 1000)
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error)
      })

    // Cleanup: clear interval on unmount
    return () => {
      if (updateInterval) {
        clearInterval(updateInterval)
      }
    }
  }, [])

  return null
}
