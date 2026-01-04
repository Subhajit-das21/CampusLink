import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard Component: The Gatekeeper Node
 * Prevents unauthorized access to protected sectors and preserves the return path.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 1. Loading HUD: Optimized for theme-aware transitions
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#051923] flex flex-col items-center justify-center transition-colors duration-500">
        <div className="relative">
          {/* Outer Luminous Orbit */}
          <div className="w-20 h-20 border-2 border-[#0AD1C8]/20 border-t-[#0AD1C8] rounded-full animate-spin" />
          
          {/* Inner Counter-Orbit */}
          <div 
            className="absolute inset-0 w-20 h-20 border-2 border-[#7C3AED]/20 border-b-[#7C3AED] rounded-full animate-spin" 
            style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} 
          />
          
          {/* Center Pulsing Core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#0AD1C8] rounded-full animate-pulse shadow-[0_0_15px_#0AD1C8]" />
          </div>
        </div>
        
        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-600 animate-pulse italic">
          Verifying Identity Node...
        </p>
      </div>
    );
  }

  // 2. Redirection Logic: Preserves the "intended destination"
  if (!isAuthenticated) {
    // We pass the current location to the /auth page so it can redirect back after login
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // 3. Access Granted
  return <>{children}</>;
};