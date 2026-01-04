import { useState, useEffect } from 'react';
import axios from 'axios';
import { type Service } from '../types/service'; // Centralized Interface
import ServiceCard from '../components/ServiceCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import { useServiceFilters } from '../hooks/useServiceFilters';
import { useJsApiLoader } from '@react-google-maps/api';

// CRITICAL: This array must be IDENTICAL in Services.tsx and ServiceDetail.tsx
const LIBRARIES: ("marker" | "geometry" | "places")[] = ['marker', 'geometry', 'places'];

export default function Services() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbServices, setDbServices] = useState<Service[]>([]); // Use Type instead of any
  const [ , setError] = useState('');

  // Initialize Map API for ServiceCards to calculate distances
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES, 
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsVisible(true);
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/services`);
        
        // Map MongoDB _id to frontend id for consistency
        const formattedData = res.data.map((s: any) => ({
          ...s,
          id: s._id 
        }));
        
        setDbServices(formattedData);
      } catch (err) {
        setError('Failed to sync with the service network.');
        console.error("Network Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const {
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    sortBy, setSortBy,
    showOpenOnly, setShowOpenOnly,
    filteredServices,
  } = useServiceFilters(dbServices);
  
  // Updated to match your ServiceCategory interface
  const categories = ['All', 'Food', 'Printing', 'Medical', 'Repairs', 'Homestay', 'Store', 'Stationery'];

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setShowOpenOnly(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#051923] pt-28 md:pt-36 relative overflow-hidden pb-20 transition-colors duration-500">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="blob-luminous blob-teal -top-20 -left-20 opacity-10 dark:opacity-20"></div>
        <div className="blob-luminous blob-violet bottom-0 -right-20 opacity-10 dark:opacity-5"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <header className="grid lg:grid-cols-2 gap-8 items-end mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-campus-teal/10 border border-campus-teal/20 text-[10px] font-black uppercase tracking-[0.2em] text-campus-teal">
              <span className="w-1.5 h-1.5 rounded-full bg-campus-teal animate-pulse"></span>
              Live Directory
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none transition-colors">
              Explore <span className="text-gradient-link">Services</span>
            </h1>
          </div>
          
          <div className="hidden lg:flex justify-end">
            <div className="glass-card px-8 py-4 rounded-2xl flex items-center gap-6 border-white/80 dark:border-white/5 dark:bg-slate-900/40">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1">Network</p>
                <p className="text-2xl font-black text-campus-teal">{dbServices.length}</p>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-white/10"></div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1">Found</p>
                <p className="text-2xl font-black text-campus-violet">{filteredServices.length}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Search & Filter Toolbar */}
        <div className={`glass-card rounded-[2.5rem] p-4 md:p-6 mb-12 border-white/80 dark:border-white/5 dark:bg-slate-900/40 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="grid lg:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="lg:col-span-4 relative group">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white placeholder:text-slate-400 focus:border-campus-teal outline-none transition-all font-bold shadow-sm"
              />
              <svg className="w-5 h-5 text-campus-teal absolute left-5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filter */}
            <div className="lg:col-span-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 ${selectedCategory === cat ? 'bg-campus-teal border-campus-teal text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-white/5 text-slate-400 hover:text-campus-teal'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort & Status Controls */}
            <div className="lg:col-span-3 flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'distance' | 'name')}
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer transition-colors"
              >
                <option value="distance">Nearest</option>
                <option value="name">A-Z Order</option>
              </select>
              <button
                onClick={() => setShowOpenOnly(!showOpenOnly)}
                className={`px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center gap-2 ${showOpenOnly ? 'border-campus-violet bg-campus-violet/5 text-campus-violet' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-800 text-slate-400'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${showOpenOnly ? 'bg-campus-violet animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                Open
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <div key={service.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-reveal">
                <ServiceCard service={service} isMapLoaded={isLoaded} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            message={`No nodes found for "${searchQuery}" in ${selectedCategory}.`} 
            actionText="Reset Search" 
            onAction={handleReset} 
          />
        )}
      </div>
    </div>
  );
}