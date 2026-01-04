import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import GoogleMapEngine from '../components/GoogleMapEngine';
import { useJsApiLoader } from '@react-google-maps/api';
import { useDistanceMatrix } from '../hooks/useDistanceMatrix';

const LIBRARIES: ("marker" | "geometry" | "places")[] = ['marker', 'geometry', 'places'];

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [liveOpenStatus, setLiveOpenStatus] = useState<boolean | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState<string>('');

  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const checkLiveStatus = useCallback(async () => {
    if (isLoaded && service?.placeId && window.google?.maps?.places) {
      setIsRefreshing(true);
      try {
        const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
        const place = new Place({ id: service.placeId, requestedLanguage: "en" });
        await place.fetchFields({ fields: ["regularOpeningHours"] });

        if (place.regularOpeningHours) {
          const hours = place.regularOpeningHours as any;
          const isOpenNow = typeof hours.isOpen === 'function' ? !!hours.isOpen() : !!hours.isOpen;
          setLiveOpenStatus(isOpenNow);
          setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (err) {
        console.error("Luminous Node Sync Failed:", err);
      } finally {
        setTimeout(() => setIsRefreshing(false), 800);
      }
    }
  }, [isLoaded, service?.placeId]);

  const dist = useDistanceMatrix(isLoaded, service ? { lat: service.lat, lng: service.lng } : null);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/services/${id}`);
        setService(res.data);
        setIsVisible(true);
      } catch (err) {
        console.error("Node identification failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetail();
  }, [id]);

  useEffect(() => {
    if (service?.placeId) checkLiveStatus();
  }, [service?.placeId, checkLiveStatus]);

  if (loading || !isLoaded) return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#051923] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-campus-teal/20 border-t-campus-teal rounded-full animate-spin"></div>
      <p className="text-campus-teal font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Syncing Node Connection...</p>
    </div>
  );

  if (!service) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#051923] pt-24 px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-black mb-8 text-slate-900 dark:text-white uppercase italic">Node <span className="text-emerald-500">Offline</span></h1>
      <Link to="/services" className="btn-primary inline-block">← Return to Network</Link>
    </div>
  );

  const isActive = liveOpenStatus !== null ? liveOpenStatus : service.isOpen;

  return (
    <div className={`min-h-screen bg-[#F8FAFC] dark:bg-[#051923] pt-28 md:pt-36 overflow-hidden relative pb-20 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="blob-luminous blob-teal -top-20 -left-20 opacity-10"></div>
        <div className="blob-luminous blob-violet bottom-0 -right-20 opacity-5"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <Link to="/services" className="inline-flex items-center text-slate-400 dark:text-slate-500 hover:text-campus-teal transition-all font-black uppercase tracking-widest text-[10px] group">
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 flex items-center justify-center mr-3 group-hover:bg-campus-teal group-hover:text-white transition-all shadow-sm">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </div>
            Back to Directory
          </Link>
        </div>

        <div className="glass-card rounded-[3.5rem] p-8 md:p-16 border-white/80 dark:border-white/5 dark:bg-slate-900/40 relative overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="px-4 py-1.5 rounded-lg bg-campus-violet/10 border border-campus-violet/20 text-[10px] font-black uppercase tracking-[0.2em] text-campus-violet">
                  {service.category}
                </span>
                
                <div className="flex flex-col gap-1">
                  <div className={`flex items-center gap-3 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border-2 transition-all ${isActive ? 'border-emerald-500 bg-emerald-500/5 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-slate-200 dark:border-white/10 text-slate-400'}`}>
                    <span>{liveOpenStatus !== null ? (isActive ? '● Live: Open' : '○ Live: Closed') : (isActive ? '● Open' : '○ Closed')}</span>
                    <button onClick={checkLiveStatus} disabled={isRefreshing} className="ml-2 p-1 hover:bg-emerald-500/10 rounded-full transition-colors">
                      <svg className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : 'hover:rotate-180 transition-transform duration-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                  </div>
                  {lastSync && <p className="text-[7px] text-slate-400 uppercase tracking-tighter ml-1 italic">Synced at {lastSync}</p>}
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">{service.name}</h1>
            </div>

            <div className="bg-white/50 dark:bg-slate-900/40 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 flex flex-col justify-between h-full">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-6 italic">Terminal Data Output</h4>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-md border border-slate-100 dark:border-white/5">🏢</div>
                <div>
                  <p className="text-xl font-black text-slate-800 dark:text-white leading-tight mb-2">{service.address}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-tighter shadow-lg">{dist.distance || `${service.distance}m`} {dist.isFromGate ? "(Gate)" : "(User)"}</span>
                    {dist.duration && <span className="px-3 py-1 bg-campus-violet text-white text-[10px] font-black rounded-full uppercase tracking-tighter shadow-lg animate-pulse">⏱ {dist.duration} walk</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-1 gap-16 border-t border-slate-100 dark:border-white/10 pt-16">
            <section className="max-w-3xl">
              <h2 className="text-xs font-black mb-6 text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] italic">Node Overview</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg md:text-2xl leading-relaxed font-medium font-mono">{service.description}</p>
            </section>

            <section>
              <h2 className="text-xs font-black mb-6 text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] italic">Visual Radar</h2>
              <div className="relative h-80 md:h-[500px] w-full rounded-[3rem] overflow-hidden border-8 border-white dark:border-white/5 shadow-2xl bg-[#051923]">
                {/* 🚀 THE MAP ENGINE IMPLEMENTATION */}
                <GoogleMapEngine 
                  center={{ lat: service.lat, lng: service.lng }}
                  zoom={18}
                  isDark={isDarkMode}
                  markers={[{ 
                    name: service.name, 
                    lat: service.lat, 
                    lng: service.lng, 
                    category: service.category 
                  }]}
                />
              </div>
            </section>
            
            <Link 
              to={`/map?lat=${service.lat}&lng=${service.lng}&name=${encodeURIComponent(service.name)}`}
              className="btn-primary w-full py-8 text-xl md:text-2xl group text-center block no-underline bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
            >
              <span className="flex items-center justify-center uppercase tracking-widest font-black italic">
                Initialize Navigation
                <svg className="w-6 h-6 md:w-8 md:h-8 ml-6 group-hover:translate-x-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}