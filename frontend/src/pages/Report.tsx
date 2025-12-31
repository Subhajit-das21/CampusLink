import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form'; // New Import
import * as yup from 'yup'; // New Import
import { yupResolver } from '@hookform/resolvers/yup'; // New Import
import toast from 'react-hot-toast';

// Define the validation schema
const schema = yup.object().shape({
  type: yup.string().required('Please select an issue type'),
  description: yup.string()
    .min(20, 'Please provide at least 20 characters for a detailed report')
    .max(500, 'Description is too long')
    .required('Description is required'),
});

interface ReportFormData {
  type: string;
  description: string;
}

export default function Report() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Initialize Hook Form
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    formState: { errors } 
  } = useForm<ReportFormData>({
    resolver: yupResolver(schema),
    defaultValues: { type: '', description: '' }
  });

  const selectedType = watch('type');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const issueTypes = [
    { label: 'Street Light', icon: '💡' },
    { label: 'Road Safety', icon: '🚧' },
    { label: 'Garbage', icon: '♻️' },
    { label: 'Water Supply', icon: '🚰' },
    { label: 'Safety Concern', icon: '🛡️' },
    { label: 'Other', icon: '✨' }
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image must be under 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        toast.success('Evidence attached 📸');
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ReportFormData) => {
    const loadingToast = toast.loading('Syncing with community board...');
    
    // Simulate API Call
    setTimeout(() => {
      toast.dismiss(loadingToast);
      console.log('Backend Payload:', { ...data, image: selectedImage });
      setSubmitted(true);
      toast.success('Report filed successfully! 🎉');
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#051923] flex items-center justify-center px-6 pt-20 overflow-hidden relative transition-colors duration-500">
        <div className="blob-luminous blob-teal top-1/4 left-1/4 opacity-10"></div>
        <div className="text-center max-lg relative z-10">
          <div className="w-24 h-24 bg-campus-teal/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
            <svg className="w-12 h-12 text-campus-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-5xl font-black mb-4 text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">
            Report <span className="text-campus-teal">Filed</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 font-medium leading-relaxed">
            Thank you for being an active community member. We have notified local authorities and pinned this to the board.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/profile" className="btn-primary">Track Progress</Link>
            <button 
              onClick={() => setSubmitted(false)} 
              className="px-8 py-4 rounded-full border border-slate-200 dark:border-white/10 font-black uppercase tracking-widest text-[10px] text-slate-500 hover:bg-white dark:hover:bg-white/5 transition-all"
            >
              New Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#051923] pt-28 md:pt-36 overflow-hidden relative pb-20 transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="blob-luminous blob-amber -top-20 -left-20 opacity-10 dark:opacity-20"></div>
        <div className="blob-luminous blob-violet bottom-0 -right-20 opacity-5 dark:opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-campus-amber/10 border border-campus-amber/20 text-[10px] font-black uppercase tracking-[0.2em] text-campus-amber mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-campus-amber animate-pulse"></span>
              Civic Engagement
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">
              Report <span className="text-gradient-link">Issues</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-400 dark:text-slate-500 font-medium mt-4 leading-tight">Help bridge the gap in local infrastructure.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={`grid lg:grid-cols-12 gap-8 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border-white/80 dark:border-white/5 dark:bg-slate-900/40 shadow-2xl">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-8 italic">Issue Details</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {issueTypes.map((type) => (
                  <button
                    key={type.label}
                    type="button"
                    onClick={() => setValue('type', type.label, { shouldValidate: true })}
                    className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border-2 ${
                      selectedType === type.label
                        ? 'border-campus-amber bg-campus-amber/5 shadow-lg scale-105'
                        : 'border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 text-slate-400 dark:text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-center">{type.label}</span>
                  </button>
                ))}
              </div>
              {errors.type && <p className="text-red-500 text-[10px] font-bold uppercase ml-2 mb-6">{errors.type.message}</p>}

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-2">Description</label>
                <textarea
                  {...register('description')}
                  placeholder="What's happening? Be as specific as possible..."
                  rows={4}
                  className={`w-full px-6 py-5 rounded-[1.5rem] bg-white dark:bg-slate-800 border ${errors.description ? 'border-red-500' : 'border-slate-100 dark:border-white/10'} focus:border-campus-teal outline-none transition-all text-slate-700 dark:text-white font-medium resize-none shadow-sm`}
                />
                {errors.description && <p className="text-red-500 text-[10px] font-bold uppercase ml-2">{errors.description.message}</p>}
              </div>
            </div>

            {/* Visual Evidence Block */}
            <div className="glass-card rounded-[2.5rem] p-8 border-white/80 dark:border-white/5 dark:bg-slate-900/40 shadow-2xl">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-6 italic">Visual Evidence</h3>
              {!selectedImage ? (
                <label className="flex flex-col items-center justify-center border-4 border-dashed border-slate-100 dark:border-white/10 rounded-[2rem] p-10 hover:border-campus-teal/30 hover:bg-campus-teal/5 transition-all cursor-pointer group">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">📸</div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Attach Photo</p>
                </label>
              ) : (
                <div className="relative rounded-[2rem] overflow-hidden group shadow-xl border-4 border-white dark:border-slate-800">
                  <img src={selectedImage} alt="Preview" className="w-full h-64 object-cover" />
                  <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3} stroke="currentColor" /></svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-[2.5rem] p-8 border-white/80 dark:border-white/5 dark:bg-slate-900/40 shadow-2xl h-full flex flex-col transition-all">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-8 italic">Incident Location</h3>
              
              <div className="relative flex-1 rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-900 mb-10 min-h-[300px] group shadow-inner transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-campus-amber/10 to-campus-teal/5 opacity-40"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-7xl mb-4 animate-float drop-shadow-2xl">📍</div>
                  <div className="glass-panel px-6 py-2 rounded-full font-black text-[9px] uppercase tracking-widest text-slate-600 dark:text-slate-300 border-white dark:border-white/10 shadow-xl">
                    GPS Data Active
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-6 text-xl shadow-[0_20px_50px_rgba(245,158,11,0.2)] active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
              >
                Submit Report
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}