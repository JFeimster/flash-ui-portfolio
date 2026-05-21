import React from 'react';

interface DailyTaskItemProps {
  id: string | number;
  name: string;
  company: string;
  category: string;
  stage: string;
  isOverdue?: boolean;
  onComplete?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
}

const DailyTaskItem: React.FC<DailyTaskItemProps> = ({
  id,
  name,
  company,
  category,
  stage,
  isOverdue = false,
  onComplete,
  onEdit
}) => {
  return (
    <div className={`group flex items-center justify-between p-4 mb-3 rounded-xl border transition-all duration-200 ${
      isOverdue 
        ? 'bg-red-50/50 border-red-100 hover:border-red-200' 
        : 'bg-white border-slate-200 hover:border-[#d4af37] hover:shadow-md'
    }`}>
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="flex-shrink-0">
          <button 
            onClick={() => onComplete?.(id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              isOverdue 
                ? 'border-red-300 hover:bg-red-500 hover:border-red-500' 
                : 'border-slate-300 hover:border-[#10b981] hover:bg-[#10b981]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className={`font-bold text-sm truncate ${isOverdue ? 'text-red-900' : 'text-slate-900'}`}>
              {name}
            </h4>
            {isOverdue && (
              <span className="text-[10px] font-black uppercase tracking-tighter text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                Overdue
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="truncate font-medium">{company}</span>
            <span className="text-slate-300 text-[10px]">•</span>
            <span className="whitespace-nowrap px-2 py-0.5 bg-slate-100 rounded-full text-[10px] font-bold uppercase tracking-wide">
              {category}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4">
        <div className="hidden md:block text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Current Stage</p>
          <p className="text-xs font-semibold text-slate-600 truncate max-w-[120px]">{stage}</p>
        </div>
        
        <button 
          onClick={() => onEdit?.(id)}
          className="p-2 text-slate-400 hover:text-[#d4af37] hover:bg-slate-50 rounded-lg transition-colors"
          title="Update Follow-up"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DailyTaskItem;