interface EmptyStateProps {
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({ 
  message = "No results found in this sector.", 
  actionText, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-reveal">
      <div className="w-24 h-24 mb-6 rounded-[2rem] bg-slate-50 dark:bg-white/5 flex items-center justify-center text-5xl shadow-inner border border-white dark:border-white/5">
        🔍
      </div>
      <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2 italic">
        Signal <span className="text-campus-teal">Lost</span>
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-xs mx-auto mb-8">
        {message} Try adjusting your filters or searching for something else.
      </p>
      
      {actionText && (
        <button 
          onClick={onAction}
          className="px-6 py-2.5 rounded-xl border-2 border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}