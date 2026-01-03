// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  rollNumber?: string;
  department?: string;
  year?: string;
}

const STORAGE_KEY = 'campuslink:user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Login function - stores user data and redirects
  const login = (userData: User, redirectTo?: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    
    // Redirect to intended page or default to /services
    const destination = redirectTo || '/services';
    navigate(destination, { replace: true });
  };

  // Signup function - similar to login
  const signup = (userData: User, redirectTo?: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    
    const destination = redirectTo || '/services';
    navigate(destination, { replace: true });
  };

  // Logout function - clears storage and redirects to home
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    navigate('/', { replace: true });
  };

  // Check if user is authenticated
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
