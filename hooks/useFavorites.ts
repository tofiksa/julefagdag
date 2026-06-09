"use client";

import { useCallback, useEffect, useState } from "react";

const FAVORITES_KEY = "julefagdag-favorites";

function getFavoritesFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading favorites:", error);
    return [];
  }
}

function saveFavoritesToStorage(favorites: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites:", error);
  }
}

export function useFavorites() {
  // Start empty so the server-rendered HTML and the first client render match;
  // the real values are loaded from localStorage in the mount effect below.
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load from storage on mount, and keep in sync with other tabs/windows.
  useEffect(() => {
    if (typeof window === "undefined") return;

    setFavorites(getFavoritesFromStorage());

    // Only fires for changes made in *other* tabs — never self-triggered,
    // so there is no feedback loop to guard against.
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY) {
        setFavorites(getFavoritesFromStorage());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Persist synchronously on each change so nothing can be lost to a race.
  const toggleFavorite = useCallback((sessionId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId];
      saveFavoritesToStorage(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (sessionId: string) => favorites.includes(sessionId),
    [favorites],
  );

  const removeFavorites = useCallback((sessionIds: string[]) => {
    if (sessionIds.length === 0) return;

    setFavorites((prev) => {
      const removeSet = new Set(sessionIds);
      const next = prev.filter((id) => !removeSet.has(id));
      if (next.length === prev.length) return prev;
      saveFavoritesToStorage(next);
      return next;
    });
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    removeFavorites,
  };
}
