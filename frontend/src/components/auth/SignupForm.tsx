import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface SignupFormProps {
  redirectTo?: string;
}

/**
 * SignupForm Component: Identity Creation Node
 * Collects and synchronizes campus credentials with the Luminous design system.
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
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const userData = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      rollNumber: formData.rollNumber,
      department: formData.department,
      year: '1st Year',
    };
    
    signup(userData, redirectTo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
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

      {/* Email Input */}
      <div>
        <label htmlFor="signup-email" className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-2 ml-1 italic">
          Campus Node (Email)
        </label>
        <input
          id="signup-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-5 py-3 rounded-xl bg-white/50 dark:bg-black/20 border-2 ${
            errors.email ? 'border-red-500/50' : 'border-slate-100 dark:border-white/5'
          } focus:border-[#0AD1C8] focus:outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400/50 font-bold`}
          placeholder="id@campus.edu"
        />
        {errors.email && <p className="mt-1.5 text-[10px] font-black uppercase text-red-500 ml-1">{errors.email}</p>}
      </div>

      {/* Roll Number & Department HUD */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="signup-roll" className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-2 ml-1 italic">
            Roll ID
          </label>
          <input
            id="signup-roll"
            type="text"
            value={formData.rollNumber}
            onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border-2 ${
              errors.rollNumber ? 'border-red-500/50' : 'border-slate-100 dark:border-white/5'
            } focus:border-[#0AD1C8] focus:outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400/50 font-bold text-xs`}
            placeholder="2024CS001"
          />
        </div>
        <div>
          <label htmlFor="signup-dept" className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-2 ml-1 italic">
            Sector (Dept)
          </label>
          <input
            id="signup-dept"
            type="text"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border-2 ${
              errors.department ? 'border-red-500/50' : 'border-slate-100 dark:border-white/5'
            } focus:border-[#0AD1C8] focus:outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400/50 font-bold text-xs`}
            placeholder="IT / CSE"
          />
        </div>
      </div>

      {/* Security Key Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="signup-password" className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-2 ml-1 italic">
            Key
          </label>
          <input
            id="signup-password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border-2 ${
              errors.password ? 'border-red-500/50' : 'border-slate-100 dark:border-white/5'
            } focus:border-[#0AD1C8] focus:outline-none transition-all text-slate-900 dark:text-white font-bold text-xs`}
            placeholder="••••••"
          />
        </div>
        <div>
          <label htmlFor="signup-confirm" className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-2 ml-1 italic">
            Verify
          </label>
          <input
            id="signup-confirm"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border-2 ${
              errors.confirmPassword ? 'border-red-500/50' : 'border-slate-100 dark:border-white/5'
            } focus:border-[#0AD1C8] focus:outline-none transition-all text-slate-900 dark:text-white font-bold text-xs`}
            placeholder="••••••"
          />
        </div>
      </div>

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
            {isSubmitting ? 'Initializing Node...' : 'Register Identity'}
          </span>
        </div>
      </button>

    </form>
  );
};