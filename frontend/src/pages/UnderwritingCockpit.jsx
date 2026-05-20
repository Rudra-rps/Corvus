import React from 'react';

export default function UnderwritingCockpit({ setCurrentPage, session }) {
  const dashboard = session?.dashboard;
  const user = session?.user;
  const metrics = dashboard?.metrics;
  const topCategories = dashboard?.charts?.category_breakdown?.slice(0, 4) || [];

  return (
    <div className="flex-1 w-full bg-grid-pattern min-h-screen flex flex-col pb-24">
      <header className="h-20 px-container-padding-desktop flex items-center justify-between border-b border-outline-variant/30 bg-surface/80 backdrop-blur-md z-10 sticky top-0">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Command Center</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Strategic credit underwriting cockpit.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full border border-outline-variant/50">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-on-surface">Graphite Node Active</span>
          </div>
          <button onClick={() => setCurrentPage('onboarding')} className="hidden sm:flex bg-primary hover:bg-white text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg transition-colors gap-2 items-center">
            New Analysis
            <span className="material-symbols-outlined text-[16px]">add</span>
          </button>
        </div>
      </header>

      <div className="flex-grow p-container-padding-mobile md:p-container-padding-desktop overflow-y-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-base">
            <div className="lg:col-span-4 bg-surface-container-low card-border rounded-xl p-6 flex flex-col gap-4">
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Entity Profile</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center font-bold text-headline-md text-on-surface">
                  {(user?.name || 'C').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-headline-md text-[18px] text-on-surface font-semibold">{user?.name || 'Corvus Borrower'}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">{user?.employment_type || 'Employment Pending'} • {user?.city || 'India'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Monthly Income</span>
                  <span className="font-label-md text-label-md text-on-surface">₹{Math.round(metrics?.monthly_income || user?.monthly_income || 0).toLocaleString()}</span>
                </div>
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Existing EMI</span>
                  <span className="font-label-md text-label-md text-on-surface">₹{Math.round(user?.monthly_emi || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-surface-container-low card-border rounded-xl p-6 flex flex-col gap-4">
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Financial Health Vectors</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30 flex flex-col justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Income Stability</span>
                  <span className="font-headline-md text-headline-md text-primary mt-2">{Math.round(metrics?.income_stability || 0)}</span>
                </div>
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30 flex flex-col justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">DTI Ratio</span>
                  <span className="font-headline-md text-headline-md text-primary mt-2">{Math.round(metrics?.dti_ratio || 0)}%</span>
                </div>
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30 flex flex-col justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Avg Balance</span>
                  <span className="font-headline-md text-headline-md text-primary mt-2">₹{Math.round(metrics?.average_balance || 0).toLocaleString()}</span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">
                {metrics?.summary || 'Complete onboarding and upload a statement to generate live Corvus underwriting metrics.'}
              </p>
            </div>

            <div className="lg:col-span-3 bg-surface-container-low card-border rounded-xl p-6 flex flex-col justify-between items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/10 rounded-full blur-xl -mr-6 -mt-6"></div>
              <div className="w-full">
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Credit Trust Index</h3>
                <div className="flex justify-between items-baseline mt-4">
                  <span className="font-display-lg text-[48px] font-bold text-tertiary">{Math.round(metrics?.trust_score || 0)}</span>
                  <span className="font-label-sm text-label-sm text-tertiary bg-tertiary-container/30 px-2 py-0.5 rounded border border-tertiary-container">{metrics?.risk_category || 'Pending'}</span>
                </div>
              </div>
              <div className="w-full mt-4">
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary rounded-full" style={{ width: `${metrics?.trust_score || 0}%` }}></div>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-2 block text-xs">
                  {metrics ? 'Updated from latest consensus run' : 'Awaiting first analysis'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-base">
            <div className="bg-surface-container-low card-border rounded-xl p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-md text-[18px] text-on-surface font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                  Cashflow Consistency
                </h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Live metric</span>
              </div>
              <div className="h-48 w-full mt-4 flex items-center justify-center rounded-lg border border-outline-variant/20 bg-surface-container-lowest">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary">{Math.round(metrics?.spending_consistency || 0)}</div>
                  <p className="text-sm text-on-surface-variant mt-2">Spending consistency score</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low card-border rounded-xl p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-md text-[18px] text-on-surface font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">query_stats</span>
                  Repayment Readiness
                </h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Risk output</span>
              </div>
              <div className="h-48 w-full mt-4 flex items-center justify-center rounded-lg border border-outline-variant/20 bg-surface-container-lowest">
                <div className="text-center">
                  <div className="text-5xl font-bold text-tertiary">{Math.round(metrics?.repayment_confidence || 0)}%</div>
                  <p className="text-sm text-on-surface-variant mt-2">Repayment confidence</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-base">
            <div className="lg:col-span-6 bg-surface-container-low card-border rounded-xl p-6 flex flex-col gap-4">
              <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">Outflow Profile</h3>
              <div className="space-y-4 mt-2">
                {topCategories.length ? topCategories.map((item, index) => {
                  const max = topCategories[0]?.amount || 1;
                  const width = `${Math.max(12, (item.amount / max) * 100)}%`;
                  return (
                    <div key={item.category}>
                      <div className="flex justify-between text-label-sm font-label-sm mb-1.5">
                        <span className="text-on-surface capitalize">{item.category}</span>
                        <span className="text-on-surface-variant">₹{Math.round(item.amount).toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width, opacity: 1 - index * 0.18 }}></div>
                      </div>
                    </div>
                  );
                }) : <p className="text-sm text-on-surface-variant">Category insights will appear after statement analysis.</p>}
              </div>
            </div>

            <div className="lg:col-span-6 bg-surface-container-low card-border rounded-xl p-6 flex flex-col gap-4">
              <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">Agent Finding Log</h3>
              <div className="flex-1 flex flex-col gap-3 max-h-[220px] overflow-y-auto">
                <div className="bg-surface-container-lowest p-3.5 rounded-lg border border-outline-variant/20 flex gap-3 items-start">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">verified_user</span>
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface block font-semibold">Consensus Established</span>
                    <span className="font-body-md text-body-md text-on-surface-variant text-sm mt-0.5 block">
                      {metrics?.summary || 'Awaiting the first completed run.'}
                    </span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-3.5 rounded-lg border border-outline-variant/20 flex gap-3 items-start">
                  <span className="material-symbols-outlined text-tertiary text-[18px] mt-0.5">hub</span>
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface block font-semibold">Recommendation State</span>
                    <span className="font-body-md text-body-md text-on-surface-variant text-sm mt-0.5 block">
                      {session?.recommendations?.length ? `${session.recommendations.length} lenders ranked for current borrower profile.` : 'Lender ranking will appear after analysis.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
