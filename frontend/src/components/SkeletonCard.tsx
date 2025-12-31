export default function SkeletonCard() {
  return (
    /* Container: Added dark:bg-slate-900/40 and dark:border-white/5 */
    <div className="glass-card rounded-[2.5rem] p-7 h-[280px] border-white/80 dark:border-white/5 dark:bg-slate-900/40 animate-pulse relative overflow-hidden transition-colors duration-500">
      
      {/* Shimmer overlay: Adjusted opacity for Dark Mode */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
      
      {/* Header Section Placeholder */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 pr-3">
          {/* Category Tag Placeholder */}
          <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full w-1/3 mb-3"></div>
          {/* Title Placeholder */}
          <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4"></div>
        </div>
        {/* Heart/Status Badge Placeholder */}
        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
      </div>
      
      {/* Description Body Placeholders */}
      <div className="space-y-3 mb-8">
        <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-full"></div>
        <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-5/6"></div>
      </div>
      
      {/* Footer Section Placeholder */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/10">
        <div className="flex items-center gap-2">
          {/* Distance Icon Placeholder */}
          <div className="w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          {/* Distance Text Placeholder */}
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full w-16"></div>
        </div>
        
        {/* Arrow Placeholder */}
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full w-12"></div>
      </div>
    </div>
  );
}