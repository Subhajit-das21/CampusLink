import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * Navbar Component: The Global Control Hub
 * Synchronizes navigation states and user identity across the CampusLink nodes.
 */
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 1. Scroll Detection for Adaptive Glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Click-Outside Guard for Profile Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/services', label: 'Services', activeGradient: 'from-[#0AD1C8] to-[#429EBD]' },
    { to: '/map', label: 'Map', activeGradient: 'from-[#0AD1C8] to-[#429EBD]' },
    { to: '/report', label: 'Report', activeGradient: 'from-[#F7AD19] to-[#FF8C42]' }
  ];

  // Generate identity initials for avatar HUD
  const getUserInitials = () => {
    if (!user?.username) return 'U';
    return user.username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getFirstName = () => {
    if (!user?.username) return 'User';
    return user.username.split(' ')[0];
  };

  const handleViewProfile = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/profile');
  };

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-auto transition-all duration-500">
        <div className={`backdrop-blur-xl rounded-full px-4 md:px-8 py-3 transition-all duration-500 border ${
          scrolled 
            ? 'bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-2xl' 
            : 'bg-white/40 dark:bg-white/5 border-white/40 dark:border-white/10 shadow-lg'
        }`}>
          <div className="flex items-center justify-between md:gap-10">
            
            {/* Brand Logo HUD */}
            <Link to="/" className="flex items-center gap-1.5 group transition-transform hover:scale-105 active:scale-95">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 dark:text-white transition-colors">
                Campus
              </span>
              <span className="text-xl md:text-2xl font-black italic tracking-tighter text-[#0AD1C8]">
                Link
              </span>
            </Link>

            {/* Desktop Navigation Nodes */}
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

              {/* Secure Identity Controller */}
              {isAuthenticated ? (
                <div className="relative ml-2" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="group flex items-center justify-start w-[45px] h-[45px] rounded-full cursor-pointer relative overflow-hidden transition-all duration-300 shadow-[2px_2px_10px_rgba(0,0,0,0.1)] bg-gradient-to-r from-[#0AD1C8] to-[#429EBD] hover:w-[160px] hover:rounded-[40px] active:translate-x-[2px] active:translate-y-[2px]"
                    title={user?.username || 'User Profile'}
                  >
                    <div className="w-full h-full transition-all duration-300 flex items-center justify-center group-hover:w-[30%] group-hover:pl-5">
                      <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-black text-sm border-2 border-white/40">
                        {getUserInitials()}
                      </div>
                    </div>
                    <div className="absolute right-0 w-0 opacity-0 text-white text-sm font-semibold transition-all duration-300 group-hover:opacity-100 group-hover:w-[70%] group-hover:pr-3 whitespace-nowrap overflow-hidden italic">
                      {getFirstName()}
                    </div>
                  </button>

                  {/* Profile Dropdown Hub */}
                  {userDropdownOpen && (
                    <div className="absolute top-14 right-0 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-4 bg-gradient-to-br from-[#0AD1C8]/10 to-[#429EBD]/10 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0AD1C8] to-[#429EBD] flex items-center justify-center text-white font-black text-lg">
                            {getUserInitials()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-slate-900 dark:text-white truncate uppercase italic">
                              {user?.username}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={handleViewProfile}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          View Network Profile
                        </button>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          Disconnect Session
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="ml-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#0AD1C8] to-[#429EBD] text-white text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-90"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Control Interface */}
            <div className="md:hidden flex items-center gap-2">
              {isAuthenticated && (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="group w-10 h-10 rounded-full bg-gradient-to-r from-[#0AD1C8] to-[#429EBD] p-0.5 transition-all duration-[450ms] hover:scale-110 active:scale-95"
                >
                  <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-black text-xs border-2 border-white/40">
                    {getUserInitials()}
                  </div>
                </button>
              )}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-900 dark:text-white"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Avatar Dropdown - Logic Synchronized */}
        {userDropdownOpen && isAuthenticated && (
          <div className="md:hidden absolute top-20 right-4 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            <div className="p-4 bg-gradient-to-br from-[#0AD1C8]/10 to-[#429EBD]/10 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0AD1C8] to-[#429EBD] flex items-center justify-center text-white font-black text-lg">
                  {getUserInitials()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-900 dark:text-white truncate uppercase italic">
                    {user?.username}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-2">
              <button
                onClick={handleViewProfile}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                View Profile
              </button>
              <button
                onClick={() => {
                  setUserDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Mobile Hamburger Menu - Logic Synchronized */}
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
            {!isAuthenticated && (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center py-4 rounded-xl font-black uppercase tracking-widest text-xs bg-gradient-to-r from-[#0AD1C8] to-[#429EBD] text-white shadow-xl"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
}