import React, { useEffect, useState } from 'react';
import {
  analyzeUser,
  fetchDashboard,
  fetchExplanations,
  fetchRecommendations,
  saveIntake,
  uploadTransactions,
} from '../lib/api';

const initialQuickEstimate = {
  loan_purpose: 'working_capital',
  loan_amount_needed: 250000,
  urgency: '2-4 weeks',
  use_case: 'business',
  intake_source: 'quick_estimate',
};

const initialManualSnapshot = {
  intake_source: 'manual_snapshot',
  loan_purpose: 'working_capital',
  loan_amount_needed: 500000,
  urgency: 'flexible',
  use_case: 'business',
  avg_balance_band: '75k_150k',
  rent_amount: 15000,
  declared_spending: 45000,
  business_vintage: '1-3 years',
};

export default function FinancialDataCenter({ setCurrentPage, setAgentStatus, user, onAnalysisLoaded }) {
  const [uploadState, setUploadState] = useState('idle');
  const [dataPoints, setDataPoints] = useState(0);
  const [upiProgress, setUpiProgress] = useState(0);
  const [cashFlowProgress, setCashFlowProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [activeMethod, setActiveMethod] = useState('csv');
  const [quickEstimate, setQuickEstimate] = useState(initialQuickEstimate);
  const [manualSnapshot, setManualSnapshot] = useState(initialManualSnapshot);

  const runAnalysisBundle = async (analysisOptions = {}) => {
    const [analysisResponse, dashboardResponse, recommendationsResponse, explanationsResponse] = await Promise.all([
      analyzeUser(user.id, analysisOptions),
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
  };

  const handleProvisionalRun = async (payload) => {
    if (!user?.id) {
      return;
    }

    setError('');
    setUploadState('uploading');
    setAgentStatus({
      parsing: 'Standby',
      stability: 'Running',
      risk: 'Running',
    });

    try {
      await saveIntake(user.id, payload);
      setDataPoints(Math.round((payload.loan_amount_needed || 0) / 1250) + 12);
      setUpiProgress(65);
      setCashFlowProgress(78);
      setUploadState('completed');
      await runAnalysisBundle({ mode: 'provisional' });
    } catch (err) {
      setError(err.message);
      setUploadState('idle');
      setAgentStatus({
        parsing: 'Standby',
        stability: 'Standby',
        risk: 'Standby',
      });
    }
  };

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
      await saveIntake(user.id, { intake_source: 'csv_verified' });
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
      await runAnalysisBundle();
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

  const methodCard = (key, title, copy, accent) => (
    <button
      type="button"
      onClick={() => setActiveMethod(key)}
      className={`text-left rounded-xl border p-4 transition-all ${
        activeMethod === key
          ? 'border-tertiary bg-surface-container-high shadow-[0_0_20px_rgba(181,196,255,0.08)]'
          : 'border-outline-variant/40 bg-surface-container-low hover:border-tertiary/40'
      }`}
    >
      <div className={`text-xs uppercase tracking-[0.2em] ${accent} mb-2`}>{title}</div>
      <p className="text-sm text-on-surface-variant">{copy}</p>
    </button>
  );

  return (
    <div className="flex-grow flex flex-col h-screen relative bg-background pb-16">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,1) 1px, transparent 0)", backgroundSize: '32px 32px' }}></div>

      <header className="h-20 px-container-padding-desktop flex items-center justify-between border-b border-outline-variant/30 bg-surface/80 backdrop-blur-md z-10 sticky top-0">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Progressive Intake</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Start with an estimate, a snapshot, or full statement verification.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full border border-outline-variant/50">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span className="font-label-sm text-label-sm text-on-surface">Graphite Node Active</span>
          </div>
        </div>
      </header>

      <div className="flex-grow overflow-y-auto p-container-padding-desktop flex items-center justify-center">
        <div className="grid grid-cols-12 gap-8 max-w-[1280px] w-full mx-auto">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {methodCard('quick', 'Quick Estimate', 'Intent-first intake for instant provisional scoring.', 'text-tertiary')}
              {methodCard('manual', 'Manual Snapshot', 'Self-declared financial snapshot for richer provisional underwriting.', 'text-primary')}
              {methodCard('csv', 'CSV Verification', 'Transaction-level upload for full verified scoring and charts.', 'text-emerald-300')}
            </div>

            <div className="min-h-[420px] bg-surface-container border border-outline-variant/50 rounded-xl p-8 relative overflow-hidden">
              {activeMethod === 'csv' && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(181,196,255,0.1)]">
                    <span className={`material-symbols-outlined text-[40px] text-tertiary ${uploadState === 'uploading' ? 'animate-bounce' : ''}`}>
                      {uploadState === 'completed' ? 'check_circle' : 'cloud_upload'}
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                    {uploadState === 'idle' && 'Upload Statement CSV'}
                    {uploadState === 'uploading' && 'Ingesting Ledger Records...'}
                    {uploadState === 'completed' && 'Verified Analysis Ready'}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md text-center mb-8">
                    Upload a bank-statement-style CSV with date, narration, amount, and optional balance columns.
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
                </div>
              )}

              {activeMethod === 'quick' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Quick Estimate</h3>
                    <p className="text-sm text-on-surface-variant">Generate a provisional trust score in under a minute.</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="space-y-2 text-sm">
                      <span className="text-on-surface">Loan purpose</span>
                      <select className="w-full h-12 px-4 rounded-lg input-field" value={quickEstimate.loan_purpose} onChange={(e) => setQuickEstimate((prev) => ({ ...prev, loan_purpose: e.target.value }))}>
                        <option value="working_capital">Working Capital</option>
                        <option value="business_expansion">Business Expansion</option>
                        <option value="education">Education</option>
                        <option value="medical">Medical</option>
                        <option value="consumer">Consumer Need</option>
                        <option value="debt_consolidation">Debt Consolidation</option>
                      </select>
                    </label>
                    <label className="space-y-2 text-sm">
                      <span className="text-on-surface">Loan amount needed</span>
                      <input className="w-full h-12 px-4 rounded-lg input-field" type="number" value={quickEstimate.loan_amount_needed} onChange={(e) => setQuickEstimate((prev) => ({ ...prev, loan_amount_needed: Number(e.target.value) }))} />
                    </label>
                    <label className="space-y-2 text-sm">
                      <span className="text-on-surface">Urgency</span>
                      <select className="w-full h-12 px-4 rounded-lg input-field" value={quickEstimate.urgency} onChange={(e) => setQuickEstimate((prev) => ({ ...prev, urgency: e.target.value }))}>
                        <option>Immediate</option>
                        <option>This month</option>
                        <option>2-4 weeks</option>
                        <option>Flexible</option>
                      </select>
                    </label>
                    <label className="space-y-2 text-sm">
                      <span className="text-on-surface">Use case</span>
                      <select className="w-full h-12 px-4 rounded-lg input-field" value={quickEstimate.use_case} onChange={(e) => setQuickEstimate((prev) => ({ ...prev, use_case: e.target.value }))}>
                        <option value="business">Business</option>
                        <option value="personal">Personal</option>
                      </select>
                    </label>
                  </div>
                  <button type="button" onClick={() => handleProvisionalRun(quickEstimate)} className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-white transition-colors font-semibold">
                    Run Provisional Estimate
                  </button>
                </div>
              )}

              {activeMethod === 'manual' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Manual Financial Snapshot</h3>
                    <p className="text-sm text-on-surface-variant">Self-declare core financial behavior when no statement is ready.</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="space-y-2 text-sm">
                      <span className="text-on-surface">Loan purpose</span>
                      <select className="w-full h-12 px-4 rounded-lg input-field" value={manualSnapshot.loan_purpose} onChange={(e) => setManualSnapshot((prev) => ({ ...prev, loan_purpose: e.target.value }))}>
                        <option value="working_capital">Working Capital</option>
                        <option value="business_expansion">Business Expansion</option>
                        <option value="education">Education</option>
                        <option value="medical">Medical</option>
                        <option value="consumer">Consumer Need</option>
                        <option value="debt_consolidation">Debt Consolidation</option>
                      </select>
                    </label>
                    <label className="space-y-2 text-sm">
                      <span className="text-on-surface">Loan amount needed</span>
                      <input className="w-full h-12 px-4 rounded-lg input-field" type="number" value={manualSnapshot.loan_amount_needed} onChange={(e) => setManualSnapshot((prev) => ({ ...prev, loan_amount_needed: Number(e.target.value) }))} />
                    </label>
                    <label className="space-y-2 text-sm">
                      <span className="text-on-surface">Average balance band</span>
                      <select className="w-full h-12 px-4 rounded-lg input-field" value={manualSnapshot.avg_balance_band} onChange={(e) => setManualSnapshot((prev) => ({ ...prev, avg_balance_band: e.target.value }))}>
                        <option value="below_25k">Below ₹25k</option>
                        <option value="25k_75k">₹25k - ₹75k</option>
                        <option value="75k_150k">₹75k - ₹150k</option>
                        <option value="150k_plus">₹150k+</option>
                      </select>
                    </label>
                    <label className="space-y-2 text-sm">
                      <span className="text-on-surface">Urgency</span>
                      <select className="w-full h-12 px-4 rounded-lg input-field" value={manualSnapshot.urgency} onChange={(e) => setManualSnapshot((prev) => ({ ...prev, urgency: e.target.value }))}>
                        <option>Immediate</option>
                        <option>This month</option>
                        <option>2-4 weeks</option>
                        <option>Flexible</option>
                      </select>
                    </label>
                    <label className="space-y-2 text-sm">
                      <span className="text-on-surface">Monthly rent / fixed obligation</span>
                      <input className="w-full h-12 px-4 rounded-lg input-field" type="number" value={manualSnapshot.rent_amount} onChange={(e) => setManualSnapshot((prev) => ({ ...prev, rent_amount: Number(e.target.value) }))} />
                    </label>
                    <label className="space-y-2 text-sm">
                      <span className="text-on-surface">Declared monthly spending</span>
                      <input className="w-full h-12 px-4 rounded-lg input-field" type="number" value={manualSnapshot.declared_spending} onChange={(e) => setManualSnapshot((prev) => ({ ...prev, declared_spending: Number(e.target.value) }))} />
                    </label>
                    <label className="space-y-2 text-sm">
                      <span className="text-on-surface">Business vintage</span>
                      <select className="w-full h-12 px-4 rounded-lg input-field" value={manualSnapshot.business_vintage} onChange={(e) => setManualSnapshot((prev) => ({ ...prev, business_vintage: e.target.value }))}>
                        <option value="<1 year">Less than 1 year</option>
                        <option value="1-3 years">1-3 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5+ years">5+ years</option>
                      </select>
                    </label>
                    <label className="space-y-2 text-sm">
                      <span className="text-on-surface">Use case</span>
                      <select className="w-full h-12 px-4 rounded-lg input-field" value={manualSnapshot.use_case} onChange={(e) => setManualSnapshot((prev) => ({ ...prev, use_case: e.target.value }))}>
                        <option value="business">Business</option>
                        <option value="personal">Personal</option>
                      </select>
                    </label>
                  </div>
                  <button type="button" onClick={() => handleProvisionalRun(manualSnapshot)} className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-white transition-colors font-semibold">
                    Analyze Manual Snapshot
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container border border-outline-variant/50 rounded-xl p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider text-on-surface-variant">Analysis State</h3>
                <span className={`material-symbols-outlined text-tertiary ${uploadState === 'uploading' ? 'animate-pulse' : ''}`}>sensors</span>
              </div>
              <div className="flex-grow flex flex-col gap-4 font-mono text-[13px] text-on-surface-variant justify-center">
                <div className="p-3 bg-background border border-outline-variant/30 rounded flex justify-between items-center">
                  <span className="text-on-surface">Signals Detected</span>
                  <span className="text-tertiary font-bold">{uploadState === 'idle' ? '--' : dataPoints.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-background border border-outline-variant/30 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-on-surface">Score Confidence</span>
                    <span className={`text-[11px] ${activeMethod === 'csv' ? 'text-emerald-300' : 'text-tertiary'}`}>
                      {activeMethod === 'csv' ? 'VERIFIED PATH' : 'PROVISIONAL PATH'}
                    </span>
                  </div>
                  <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
                    <div className="bg-outline h-full transition-all duration-300" style={{ width: `${activeMethod === 'csv' ? upiProgress : 68}%` }}></div>
                  </div>
                </div>
                <div className="p-3 bg-background border border-outline-variant/30 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-on-surface">Stability Model</span>
                    <span className={`text-[11px] ${uploadState === 'idle' ? 'text-secondary' : 'text-tertiary'}`}>
                      {uploadState === 'idle' && 'AWAITING INPUT'}
                      {uploadState === 'uploading' && 'SCORING...'}
                      {uploadState === 'completed' && 'CONSENSUAL'}
                    </span>
                  </div>
                  <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
                    <div className="bg-outline h-full transition-all duration-300" style={{ width: `${cashFlowProgress}%` }}></div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-tertiary-container/20 border border-tertiary-container rounded text-center">
                  <p className="text-on-surface font-label-sm text-label-sm">
                    {uploadState === 'idle' && 'Choose an intake method to begin'}
                    {uploadState === 'uploading' && 'Running underwriting models...'}
                    {uploadState === 'completed' && 'Passing results into Corvus cockpit'}
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
