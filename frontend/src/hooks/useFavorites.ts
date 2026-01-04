import { useState, useEffect, useCallback } from 'react';

/**
 * useFavorites Hook: Logic Controller for Bookmarked Nodes
 * Persists user-selected nodes to LocalStorage for cross-session access.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('favorites');
      // Added error handling for malformed JSON in LocalStorage
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Nexus Storage Sync Error:", err);
      return [];
    }
  });

  // Sync state changes to physical storage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  /**
   * toggleFavorite: Adds or removes a node from the personal network
   * Using useCallback to prevent unnecessary re-renders in list components
   */
  const toggleFavorite = useCallback((id: string) => {
    if (!id) return;
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id) 
        : [...prev, id]
    );
  }, []);

  /**
   * isFavorite: Checks if a specific node ID is pinned
   */
  const isFavorite = useCallback((id: string) => {
    return favorites.includes(id);
  }, [favorites]);

  return { 
    favorites, 
    toggleFavorite, 
    isFavorite,
    // Added helper to clear all nodes if needed
    clearFavorites: () => setFavorites([]) 
  };
}