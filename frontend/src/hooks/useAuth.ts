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

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  rollNumber: string;
  department: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

const STORAGE_KEY = 'campuslink:user';
const TOKEN_KEY = 'campuslink:token';
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

console.log('🔗 API Base URL:', API_BASE_URL);

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials, redirectTo?: string): Promise<AuthResult> => {
    setLoading(true);
    setError(null);

    console.log('🔐 Attempting login to:', `${API_BASE_URL}/api/auth/login`);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await response.json();
      console.log('✅ Login successful');

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      setUser(data.user);

      const destination = redirectTo || '/services';
      navigate(destination, { replace: true });

      return { success: true };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      const errorMessage = error.message || 'Login failed. Please check your connection.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Modified: Signup now only registers, doesn't auto-login
  const signup = async (userData: SignupData, redirectTo?: string): Promise<AuthResult> => {
    setLoading(true);
    setError(null);

    console.log('📝 Attempting signup to:', `${API_BASE_URL}/api/auth/signup`);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Signup failed');
      }

      const data = await response.json();
      console.log('✅ Signup successful - OTP sent to email');

      // ✅ DON'T store token or user yet - wait for OTP verification
      // localStorage.setItem(TOKEN_KEY, data.token);
      // localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      // setUser(data.user);

      // ✅ DON'T navigate - let the parent component handle showing OTP screen
      // const destination = redirectTo || '/services';
      // navigate(destination, { replace: true });

      return { success: true };
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      const errorMessage = error.message || 'Signup failed. Please check your connection.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    navigate('/', { replace: true });
  };

  const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
  };

  const isAuthenticated = !!user;

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    signup,
    logout,
    getToken,
  };
};
