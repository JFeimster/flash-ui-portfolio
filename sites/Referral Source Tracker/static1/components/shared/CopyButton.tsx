import React, { useState } from 'react';

interface CopyButtonProps {
  textToCopy: string;
  variant?: 'gold' | 'ghost' | 'navy';
  size?: 'sm' | 'md';
}

/**
 * CopyButton component for the Moonshine Capital Outreach Template Library.
 * Provides visual feedback when copying communication scripts to clipboard.
 */
const CopyButton: React.FC<CopyButtonProps> = ({ 
  textToCopy, 
  variant = 'gold', 
  size = 'md' 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getVariantClasses = () => {
    if (copied) return 'bg-[#10b981] text-white border-[#10b981]';
    
    switch (variant) {
      case 'ghost':
        return 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10';
      case 'navy':
        return 'bg-[#0f172a] text-white hover:bg-[#1e293b] border border-[#334155]';
      case 'gold':
      default:
        return 'bg-[#d4af37] text-[#020617] hover:bg-[#b8962e] border border-[#d4af37]';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-[10px]' : 'px-5 py-2.5 text-xs';

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center justify-center gap-2 
        font-bold uppercase tracking-wider rounded-lg
        transition-all duration-200 ease-in-out
        active:scale-95 select-none
        ${getVariantClasses()}
        ${sizeClasses}
      `}
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
    >
      {copied ? (
        <>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>Copy Script</span>
        </>
      )}
    </button>
  );
};

export default CopyButton;