import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';

/**
 * AuthPage Component: Central Node for User Access
 * Optimized for 2026 CampusLink Design Language
 */
export const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const location = useLocation();
  
  // Theme state for dynamic glow adjustments
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );

  // Sync theme changes to update card transparency levels
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Intended destination from navigation state
  const from = (location.state as { from?: string })?.from || '/services';

  // Pulse effect synchronization
  useEffect(() => {
    const blobs = document.querySelectorAll('.auth-blob');
    blobs.forEach((blob) => {
      blob.classList.remove('animate-pulse');
      // Force reflow
      void (blob as HTMLElement).offsetWidth;
      blob.classList.add('animate-pulse');
    });
  }, [activeTab]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC] dark:bg-[#051923] transition-colors duration-500">
      
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="auth-blob absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#0AD1C8]/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="auth-blob absolute top-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="auth-blob absolute -bottom-32 left-1/4 w-96 h-96 bg-gradient-to-br from-[#F7AD19]/10 to-orange-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>

      {/* Main Auth Terminal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-reveal">
        <div className="w-full max-w-md">
          
          {/* Glass-Card Controller */}
          <div className="relative backdrop-blur-3xl bg-white/70 dark:bg-slate-900/40 rounded-[3rem] shadow-2xl border-4 border-white dark:border-white/5 overflow-hidden transition-all duration-500">
            
            {/* Sector Glow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0AD1C8]/5 via-[#7C3AED]/5 to-[#F7AD19]/5 pointer-events-none" />
            
            <div className="relative z-10 p-8 sm:p-12">
              
              {/* Brand HUD */}
              <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter bg-gradient-to-r from-[#0AD1C8] via-[#7C3AED] to-[#F7AD19] bg-clip-text text-transparent italic">
                  CampusLink
                </h1>
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 italic">
                  Initialize Secure Access
                </p>
              </div>

              {/* Tab Selector Hub */}
              <div className="relative flex gap-2 p-1.5 bg-slate-100/50 dark:bg-black/40 rounded-[1.5rem] mb-10 border border-slate-200 dark:border-white/5">
                
                {/* Sliding Node Indicator */}
                <div
                  className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.25rem)] bg-white dark:bg-slate-800 rounded-[1.25rem] shadow-xl transition-transform duration-500 ease-nexus ${
                    activeTab === 'signup' ? 'translate-x-[calc(100%+0.5rem)]' : 'translate-x-0'
                  }`}
                />
                
                <button
                  onClick={() => setActiveTab('login')}
                  className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-[1.25rem] transition-colors duration-500 ${
                    activeTab === 'login' ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                  }`}
                >
                  Login
                </button>
                
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-[1.25rem] transition-colors duration-500 ${
                    activeTab === 'signup' ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form Component Injection */}
              <div className="relative min-h-[300px]">
                <div className={`transition-all duration-500 ${activeTab === 'login' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0 pointer-events-none'}`}>
                  {activeTab === 'login' && <LoginForm redirectTo={from} />}
                </div>
                
                <div className={`transition-all duration-500 ${activeTab === 'signup' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0 pointer-events-none'}`}>
                  {activeTab === 'signup' && <SignupForm redirectTo={from} />}
                </div>
              </div>

            </div>
          </div>

          {/* Navigation Return */}
          <div className="text-center mt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#0AD1C8] transition-all group italic"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path d="M15 19l-7-7 7-7" />
              </svg>
              Abort to Home Node
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};