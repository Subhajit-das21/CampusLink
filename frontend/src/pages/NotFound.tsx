import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0fdfe] dark:bg-[#051923] px-6 transition-colors duration-500">
      {/* Background Luminous Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#0AD1C8]/10 rounded-full blur-[120px] animate-pulse"></div>
      
      <div className="text-center relative z-10 space-y-8 max-w-2xl">
        {/* Floating 3D Element */}
        <div className="text-[10rem] md:text-[12rem] animate-float drop-shadow-2xl select-none">
          🛰️
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase text-slate-900 dark:text-white">
            Lost in <span className="text-gradient-link">Space</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium">
            The sector you're looking for doesn't exist in the CampusLink network. 
            Check the URL or head back to base.
          </p>
        </div>

        <div className="pt-6">
          <Link 
            to="/" 
            className="btn-primary inline-flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}