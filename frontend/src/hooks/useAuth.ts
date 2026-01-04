import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Updated User Interface
 * Aligned with the Backend Model (username, rollNumber, department)
 */
export interface User {
  id: string;
  username: string; // Changed from 'name' to 'username'
  email: string;
  rollNumber: string;
  department: string;
  year?: string;
}

const STORAGE_KEY = 'campuslink:user';
const TOKEN_KEY = 'token'; // Added for JWT synchronization

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Initial Identity Synchronization
  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = localStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Identity parsing failure:', error);
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(TOKEN_KEY);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * login: Establishes a secure session and stores the JWT.
   */
  const login = useCallback((userData: User, token: string, redirectTo?: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, token); // Store the JWT for API calls
    setUser(userData);
    
    const destination = redirectTo || '/services';
    navigate(destination, { replace: true });
  }, [navigate]);

  /**
   * signup: Effectively the same as login after successful OTP verification.
   */
  const signup = useCallback((userData: User, token: string, redirectTo?: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, token);
    setUser(userData);
    
    const destination = redirectTo || '/services';
    navigate(destination, { replace: true });
  }, [navigate]);

  /**
   * logout: Wipes the local node and the access key.
   */
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    navigate('/', { replace: true });
  }, [navigate]);

  const isAuthenticated = !!user;

  return {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
  };
};