import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Home() {
  // const [scrollY, setScrollY] = useState(0);
  const [, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    /* Wrapper: Global Background and text color transitions */
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#051923] text-slate-900 dark:text-white selection:bg-campus-teal/30 transition-colors duration-500">
      
      {/* --- HERO SECTION: Soft Teal Tint (#f0fdfe) --- */}
      <section className="min-h-screen relative flex items-center justify-center pt-20 overflow-hidden bg-[#f0fdfe] dark:bg-transparent transition-colors duration-500">
        {/* Animated Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#0AD1C8]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F7AD19]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center lg:text-left space-y-8 animate-reveal">
            
            {/* Badge: Reactive to dark mode and light mode tinted background */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-campus-teal/20 dark:border-white/10 text-xs font-bold uppercase tracking-widest text-[#0AD1C8]">
              <span className="w-2 h-2 rounded-full bg-[#0AD1C8] animate-pulse"></span>
              Student-Driven Ecosystem
            </div>
            
            <h1 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tight leading-[0.95] text-slate-900 dark:text-white transition-colors">
              Linking Campus <br /> To <span className="bg-gradient-to-r from-[#0AD1C8] via-[#45DFB1] to-[#F7AD19] bg-clip-text text-transparent italic">Community.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 transition-colors">
              The trusted digital bridge for college life—helping you discover verified services and navigate your locality with confidence.
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-5">
              <Link to="/services" className="px-10 py-4 rounded-full bg-gradient-to-r from-[#0AD1C8] to-[#429EBD] text-white font-black uppercase tracking-widest hover:scale-105 hover:shadow-[0_10px_40px_rgba(10,209,200,0.4)] transition-all">
                Get Started
              </Link>
              <Link to="/map" className="px-10 py-4 rounded-full border border-slate-300 dark:border-white/20 font-black uppercase tracking-widest text-slate-600 dark:text-white hover:bg-white dark:hover:bg-white/5 transition-all">
                Explore Map
              </Link>
            </div>
          </div>

          {/* Isometric Visual Card: Adjusted depth for tinted background */}
          <div className="hidden lg:block relative h-[600px] animate-float">
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[85%] h-[80%] bg-white/70 dark:bg-slate-900/50 backdrop-blur-2xl rounded-[3rem] border border-white dark:border-white/10 p-4 shadow-[0_30px_60px_rgba(10,209,200,0.1)] dark:shadow-3xl rotate-3 transform translate-x-10 transition-all duration-500">
                   <div className="h-full w-full bg-[#F1F5F9] dark:bg-[#051923] rounded-[2.2rem] border border-slate-200 dark:border-white/5 relative overflow-hidden flex items-center justify-center transition-colors">
                      <div className="text-[15rem] opacity-[0.03] font-black text-slate-900 dark:text-white uppercase select-none">MAP</div>
                      <div className="relative z-10 text-center">
                         <div className="text-6xl mb-4 drop-shadow-2xl">📍</div>
                         <div className="px-6 py-2 bg-white dark:bg-[#0AD1C8]/20 border border-slate-200 dark:border-[#0AD1C8]/30 rounded-full text-slate-900 dark:text-[#0AD1C8] font-black uppercase tracking-widest text-xs shadow-sm">
                            Navigation Active
                         </div>
                      </div>
                   </div>
                </div>
                {/* Floating Badges */}
                <div className="absolute top-20 left-0 bg-white/90 dark:bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white dark:border-white/10 shadow-xl animate-bounce" style={{ animationDuration: '4s' }}>
                   <span className="text-2xl">🏪</span>
                </div>
                <div className="absolute bottom-20 right-0 bg-white/90 dark:bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white dark:border-white/10 shadow-xl animate-bounce" style={{ animationDuration: '5s' }}>
                   <span className="text-2xl">🛡️</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- FEATURE SECTION: Soft Violet Tint (#f5f3ff) --- */}
      <section className="py-32 bg-[#f5f3ff] dark:bg-[#020C12] text-slate-900 dark:text-white transition-colors duration-500 border-y border-campus-violet/5 dark:border-none">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Map Preview Visual */}
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

      {/* --- SERVICES & IMPACT: Soft Amber Tint (#fffbeb) --- */}
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

      {/* --- FINAL CTA: Balanced Dark Theme --- */}
      <section className="py-40 relative bg-[#051923] dark:bg-black overflow-hidden text-center transition-colors duration-500">
        {/* Luminous glow fixed for dark backgrounds */}
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