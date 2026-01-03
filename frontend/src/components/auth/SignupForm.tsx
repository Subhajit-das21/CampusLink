// components/auth/SignupForm.tsx
import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface SignupFormProps {
  redirectTo?: string;
}

/**
 * SignupForm Component
 * Handles new user registration
 * Collects additional campus-specific information
 */
export const SignupForm: React.FC<SignupFormProps> = ({ redirectTo }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    department: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Comprehensive validation for signup
  const validateForm = (): boolean => {
    const newErrors: Partial<typeof formData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create user data
    const userData = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      rollNumber: formData.rollNumber,
      department: formData.department,
      year: '1st Year', // Default or could be added to form
    };
    
    signup(userData, redirectTo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Name Input */}
      <div>
        <label htmlFor="signup-name" className="block text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 mb-2">
          Full Name
        </label>
        <input
          id="signup-name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border-2 ${
            errors.name 
              ? 'border-red-400 dark:border-red-500' 
              : 'border-slate-200 dark:border-slate-700'
          } focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-colors text-slate-900 dark:text-white placeholder:text-slate-400`}
          placeholder="John Doe"
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.name}</p>
        )}
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="signup-email" className="block text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 mb-2">
          Email
        </label>
        <input
          id="signup-email"
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

      {/* Roll Number & Department - Grid Layout */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="signup-roll" className="block text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 mb-2">
            Roll No.
          </label>
          <input
            id="signup-roll"
            type="text"
            value={formData.rollNumber}
            onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border-2 ${
              errors.rollNumber 
                ? 'border-red-400 dark:border-red-500' 
                : 'border-slate-200 dark:border-slate-700'
            } focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-colors text-slate-900 dark:text-white placeholder:text-slate-400`}
            placeholder="2024CS001"
          />
          {errors.rollNumber && (
            <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.rollNumber}</p>
          )}
        </div>

        <div>
          <label htmlFor="signup-dept" className="block text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 mb-2">
            Department
          </label>
          <input
            id="signup-dept"
            type="text"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border-2 ${
              errors.department 
                ? 'border-red-400 dark:border-red-500' 
                : 'border-slate-200 dark:border-slate-700'
            } focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-colors text-slate-900 dark:text-white placeholder:text-slate-400`}
            placeholder="CSE"
          />
          {errors.department && (
            <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.department}</p>
          )}
        </div>
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="signup-password" className="block text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 mb-2">
          Password
        </label>
        <input
          id="signup-password"
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

      {/* Confirm Password Input */}
      <div>
        <label htmlFor="signup-confirm" className="block text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 mb-2">
          Confirm Password
        </label>
        <input
          id="signup-confirm"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border-2 ${
            errors.confirmPassword 
              ? 'border-red-400 dark:border-red-500' 
              : 'border-slate-200 dark:border-slate-700'
          } focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-colors text-slate-900 dark:text-white placeholder:text-slate-400`}
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-teal-500 via-violet-500 to-amber-500 p-[2px] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <div className="relative px-6 py-3.5 rounded-[10px] bg-slate-900 dark:bg-slate-950 transition-colors group-hover:bg-slate-900/90">
          <span className="block font-black uppercase tracking-wide text-sm bg-gradient-to-r from-teal-400 via-violet-400 to-amber-400 bg-clip-text text-transparent">
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </span>
        </div>
      </button>

    </form>
  );
};
