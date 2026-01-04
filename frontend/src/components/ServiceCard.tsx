import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites'; // Corrected path
import { useDistanceMatrix } from '../hooks/useDistanceMatrix';
import { type Service } from '../types/service';
import toast from 'react-hot-toast';
import styled from 'styled-components';

interface ServiceCardProps {
  service: Service;
  isMapLoaded: boolean;
}

export default function ServiceCard({ service, isMapLoaded }: ServiceCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Theme state for specific HeartWrapper adjustments
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Fetch real-time spatial telemetry
  const liveDist = useDistanceMatrix(isMapLoaded, { lat: service.lat, lng: service.lng });
  const favorite = isFavorite(service.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    toggleFavorite(service.id);
    
    if (!favorite) {
      toast.success(`Node ${service.name} pinned to network`, { 
        // Syncing toast style with the Luminous design system
        style: { 
          borderRadius: '1.5rem', 
          background: isDarkMode ? '#051923' : '#ffffff', 
          color: isDarkMode ? '#0AD1C8' : '#0f172a', 
          border: isDarkMode ? '1px solid #0AD1C8' : '1px solid #0AD1C8',
          fontSize: '10px',
          fontWeight: '900',
          textTransform: 'uppercase'
        }
      });
    }
  };

  return (
    <Link to={`/services/${service.id}`} className="block group">
      <div className="glass-card rounded-[2.5rem] p-7 h-full border-white/80 dark:border-white/5 dark:bg-slate-900/40 transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-[0_30px_60px_rgba(10,209,200,0.15)] relative overflow-hidden">
        
        {/* Connection Status Bar */}
        <div className={`absolute top-0 left-0 w-full h-1.5 transition-transform duration-700 origin-left scale-x-0 group-hover:scale-x-100 ${
          service.isOpen ? 'bg-campus-teal' : 'bg-campus-violet'
        }`}></div>

        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-4">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-campus-violet mb-2 block opacity-70 italic">
              {service.category}
            </span>
            <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tighter leading-none group-hover:text-campus-teal transition-colors uppercase italic">
              {service.name}
            </h3>
          </div>

          {/* Interactive Bookmark Node */}
          <div onClick={handleFavoriteClick} className="relative z-10 scale-[1.3] -translate-x-2 translate-y-2">
            <HeartWrapper $isDark={isDarkMode}>
              <div className="love">
                <input id={`heart-${service.id}`} type="checkbox" checked={favorite} readOnly />
                <label className="love-heart" htmlFor={`heart-${service.id}`}>
                  <i className="left" /><i className="right" /><i className="bottom" />
                  <div className="round" />
                </label>
              </div>
            </HeartWrapper>
          </div>
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8 line-clamp-2 font-mono italic">
          {service.description}
        </p>

        {/* Footer Metrics Section */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${service.isOpen ? 'bg-campus-teal animate-pulse shadow-[0_0_10px_#0AD1C8]' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${service.isOpen ? 'text-campus-teal' : 'text-slate-400'}`}>
              {service.isOpen ? 'Node Online' : 'Node Offline'}
            </span>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center text-slate-400 dark:text-slate-500 group-hover:text-campus-teal transition-all">
              <span className="text-[11px] font-black uppercase tracking-widest mr-2">
                {liveDist.distance || `${service.distance}m`}
              </span>
              <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            {liveDist.duration && (
              <span className="text-[7px] font-black text-campus-violet uppercase tracking-[0.2em] mt-1 italic animate-pulse">
                ~ {liveDist.duration} walk
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

const HeartWrapper = styled.div<{ $isDark: boolean }>`
  .love-heart:before, input { display: none; }
  .love-heart, .love-heart::after, .love-heart .bottom {
    background-color: ${props => props.$isDark ? 'rgba(255,255,255,0.05)' : '#fff1f2'};
    border-color: ${props => props.$isDark ? 'rgba(255,255,255,0.1)' : '#fda4af'};
    border: 1.5px solid;
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .love-heart {
    border-top-left-radius: 100px; border-top-right-radius: 100px;
    width: 12px; height: 10px; border-bottom: 0;
    position: relative; transform: rotate(-45deg); display: block; cursor: pointer;
  }
  .love-heart::after {
    content: ""; display: block; position: absolute; right: -11px;
    transform: rotate(90deg); top: 9px; border-top-left-radius: 100px;
    border-top-right-radius: 100px; width: 12px; height: 10px; border-bottom: 0;
  }
  .love-heart .bottom {
    content: ""; display: block; position: absolute; width: 13.5px; height: 13.5px;
    border-left: 1.5px solid; border-bottom: 1.5px solid; left: -1.5px; top: 6px; border-radius: 0px 0px 0px 5px;
  }
  .round {
    position: absolute; z-index: 2; width: 6px; height: 6px; 
    background: ${props => props.$isDark ? '#0AD1C8' : '#ffffff'};
    box-shadow: 0 2px 10px rgba(0,0,0,0.3); border-radius: 100%; left: 2px; bottom: 2px;
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  input:checked + .love-heart, input:checked + .love-heart::after, input:checked + .love-heart .bottom {
    background-color: #fb7185; border-color: #f43f5e;
    box-shadow: inset 6px -5px 0px 2px #fda4af; filter: drop-shadow(0 0 10px rgba(244, 63, 94, 0.6));
  }
  input:checked + label .round { transform: translate(8px, 8px); }
`;