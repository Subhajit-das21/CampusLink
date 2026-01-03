import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
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

  // ✅ REMOVED PROFILE FROM NAVBAR
  const navLinks = [
    { to: '/services', label: 'Services', activeGradient: 'from-[#0AD1C8] to-[#429EBD]' },
    { to: '/map', label: 'Map', activeGradient: 'from-[#0AD1C8] to-[#429EBD]' },
    { to: '/report', label: 'Report', activeGradient: 'from-[#F7AD19] to-[#FF8C42]' }
  ];

  // Generate user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle View Profile navigation
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

              {/* Auth Section - Desktop */}
              {isAuthenticated ? (
                <div className="relative ml-2" ref={dropdownRef}>
                  {/* User Avatar Button */}
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-gradient-to-r from-[#0AD1C8] to-[#429EBD] hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wide text-white hidden lg:block">
                      {user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-black text-xs border-2 border-white/40">
                      {getUserInitials()}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute top-14 right-0 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info Header */}
                      <div className="p-4 bg-gradient-to-br from-[#0AD1C8]/10 to-[#429EBD]/10 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0AD1C8] to-[#429EBD] flex items-center justify-center text-white font-black text-lg">
                            {getUserInitials()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {user?.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                        {user?.rollNumber && (
                          <div className="mt-2 flex items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 bg-[#0AD1C8]/20 text-[#0AD1C8] dark:text-[#0AD1C8] rounded-full font-semibold">
                              {user.rollNumber}
                            </span>
                            {user?.department && (
                              <span className="text-slate-600 dark:text-slate-400">
                                {user.department}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        {/* ✅ CHANGED TO BUTTON WITH NAVIGATION */}
                        <button
                          onClick={handleViewProfile}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          View Profile
                        </button>
                        
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
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

            {/* Mobile Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-900 dark:text-white"
              aria-label="Toggle menu"
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
            
            {/* Mobile User Info */}
            {isAuthenticated && user && (
              <div className="pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0AD1C8] to-[#429EBD] flex items-center justify-center text-white font-black text-lg">
                    {getUserInitials()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                {/* ✅ ADDED VIEW PROFILE BUTTON IN MOBILE */}
                <button
                  onClick={handleViewProfile}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase tracking-wide text-[10px] bg-gradient-to-r from-[#0AD1C8] to-[#429EBD] text-white transition-all hover:shadow-lg active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </button>
              </div>
            )}

            {/* Mobile Nav Links */}
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

            {/* Mobile Auth Button */}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase tracking-widest text-xs bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            ) : (
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
