import { useState, useMemo } from 'react';
import { type Service } from '../types/service'; // Ensure this matches your centralized types

/**
 * useServiceFilters Hook: Logic Controller for Node Directory
 * Handles multi-criteria filtering and sorting for CampusLink Services
 */
export function useServiceFilters(services: Service[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'distance'>('distance');
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  const filteredServices = useMemo(() => {
    // Start with a shallow copy to avoid mutating the original prop
    let filtered = [...services];

    // 1. Category Filter: Exact match logic
    if (selectedCategory !== 'All') {
      // Changed from .includes() to strict equality to prevent 'Store' matching 'Stationery'
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    // 2. Search Filter: Deep content matching
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.address.toLowerCase().includes(query) // Added address search for better UX
      );
    }

    // 3. Status Filter: Live or fallback
    if (showOpenOnly) {
      filtered = filtered.filter(s => s.isOpen);
    }

    // 4. Sort Logic: Multi-criteria handling
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      
      // Default: Distance sorting (Nearest First)
      const distA = a.distance ?? Infinity; // Use Infinity if distance is missing
      const distB = b.distance ?? Infinity;
      return distA - distB;
    });

    return filtered;
  }, [services, searchQuery, selectedCategory, sortBy, showOpenOnly]);

  return {
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    sortBy, setSortBy,
    showOpenOnly, setShowOpenOnly,
    filteredServices,
  };
}