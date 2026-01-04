import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { GoogleMap, CircleF, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: 22.5580536, lng: 88.3966811 };
const MAX_SCAN_RADIUS = 500; 

const EMERALD_NEON = "#00FF41"; 
const EMERALD_DEEP = "#003B00"; 
const REPORT_AMBER = "#F59E0B"; // Specific color for dropped report pins

// 1. Standardized Theme Configs
const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#051923" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#051923" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#0AD1C8" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#051923" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] }
];

const lightMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#f8fafc" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#0f172a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
];

interface MapEngineProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: any[];
  interactive?: boolean;
  origin?: { lat: number; lng: number } | null;
  destination?: { lat: number; lng: number } | null;
  isDark?: boolean;
  onLocationSelect?: (coords: { lat: number; lng: number }) => void; // ADDED: For pin dropping
}

const GoogleMapEngine: React.FC<MapEngineProps> = ({ 
  center = defaultCenter, 
  zoom = 15, 
  markers = [], 
  interactive = true,
  origin = null,
  destination = null,
  isDark: propIsDark,
  onLocationSelect // ADDED
}) => {
  // 2. Unified Theme Detection
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );

  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<any[]>([]);
  const [scanRadius, setScanRadius] = useState(0);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // 3. THE FIX: Balanced Style Logic
  const mapOptions = useMemo(() => {
    const currentMode = propIsDark !== undefined ? propIsDark : isDarkMode;
    const CLOUD_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_ID || "7b133eb5f8c4dacb7656f627";

    return {
      mapId: currentMode ? CLOUD_MAP_ID : undefined,
      styles: currentMode ? darkMapStyles : lightMapStyles, 
      disableDefaultUI: true,
      zoomControl: interactive,
      scrollwheel: interactive,
      gestureHandling: interactive ? 'greedy' : 'none',
      backgroundColor: currentMode ? "#051923" : "#f8fafc",
    };
  }, [isDarkMode, propIsDark, interactive]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // NEW: Handle Map Click for Pin Dropping
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (onLocationSelect && e.latLng) {
      onLocationSelect({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
    }
  }, [onLocationSelect]);

  // 4. Kinetic Sonar Loop
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      setScanRadius(r => (r + 1.5 > MAX_SCAN_RADIUS ? 0 : r + 1.5)); 
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // 5. Directions Hub
  useEffect(() => {
    if (window.google && destination) {
      const service = new google.maps.DirectionsService();
      service.route({
        origin: origin || defaultCenter,
        destination: destination,
        travelMode: google.maps.TravelMode.WALKING,
      }, (result, status) => {
        if (status === "OK") setDirections(result);
      });
    } else {
      setDirections(null);
    }
  }, [origin, destination]);

  // 6. Advanced Marker Manager
  useEffect(() => {
    let isMounted = true;
    const initMarkers = async () => {
      if (!window.google || !mapRef.current) return;
      try {
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        if (!isMounted) return;

        markersRef.current.forEach(m => { m.map = null; });
        markersRef.current = [];

        // Primary Node (Emerald) - Used for Destination
        if (destination || center) {
            const mainPin = new PinElement({ 
                background: EMERALD_NEON, 
                borderColor: "#fff", 
                glyphColor: EMERALD_DEEP 
            });
            const mainMarker = new AdvancedMarkerElement({
              map: mapRef.current,
              position: destination || center,
              content: mainPin.element,
            });
            markersRef.current.push(mainMarker);
        }

        // Secondary Nodes (Teal or Amber for Reports)
        markers.forEach((m) => {
          // If we are in "Report Mode" (passed an ID 'temp' or 'report'), use Amber
          const isReportPin = m.id === 'temp' || m.id === 'report';
          
          const nodePin = new PinElement({ 
            background: isReportPin ? REPORT_AMBER : "#0AD1C8", 
            scale: isReportPin ? 1.2 : 0.8,
            borderColor: isReportPin ? "#fff" : "rgba(255,255,255,0.2)"
          });

          const nodeMarker = new AdvancedMarkerElement({
            map: mapRef.current,
            position: { lat: m.lat, lng: m.lng },
            title: m.name || "Incident Location",
            content: nodePin.element
          });
          markersRef.current.push(nodeMarker);
        });
      } catch (err) { console.error("Advanced Marker Init Failed:", err); }
    };
    
    initMarkers();
    return () => { isMounted = false; };
  }, [markers, destination, center, isDarkMode]);

  if (!window.google) return <div className="w-full h-full bg-[#051923] rounded-[3rem] animate-pulse" />;

  const scannerOpacity = (1 - (scanRadius / MAX_SCAN_RADIUS)) * 0.4;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-[3rem]">
      <GoogleMap 
        key={isDarkMode ? 'dark-nexus' : 'light-nexus'} 
        mapContainerStyle={containerStyle} 
        center={center} 
        zoom={zoom} 
        onLoad={onLoad}
        options={mapOptions}
        onClick={handleMapClick} // ADDED: Enable clicking
      >
        {directions && (
          <DirectionsRenderer 
            directions={directions} 
            options={{
              polylineOptions: { strokeColor: EMERALD_NEON, strokeWeight: 6, strokeOpacity: 0.8 },
              preserveViewport: true,
              suppressMarkers: true 
            }} 
          />
        )}
        
        <CircleF center={defaultCenter} radius={25} options={{ fillColor: EMERALD_DEEP, fillOpacity: 0.4, strokeWeight: 0, clickable: false }} />
        <CircleF center={defaultCenter} radius={scanRadius} options={{ fillColor: "transparent", strokeColor: EMERALD_NEON, strokeOpacity: scannerOpacity, strokeWeight: 1.5, clickable: false }} />
      </GoogleMap>

      {/* Dynamic HUD Overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-2xl flex items-center gap-3 shadow-2xl">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] font-mono">
            {isDarkMode ? 'Dark' : 'Light'} Grid {onLocationSelect ? '• Input Mode' : '• Online'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(GoogleMapEngine);