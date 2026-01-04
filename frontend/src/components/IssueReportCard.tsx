
interface IssueReportCardProps {
  report: {
    _id: string;
    type: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Resolved';
    createdAt: string;
    location?: {
      address?: string;
    };
  };
}

const statusConfig = {
  'Pending': { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: '📡' },
  'In Progress': { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🛠️' },
  'Resolved': { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: '✅' },
};

export default function IssueReportCard({ report }: IssueReportCardProps) {
  const config = statusConfig[report.status] || statusConfig['Pending'];
  const date = new Date(report.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="glass-card p-6 rounded-[2rem] border border-white/5 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl hover:scale-[1.02] transition-all duration-500 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-xl shadow-inner">
            {report.type === 'Street Light' ? '💡' : 
             report.type === 'Road Safety' ? '🚧' : 
             report.type === 'Garbage' ? '♻️' : '🛡️'}
          </div>
          <div>
            <h4 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-tight leading-none mb-1">
              {report.type}
            </h4>
            <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              ID: {report._id.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-lg border ${config.bg} ${config.border} ${config.color} text-[9px] font-black uppercase tracking-widest flex items-center gap-2`}>
          <span className="animate-pulse">{config.icon}</span>
          {report.status}
        </div>
      </div>

      <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-6 font-medium line-clamp-2">
        {report.description}
      </p>

      <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-tighter">{date}</span>
        </div>

        <button className="text-[10px] font-black text-campus-teal uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
          View Details
        </button>
      </div>
    </div>
  );
}