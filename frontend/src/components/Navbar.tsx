import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/services', label: 'Services', activeGradient: 'from-[#0AD1C8] to-[#429EBD]' },
    { to: '/map', label: 'Map', activeGradient: 'from-[#0AD1C8] to-[#429EBD]' },
    { to: '/report', label: 'Report', activeGradient: 'from-[#F7AD19] to-[#FF8C42]' },
    { to: '/profile', label: 'Profile', activeGradient: 'from-[#0AD1C8] to-[#429EBD]' }
  ];

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-auto transition-all duration-500">
        <div className={`backdrop-blur-xl rounded-full px-4 md:px-8 py-3 transition-all duration-500 border ${
          scrolled 
            ? 'bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-2xl' 
            : 'bg-white/40 dark:bg-white/5 border-white/40 dark:border-white/10 shadow-lg'
        }`}>
          <div className="flex items-center justify-between md:gap-10">
            
            {/* Logo: Always high contrast */}
            <Link to="/" className="flex items-center gap-1.5 group transition-transform hover:scale-105 active:scale-95">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 dark:text-white transition-colors">
                Campus
              </span>
              <span className="text-xl md:text-2xl font-black italic tracking-tighter text-[#0AD1C8]">
                Link
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 px-5 py-2 rounded-full transform hover:scale-110 active:scale-90 ${
                    isActive(link.to) 
                      ? `bg-gradient-to-r ${link.activeGradient} text-white shadow-lg`
                      : 'text-slate-600 dark:text-slate-400 hover:text-[#0AD1C8] dark:hover:text-white hover:bg-white dark:hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-900 dark:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 space-y-3 shadow-3xl animate-reveal">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-center py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
                  isActive(link.to) 
                    ? `bg-gradient-to-r ${link.activeGradient} text-white shadow-xl`
                    : 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}