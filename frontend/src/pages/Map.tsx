import { useState } from 'react';
import { mapLocations, transportVehicles } from '../data/mapData.ts';

export default function Map() {
  const [selectedLayer, setSelectedLayer] = useState(['all']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const layers = [
    { id: 'all', label: 'All', icon: '🗺️' },
    { id: 'campus', label: 'Campus', icon: '🏫' },
    { id: 'college', label: 'Colleges', icon: '🎓' },
    { id: 'shop', label: 'Shops', icon: '🏪' },
    { id: 'transport', label: 'Transport', icon: '🚌' },
  ];

  const toggleLayer = (layerId: string) => {
    if (layerId === 'all') {
      setSelectedLayer(['all']);
    } else {
      const newLayers = selectedLayer.filter(l => l !== 'all');
      if (newLayers.includes(layerId)) {
        const filtered = newLayers.filter(l => l !== layerId);
        setSelectedLayer(filtered.length ? filtered : ['all']);
      } else {
        setSelectedLayer([...newLayers, layerId]);
      }
    }
  };

  const filteredLocations = selectedLayer.includes('all')
    ? mapLocations
    : mapLocations.filter(loc => selectedLayer.includes(loc.type));

  const filteredTransport = selectedLayer.includes('all') || selectedLayer.includes('transport')
    ? transportVehicles
    : [];

  return (
    <div className="h-screen flex flex-col md:flex-row pt-16 md:pt-28 relative bg-[#F8FAFC] dark:bg-[#051923] overflow-hidden transition-colors duration-500">
      
      {/* Background Luminous Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="blob-luminous blob-teal -top-20 -left-20 opacity-10 dark:opacity-20"></div>
        <div className="blob-luminous blob-violet bottom-0 -right-20 opacity-5 dark:opacity-10"></div>
      </div>

      {/* --- SIDEBAR: Mobile Bottom Drawer / Desktop Left Panel --- */}
      <div className={`
        fixed inset-x-0 bottom-0 z-40 transition-transform duration-500 ease-in-out transform
        md:relative md:inset-auto md:translate-y-0 md:flex md:w-[400px] md:h-full
        ${sidebarOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)] md:translate-y-0'}
      `}>
        <div className="flex flex-col h-[80vh] md:h-full w-full glass-card md:m-4 md:rounded-[2.5rem] rounded-t-[2.5rem] overflow-hidden border-t md:border border-white/80 dark:border-white/5 dark:bg-slate-900/60 shadow-2xl">
          
          {/* Mobile Handle Bar */}
          <div 
            className="md:hidden flex justify-center py-3 cursor-pointer" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
          </div>

          {/* Search Header */}
          <div className="px-6 md:px-8 pb-4 pt-2 md:pt-8 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                Navi<span className="text-gradient-link">gate</span>
              </h1>
            </div>
            
            <div className="relative group">
              <input
                type="text"
                placeholder="Search landmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-6 pr-6 py-3 md:py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-campus-teal outline-none transition-all font-bold text-sm shadow-sm"
              />
            </div>
          </div>

          {/* Layers: Horizontal Scroll on Mobile */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-transparent overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              {layers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                    selectedLayer.includes(layer.id) || selectedLayer.includes('all')
                      ? 'bg-campus-navy dark:bg-campus-teal text-white border-campus-navy dark:border-campus-teal shadow-lg scale-105'
                      : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-white/5 hover:border-campus-teal/30'
                  }`}
                >
                  {layer.icon} <span className="ml-1">{layer.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Directions Panel */}
          <div className="p-6 bg-white/20 dark:bg-transparent">
            <button
              onClick={() => setShowRoutePanel(!showRoutePanel)}
              className="w-full btn-primary py-3 md:py-4 text-xs shadow-campus-teal/20 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              GET SAFETY ROUTE
            </button>

            {showRoutePanel && (
              <div className="mt-4 space-y-2 animate-reveal">
                {['Your Location', 'Destination'].map((placeholder, i) => (
                  <div key={i} className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-campus-teal bg-white dark:bg-slate-800"></div>
                    <input
                      type="text"
                      placeholder={placeholder}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-campus-teal"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Scrollable List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
            <section>
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4 italic">Point of Interest</h3>
              <div className="space-y-3">
                {filteredLocations.map((location) => (
                  <div key={location.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-50 dark:border-white/5 hover:border-campus-teal/30 hover:shadow-xl transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        {location.type === 'campus' ? '🏫' : location.type === 'college' ? '🎓' : '🏪'}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-slate-800 dark:text-white group-hover:text-campus-teal transition-colors">{location.name}</h4>
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{location.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {filteredTransport.length > 0 && (
              <section className="pb-10">
                <h3 className="text-[10px] font-black text-campus-violet uppercase tracking-[0.3em] mb-4 italic">Live Transit</h3>
                <div className="space-y-3">
                  {filteredTransport.map((vehicle) => (
                    <div key={vehicle.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-50 dark:border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm text-slate-900 dark:text-white">{vehicle.number}</h4>
                        </div>
                        <span className="text-[8px] px-2 py-0.5 rounded-full bg-campus-mint/10 text-campus-mint uppercase font-black">{vehicle.status}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                         <div className="h-full bg-campus-violet animate-pulse w-[65%]"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* --- MAP ENGINE INTERFACE: Flexible container --- */}
      <div className="flex-1 relative m-2 md:m-4 md:ml-0 h-full rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-950 transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-campus-teal/5 via-transparent to-transparent"></div>
        
        {/* Map Placeholder Content - Responsive Text Sizes */}
        <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8 text-center">
          <div className="relative max-w-2xl">
            <div className="absolute -inset-20 bg-campus-teal/5 dark:bg-campus-teal/10 blur-[80px] md:blur-[100px] rounded-full animate-pulse"></div>
            <div className="relative z-10">
              <div className="text-6xl md:text-9xl mb-4 md:mb-8 animate-float drop-shadow-2xl">🗺️</div>
              <h2 className="text-3xl md:text-7xl font-black mb-4 md:mb-6 text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">
                Safe-Path <span className="text-gradient-link">Engine</span>
              </h2>
              <p className="text-xs md:text-xl text-slate-500 dark:text-slate-400 font-medium mb-8 md:mb-12 leading-relaxed px-4">
                Processing live community data. Safety-verified routes and real-time transit will appear here.
              </p>
              
              {/* Responsive Tags: Wrapped on small screens */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {['📍 GPS Sync', '🛡️ Safety Blur', '👥 Crowd Flow'].map((tag) => (
                  <div key={tag} className="glass-panel px-4 py-2 md:px-6 md:py-3 rounded-2xl flex items-center border-white dark:border-white/10 dark:text-white">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Controls: Scaled down for mobile */}
        <div className="absolute top-4 right-4 md:top-10 md:right-10 flex flex-col gap-2 scale-90 md:scale-100">
          {['+', '−'].map((op) => (
            <button key={op} className="w-10 h-10 md:w-12 md:h-12 glass-card rounded-2xl flex items-center justify-center text-xl font-black text-slate-700 dark:text-white hover:bg-white dark:hover:bg-slate-700 transition-all border-white/50">
              {op}
            </button>
          ))}
        </div>

        {/* Locate Me Button: Responsive position */}
        <button className="absolute bottom-20 md:bottom-10 right-4 md:right-10 btn-primary p-4 md:p-6 shadow-campus-teal/40 scale-90 md:scale-100">
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Backdrop for Mobile Drawer */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
}