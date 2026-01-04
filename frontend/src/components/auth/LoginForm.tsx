import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface LoginFormProps {
  redirectTo?: string | undefined;
}

export const LoginForm: React.FC<LoginFormProps> = ({ redirectTo }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Identity required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid node format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Security key required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Key must be 6+ chars';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    const loadingToast = toast.loading('Initializing Access...');

    try {
      // Call login with correct parameters
      const result = await login(
        {
          email: formData.email,
          password: formData.password
        },
        redirectTo
      );

      if (result.success) {
        toast.success('Access Granted!', { id: loadingToast });
      } else {
        toast.error(result.error || 'Authentication failed', { id: loadingToast });
        setErrors({ ...errors, email: 'Authentication failed' });
      }
    } catch (err: any) {
      const message = err.message || 'Handshake failed';
      toast.error(message, { id: loadingToast });
      setErrors({ ...errors, email: 'Authentication failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Email Input Node */}
      <div>
        <label htmlFor="login-email" className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-2 ml-1 italic">
          Campus Identity
        </label>
        <input
          id="login-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={isSubmitting}
          className={`w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-black/20 border-2 ${
            errors.email 
              ? 'border-red-500/50 dark:border-red-500/30' 
              : 'border-slate-100 dark:border-white/5'
          } focus:border-[#0AD1C8] dark:focus:border-[#0AD1C8] focus:outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400/50 font-bold disabled:opacity-50`}
          placeholder="id@campus.edu"
        />
        {errors.email && (
          <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-red-500 ml-1">{errors.email}</p>
        )}
      </div>

      {/* Password Input Node */}
      <div>
        <label htmlFor="login-password" className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-2 ml-1 italic">
          Security Key
        </label>
        <input
          id="login-password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          disabled={isSubmitting}
          className={`w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-black/20 border-2 ${
            errors.password 
              ? 'border-red-500/50 dark:border-red-500/30' 
              : 'border-slate-100 dark:border-white/5'
          } focus:border-[#0AD1C8] dark:focus:border-[#0AD1C8] focus:outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400/50 font-bold disabled:opacity-50`}
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-red-500 ml-1">{errors.password}</p>
        )}
      </div>

      <div className="text-right">
        <button
          type="button"
          className="text-[10px] font-black uppercase tracking-widest text-[#0AD1C8] hover:text-campus-teal/70 transition-colors"
        >
          Recover Key?
        </button>
      </div>

      {/* Terminal Access Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-[#0AD1C8] via-[#7C3AED] to-[#F7AD19] p-[2px] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="relative px-6 py-4 rounded-[14px] bg-white dark:bg-[#051923] transition-colors group-hover:bg-transparent">
          <span className={`block font-black uppercase tracking-[0.3em] text-xs transition-colors ${
            isSubmitting ? 'text-white' : 'bg-gradient-to-r from-[#0AD1C8] via-[#7C3AED] to-[#F7AD19] bg-clip-text text-transparent group-hover:text-white'
          }`}>
            {isSubmitting ? 'Syncing...' : 'Initialize Access'}
          </span>
        </div>
      </button>

    </form>
  );
};
