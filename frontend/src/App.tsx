import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingBar from 'react-top-loading-bar';

// Component Hub
import ToastProvider from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Switch from './components/Switch';
import PageTransition from './components/PageTransition';
import { AuthGuard } from './components/auth/AuthGuard';

// Page Hub
import Home from './pages/Home';
import { AuthPage } from './pages/AuthPage';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetails';
import Map from './pages/Map';
import Report from './pages/Report';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

/**
 * AnimatedRoutes Component: The Kinetic Router Node
 * Manages route transitions, loading states, and global UI visibility.
 */
function AnimatedRoutes({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) {
  const location = useLocation();
  const [progress, setProgress] = useState(0);

  // 1. Global Loading Bar Logic: Synchronized with CampusLink 2026 motion curves
  useEffect(() => {
    setProgress(30); 
    const timer = setTimeout(() => setProgress(100), 400); 
    
    return () => {
      clearTimeout(timer);
      setProgress(0); 
    };
  }, [location.pathname]);

  // UI Visibility Logic: Hide Global HUD on Auth Page
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#051923] transition-colors duration-500 relative overflow-x-hidden">
      <LoadingBar
        color="#0AD1C8" // Luminous Teal
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        height={3}
        shadow={true}
      />
      
      <ToastProvider />
      
      {!isAuthPage && <Navbar />}
      
      {/* Nexus Theme Controller */}
      {!isAuthPage && (
        <div className="fixed bottom-8 left-8 z-[9999] hover:scale-110 active:scale-95 transition-transform">
          <Switch isDarkMode={theme === 'dark'} toggleTheme={toggleTheme} />
        </div>
      )}

      {/* Kinetic Routing Engine */}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          
          {/* Public Access Points */}
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><AuthPage /></PageTransition>} />
          
          {/* Restricted Network Nodes */}
          <Route path="/services" element={<AuthGuard><PageTransition><Services /></PageTransition></AuthGuard>} />
          <Route path="/services/:id" element={<AuthGuard><PageTransition><ServiceDetail /></PageTransition></AuthGuard>} />
          <Route path="/map" element={<AuthGuard><PageTransition><Map /></PageTransition></AuthGuard>} />
          <Route path="/report" element={<AuthGuard><PageTransition><Report /></PageTransition></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard><PageTransition><Profile /></PageTransition></AuthGuard>} />
          
          {/* Error Handler */}
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default function App() {
  // 2. Identity & Theme Persistence Engine
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    // Auto-detect system preference if no user override exists
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply Theme to DOM root
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <Router>
      <AnimatedRoutes theme={theme} toggleTheme={toggleTheme} />
    </Router>
  );
}