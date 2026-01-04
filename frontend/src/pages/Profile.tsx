import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import IssueReportCard from '../components/IssueReportCard';

export default function Profile() {
  const { user, logout } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * 1. Synchronize Node Telemetry
   * Fetches the actual reports associated with this User ID from the backend.
   */
  useEffect(() => {
    const fetchUserTelemetry = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error("No authentication token found.");
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reports/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(res.data);
      } catch (err) {
        console.error("Nexus Dashboard Sync Failure:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserTelemetry();
  }, []);

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.slice(0, 2).toUpperCase();
  };

  const getFirstName = () => {
    if (!user?.name) return 'Student';
    return user.name.split(' ')[0];
  };

  // Metrics Calculation
  const metrics = {
    total: reports.length,
    resolved: reports.filter(r => r.status === 'Resolved').length,
    pending: reports.filter(r => r.status === 'Pending').length
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#051923] pt-28 md:pt-36 overflow-hidden relative pb-20 transition-colors duration-500">
      
      {/* Background Decorator Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="blob-luminous blob-teal -top-20 -left-20 opacity-10"></div>
        <div className="blob-luminous blob-violet bottom-0 -right-20 opacity-5"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-12 transition-all duration-1000 transform">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-campus-teal/10 border border-campus-teal/20 text-[10px] font-black uppercase tracking-[0.2em] text-campus-teal mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-campus-teal animate-pulse"></span>
            Operational Dashboard
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">
            User <span className="text-gradient-link">Profile</span>
          </h1>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: User Info & Metrics */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card rounded-[3rem] p-8 border-white/80 dark:border-white/5 dark:bg-slate-900/40 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-10">
                {/* Dynamic Avatar */}
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-campus-teal via-campus-violet to-campus-amber rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-xl mb-6 border-4 border-white dark:border-slate-800 transform hover:rotate-3 transition-transform">
                  {getUserInitials()}
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-1">
                  {user?.name || 'Verified Student'}
                </h2>
                
                {/* Contact Data */}
                <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-4 py-2 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-6 transition-colors">
                  <span className="text-campus-teal">📧</span>
                  {user?.email || 'nexus.user@campus.edu'}
                </div>

                {/* Institutional Credentials */}
                <div className="flex flex-wrap gap-2 justify-center">
                    <div className="px-3 py-1.5 bg-campus-teal/10 border border-campus-teal/20 rounded-lg">
                      <p className="text-[9px] font-black uppercase tracking-wider text-campus-teal">
                        🎓 {user?.rollNumber || 'SESS_ACTIVE'}
                      </p>
                    </div>
                    <div className="px-3 py-1.5 bg-campus-violet/10 border border-campus-violet/20 rounded-lg">
                      <p className="text-[9px] font-black uppercase tracking-wider text-campus-violet">
                        📚 {user?.department || 'RCCIIT_CORE'}
                      </p>
                    </div>
                </div>
              </div>

              {/* Activity Metrics */}
              <div className="space-y-3">
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-4 italic">
                  Activity Telemetry
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50/50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 text-center shadow-sm">
                    <p className="text-3xl font-black text-campus-teal leading-none mb-1">{metrics.total}</p>
                    <p className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Reports</p>
                  </div>
                  <div className="bg-slate-50/50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 text-center shadow-sm">
                    <p className="text-3xl font-black text-campus-violet leading-none mb-1">{metrics.resolved}</p>
                    <p className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Resolved</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Controller */}
            <button 
              onClick={logout}
              className="w-full bg-white dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-5 rounded-[2rem] flex items-center justify-center gap-3 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all active:scale-95 group shadow-sm"
            >
              🚪 Terminate Session
            </button>
          </div>

          {/* RIGHT COLUMN: Active Reports Timeline */}
          <div className="lg:col-span-8">
            <div className="glass-card rounded-[3.5rem] p-8 md:p-12 border-white/80 dark:border-white/5 dark:bg-slate-900/40 shadow-2xl min-h-[600px] transition-all duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                    {getFirstName()}'s Active Feed
                  </h3>
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                    Real-time status of community reports
                  </p>
                </div>
                <Link to="/report" className="btn-primary py-3 px-8 text-[10px] shadow-campus-teal/20">+ File New Issue</Link>
              </div>

              {/* Reports List */}
              <div className="space-y-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                    <div className="w-12 h-12 border-4 border-t-campus-teal border-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[10px] font-black text-campus-teal uppercase tracking-widest">Synchronizing Registry...</p>
                  </div>
                ) : reports.length > 0 ? (
                  reports.map((report) => (
                    <IssueReportCard key={report._id} report={report} />
                  ))
                ) : (
                  <div className="text-center py-24 bg-slate-50/50 dark:bg-white/5 rounded-[3rem] border-4 border-dashed border-white dark:border-white/5 shadow-inner">
                    <div className="text-7xl mb-6 grayscale opacity-20">📡</div>
                    <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-[10px]">
                      No active telemetry found in local registry.
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