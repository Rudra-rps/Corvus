import React, { useState, useEffect } from 'react';

export default function FinancialDataCenter({ setCurrentPage, setAgentStatus }) {
  const [uploadState, setUploadState] = useState('idle'); // 'idle', 'uploading', 'completed'
  const [dataPoints, setDataPoints] = useState(0);
  const [upiProgress, setUpiProgress] = useState(0);
  const [cashFlowProgress, setCashFlowProgress] = useState(0);

  const startSimulatedUpload = () => {
    if (uploadState !== 'idle') return;

    setUploadState('uploading');
    setAgentStatus({
      parsing: 'Running',
      stability: 'Standby',
      risk: 'Standby'
    });

    // Simulate counter increments
    let count = 0;
    const interval = setInterval(() => {
      count += 84;
      setDataPoints(count);
      setUpiProgress((prev) => Math.min(prev + 12, 100));
      setCashFlowProgress((prev) => Math.min(prev + 8, 100));

      if (count >= 12450) {
        clearInterval(interval);
        setUploadState('completed');
        setAgentStatus({
          parsing: 'Completed',
          stability: 'Running',
          risk: 'Running'
        });
      }
    }, 20);
  };

  useEffect(() => {
    if (uploadState === 'completed') {
      const timer = setTimeout(() => {
        setCurrentPage('engine'); // Go to processing engine automatically!
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [uploadState, setCurrentPage]);

  return (
    <div className="flex-grow flex flex-col h-screen relative bg-background pb-16">
      {/* Subtle AI Node Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,1) 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
      
      {/* Top Header */}
      <header className="h-20 px-container-padding-desktop flex items-center justify-between border-b border-outline-variant/30 bg-surface/80 backdrop-blur-md z-10 sticky top-0">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Data Ingestion</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Upload financial records for AI analysis.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full border border-outline-variant/50">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span className="font-label-sm text-label-sm text-on-surface">Graphite Node Active</span>
          </div>
        </div>
      </header>

      {/* Content Grid */}
      <div className="flex-grow overflow-y-auto p-container-padding-desktop flex items-center justify-center">
        <div className="grid grid-cols-12 gap-8 max-w-[1200px] w-full mx-auto">
          {/* Main Upload Area (8 cols) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div 
              onClick={startSimulatedUpload}
              className={`min-h-[350px] bg-surface-container border border-outline-variant/50 rounded-xl flex flex-col items-center justify-center relative group transition-all duration-300 hover:border-tertiary-container hover:bg-surface-container/80 cursor-pointer overflow-hidden ${
                uploadState === 'uploading' ? 'pointer-events-none' : ''
              }`}
            >
              {/* Drag & Drop Visual Indicator */}
              <div className="absolute inset-4 border-2 border-dashed border-outline-variant/30 rounded-lg group-hover:border-tertiary/50 transition-colors duration-300 flex flex-col items-center justify-center z-10 bg-surface/30 backdrop-blur-sm">
                <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ease-out shadow-[0_0_40px_rgba(181,196,255,0.1)]">
                  <span className={`material-symbols-outlined text-[40px] text-tertiary ${uploadState === 'uploading' ? 'animate-bounce' : ''}`}>
                    {uploadState === 'completed' ? 'check_circle' : 'cloud_upload'}
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                  {uploadState === 'idle' && 'Drag & Drop CSV Files'}
                  {uploadState === 'uploading' && 'Ingesting Ledger Records...'}
                  {uploadState === 'completed' && 'Dossier Loaded successfully'}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md text-center mb-8 px-4">
                  {uploadState === 'idle' && 'Securely upload ledger data, transaction histories, or portfolio extracts for immediate strategic processing.'}
                  {uploadState === 'uploading' && `Parsing and structuring transactional vectors in Graphite secure memory. Click to speed up.`}
                  {uploadState === 'completed' && 'Data parsed. Initializing Credit Graph nodes.'}
                </p>
                {uploadState === 'idle' && (
                  <button className="bg-tertiary text-on-tertiary font-label-md text-label-md py-3 px-6 rounded-lg font-bold shadow-[0_0_15px_rgba(181,196,255,0.2)] hover:shadow-[0_0_25px_rgba(181,196,255,0.4)] transition-all">
                    Browse Local Files
                  </button>
                )}
                {uploadState === 'uploading' && (
                  <div className="w-64 bg-surface-container-low h-2 rounded-full overflow-hidden border border-outline-variant/30">
                    <div className="h-full bg-tertiary transition-all duration-300" style={{ width: `${upiProgress}%` }}></div>
                  </div>
                )}
                <div className="mt-8 flex gap-4 text-on-surface-variant/60 font-label-sm text-label-sm uppercase tracking-widest">
                  <span>CSV</span> • <span>XLSX</span> • <span>JSON</span> • <span>Max 500MB</span>
                </div>
              </div>
              
              {/* Atmospheric Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-tertiary-container/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          </div>

          {/* Side Panel (4 cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            {/* Real-time Extraction Simulation */}
            <div className="bg-surface-container border border-outline-variant/50 rounded-xl p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider text-on-surface-variant">Real-Time Extraction</h3>
                <span className={`material-symbols-outlined text-tertiary ${uploadState === 'uploading' ? 'animate-pulse' : ''}`}>sensors</span>
              </div>
              <div className="flex-grow flex flex-col gap-4 font-mono text-[13px] text-on-surface-variant justify-center">
                <div className="p-3 bg-background border border-outline-variant/30 rounded flex justify-between items-center">
                  <span className="text-on-surface">Data Points Detected</span>
                  <span className="text-tertiary font-bold">
                    {uploadState === 'idle' ? '--' : dataPoints.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-background border border-outline-variant/30 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-on-surface">UPI Patterns</span>
                    <span className={`text-[11px] ${uploadState === 'idle' ? 'text-secondary' : 'text-tertiary'}`}>
                      {uploadState === 'idle' && 'AWAITING INPUT'}
                      {uploadState === 'uploading' && 'EXTRACTING...'}
                      {uploadState === 'completed' && 'VERIFIED'}
                    </span>
                  </div>
                  <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
                    <div className="bg-outline h-full transition-all duration-300" style={{ width: `${upiProgress}%` }}></div>
                  </div>
                </div>
                <div className="p-3 bg-background border border-outline-variant/30 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-on-surface">Cash Flow Stability</span>
                    <span className={`text-[11px] ${uploadState === 'idle' ? 'text-secondary' : 'text-tertiary'}`}>
                      {uploadState === 'idle' && 'AWAITING INPUT'}
                      {uploadState === 'uploading' && 'VERIFYING...'}
                      {uploadState === 'completed' && 'Consensual'}
                    </span>
                  </div>
                  <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
                    <div className="bg-outline h-full transition-all duration-300" style={{ width: `${cashFlowProgress}%` }}></div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-tertiary-container/20 border border-tertiary-container rounded text-center">
                  <p className="text-on-surface font-label-sm text-label-sm">
                    {uploadState === 'idle' && 'Awaiting Ledger Upload'}
                    {uploadState === 'uploading' && 'Injecting Data Matrices...'}
                    {uploadState === 'completed' && 'Ready for Graph Injection'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
