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
import { AuthGuard } from './components/auth/AuthGuard';

// Page Imports
import Home from './pages/Home';
import { AuthPage } from './pages/AuthPage';
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
      
      {/* Hide Navbar on Auth page for cleaner experience */}
      {location.pathname !== '/auth' && <Navbar />}
      
      {/* Hide theme switcher on Auth page (or keep it - your choice) */}
      {location.pathname !== '/auth' && (
        <div className="fixed bottom-8 left-8 z-[9999]">
          <Switch isDarkMode={theme === 'dark'} toggleTheme={toggleTheme} />
        </div>
      )}

      {/* AnimatePresence with location key for smooth transitions */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/auth" 
            element={
              <PageTransition>
                <AuthPage />
              </PageTransition>
            } 
          />
          
          {/* Protected Routes - Wrapped in AuthGuard */}
          <Route 
            path="/services" 
            element={
              <AuthGuard>
                <PageTransition>
                  <Services />
                </PageTransition>
              </AuthGuard>
            } 
          />
          
          <Route 
            path="/services/:id" 
            element={
              <AuthGuard>
                <PageTransition>
                  <ServiceDetail />
                </PageTransition>
              </AuthGuard>
            } 
          />
          
          <Route 
            path="/map" 
            element={
              <AuthGuard>
                <PageTransition>
                  <Map />
                </PageTransition>
              </AuthGuard>
            } 
          />
          
          <Route 
            path="/report" 
            element={
              <AuthGuard>
                <PageTransition>
                  <Report />
                </PageTransition>
              </AuthGuard>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <AuthGuard>
                <PageTransition>
                  <Profile />
                </PageTransition>
              </AuthGuard>
            } 
          />
          
          {/* 404 Route */}
          <Route 
            path="*" 
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            } 
          />
        </Routes>
      </AnimatePresence>

      {/* Hide Footer on Auth page */}
      {location.pathname !== '/auth' && <Footer />}
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
