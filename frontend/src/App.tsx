import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingBar from 'react-top-loading-bar';

// Component Imports
import ToastProvider from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Switch from './components/Switch';
import PageTransition from './components/PageTransition';

// Page Imports
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetails';
import Map from './pages/Map';
import Report from './pages/Report';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function AnimatedRoutes({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) {
  const location = useLocation();
  const [progress, setProgress] = useState(0);

  // Trigger Global Loading Bar on route changes
  useEffect(() => {
    setProgress(40); // Start progress
    const timer = setTimeout(() => setProgress(100), 300); // Complete progress
    
    return () => {
      clearTimeout(timer);
      setProgress(0); // Reset for next transition
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-campus-light dark:bg-campus-navy transition-colors duration-500 relative">
      {/* Global Top-Loading Bar matching your Luminous Teal */}
      <LoadingBar
        color="#0AD1C8" 
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        height={3}
        shadow={true}
      />
      
      <ToastProvider />
      <Navbar />
      
      <div className="fixed bottom-8 left-8 z-[9999]">
        <Switch isDarkMode={theme === 'dark'} toggleTheme={toggleTheme} />
      </div>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
          <Route path="/services/:id" element={<PageTransition><ServiceDetail /></PageTransition>} />
          <Route path="/map" element={<PageTransition><Map /></PageTransition>} />
          <Route path="/report" element={<PageTransition><Report /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <AnimatedRoutes theme={theme} toggleTheme={toggleTheme} />
    </Router>
  );
}