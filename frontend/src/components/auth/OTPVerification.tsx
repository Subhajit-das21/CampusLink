import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';

interface OTPVerificationProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({ email, onSuccess, onBack }) => {
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsSubmitting(true);
    setError('');
    const loadingToast = toast.loading('Verifying Security Key...');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      // Store token and user data if provided
      if (data.token) {
        localStorage.setItem('campuslink:token', data.token);
        localStorage.setItem('campuslink:user', JSON.stringify(data.user));
      }

      toast.success('Identity Verified Successfully!', { id: loadingToast });
      onSuccess();
    } catch (err: any) {
      const message = err.message || 'Verification failed';
      toast.error(message, { id: loadingToast });
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    toast.loading('Resending OTP...');
    // You'll need to implement a resend endpoint in backend
    toast.error('Resend feature not implemented yet');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#0AD1C8] to-[#429EBD] rounded-full mx-auto flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
          Verify Security Key
        </h2>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Enter the 6-digit code sent to
        </p>
        <p className="text-sm font-bold text-[#0AD1C8] mt-1">
          {email}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* OTP Input */}
        <div>
          <label htmlFor="otp" className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-2 ml-1 italic">
            Security Key
          </label>
          <input
            id="otp"
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            disabled={isSubmitting}
            className={`w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-black/20 border-2 ${
              error 
                ? 'border-red-500/50 dark:border-red-500/30' 
                : 'border-slate-100 dark:border-white/5'
            } focus:border-[#0AD1C8] dark:focus:border-[#0AD1C8] focus:outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400/50 font-black text-center text-2xl tracking-[1em] disabled:opacity-50`}
            placeholder="000000"
            autoComplete="off"
          />
          {error && (
            <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-red-500 ml-1 text-center">{error}</p>
          )}
        </div>

        {/* Resend Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleResendOTP}
            className="text-[10px] font-black uppercase tracking-widest text-[#0AD1C8] hover:text-[#0AD1C8]/70 transition-colors"
          >
            Resend Code
          </button>
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-[#0AD1C8] via-[#7C3AED] to-[#F7AD19] p-[2px] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="relative px-6 py-4 rounded-[14px] bg-white dark:bg-[#051923] transition-colors group-hover:bg-transparent">
            <span className={`block font-black uppercase tracking-[0.3em] text-xs transition-colors ${
              isSubmitting ? 'text-white' : 'bg-gradient-to-r from-[#0AD1C8] via-[#7C3AED] to-[#F7AD19] bg-clip-text text-transparent group-hover:text-white'
            }`}>
              {isSubmitting ? 'Verifying...' : 'Verify Identity'}
            </span>
          </div>
        </button>

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
        >
          ← Back to Registration
        </button>

      </form>
    </div>
  );
};
