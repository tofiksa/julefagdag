'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    // Register service worker in both dev and production
    // In development, it helps test notifications
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope)
        
        // Check for updates every hour
        setInterval(() => {
          registration.update()
        }, 60 * 60 * 1000)
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
  }, [])

  return null
}
