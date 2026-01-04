import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import GoogleMapEngine from '../components/GoogleMapEngine.tsx';
import axios from 'axios';
import toast from 'react-hot-toast';

const CAMPUS_GATE = { lat: 22.5580536, lng: 88.3966811 };

export default function Map() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // 1. Theme state for dynamic map styling
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );

  const [origin, setOrigin] = useState<{lat: number, lng: number} | null>(CAMPUS_GATE);
  const [destination, setDestination] = useState<{lat: number, lng: number} | null>(null);
  const [mapCenter, setMapCenter] = useState(CAMPUS_GATE);
  const [locations, setLocations] = useState<any[]>([]);

  // Sync theme changes from the global <html> class
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // 2. Fetch Live Map Nodes
  useEffect(() => {
    const fetchMapNodes = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/services`);
        const mapped = res.data.map((s: any) => ({
          id: s._id,
          name: s.name,
          category: s.category,
          type: s.category?.toLowerCase().includes('medical') ? 'medical' : 'shop',
          lat: s.lat,
          lng: s.lng
        }));
        setLocations(mapped);
      } catch (err) {
        console.error("Map sync failed", err);
        toast.error("Nexus Link Failure: Map data offline.");
      }
    };
    fetchMapNodes();
  }, []);

  // 3. Handle External Navigation Requests (from ServiceDetail)
  useEffect(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const name = searchParams.get('name');
    if (lat && lng) {
      const dest = { lat: parseFloat(lat), lng: parseFloat(lng) };
      setDestination(dest);
      setMapCenter(dest);
      setShowRoutePanel(true);
      setSidebarOpen(false);
      toast.success(`Navigation set to ${name || 'Selected Node'}`);
    }
  }, [searchParams]);

  const filteredLocations = useMemo(() => {
    return locations.filter(loc => 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [locations, searchQuery]);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      toast.loading("Triangulating Position...", { id: 'geo' });
      navigator.geolocation.getCurrentPosition(p => {
        const coords = { lat: p.coords.latitude, lng: p.coords.longitude };
        setOrigin(coords);
        setMapCenter(coords);
        toast.success("Position Locked 🛰️", { id: 'geo' });
      }, () => {
        toast.error("GPS Signal Lost", { id: 'geo' });
      });
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row pt-16 md:pt-24 relative bg-[#F8FAFC] dark:bg-[#051923] overflow-hidden transition-colors duration-500">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="blob-luminous blob-teal -top-20 -left-20 opacity-10"></div>
        <div className="blob-luminous blob-emerald-500 bottom-0 -right-20 opacity-5"></div>
      </div>

      {/* --- SIDEBAR PANEL --- */}
      <div className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-500 md:relative md:inset-auto md:translate-y-0 md:flex md:w-[420px] md:h-full ${sidebarOpen ? 'translate-y-0' : 'translate-y-[calc(100%-70px)] md:translate-y-0'}`}>
        <div className="flex flex-col h-[85vh] md:h-full w-full glass-card md:m-4 md:rounded-[3rem] rounded-t-[3rem] overflow-hidden border border-white/10 dark:bg-slate-950/60 shadow-[0_0_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
          
          {/* Mobile Handle */}
          <div className="md:hidden flex justify-center py-4 cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <div className="w-16 h-1.5 bg-slate-300 dark:bg-slate-800 rounded-full"></div>
          </div>

          <div className="px-8 pb-6 pt-2 md:pt-10">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic mb-6">
              Navi<span className="text-emerald-500">gate</span>
            </h1>
            
            <div className="space-y-4">
               <button 
                onClick={() => setShowRoutePanel(!showRoutePanel)}
                className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all border-2 flex items-center justify-center gap-3 ${showRoutePanel ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white dark:bg-slate-900 text-slate-500 dark:border-white/5 hover:border-emerald-500/50'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                {showRoutePanel ? 'Exit Navigation' : 'Start Routing'}
              </button>

              {showRoutePanel && (
                <div className="space-y-3 animate-reveal">
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500"></div>
                    <input readOnly value={origin === CAMPUS_GATE ? "Campus Main Gate" : "Your Location"} className="w-full pl-10 pr-4 py-4 rounded-2xl bg-slate-100 dark:bg-slate-900/80 text-[10px] font-bold text-slate-400 outline-none border border-transparent" />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <input 
                      placeholder="Destination node..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/20 text-[11px] font-black outline-none focus:border-emerald-500 text-slate-900 dark:text-white transition-all shadow-sm" 
                    />
                  </div>
                </div>
              )}

              {!showRoutePanel && (
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Search campus nodes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white outline-none font-bold text-sm shadow-sm focus:border-emerald-500 transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 pb-10 space-y-4 scrollbar-hide">
             <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] italic mb-2">Available Infrastructure</h3>
             {filteredLocations.length > 0 ? filteredLocations.map((location) => (
                <div 
                  key={location.id} 
                  onClick={() => {
                    setDestination({lat: location.lat, lng: location.lng});
                    setMapCenter({lat: location.lat, lng: location.lng});
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer group ${destination?.lat === location.lat ? 'bg-emerald-500/10 border-emerald-500' : 'bg-white dark:bg-slate-900/40 border-slate-50 dark:border-white/5 hover:border-emerald-500/30'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform">
                        {location.type === 'medical' ? '🏥' : '🏪'}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-slate-800 dark:text-white group-hover:text-emerald-500 transition-colors">{location.name}</h4>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{location.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-[10px] font-mono text-slate-500 italic">No nodes matching search criteria.</p>
              )}
          </div>
        </div>
      </div>

      {/* --- MAP HUB AREA --- */}
      <div className="flex-1 relative m-2 md:m-4 md:ml-0 h-full rounded-[3rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white dark:border-slate-800">
        <GoogleMapEngine 
          center={mapCenter}
          zoom={destination ? 18 : 16}
          isDark={isDarkMode}
          origin={origin}
          destination={destination}
          markers={filteredLocations}
        />

        {/* HUD OVERLAY: Satellite Status */}
        <div className="absolute top-8 right-8 pointer-events-none hidden md:block">
           <div className="bg-slate-950/80 backdrop-blur-xl border border-emerald-500/30 p-4 rounded-2xl space-y-2 min-w-[180px]">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Signal</span>
                <span className="text-[9px] font-mono text-emerald-500 animate-pulse font-bold uppercase">Locked</span>
              </div>
              <div className="h-[1px] bg-white/10 w-full" />
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Lat</span>
                <span className="text-[9px] font-mono text-white">{mapCenter.lat.toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Lng</span>
                <span className="text-[9px] font-mono text-white">{mapCenter.lng.toFixed(4)}</span>
              </div>
           </div>
        </div>

        {/* MAP ACTION CONTROLS */}
        <div className="absolute bottom-12 right-10 flex flex-col gap-4">
           {destination && (
             <button 
              onClick={() => {setDestination(null); setOrigin(CAMPUS_GATE); setSearchParams({});}} 
              className="w-14 h-14 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
             >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
           )}
           <button 
             onClick={handleLocateMe}
             className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all border-none"
           >
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
           </button>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
}