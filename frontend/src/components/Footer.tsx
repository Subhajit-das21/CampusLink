import { Link } from 'react-router-dom';

/**
 * Footer Component: The Network Anchor
 * Optimized for 2026 CampusLink design standards with theme-reactive depth.
 */
export default function Footer() {
  return (
    /* Footer Container: Seamless transition between light slate and deep navy */
    <footer className="relative z-10 bg-[#F8FAFC] dark:bg-[#051923] border-t border-slate-200 dark:border-white/5 overflow-hidden transition-colors duration-500">
      
      {/* Dynamic atmospheric glow synced with the brand Teal */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#0AD1C8]/5 dark:bg-[#0AD1C8]/10 rounded-full filter blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none transition-all duration-500"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Identity Section */}
          <div className="space-y-6 md:col-span-1">
            <Link to="/" className="inline-block group transition-transform active:scale-95">
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic leading-none">
                <span className="text-slate-900 dark:text-white transition-colors">Campus</span>
                <span className="text-[#0AD1C8] italic">Link</span>
              </h3>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
              Connecting campus life with the local community through trusted, verified digital bridges.
            </p>
            
            {/* Social Matrix */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:border-[#0AD1C8]/50 hover:text-[#0AD1C8] transition-all cursor-pointer group shadow-sm">
                <span className="text-lg group-hover:scale-110 transition-transform">🌐</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:border-[#F7AD19]/50 hover:text-[#F7AD19] transition-all cursor-pointer group shadow-sm">
                <span className="text-lg group-hover:scale-110 transition-transform">📍</span>
              </div>
            </div>
          </div>

          {/* Directory Column */}
          <div>
            <h4 className="text-[10px] font-black text-slate-400 dark:text-[#0AD1C8] uppercase tracking-[0.4em] mb-8 italic opacity-80">
              Directory
            </h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              {[
                { to: '/services', label: 'All Services' },
                { to: '#', label: 'Food & Dining' },
                { to: '#', label: 'Tech & Printing' },
                { to: '#', label: 'Medical Nodes' }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-slate-500 dark:text-slate-400 hover:text-[#0AD1C8] dark:hover:text-white transition-all duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-3 h-0.5 bg-[#0AD1C8] mr-0 group-hover:mr-3 transition-all rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Engagement Column */}
          <div>
            <h4 className="text-[10px] font-black text-slate-400 dark:text-[#F7AD19] uppercase tracking-[0.4em] mb-8 italic opacity-80">
              Community
            </h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              {[
                { to: '/report', label: 'Report Issue' },
                { to: '#', label: 'Guidelines' },
                { to: '#', label: 'Safety Protocols' },
                { to: '#', label: 'Impact Logs' }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-slate-500 dark:text-slate-400 hover:text-[#F7AD19] dark:hover:text-[#F7AD19] transition-all duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-3 h-0.5 bg-[#F7AD19] mr-0 group-hover:mr-3 transition-all rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Personalization Column */}
          <div>
            <h4 className="text-[10px] font-black text-slate-400 dark:text-[#0AD1C8] uppercase tracking-[0.4em] mb-8 italic opacity-80">
              Terminal
            </h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              {[
                { to: '/profile', label: 'User Dashboard' },
                { to: '#', label: 'System Settings' },
                { to: '#', label: 'Help Node' }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-slate-500 dark:text-slate-400 hover:text-[#0AD1C8] dark:hover:text-white transition-all duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-3 h-0.5 bg-[#0AD1C8] mr-0 group-hover:mr-3 transition-all rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar Section */}
        <div className="pt-10 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="px-4 py-1 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[9px] font-black uppercase tracking-widest text-[#0AD1C8]">
              Network Active v1.0
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] italic">
              © 2026 CampusLink Network. Secured Synchronization Enabled.
            </p>
          </div>
          
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
            <a href="#" className="text-slate-400 dark:text-slate-500 hover:text-[#0AD1C8] dark:hover:text-white transition-colors">Privacy_Protocol</a>
            <a href="#" className="text-slate-400 dark:text-slate-500 hover:text-[#0AD1C8] dark:hover:text-white transition-colors">Terms_Of_Link</a>
            <a href="#" className="text-slate-400 dark:text-slate-500 hover:text-[#0AD1C8] dark:hover:text-white transition-colors">Contact_Base</a>
          </div>
        </div>
      </div>
    </footer>
  );
}