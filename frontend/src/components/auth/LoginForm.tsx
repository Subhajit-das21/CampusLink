// components/auth/LoginForm.tsx
import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormProps {
  redirectTo?: string;
}

/**
 * LoginForm Component
 * Handles user login with email/password
 * Creates dummy user data for frontend-only auth
 */
export const LoginForm: React.FC<LoginFormProps> = ({ redirectTo }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple client-side validation
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create dummy user data (in production, this comes from backend)
    const userData = {
      id: Date.now().toString(),
      name: formData.email.split('@')[0], // Extract name from email
      email: formData.email,
      rollNumber: '2024CS001',
      department: 'Computer Science',
      year: '3rd Year',
    };
    
    login(userData, redirectTo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* Email Input */}
      <div>
        <label htmlFor="login-email" className="block text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 mb-2">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border-2 ${
            errors.email 
              ? 'border-red-400 dark:border-red-500' 
              : 'border-slate-200 dark:border-slate-700'
          } focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-colors text-slate-900 dark:text-white placeholder:text-slate-400`}
          placeholder="your.email@campus.edu"
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="login-password" className="block text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 mb-2">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border-2 ${
            errors.password 
              ? 'border-red-400 dark:border-red-500' 
              : 'border-slate-200 dark:border-slate-700'
          } focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-colors text-slate-900 dark:text-white placeholder:text-slate-400`}
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.password}</p>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="text-right">
        <button
          type="button"
          className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors"
        >
          Forgot password?
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-teal-500 via-violet-500 to-amber-500 p-[2px] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <div className="relative px-6 py-3.5 rounded-[10px] bg-slate-900 dark:bg-slate-950 transition-colors group-hover:bg-slate-900/90">
          <span className="block font-black uppercase tracking-wide text-sm bg-gradient-to-r from-teal-400 via-violet-400 to-amber-400 bg-clip-text text-transparent">
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </span>
        </div>
      </button>

    </form>
  );
};
