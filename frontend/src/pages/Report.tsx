import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import GoogleMapEngine from '../components/GoogleMapEngine';

// 1. Define specific Form Interface
interface ReportFormData {
  type: string;
  description: string;
}

const schema = yup.object().shape({
  type: yup.string().required('Please select an issue type'),
  description: yup.string()
    .min(20, 'Please provide at least 20 characters')
    .max(500, 'Description is too long')
    .required('Description is required'),
});

export default function Report() {
  const [reportedCoords, setReportedCoords] = useState<{lat: number, lng: number} | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [mapCenter, setMapCenter] = useState({ lat: 22.5580536, lng: 88.3966811 });

  // Fixed useForm initialization
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ReportFormData>({
    resolver: yupResolver(schema)
  });

  const selectedType = watch('type');

  // Theme Sync Logic
  useEffect(() => {
    const observer = new MutationObserver(() => setIsDarkMode(document.documentElement.classList.contains('dark')));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      toast.loading("Finding your coordinates...", { id: 'geo' });
      navigator.geolocation.getCurrentPosition((p) => {
        const coords = { lat: p.coords.latitude, lng: p.coords.longitude };
        setReportedCoords(coords);
        setMapCenter(coords);
        toast.success("Location Locked! 🛰️", { id: 'geo' });
      }, () => {
        toast.error("GPS Signal Lost", { id: 'geo' });
      });
    }
  };

  // Fixed onSubmit logic
  const onSubmit = async (data: ReportFormData) => {
    if (!reportedCoords) {
      toast.error("Please pin the incident location on the map! 📍");
      return;
    }

    const loadingToast = toast.loading('Transmitting report to Nexus...');
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        type: data.type,
        description: data.description,
        location: {
          lat: reportedCoords.lat,
          lng: reportedCoords.lng,
          address: "Pinned Location" 
        },
        image: selectedImage
      };

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/reports`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Report Filed! Thank you, Citizen. 🎉', { id: loadingToast });
      setSubmitted(true);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Nexus handshaking failed';
      toast.error(errMsg, { id: loadingToast });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#051923] flex items-center justify-center pt-20 transition-colors">
        <div className="text-center space-y-8 animate-reveal">
          <div className="text-7xl animate-bounce">🛡️</div>
          <h2 className="text-4xl md:text-6xl font-black dark:text-white italic uppercase tracking-tighter">
            Report <span className="text-emerald-500">Locked</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
            Your report has been synchronized with the community safety board and sent to local campus nodes.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/profile" className="btn-primary px-10 py-4 shadow-emerald-500/20">Track Status</Link>
            <button onClick={() => setSubmitted(false)} className="px-8 py-4 border-2 border-slate-200 dark:border-white/10 dark:text-white rounded-full font-black uppercase text-[10px] hover:bg-white dark:hover:bg-white/5 transition-all">New Report</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#051923] pt-32 pb-20 relative transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <h1 className="text-5xl md:text-8xl font-black dark:text-white uppercase italic tracking-tighter mb-12 animate-reveal">
          Report <span className="text-amber-500">Incident</span>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Input Fields */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card p-10 rounded-[3rem] dark:bg-slate-900/40 border-white/5 shadow-2xl">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-8 block italic">Step 1: Classification</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Street Light', 'Road Safety', 'Water Supply', 'Safety Concern', 'Garbage', 'Other'].map((t) => (
                  <button
                    key={t} type="button"
                    onClick={() => setValue('type', t, { shouldValidate: true })}
                    className={`p-4 rounded-2xl border-2 transition-all text-[9px] font-black uppercase ${selectedType === t ? 'border-amber-500 bg-amber-500/10 text-amber-500 scale-105 shadow-lg' : 'border-transparent bg-slate-100 dark:bg-white/5 text-slate-400 hover:border-slate-300 dark:hover:border-white/20'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {errors.type && <p className="text-red-500 text-[10px] font-black mt-3 ml-1">{errors.type.message}</p>}

              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mt-12 mb-6 block italic">Step 2: Log Description</label>
              <textarea
                {...register('description')}
                className="w-full p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-amber-500 outline-none text-sm dark:text-white min-h-[160px] shadow-inner transition-all"
                placeholder="Details of the anomaly? (e.g. Location specifics, severity...)"
              />
              {errors.description && <p className="text-red-500 text-[10px] font-black mt-3 ml-1">{errors.description.message}</p>}
            </div>

            <div className="glass-card p-10 rounded-[3rem] dark:bg-slate-900/40 border-white/5 shadow-2xl">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 block italic">Step 3: Visual Telemetry</label>
              {!selectedImage ? (
                <label className="border-4 border-dashed border-slate-100 dark:border-white/5 rounded-[2.5rem] p-12 flex flex-col items-center cursor-pointer hover:bg-amber-500/5 transition-all group">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const reader = new FileReader();
                    reader.onload = () => setSelectedImage(reader.result as string);
                    if (e.target.files?.[0]) reader.readAsDataURL(e.target.files[0]);
                  }} />
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">📸</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Attach Evidence Image</span>
                </label>
              ) : (
                <div className="relative rounded-[2.5rem] overflow-hidden h-56 border-4 border-white dark:border-slate-800 shadow-xl group">
                  <img src={selectedImage} alt="Evidence" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-all">✕</button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Geographic Calibration */}
          <div className="lg:col-span-5 h-full">
            <div className="glass-card p-8 rounded-[3.5rem] dark:bg-slate-900/40 border-white/5 shadow-2xl h-full flex flex-col transition-all">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 block italic">Step 4: Spatial Calibration</label>
              
              <div className="flex-1 relative rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-800 min-h-[420px] shadow-2xl">
                <GoogleMapEngine 
                  center={mapCenter}
                  zoom={16}
                  isDark={isDarkMode}
                  onLocationSelect={(coords: any) => setReportedCoords(coords)}
                  markers={reportedCoords ? [reportedCoords] : []}
                />
                
                <button 
                  type="button" onClick={handleLocateMe}
                  className="absolute bottom-8 right-8 w-14 h-14 bg-emerald-500 text-white rounded-2xl shadow-xl hover:scale-110 transition-all active:scale-95 flex items-center justify-center"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                </button>
              </div>

              <div className="bg-slate-100 dark:bg-black/40 p-5 rounded-2xl mt-8 text-center border dark:border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  {reportedCoords 
                    ? `📍 Target Locked: ${reportedCoords.lat.toFixed(4)}, ${reportedCoords.lng.toFixed(4)}` 
                    : "Click Radar to Mark Anomaly Location"}
                </p>
              </div>

              <button type="submit" className="w-full py-8 mt-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-[2rem] font-black uppercase italic tracking-[0.3em] text-sm shadow-[0_20px_40px_rgba(245,158,11,0.25)] hover:-translate-y-1 transition-all">
                Submit Anomaly Report
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}