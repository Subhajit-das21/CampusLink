import { useState, useMemo } from 'react';
import type { Service } from '../types';

export function useServiceFilters(services: Service[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'distance'>('distance');
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  const filteredServices = useMemo(() => {
    let filtered = services;

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Open only filter
    if (showOpenOnly) {
      filtered = filtered.filter(s => s.isOpen);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return a.distance - b.distance;
    });

    return filtered;
  }, [services, searchQuery, selectedCategory, sortBy, showOpenOnly]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    showOpenOnly,
    setShowOpenOnly,
    filteredServices,
  };
}
