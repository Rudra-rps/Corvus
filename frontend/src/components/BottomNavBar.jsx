
export default function BottomNavBar({ currentPage, setCurrentPage }) {
  const navItems = [
    { id: 'cockpit', label: 'Terminal', icon: 'terminal' },
    { id: 'engine', label: 'Graph', icon: 'mediation' },
    { id: 'lender', label: 'Agents', icon: 'memory' },
    { id: 'explainability', label: 'Alerts', icon: 'notifications' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-xl bg-surface-container-highest/90 backdrop-blur-lg border-t border-white/5 shadow-xl flex justify-around items-center h-16 px-4">
      {navItems.map((item) => {
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`flex flex-col items-center justify-center transition-colors p-2 rounded-lg ${
              isActive 
                ? 'text-on-tertiary-container font-bold translate-y-[-2px]' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${isActive ? 'icon-fill' : ''}`}>
              {item.icon}
            </span>
            <span className="font-label-sm text-[10px] mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
