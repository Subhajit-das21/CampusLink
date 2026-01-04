import { Link } from 'react-router-dom';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, CircleF } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '100%' };

// Standardized across all app nodes to prevent Loader conflict errors
const LIBRARIES: ("marker" | "geometry" | "places")[] = ['marker', 'geometry', 'places'];

// Backup Map Themes
const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#051923" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#051923" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#0AD1C8" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#051923" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] }
];

const lightMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#f8fafc" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#0f172a" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#e0f2fe" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f1f5f9" }] },
  { featureType: "poi", stylers: [{ visibility: "on" }] }
];

export default function Home() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );
  const [coords, setCoords] = useState({ lat: 22.5580536, lng: 88.3966811 });
  const [hasPermission, setHasPermission] = useState(false);
  const [zoom, setZoom] = useState(2);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES // Fixed: Now matches other nodes to prevent Loader errors
  });

  // 1. Unified Theme Detection
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // 2. Map Options with Mutual Exclusivity Fix
  const mapOptions = useMemo(() => {
    // If you have a Cloud ID, use it for Dark mode, otherwise set to undefined
    const MAP_ID = import.meta.env.VITE_DARK_MAP_ID || undefined;

    return {
      disableDefaultUI: true,
      // Fixed: mapId and styles are mutually exclusive
      mapId: isDarkMode ? MAP_ID : undefined,
      styles: isDarkMode && !MAP_ID ? darkMapStyles : (isDarkMode ? undefined : lightMapStyles),
      isFractionalZoomEnabled: true,
    };
  }, [isDarkMode]);

  // 3. Geolocation logic
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setHasPermission(true);
        setZoom(14);
      },
      () => {
        setCoords({ lat: 22.5580536, lng: 88.3966811 });
        setHasPermission(false);
        setZoom(15);
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#051923] text-slate-900 dark:text-white selection:bg-campus-teal/30 transition-colors duration-500">
      
      <section className="min-h-screen relative flex items-center justify-center pt-20 overflow-hidden bg-[#f0fdfe] dark:bg-transparent transition-colors duration-500">
        {/* Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#0AD1C8]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F7AD19]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center lg:text-left space-y-8 animate-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-campus-teal/20 text-xs font-bold uppercase tracking-widest text-[#0AD1C8]">
              <span className="w-2 h-2 rounded-full bg-[#0AD1C8] animate-pulse"></span>
              Live Synchronization
            </div>
            <h1 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tight leading-[0.95]">
              Linking Campus <br /> To <span className="bg-gradient-to-r from-[#0AD1C8] via-[#45DFB1] to-[#F7AD19] bg-clip-text text-transparent italic">Community.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              The trusted digital bridge for college life—navigate your locality with confidence and real-time precision.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-5">
              <Link to="/services" className="btn-primary px-10 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-campus-teal/20">
                Get Started
              </Link>
            </div>
          </div>

          {/* Map Portal */}
          <div className="hidden lg:block relative h-[620px] animate-float">
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-[95%] h-[95%] rounded-[3.5rem] p-2 bg-gradient-to-br from-campus-teal/30 via-white/20 to-campus-violet/30 dark:from-campus-teal/20 dark:via-slate-900/40 dark:to-campus-violet/20 shadow-[0_30px_60px_rgba(10,209,200,0.2)] dark:shadow-3xl rotate-2 transform translate-x-10 transition-all duration-500">
                  
                  <div className="h-full w-full rounded-[3rem] overflow-hidden relative border-4 border-white dark:border-slate-800 bg-white dark:bg-[#051923] transition-colors duration-500">
                     
                     {isLoaded ? (
                       <GoogleMap
                         // Fixed: Key forces fresh mount on theme switch
                         key={isDarkMode ? 'home-dark' : 'home-light'}
                         mapContainerStyle={containerStyle}
                         center={coords}
                         zoom={zoom}
                         onLoad={(map) => { mapRef.current = map; }}
                         options={mapOptions}
                       >
                         <CircleF
                          center={coords}
                          radius={hasPermission ? 150 : 800000}
                          options={{
                            fillColor: "#0AD1C8",
                            fillOpacity: isDarkMode ? 0.1 : 0.2,
                            strokeColor: "#0AD1C8",
                            strokeOpacity: 0.4,
                            strokeWeight: 1,
                          }}
                        />
                         <MarkerF 
                           position={coords}
                           icon={{
                             path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                             fillColor: "#0AD1C8",
                             fillOpacity: 1,
                             strokeWeight: 2,
                             strokeColor: isDarkMode ? "#ffffff" : "#051923",
                             scale: 1.8
                           }}
                         />
                       </GoogleMap>
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-campus-teal font-black animate-pulse uppercase tracking-widest text-xs transition-colors">
                         Connecting to Satellite...
                       </div>
                     )}

                     {/* Zoom Controllers */}
                     <div className="absolute top-10 right-10 flex flex-col gap-2 z-50">
                        <button onClick={() => setZoom(prev => prev + 1)} className="w-10 h-10 glass-card bg-white/80 dark:bg-slate-900/80 flex items-center justify-center rounded-xl text-slate-800 dark:text-white font-black hover:bg-campus-teal hover:text-white transition-all border border-slate-200 dark:border-white/10">+</button>
                        <button onClick={() => setZoom(prev => prev - 1)} className="w-10 h-10 glass-card bg-white/80 dark:bg-slate-900/80 flex items-center justify-center rounded-xl text-slate-800 dark:text-white font-black hover:bg-campus-teal hover:text-white transition-all border border-slate-200 dark:border-white/10">−</button>
                     </div>

                     {/* Re-center Control */}
                     <button 
                       onClick={requestLocation}
                       className="absolute bottom-10 right-10 z-50 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-campus-teal/30 shadow-2xl hover:scale-110 transition-all"
                     >
                       <svg className={`w-7 h-7 ${hasPermission ? 'text-campus-teal' : 'text-slate-400'} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                       </svg>
                     </button>

                     {/* HUD Data Overlay */}
                     <div className="absolute top-10 left-10 pointer-events-none">
                        <div className="bg-white/60 dark:bg-black/60 backdrop-blur-md px-5 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-[9px] font-mono text-slate-800 dark:text-campus-teal uppercase tracking-widest leading-relaxed shadow-sm">
                          Theme: {isDarkMode ? 'Luminous_Dark' : 'Luminous_Light'} <br />
                          Loc: {coords.lat.toFixed(4)}°, {coords.lng.toFixed(4)}°
                        </div>
                     </div>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Feature & Impact Nodes */}
      <section className="py-32 bg-[#f5f3ff] dark:bg-[#020C12] transition-colors duration-500 border-y border-campus-violet/5 dark:border-none">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative h-[500px] rounded-[3rem] bg-white dark:bg-slate-900 overflow-hidden shadow-2xl border-8 border-white dark:border-white/5 group transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-campus-violet/10 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center group-hover:scale-110 transition-transform duration-700">
                    <div className="text-9xl mb-6 drop-shadow-xl">🧭</div>
                    <div className="bg-campus-violet text-white px-8 py-3 rounded-full font-black uppercase tracking-[0.2em] shadow-xl text-sm transition-colors">
                        Safe Path Engine
                    </div>
                  </div>
                </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-campus-violet font-black uppercase tracking-[0.3em] text-sm">Interactive Safety</h3>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic uppercase text-slate-900 dark:text-white transition-colors">
                Navigate with <br /> <span className="text-campus-violet">Confidence.</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed transition-colors">
                Find the safest routes, track live transit, and explore your campus neighborhood through a verified, student-curated map interface.
              </p>
              <div className="flex gap-4">
                <Link to="/map" className="px-8 py-4 bg-campus-violet text-white rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl shadow-campus-violet/20">
                  Open Live Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-[#fffbeb] dark:bg-[#051923] text-slate-900 dark:text-white transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase mb-6 text-slate-900 dark:text-white transition-colors">Empowering <br /> Local Impact</h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium transition-colors">Strengthening the relationship between campus life and local community infrastructure.</p>
            </div>
            <Link to="/services" className="px-8 py-4 border-2 border-campus-amber/30 dark:border-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-campus-amber hover:text-white transition-all text-campus-amber dark:text-white">
              View All Services
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Verified Directory', icon: '🏪', desc: 'Trust-based ecosystem for food, printing, and essential campus services.', borderColor: 'border-campus-teal' },
              { title: 'Issue Reporting', icon: '📝', desc: 'Report local infrastructure issues like broken lights or safety concerns directly.', borderColor: 'border-campus-amber' },
              { title: 'Community Voice', icon: '🤝', desc: 'A bridge for local vendors to connect with students through verified listings.', borderColor: 'border-campus-violet' }
            ].map((card, i) => (
              <div key={i} className={`bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-xl border-b-8 ${card.borderColor} hover:-translate-y-4 transition-all duration-500 group`}>
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{card.icon}</div>
                <h4 className="text-xl font-black uppercase tracking-tighter mb-4 text-slate-900 dark:text-white transition-colors">{card.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium transition-colors">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Network CTA Section */}
      <section className="py-40 relative bg-[#051923] dark:bg-black overflow-hidden text-center transition-colors duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0AD1C815_0%,transparent_70%)]"></div>
        <div className="relative z-10 space-y-10 px-6">
          <h2 className="text-5xl md:text-8xl font-black tracking-tight leading-none uppercase italic text-white transition-colors">
            Ready to <span className="bg-gradient-to-r from-[#0AD1C8] to-[#F7AD19] bg-clip-text text-transparent">Link</span> Up?
          </h2>
          <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-3xl mx-auto">
            Join thousands of students in building a safer, more connected campus ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/report" className="px-12 py-5 bg-gradient-to-r from-[#F7AD19] to-[#FF8C42] rounded-full text-white font-black uppercase tracking-widest shadow-2xl hover:scale-110 transition-all">
              Report an Issue
            </Link>
            <Link to="/profile" className="px-12 py-5 rounded-full border border-white/20 font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}