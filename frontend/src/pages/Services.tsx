import { useState, useEffect } from 'react';
import { servicesData } from '../data/services';
import ServiceCard from '../components/ServiceCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState'; // Import your new component
import { useServiceFilters } from '../hooks/useServiceFilters';

export default function Services() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const {
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    sortBy, setSortBy,
    showOpenOnly, setShowOpenOnly,
    filteredServices,
  } = useServiceFilters(servicesData);
  
  useEffect(() => {
    setIsVisible(true);
    // Mimicking a real backend delay to show your Skeleton effect
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  
  const categories = ['All', 'Food', 'Printing', 'Medical', 'Repairs'];

  // Shortcut function to reset everything
  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setShowOpenOnly(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#051923] pt-28 md:pt-36 overflow-hidden relative pb-20 transition-colors duration-500">
      
      {/* Background Luminous Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="blob-luminous blob-teal -top-20 -left-20 opacity-10 dark:opacity-20"></div>
        <div className="blob-luminous blob-violet bottom-0 -right-20 opacity-10 dark:opacity-5"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="grid lg:grid-cols-2 gap-8 items-end mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-campus-teal/10 border border-campus-teal/20 text-[10px] font-black uppercase tracking-[0.2em] text-campus-teal">
              <span className="w-1.5 h-1.5 rounded-full bg-campus-teal animate-pulse"></span>
              Live Directory
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none transition-colors">
              Explore <span className="text-gradient-link">Services</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-lg">
              Verified community partners bridging the gap between campus life and local utility.
            </p>
          </div>
          
          <div className="hidden lg:flex justify-end">
            <div className="glass-card px-8 py-4 rounded-2xl flex items-center gap-6 border-white/80 dark:border-white/5">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1">Total</p>
                <p className="text-2xl font-black text-campus-teal">{servicesData.length}</p>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-white/10"></div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1">Found</p>
                <p className="text-2xl font-black text-campus-violet">{filteredServices.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Control Dock */}
        <div className={`glass-card rounded-[2.5rem] p-4 md:p-6 mb-12 border-white/80 dark:border-white/5 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="grid lg:grid-cols-12 gap-4 items-center">
            
            <div className="lg:col-span-4 relative group">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-campus-teal focus:ring-4 focus:ring-campus-teal/5 outline-none transition-all font-bold shadow-sm"
              />
              <svg className="w-5 h-5 text-campus-teal absolute left-5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="lg:col-span-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 ${
                    selectedCategory === cat
                      ? 'bg-campus-teal border-campus-teal text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-400 hover:border-campus-teal/30 hover:text-campus-teal'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="lg:col-span-3 flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'distance' | 'name')}
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 outline-none cursor-pointer transition-colors"
              >
                <option value="distance">Nearest</option>
                <option value="name">A-Z Order</option>
              </select>
              <button
                onClick={() => setShowOpenOnly(!showOpenOnly)}
                className={`px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center gap-2 ${
                  showOpenOnly 
                    ? 'border-campus-violet bg-campus-violet/5 text-campus-violet' 
                    : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-400'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${showOpenOnly ? 'bg-campus-violet animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                Open
              </button>
            </div>
          </div>
        </div>

        {/* Content Section: Loading -> Data Grid -> Empty Case */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <div
                key={service.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-reveal"
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        ) : (
          /* The Empty Case */
          <EmptyState 
            message={`We couldn't find any "${searchQuery}" services in the ${selectedCategory} sector.`}
            actionText="Clear Search"
            onAction={handleReset}
          />
        )}
      </div>
    </div>
  );
}