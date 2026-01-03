import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { reportsData } from '../data/reports';

export default function Profile() {
  const [, setIsVisible] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Generate user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get first name for greeting
  const getFirstName = () => {
    if (!user?.name) return 'Student';
    return user.name.split(' ')[0];
  };

  return (
    /* Wrapper: Background shifts from light slate to deep navy */
    <div className="min-h-screen bg-campus-light dark:bg-[#051923] pt-28 md:pt-36 overflow-hidden relative pb-20 transition-colors duration-500">
      
      {/* Background Mesh: Opacity tuned for theme depth */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="blob-luminous blob-teal -top-20 -left-20 opacity-10 dark:opacity-20"></div>
        <div className="blob-luminous blob-violet bottom-0 -right-20 opacity-5 dark:opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-12 transition-all duration-1000 transform">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-campus-teal/10 border border-campus-teal/20 text-[10px] font-black uppercase tracking-[0.2em] text-campus-teal mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-campus-teal animate-pulse"></span>
            Account Dashboard
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">
            User <span className="text-gradient-link">Profile</span>
          </h1>
        </div>

        {/* Dashboard Grid - Utilizing Horizontal Space */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: User Info & Stats */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card rounded-[3rem] p-8 border-white/80 dark:border-white/5 dark:bg-slate-900/40 shadow-2xl relative overflow-hidden transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-campus-teal/5 rounded-full filter blur-3xl"></div>
              
              {/* Profile Avatar & Identity - Now using real user data */}
              <div className="text-center mb-10">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-campus-teal via-campus-violet to-campus-amber rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-xl mb-6 border-4 border-white dark:border-slate-800 transform hover:rotate-3 transition-transform">
                  {getUserInitials()}
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-1">
                  {user?.name || 'Student User'}
                </h2>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
                  Verified Student
                </p>
                
                {/* Email Badge */}
                <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-4 py-2 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 transition-colors mb-4">
                  <span className="text-campus-teal">📧</span>
                  {user?.email || 'student@campus.edu'}
                </div>

                {/* Student Info - Roll Number & Department */}
                {(user?.rollNumber || user?.department) && (
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {user?.rollNumber && (
                      <div className="px-3 py-1.5 bg-campus-teal/10 border border-campus-teal/20 rounded-lg">
                        <p className="text-[9px] font-black uppercase tracking-wider text-campus-teal">
                          🎓 {user.rollNumber}
                        </p>
                      </div>
                    )}
                    {user?.department && (
                      <div className="px-3 py-1.5 bg-campus-violet/10 border border-campus-violet/20 rounded-lg">
                        <p className="text-[9px] font-black uppercase tracking-wider text-campus-violet">
                          📚 {user.department}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Year Badge if available */}
                {user?.year && (
                  <div className="mt-3">
                    <span className="px-3 py-1.5 bg-campus-amber/10 border border-campus-amber/20 rounded-lg text-[9px] font-black uppercase tracking-wider text-campus-amber">
                      📅 {user.year}
                    </span>
                  </div>
                )}
              </div>

              {/* High-Impact Stats */}
              <div className="space-y-3">
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-4 italic">
                  Activity Metrics
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50/50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 text-center transition-colors">
                    <p className="text-3xl font-black text-campus-teal leading-none mb-1">
                      {reportsData.length}
                    </p>
                    <p className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">
                      Reports
                    </p>
                  </div>
                  <div className="bg-slate-50/50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 text-center transition-colors">
                    <p className="text-3xl font-black text-campus-violet leading-none mb-1">
                      {reportsData.filter(r => r.status === 'Resolved').length}
                    </p>
                    <p className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">
                      Resolved
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Button - Now functional */}
            <button 
              onClick={logout}
              className="w-full bg-white dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-5 rounded-[2rem] flex items-center justify-center gap-3 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-50 dark:hover:bg-red-500/20 transition-all active:scale-95 group shadow-sm"
            >
              <span className="group-hover:rotate-12 transition-transform">🚪</span> 
              Sign Out of Account
            </button>
          </div>

          {/* RIGHT COLUMN: Active Reports & Timeline */}
          <div className="lg:col-span-8">
            <div className="glass-card rounded-[3.5rem] p-8 md:p-12 border-white/80 dark:border-white/5 dark:bg-slate-900/40 shadow-2xl min-h-[600px] transition-all duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                    {getFirstName()}'s Active Reports
                  </h3>
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                    Live tracking of filed issues
                  </p>
                </div>
                <Link
                  to="/report"
                  className="btn-primary py-3 px-8 text-[10px] shadow-campus-teal/20"
                >
                  + File New Issue
                </Link>
              </div>

              {/* Reports List */}
              <div className="space-y-4">
                {reportsData.length > 0 ? (
                  reportsData.map((report, index) => (
                    <div
                      key={report.id}
                      style={{ animationDelay: `${index * 100}ms` }}
                      className="group bg-white dark:bg-slate-800/40 rounded-3xl p-6 border border-slate-100 dark:border-white/5 hover:border-campus-teal/30 dark:hover:border-campus-teal/30 hover:shadow-xl transition-all duration-500 animate-reveal"
                    >
                      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-xl">
                            {report.type === 'Street Light' ? '💡' : '🛡️'}
                          </div>
                          <h4 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                            {report.type}
                          </h4>
                        </div>
                        <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${
                          report.status === 'Resolved' 
                            ? 'bg-campus-teal/10 text-campus-teal' 
                            : 'bg-campus-violet/10 text-campus-violet'
                        }`}>
                          ● {report.status}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6 leading-relaxed">
                        {report.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-white/5">
                        <div className="flex items-center gap-2 text-slate-300 dark:text-slate-600">
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            Filed: {report.date}
                          </span>
                        </div>
                        <button className="text-[9px] font-black uppercase tracking-[0.2em] text-campus-teal opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-24 bg-slate-50/50 dark:bg-white/5 rounded-[3rem] border-4 border-dashed border-white dark:border-white/5">
                    <div className="text-7xl mb-6 animate-float opacity-50">📝</div>
                    <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-[10px]">
                      No activity logs found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
