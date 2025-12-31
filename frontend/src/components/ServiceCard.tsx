import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavourites';
import toast from 'react-hot-toast';
import type { Service } from '../types';
import styled from 'styled-components';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(service.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    toggleFavorite(service.id);
    
    if (!favorite) {
      toast.success(`Pinned ${service.name}! ❤️`, { duration: 2000 });
    } else {
      toast(`Removed ${service.name}`, { icon: '💔' });
    }
  };

  return (
    <Link to={`/services/${service.id}`} className="block group">
      <div className="glass-card rounded-[2.5rem] p-6 h-full border-white/80 dark:border-white/5 dark:bg-slate-900/40 transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] relative overflow-hidden">
        
        {/* Animated Accent Bar */}
        <div className={`absolute top-0 left-0 w-full h-1.5 transition-transform duration-500 scale-x-0 group-hover:scale-x-100 ${
          service.isOpen ? 'bg-campus-teal' : 'bg-campus-violet'
        }`}></div>

        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-4">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-campus-violet dark:text-campus-violet/80 mb-1 block opacity-60">
              {service.category}
            </span>
            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-tight group-hover:text-campus-teal transition-colors">
              {service.name}
            </h3>
          </div>

          {/* REFINED HEART TOGGLE */}
          <div onClick={handleFavoriteClick} className="relative z-10 scale-[1.8] translate-x-[-12px] translate-y-[12px]">
            <HeartWrapper>
              <div className="love">
                <input id={`heart-${service.id}`} type="checkbox" checked={favorite} readOnly />
                <label className="love-heart" htmlFor={`heart-${service.id}`}>
                  <i className="left" />
                  <i className="right" />
                  <i className="bottom" />
                  <div className="round" />
                </label>
              </div>
            </HeartWrapper>
          </div>
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8 line-clamp-2">
          {service.description}
        </p>

        <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${service.isOpen ? 'bg-campus-teal animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${service.isOpen ? 'text-campus-teal' : 'text-slate-400 dark:text-slate-500'}`}>
              {service.isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>
          
          <div className="flex items-center text-slate-400 dark:text-slate-500 group-hover:text-campus-teal transition-all">
            <span className="text-[10px] font-black uppercase tracking-widest mr-2">{service.distance}m</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

const HeartWrapper = styled.div`
  .love-heart:before, input {
    display: none;
  }

  /* Permanent Soft Pink Background for visibility in light mode */
  .love-heart, .love-heart::after, .love-heart .bottom {
    background-color: #fff1f2; /* Rose-50: Slight pink inside */
    border-color: #fda4af;     /* Rose-300: Soft pink border */
    border: 1px solid;
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .love-heart {
    border-top-left-radius: 100px;
    border-top-right-radius: 100px;
    width: 10px;
    height: 8px;
    border-bottom: 0;
    box-sizing: border-box;
    position: relative;
    transform: rotate(-45deg);
    display: block;
    cursor: pointer;
  }

  .love-heart::after {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    right: -9px;
    transform: rotate(90deg);
    top: 7px;
    border-top-left-radius: 100px;
    border-top-right-radius: 100px;
    width: 10px;
    height: 8px;
    border-bottom: 0;
  }

  .love-heart .bottom {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 11px;
    height: 11px;
    border-left: 1px solid;
    border-bottom: 1px solid;
    left: -1px;
    top: 5px;
    border-radius: 0px 0px 0px 5px;
    border-top: none;
    border-right: none;
  }

  /* The Moving ball */
  .round {
    position: absolute;
    z-index: 2;
    width: 8px;
    height: 8px;
    background: #fff; /* White ball */
    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
    border-radius: 100%;
    left: 0px;
    bottom: -1px;
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    animation: check-animation2 0.6s forwards;
  }

  /* CHECKED STATE: Rose Pink Glow & Background */
  input:checked + .love-heart, 
  input:checked + .love-heart::after, 
  input:checked + .love-heart .bottom {
    background-color: #fb7185; /* Rose-400 (Fill) */
    border-color: #f43f5e;     /* Rose-500 (Border) */
    box-shadow: inset 6px -5px 0px 2px #fda4af; /* Rose-300 (Inner Shadow) */
    filter: drop-shadow(0 0 8px rgba(244, 63, 94, 0.5)); /* Rose-500 based glow */
  }

  input:checked + label .round {
    animation: check-animation 0.6s forwards;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  }

  /* DARK MODE OVERRIDES: Adjust pink to be more subtle */
  @media (prefers-color-scheme: dark) {
    .love-heart, .love-heart::after, .love-heart .bottom {
       background-color: rgba(255, 241, 242, 0.05);
       border-color: rgba(253, 164, 175, 0.2);
    }
    input:checked + .love-heart, 
    input:checked + .love-heart::after, 
    input:checked + .love-heart .bottom {
      background-color: #9f1239; /* Deep Crimson for dark mode fill */
    }
  }

  @keyframes check-animation {
    0% { transform: translate(0px, 0px); }
    50% { transform: translate(0px, 7px); }
    100% { transform: translate(7px, 7px); }
  }

  @keyframes check-animation2 {
    0% { transform: translate(7px, 7px); }
    50% { transform: translate(0px, 7px); }
    100% { transform: translate(0px, 0px); }
  }
`;