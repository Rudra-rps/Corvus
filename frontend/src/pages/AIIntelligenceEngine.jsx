import { useState, useEffect } from 'react';

export default function AIIntelligenceEngine({ setCurrentPage, setAgentStatus }) {
  const [stages, setStages] = useState({
    classification: 'completed', // completed, active, pending
    income: 'active',
    dti: 'pending',
    scoring: 'pending'
  });

  useEffect(() => {
    // Stage 2 completion -> Stage 3 active
    const timer1 = setTimeout(() => {
      setStages({
        classification: 'completed',
        income: 'completed',
        dti: 'active',
        scoring: 'pending'
      });
      setAgentStatus({
        parsing: 'Completed',
        stability: 'Running',
        risk: 'Running'
      });
    }, 1200);

    // Stage 3 completion -> Stage 4 active
    const timer2 = setTimeout(() => {
      setStages({
        classification: 'completed',
        income: 'completed',
        dti: 'completed',
        scoring: 'active'
      });
      setAgentStatus({
        parsing: 'Completed',
        stability: 'Completed',
        risk: 'Running'
      });
    }, 2400);

    // All stages complete -> go to lender recommendations
    const timer3 = setTimeout(() => {
      setStages({
        classification: 'completed',
        income: 'completed',
        dti: 'completed',
        scoring: 'completed'
      });
      setAgentStatus({
        parsing: 'Completed',
        stability: 'Completed',
        risk: 'Completed'
      });
    }, 3600);

    const timer4 = setTimeout(() => {
      setCurrentPage('lender');
    }, 4200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [setCurrentPage, setAgentStatus]);

  return (
    <div className="flex-grow min-h-screen bg-background font-body-md relative overflow-hidden flex flex-col justify-center items-center py-12 px-gutter">
      {/* Ambient glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-tertiary-container/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header / Status */}
      <div className="text-center mb-16 flex flex-col items-center relative z-10">
        <h1 className="font-headline-lg text-headline-lg mb-4 text-on-surface">Analysis in Progress</h1>
        <div className="flex items-center gap-2 text-primary font-label-md text-label-md bg-surface-container-high px-4 py-2 rounded-full border border-white/5 shadow-lg">
          <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
          <span>Computing trust profile...</span>
        </div>
      </div>

      {/* Central Orchestration UI */}
      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center z-10">
        {/* Left Stages */}
        <div className="space-y-6">
          {/* Completed Stage 1 */}
          <div className={`bg-surface-container border border-white/10 rounded-xl p-4 flex items-start gap-4 transition-all duration-300 ${
            stages.classification === 'completed' ? 'opacity-70 border-outline-variant/30' : 'border-primary'
          }`}>
            <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[16px] icon-fill">check_circle</span>
            </div>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface">Transaction Classification</h3>
              <p className="font-body-md text-label-sm text-on-surface-variant mt-1">12,450 records categorized</p>
            </div>
          </div>

          {/* Stage 2 */}
          <div className={`bg-surface-container rounded-xl p-4 flex items-start gap-4 relative overflow-hidden transition-all duration-300 ${
            stages.income === 'active' 
              ? 'border border-primary/45 shadow-[0_0_20px_rgba(197,198,204,0.05)]' 
              : stages.income === 'completed' ? 'border border-white/10 opacity-70' : 'border border-transparent opacity-40'
          }`}>
            {stages.income === 'active' && (
              <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full">
                <div className="h-full bg-primary w-2/3 rounded-r-full animate-[pulse_1.5s_infinite]"></div>
              </div>
            )}
            <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center relative ${
              stages.income === 'active' ? 'bg-primary/10 text-primary pulse-circle' : 'bg-surface-variant text-primary'
            }`}>
              <span className="material-symbols-outlined text-[16px]">
                {stages.income === 'completed' ? 'check_circle' : 'radar'}
              </span>
            </div>
            <div>
              <h3 className={`font-label-md text-label-md ${stages.income === 'active' ? 'text-primary' : 'text-on-surface'}`}>Income Detection</h3>
              <p className="font-body-md text-label-sm text-on-surface-variant mt-1">
                {stages.income === 'active' ? 'Analyzing recurring deposits...' : 'Deposits verified successfully'}
              </p>
            </div>
          </div>
        </div>

        {/* Center Visual Engine */}
        <div className="flex justify-center relative h-64 md:h-auto py-8">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Outer ring */}
            <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite] opacity-35" viewBox="0 0 100 100">
              <circle className="text-primary" cx="50" cy="50" fill="none" r="48" stroke="currentColor" strokeDasharray="4 4" strokeWidth="0.5"></circle>
            </svg>
            {/* Inner ring */}
            <svg className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] animate-[spin_8s_linear_infinite_reverse] opacity-55" viewBox="0 0 100 100">
              <circle className="text-tertiary" cx="50" cy="50" fill="none" r="48" stroke="currentColor" strokeDasharray="10 5" strokeWidth="1"></circle>
            </svg>
            {/* Core */}
            <div className="w-20 h-20 bg-surface-container-highest rounded-full border border-primary/20 flex items-center justify-center shadow-[0_0_30px_rgba(197,198,204,0.15)] relative z-10">
              <span className="material-symbols-outlined text-[36px] text-primary animate-pulse">smart_toy</span>
            </div>
            {/* Connecting lines */}
            <div className="hidden md:block absolute w-[140%] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent top-1/2 -translate-y-1/2 -z-10 left-[-20%]"></div>
          </div>
        </div>

        {/* Right Stages */}
        <div className="space-y-6">
          {/* Stage 3 */}
          <div className={`bg-surface-container rounded-xl p-4 flex items-start gap-4 relative overflow-hidden transition-all duration-300 ${
            stages.dti === 'active' 
              ? 'border border-primary/45 shadow-[0_0_20px_rgba(197,198,204,0.05)]' 
              : stages.dti === 'completed' ? 'border border-white/10 opacity-70' : 'border border-white/5 opacity-40'
          }`}>
            {stages.dti === 'active' && (
              <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full">
                <div className="h-full bg-primary w-2/3 rounded-r-full animate-[pulse_1.5s_infinite]"></div>
              </div>
            )}
            <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center relative ${
              stages.dti === 'active' ? 'bg-primary/10 text-primary pulse-circle' : 'border border-outline-variant text-outline'
            }`}>
              <span className="material-symbols-outlined text-[16px]">
                {stages.dti === 'completed' ? 'check_circle' : stages.dti === 'active' ? 'query_stats' : 'hourglass_empty'}
              </span>
            </div>
            <div>
              <h3 className={`font-label-md text-label-md ${stages.dti === 'active' ? 'text-primary' : 'text-on-surface'}`}>DTI Computation</h3>
              <p className="font-body-md text-label-sm text-on-surface-variant mt-1">
                {stages.dti === 'active' ? 'Checking credit facilities...' : stages.dti === 'completed' ? 'DTI factors verified' : 'Pending income verification'}
              </p>
            </div>
          </div>

          {/* Stage 4 */}
          <div className={`bg-surface-container rounded-xl p-4 flex items-start gap-4 relative overflow-hidden transition-all duration-300 ${
            stages.scoring === 'active' 
              ? 'border border-primary/45 shadow-[0_0_20px_rgba(197,198,204,0.05)]' 
              : stages.scoring === 'completed' ? 'border border-white/10 opacity-70' : 'border border-white/5 opacity-40'
          }`}>
            {stages.scoring === 'active' && (
              <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full">
                <div className="h-full bg-primary w-2/3 rounded-r-full animate-[pulse_1.5s_infinite]"></div>
              </div>
            )}
            <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center relative ${
              stages.scoring === 'active' ? 'bg-primary/10 text-primary pulse-circle' : 'border border-outline-variant text-outline'
            }`}>
              <span className="material-symbols-outlined text-[16px]">
                {stages.scoring === 'completed' ? 'check_circle' : stages.scoring === 'active' ? 'lock_open' : 'lock'}
              </span>
            </div>
            <div>
              <h3 className={`font-label-md text-label-md ${stages.scoring === 'active' ? 'text-primary' : 'text-on-surface'}`}>Trust Scoring</h3>
              <p className="font-body-md text-label-sm text-on-surface-variant mt-1">
                {stages.scoring === 'active' ? 'Compiling consensus vectors...' : stages.scoring === 'completed' ? 'Scoring compiled successfully' : 'Awaiting previous stages'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Action */}
      <div className="mt-16 relative z-10">
        <button 
          onClick={() => setCurrentPage('ingest')}
          className="px-6 py-2.5 rounded-full border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-white/5 transition-colors shadow-md"
        >
          Cancel Analysis
        </button>
      </div>
    </div>
  );
}
