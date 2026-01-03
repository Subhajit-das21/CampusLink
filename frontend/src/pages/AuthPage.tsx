// pages/AuthPage.tsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';

/**
 * AuthPage Component
 * Combined Login/Signup page with tab switching
 * Matches CampusLink's premium design language
 */
export const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const location = useLocation();
  
  // Get the intended destination from navigation state
  const from = (location.state as { from?: string })?.from || '/services';

  // Animated background blobs (similar to Home hero)
  useEffect(() => {
    // Reset animations when tab changes
    const blobs = document.querySelectorAll('.auth-blob');
    blobs.forEach((blob) => {
      blob.classList.remove('animate-pulse');
      setTimeout(() => blob.classList.add('animate-pulse'), 10);
    });
  }, [activeTab]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="auth-blob absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-teal-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="auth-blob absolute top-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-violet-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="auth-blob absolute -bottom-32 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>

      {/* Main Auth Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          
          {/* Glassmorphism Card */}
          <div className="relative backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800/50 overflow-hidden">
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-violet-500/10 to-amber-500/10 opacity-50" />
            
            {/* Content Container */}
            <div className="relative z-10 p-8 sm:p-10">
              
              {/* Logo/Brand */}
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight bg-gradient-to-r from-teal-500 via-violet-500 to-amber-500 bg-clip-text text-transparent">
                  CampusLink
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Your campus, connected
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="relative flex gap-2 p-1.5 bg-slate-200/50 dark:bg-slate-800/50 rounded-[1.5rem] mb-8">
                
                {/* Sliding indicator */}
                <div
                  className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.25rem)] bg-white dark:bg-slate-700 rounded-[1.25rem] shadow-lg transition-transform duration-300 ease-out ${
                    activeTab === 'signup' ? 'translate-x-[calc(100%+0.5rem)]' : 'translate-x-0'
                  }`}
                />
                
                {/* Login Tab */}
                <button
                  onClick={() => setActiveTab('login')}
                  className={`relative z-10 flex-1 py-3 text-sm font-bold uppercase tracking-wide rounded-[1.25rem] transition-colors duration-300 ${
                    activeTab === 'login'
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Login
                </button>
                
                {/* Signup Tab */}
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`relative z-10 flex-1 py-3 text-sm font-bold uppercase tracking-wide rounded-[1.25rem] transition-colors duration-300 ${
                    activeTab === 'signup'
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form Container with Animated Transition */}
              <div className="relative">
                <div className={`transition-all duration-300 ${activeTab === 'login' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute inset-0 pointer-events-none'}`}>
                  {activeTab === 'login' && <LoginForm redirectTo={from} />}
                </div>
                
                <div className={`transition-all duration-300 ${activeTab === 'signup' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute inset-0 pointer-events-none'}`}>
                  {activeTab === 'signup' && <SignupForm redirectTo={from} />}
                </div>
              </div>

            </div>
          </div>

          {/* Back to Home Link */}
          <div className="text-center mt-6">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
