import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

/**
 * ToastProvider: The UI Feedback Node
 * Synchronized with the Luminous design system of CampusLink 2026.
 */
export default function ToastProvider() {
  // Observe theme to adjust shadow intensity for maximum contrast
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <Toaster
      position="top-right"
      gutter={12} // Increased spacing between multiple network alerts
      toastOptions={{
        className: 'luminous-toast',
        duration: 3000,
        style: {
          padding: '16px 24px',
          borderRadius: '24px',
          fontSize: '11px', // Optimized for terminal-style readability
          fontWeight: '900',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: 'monospace',
          // High-contrast border for dark mode
          border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
        },
        success: {
          iconTheme: {
            primary: '#fff',
            secondary: '#45DFB1',
          },
          style: {
            background: 'linear-gradient(135deg, #45DFB1 0%, #0AD1C8 100%)',
            color: '#fff',
            // Glowing shadow intensity increases in dark mode
            boxShadow: isDarkMode 
              ? '0 20px 50px rgba(10, 209, 200, 0.4)' 
              : '0 15px 30px rgba(69, 223, 177, 0.2)',
          },
        },
        error: {
          iconTheme: {
            primary: '#fff',
            secondary: '#ff4b4b',
          },
          style: {
            background: 'linear-gradient(135deg, #ff4b4b 0%, #dc2626 100%)',
            color: '#fff',
            boxShadow: isDarkMode 
              ? '0 20px 50px rgba(220, 38, 38, 0.4)' 
              : '0 15px 30px rgba(220, 38, 38, 0.2)',
          },
        },
        loading: {
          style: {
            background: 'linear-gradient(135deg, #0AD1C8 0%, #429EBD 100%)',
            color: '#fff',
            boxShadow: '0 20px 40px rgba(10, 209, 200, 0.2)',
          },
        },
      }}
    />
  );
}