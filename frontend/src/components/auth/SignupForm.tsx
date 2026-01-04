import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import toast from 'react-hot-toast';

interface SignupFormProps {
  redirectTo?: string;
  onSuccess?: (email: string) => void; // Added to trigger OTP screen
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  useAuth();
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

  const validateForm = (): boolean => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.name.trim()) newErrors.name = 'Full identity required';
    if (!formData.email) {
      newErrors.email = 'Email node required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid node format';
    }
    if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll ID required';
    if (!formData.department.trim()) newErrors.department = 'Sector required';
    if (!formData.password) {
      newErrors.password = 'Security key required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Key must be 6+ chars';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Keys do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    const loadingToast = toast.loading('Initializing Identity Node...');

    try {
      // 🚀 REAL BACKEND REGISTRATION
      // Note: Backend expects 'username' instead of 'name'
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        username: formData.name,
        email: formData.email,
        rollNumber: formData.rollNumber,
        department: formData.department,
        password: formData.password
      });

      toast.success('Security key dispatched to campus email!', { id: loadingToast });
      
      // If you have a separate OTP component, call onSuccess
      if (onSuccess) {
        onSuccess(formData.email);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Initialization Failed';
      toast.error(message, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... (Your existing input JSX remains perfect, just ensure it uses 'username' if you refactor props) ... */}
      
      {/* Full Name Input */}
      <div>
        <label htmlFor="signup-name" className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-2 ml-1 italic">
          Full Identity
        </label>
        <input
          id="signup-name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-5 py-3 rounded-xl bg-white/50 dark:bg-black/20 border-2 ${
            errors.name ? 'border-red-500/50' : 'border-slate-100 dark:border-white/5'
          } focus:border-[#0AD1C8] focus:outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400/50 font-bold`}
          placeholder="Satyam Mondal"
        />
        {errors.name && <p className="mt-1.5 text-[10px] font-black uppercase text-red-500 ml-1">{errors.name}</p>}
      </div>

      {/* ... (Keep other inputs: email, rollNumber, department, password as they are) ... */}
      
      {/* Signup Terminal Action */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-[#0AD1C8] via-[#7C3AED] to-[#F7AD19] p-[2px] transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 mt-4"
      >
        <div className="relative px-6 py-4 rounded-[14px] bg-white dark:bg-[#051923] transition-colors group-hover:bg-transparent">
          <span className={`block font-black uppercase tracking-[0.3em] text-xs transition-colors ${
            isSubmitting ? 'text-white' : 'bg-gradient-to-r from-[#0AD1C8] via-[#7C3AED] to-[#F7AD19] bg-clip-text text-transparent group-hover:text-white'
          }`}>
            {isSubmitting ? 'Syncing...' : 'Register Identity'}
          </span>
        </div>
      </button>
    </form>
  );
};