import React from 'react';

export default function SideNavBar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'cockpit', label: 'Command Center', icon: 'dashboard', fill: false },
    { id: 'engine', label: 'Credit Graph', icon: 'hub', fill: true },
    { id: 'explainability', label: 'Risk Analysis', icon: 'security', fill: true },
    { id: 'engine', label: 'Agent Logs', icon: 'smart_toy', fill: false },
    { id: 'lender', label: 'Portfolio', icon: 'account_balance_wallet', fill: false },
    { id: 'settings', label: 'Settings', icon: 'settings', fill: false },
  ];

  return (
    <nav className="hidden md:flex bg-surface-container-low dark:bg-surface-container-lowest h-screen w-64 fixed left-0 top-0 flex-col border-r border-outline-variant p-4 gap-base z-50">
      <div className="mb-8 px-2 cursor-pointer" onClick={() => setCurrentPage('landing')}>
        <h1 className="font-headline-md text-headline-md font-bold text-on-surface">Corvus Terminal</h1>
        <p className="text-on-surface-variant font-label-sm text-label-sm mt-1">Graphite Environment</p>
      </div>

      <button
        onClick={() => setCurrentPage('onboarding')}
        className="bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-container/80 font-label-md text-label-md py-3 px-4 rounded-lg flex items-center justify-center gap-2 mb-6 transition-colors shadow-lg"
      >
        <span className="material-symbols-outlined icon-fill">add</span>
        New Analysis
      </button>

      <div className="flex-1 flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.label}
              onClick={() => setCurrentPage(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-colors font-label-md text-label-md ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container font-bold'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
              }`}
            >
              <span className={`material-symbols-outlined ${item.fill || isActive ? 'icon-fill' : ''}`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-auto border-t border-outline-variant pt-4 flex flex-col gap-2">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); alert("Docs are in development."); }}
          className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-on-surface transition-colors font-label-sm text-label-sm"
        >
          <span className="material-symbols-outlined text-[18px]">description</span>
          Documentation
        </a>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); alert("Support terminal active."); }}
          className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-on-surface transition-colors font-label-sm text-label-sm"
        >
          <span className="material-symbols-outlined text-[18px]">help</span>
          Support
        </a>
      </div>
    </nav>
  );
}
