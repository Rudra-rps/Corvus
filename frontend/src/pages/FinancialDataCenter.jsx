import React, { useEffect, useState } from 'react';
import { analyzeUser, fetchDashboard, fetchExplanations, fetchRecommendations, uploadTransactions } from '../lib/api';

export default function FinancialDataCenter({ setCurrentPage, setAgentStatus, user, onAnalysisLoaded }) {
  const [uploadState, setUploadState] = useState('idle');
  const [dataPoints, setDataPoints] = useState(0);
  const [upiProgress, setUpiProgress] = useState(0);
  const [cashFlowProgress, setCashFlowProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleFileSelected = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id || uploadState !== 'idle') {
      return;
    }

    setUploadState('uploading');
    setError('');
    setFileName(file.name);
    setAgentStatus({
      parsing: 'Running',
      stability: 'Standby',
      risk: 'Standby',
    });

    let points = 0;
    const ticker = setInterval(() => {
      points += 37;
      setDataPoints(points);
      setUpiProgress((prev) => Math.min(prev + 5, 92));
      setCashFlowProgress((prev) => Math.min(prev + 4, 84));
    }, 80);

    try {
      const uploadResponse = await uploadTransactions(user.id, file);
      setDataPoints(uploadResponse.count);
      setUpiProgress(100);
      setCashFlowProgress(100);
      setUploadState('completed');
      setAgentStatus({
        parsing: 'Completed',
        stability: 'Running',
        risk: 'Running',
      });

      const [analysisResponse, dashboardResponse, recommendationsResponse, explanationsResponse] = await Promise.all([
        analyzeUser(user.id),
        fetchDashboard(user.id),
        fetchRecommendations(user.id),
        fetchExplanations(user.id),
      ]);

      onAnalysisLoaded?.({
        analysis: analysisResponse,
        dashboard: dashboardResponse,
        recommendations: recommendationsResponse.recommendations || [],
        explanations: explanationsResponse,
      });
    } catch (err) {
      setError(err.message);
      setUploadState('idle');
      setAgentStatus({
        parsing: 'Standby',
        stability: 'Standby',
        risk: 'Standby',
      });
    } finally {
      clearInterval(ticker);
    }
  };

  useEffect(() => {
    if (uploadState === 'completed') {
      const timer = setTimeout(() => {
        setCurrentPage('engine');
      }, 1200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [setCurrentPage, uploadState]);

  return (
    <div className="flex-grow flex flex-col h-screen relative bg-background pb-16">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,1) 1px, transparent 0)", backgroundSize: '32px 32px' }}></div>

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

      <div className="flex-grow overflow-y-auto p-container-padding-desktop flex items-center justify-center">
        <div className="grid grid-cols-12 gap-8 max-w-[1200px] w-full mx-auto">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div className={`min-h-[350px] bg-surface-container border border-outline-variant/50 rounded-xl flex flex-col items-center justify-center relative group transition-all duration-300 hover:border-tertiary-container hover:bg-surface-container/80 overflow-hidden ${uploadState === 'uploading' ? 'pointer-events-none' : ''}`}>
              <div className="absolute inset-4 border-2 border-dashed border-outline-variant/30 rounded-lg group-hover:border-tertiary/50 transition-colors duration-300 flex flex-col items-center justify-center z-10 bg-surface/30 backdrop-blur-sm px-4">
                <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ease-out shadow-[0_0_40px_rgba(181,196,255,0.1)]">
                  <span className={`material-symbols-outlined text-[40px] text-tertiary ${uploadState === 'uploading' ? 'animate-bounce' : ''}`}>
                    {uploadState === 'completed' ? 'check_circle' : 'cloud_upload'}
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                  {uploadState === 'idle' && 'Upload Statement CSV'}
                  {uploadState === 'uploading' && 'Ingesting Ledger Records...'}
                  {uploadState === 'completed' && 'Dossier Loaded Successfully'}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md text-center mb-8">
                  {uploadState === 'idle' && 'Upload a bank-statement-style CSV with date, narration, amount, and optional balance columns.'}
                  {uploadState === 'uploading' && 'Parsing and structuring transactional vectors in Corvus secure memory.'}
                  {uploadState === 'completed' && 'Data parsed. Initializing credit graph nodes.'}
                </p>
                {uploadState === 'idle' && (
                  <label className="bg-tertiary text-on-tertiary font-label-md text-label-md py-3 px-6 rounded-lg font-bold shadow-[0_0_15px_rgba(181,196,255,0.2)] hover:shadow-[0_0_25px_rgba(181,196,255,0.4)] transition-all cursor-pointer">
                    Browse Local Files
                    <input type="file" accept=".csv" className="hidden" onChange={handleFileSelected} />
                  </label>
                )}
                {uploadState === 'uploading' && (
                  <div className="w-64 bg-surface-container-low h-2 rounded-full overflow-hidden border border-outline-variant/30">
                    <div className="h-full bg-tertiary transition-all duration-300" style={{ width: `${upiProgress}%` }}></div>
                  </div>
                )}
                {fileName && <div className="mt-4 text-xs text-on-surface-variant font-mono">{fileName}</div>}
                <div className="mt-8 flex gap-4 text-on-surface-variant/60 font-label-sm text-label-sm uppercase tracking-widest">
                  <span>CSV</span> • <span>Ledger</span> • <span>Bank Export</span> • <span>Max 500MB</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-tertiary-container/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container border border-outline-variant/50 rounded-xl p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider text-on-surface-variant">Real-Time Extraction</h3>
                <span className={`material-symbols-outlined text-tertiary ${uploadState === 'uploading' ? 'animate-pulse' : ''}`}>sensors</span>
              </div>
              <div className="flex-grow flex flex-col gap-4 font-mono text-[13px] text-on-surface-variant justify-center">
                <div className="p-3 bg-background border border-outline-variant/30 rounded flex justify-between items-center">
                  <span className="text-on-surface">Data Points Detected</span>
                  <span className="text-tertiary font-bold">{uploadState === 'idle' ? '--' : dataPoints.toLocaleString()}</span>
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
                      {uploadState === 'completed' && 'CONSENSUAL'}
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
                {error && <div className="p-3 bg-red-500/10 border border-red-400/20 rounded text-sm text-red-200">{error}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
