import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicesData } from '../data/services';

export default function ServiceDetail() {
  const { id } = useParams();
  const service = servicesData.find(s => s.id === id);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#051923] pt-24 px-4 overflow-hidden relative transition-colors duration-500">
        <div className="blob-luminous blob-violet top-1/4 left-1/4 opacity-10"></div>
        <div className="relative z-10 text-center">
          <div className="text-8xl mb-8 animate-float">🔍</div>
          <h1 className="text-4xl md:text-6xl font-black mb-8 text-slate-900 dark:text-white tracking-tighter uppercase italic">
            Service <span className="text-gradient-link">Not Found</span>
          </h1>
          <Link 
            to="/services" 
            className="btn-primary inline-block"
          >
            ← Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#051923] pt-28 md:pt-36 overflow-hidden relative pb-20 transition-colors duration-500">
      {/* Luminous Mesh Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="blob-luminous blob-teal -top-20 -left-20 opacity-10 dark:opacity-20"></div>
        <div className="blob-luminous blob-violet bottom-0 -right-20 opacity-10 dark:opacity-5"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-10 transition-all duration-700">
          <Link 
            to="/services" 
            className="inline-flex items-center text-slate-400 dark:text-slate-500 hover:text-campus-teal dark:hover:text-white transition-all font-black uppercase tracking-widest text-[10px] group"
          >
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 flex items-center justify-center mr-3 group-hover:bg-campus-teal group-hover:text-white group-hover:border-campus-teal transition-all shadow-sm">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            Back to Directory
          </Link>
        </div>

        {/* Main Service Card */}
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="glass-card rounded-[3.5rem] p-8 md:p-16 border-white/80 dark:border-white/5 dark:bg-slate-900/40 relative overflow-hidden shadow-2xl transition-all duration-500">
            
            {/* Header Content Grid */}
            <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="px-4 py-1.5 rounded-lg bg-campus-violet/10 border border-campus-violet/20 text-[10px] font-black uppercase tracking-[0.2em] text-campus-violet">
                    {service.category}
                  </span>
                  <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border-2 transition-all ${
                    service.isOpen 
                      ? 'border-campus-teal bg-campus-teal/5 text-campus-teal animate-pulse-glow' 
                      : 'border-slate-100 dark:border-white/10 text-slate-400 dark:text-slate-500'
                  }`}>
                    {service.isOpen ? '● Open Now' : '○ Closed'}
                  </div>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">
                  {service.name}
                </h1>
                
                <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-xs">📍</span>
                  Verified Campus Community Partner
                </div>
              </div>

              {/* Quick Info Box */}
              <div className="bg-slate-50/50 dark:bg-slate-900/40 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 flex flex-col justify-between h-full transition-colors">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-6 italic">Direct Location</h4>
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-md border border-slate-100 dark:border-white/5">
                      🏢
                    </div>
                    <div>
                      <p className="text-xl font-black text-slate-800 dark:text-white leading-tight mb-2">
                        {service.address}
                      </p>
                      <p className="text-xs font-bold text-campus-teal uppercase tracking-widest">
                        {service.distance} meters from campus gate
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Info Sections */}
            <div className="grid md:grid-cols-1 gap-16 border-t border-slate-100 dark:border-white/10 pt-16">
              <section className="max-w-3xl">
                <h2 className="text-xs font-black mb-6 text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] italic">Service Overview</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg md:text-2xl leading-relaxed font-medium">
                  {service.description}
                </p>
              </section>

              {/* Map Visualization Engine - REFINED VIBE */}
              <section>
                <h2 className="text-xs font-black mb-6 text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] italic">Interactive Transit</h2>
                <div className="relative h-80 md:h-[450px] w-full rounded-[3rem] overflow-hidden border-8 border-white dark:border-white/5 shadow-inner bg-slate-100 dark:bg-slate-900 group transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-campus-teal/20 to-campus-violet/10 opacity-40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center group-hover:scale-105 transition-transform duration-700">
                      <div className="text-9xl mb-6 drop-shadow-2xl">🗺️</div>
                      <div className="glass-panel px-8 py-3 rounded-full font-black uppercase tracking-[0.2em] shadow-xl text-[10px] border-white dark:border-white/20 dark:text-white">
                        Google Maps Platform Active
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Dynamic Action Button */}
              <button className="btn-primary w-full py-8 text-xl md:text-2xl group shadow-[0_20px_50px_rgba(10,209,200,0.3)] dark:shadow-campus-teal/10">
                <span className="flex items-center justify-center">
                  Get Precise Directions
                  <svg className="w-6 h-6 md:w-8 md:h-8 ml-6 group-hover:translate-x-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}