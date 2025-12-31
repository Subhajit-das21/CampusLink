import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    /* Footer Container: Shifts from white to deep navy */
    <footer className="relative z-10 bg-white dark:bg-[#051923] border-t border-slate-100 dark:border-white/5 overflow-hidden transition-colors duration-500">
      {/* Subtle atmospheric glow: Adjusted opacity for dark mode */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-campus-teal/5 dark:bg-campus-teal/10 rounded-full filter blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          
          {/* Brand Identity Section */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-block group transition-transform active:scale-95">
              <h3 className="text-2xl font-black text-gradient-ocean tracking-tighter uppercase italic">
                Campus<span className="text-campus-teal italic">Link</span>
              </h3>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
              Connecting campus life with the local community through trusted, verified digital bridges.
            </p>
            <div className="flex gap-3">
              {/* Social Icons: Backgrounds and borders invert */}
              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center hover:bg-campus-teal/10 transition-colors cursor-pointer group">
                <span className="text-sm group-hover:scale-110 transition-transform">🌐</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center hover:bg-campus-gold/10 transition-colors cursor-pointer group">
                <span className="text-sm group-hover:scale-110 transition-transform">📍</span>
              </div>
            </div>
          </div>

          {/* Directory Column */}
          <div>
            <h4 className="text-[10px] font-black text-campus-navy dark:text-campus-teal uppercase tracking-[0.3em] mb-5 italic opacity-70">
              Services
            </h4>
            <ul className="space-y-3 text-xs font-bold">
              {[
                { to: '/services', label: 'Browse All' },
                { to: '#', label: 'Food & Dining' },
                { to: '#', label: 'Tech & Printing' },
                { to: '#', label: 'Medical Support' }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-slate-400 dark:text-slate-500 hover:text-campus-teal dark:hover:text-white transition-all duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-campus-teal mr-0 group-hover:mr-2 transition-all rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Engagement Column */}
          <div>
            <h4 className="text-[10px] font-black text-campus-navy dark:text-campus-teal uppercase tracking-[0.3em] mb-5 italic opacity-70">
              Community
            </h4>
            <ul className="space-y-3 text-xs font-bold">
              {[
                { to: '/report', label: 'Report Issue' },
                { to: '#', label: 'Campus Guidelines' },
                { to: '#', label: 'Safety Protocols' },
                { to: '#', label: 'Local Impact' }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-slate-400 dark:text-slate-500 hover:text-campus-gold dark:hover:text-campus-gold transition-all duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-campus-gold mr-0 group-hover:mr-2 transition-all rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Personalization Column */}
          <div>
            <h4 className="text-[10px] font-black text-campus-navy dark:text-campus-teal uppercase tracking-[0.3em] mb-5 italic opacity-70">
              Account
            </h4>
            <ul className="space-y-3 text-xs font-bold">
              {[
                { to: '/profile', label: 'User Profile' },
                { to: '#', label: 'Settings' },
                { to: '#', label: 'Help Center' }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-slate-400 dark:text-slate-500 hover:text-campus-teal dark:hover:text-white transition-all duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-campus-teal mr-0 group-hover:mr-2 transition-all rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar Section */}
        <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              v1.0 MVP
            </div>
            <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">
              © 2025 CampusLink. All rights reserved. 
            </p>
          </div>
          
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
            <a href="#" className="text-slate-400 dark:text-slate-500 hover:text-campus-navy dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 dark:text-slate-500 hover:text-campus-navy dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-slate-400 dark:text-slate-500 hover:text-campus-navy dark:hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}