
interface EmptyStateProps {
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

/**
 * EmptyState Component: The Search Feedback Node
 * Provides visual cues when a specific sector search returns zero results.
 */
export default function EmptyState({ 
  message = "No results found in this sector.", 
  actionText, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-reveal transition-colors duration-500">
      
      {/* Icon HUD: Using the Luminous design language border and shadow */}
      <div className="w-24 h-24 mb-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/60 flex items-center justify-center text-5xl shadow-inner border-2 border-white dark:border-white/5 relative group">
        <div className="absolute inset-0 bg-campus-teal/5 rounded-[2.5rem] animate-pulse"></div>
        <span className="relative z-10 group-hover:scale-110 transition-transform duration-500">
          🔍
        </span>
      </div>

      <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-3 italic leading-none">
        Signal <span className="text-campus-teal">Lost</span>
      </h3>
      
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-sm mx-auto mb-10 leading-relaxed font-mono italic">
        {message} Try recalibrating your search filters or exploring a different campus sector.
      </p>
      
      {actionText && (
        <button 
          onClick={onAction}
          className="btn-secondary px-8 py-3 rounded-2xl border-2 border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 hover:text-campus-teal hover:border-campus-teal/50 dark:hover:text-white dark:hover:border-white/30 hover:bg-white dark:hover:bg-white/5 transition-all shadow-sm active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}