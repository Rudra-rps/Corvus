import React from 'react';

export default function MobileHeader({ setCurrentPage }) {
  return (
    <header className="md:hidden flex justify-between items-center w-full px-gutter h-20 bg-surface/80 dark:bg-surface-container-lowest/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <span 
        className="font-headline-md text-headline-md font-bold text-on-surface tracking-tighter cursor-pointer"
        onClick={() => setCurrentPage('landing')}
      >
        Corvus AI
      </span>
      <button 
        onClick={() => setCurrentPage('login')}
        className="text-primary font-label-md text-label-md border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
      >
        Launch Terminal
      </button>
    </header>
  );
}
