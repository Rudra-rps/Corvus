import React from 'react';

export default function AgentStrip({ parsingStatus = 'Standby', stabilityStatus = 'Standby', riskStatus = 'Standby' }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
        return 'text-tertiary';
      case 'processing':
      case 'running':
        return 'text-primary animate-pulse';
      default:
        return 'text-on-surface-variant';
    }
  };

  const getStatusOpacity = (status) => {
    return status.toLowerCase() === 'standby' ? 'opacity-50' : 'opacity-100';
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 md:pl-64 w-full h-16 bg-surface-container-highest/90 backdrop-blur-lg border-t border-outline-variant/50 z-20 flex items-center px-container-padding-desktop">
      <div className="flex items-center gap-4 border-r border-outline-variant/50 pr-6 mr-6 h-full">
        <span className="material-symbols-outlined text-tertiary animate-pulse">memory</span>
        <span className="font-label-md text-label-md text-on-surface whitespace-nowrap">Agent Pipeline Active</span>
      </div>
      <div className="flex-1 flex items-center justify-between gap-8 overflow-x-auto py-2">
        {/* Parsing Agent */}
        <div className={`flex items-center gap-3 flex-1 min-w-[120px] transition-opacity duration-300 ${getStatusOpacity(parsingStatus)}`}>
          <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant/50">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">data_object</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface whitespace-nowrap">Parsing Agent</span>
            <span className={`font-label-sm text-[10px] ${getStatusColor(parsingStatus)}`}>{parsingStatus}</span>
          </div>
        </div>

        <span className="material-symbols-outlined text-outline-variant hidden sm:inline">chevron_right</span>

        {/* Stability Agent */}
        <div className={`flex items-center gap-3 flex-1 min-w-[120px] transition-opacity duration-300 ${getStatusOpacity(stabilityStatus)}`}>
          <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant/50">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">timeline</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface whitespace-nowrap">Stability Agent</span>
            <span className={`font-label-sm text-[10px] ${getStatusColor(stabilityStatus)}`}>{stabilityStatus}</span>
          </div>
        </div>

        <span className="material-symbols-outlined text-outline-variant hidden sm:inline">chevron_right</span>

        {/* Risk Agent */}
        <div className={`flex items-center gap-3 flex-1 min-w-[120px] transition-opacity duration-300 ${getStatusOpacity(riskStatus)}`}>
          <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant/50">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">warning</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface whitespace-nowrap">Risk Agent</span>
            <span className={`font-label-sm text-[10px] ${getStatusColor(riskStatus)}`}>{riskStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
