import React from 'react';

export default function AIExplainabilityReport({ setCurrentPage }) {
  return (
    <div className="flex-1 w-full bg-background pb-24 md:pb-8">
      {/* Header Section */}
      <div className="px-container-padding-mobile md:px-container-padding-desktop py-8 md:py-12 bg-surface-container-lowest border-b border-outline-variant/20 bg-intelligence-motif">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => setCurrentPage('lender')}
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm mb-6"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Recommendations
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Deep-Dive Reasoning</h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  ID: TX-8924A
                </span>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Comprehensive breakdown of algorithmic assessment and weighted factors influencing the final trust probability score.
              </p>
            </div>
            
            {/* Hero Score Callout */}
            <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-6 flex items-center gap-6 shadow-2xl shadow-black/50">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 absolute" viewBox="0 0 36 36">
                  <path className="text-surface-variant" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                  <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="88, 100" strokeLinecap="round" strokeWidth="3"></path>
                </svg>
                <span className="font-headline-md text-headline-md text-on-surface">88</span>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Trust Index</p>
                <p className="font-label-md text-label-md text-primary">High Confidence</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-base">
          
          {/* Weighted Factors Breakdown (Span 5) */}
          <div className="md:col-span-5 bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">pie_chart</span>
              Algorithmic Weights
            </h2>
            <div className="space-y-6 flex-grow flex flex-col justify-center">
              {/* Factor 1 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-label-md text-label-md text-on-surface">Income Stability</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">30%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[30%] rounded-full"></div>
                </div>
              </div>
              {/* Factor 2 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-label-md text-label-md text-on-surface">EMI Discipline</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">25%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[25%] opacity-80 rounded-full"></div>
                </div>
              </div>
              {/* Factor 3 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-label-md text-label-md text-on-surface">Credit Utilization</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">20%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[20%] opacity-60 rounded-full"></div>
                </div>
              </div>
              {/* Factor 4 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-label-md text-label-md text-on-surface">Network Trust</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">15%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[15%] opacity-40 rounded-full"></div>
                </div>
              </div>
              {/* Factor 5 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-label-md text-label-md text-on-surface">Macro Indicators</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">10%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[10%] opacity-20 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Timeline (Span 7) */}
          <div className="md:col-span-7 bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 relative overflow-hidden">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">timeline</span>
              Behavioral Timeline
            </h2>
            <div className="relative border-l border-outline-variant/30 ml-3 space-y-8 pb-4">
              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-surface-container-low"></div>
                <p className="font-label-sm text-label-sm text-primary mb-1">Oct 2023</p>
                <p className="font-label-md text-label-md text-on-surface">Sustained Deposit Growth</p>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-sm">Consecutive monthly increase in baseline liquidity detected.</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-error border-2 border-surface-container-low"></div>
                <p className="font-label-sm text-label-sm text-error mb-1">Aug 2023</p>
                <p className="font-label-md text-label-md text-on-surface">High Utilization Warning</p>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-sm">Credit utilization spiked above 65% optimal threshold temporarily.</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-surface-container-low"></div>
                <p className="font-label-sm text-label-sm text-primary mb-1">Mar 2023</p>
                <p className="font-label-md text-label-md text-on-surface">Account Maturation</p>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-sm">Primary operating accounts crossed 24-month stability threshold.</p>
              </div>
            </div>
            {/* Decorative blur */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-container-low to-transparent pointer-events-none"></div>
          </div>

          {/* Positive Drivers (Span 6) */}
          <div className="md:col-span-6 bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <span className="material-symbols-outlined text-[96px] text-primary">trending_up</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Positive Drivers</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5 text-[20px] icon-fill">check_circle</span>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">Zero Default History</p>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-0.5">No recorded missed payments across all linked facilities in 36 months.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5 text-[20px] icon-fill">check_circle</span>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">Diverse Credit Mix</p>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-0.5">Healthy ratio of secured vs unsecured instruments.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Negative Drivers (Span 6) */}
          <div className="md:col-span-6 bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <span className="material-symbols-outlined text-[96px] text-error">trending_down</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Risk Factors</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-error mt-0.5 text-[20px]">warning</span>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">Recent Hard Inquiries</p>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-0.5">Two new credit applications detected within the last 45 days.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-error mt-0.5 text-[20px]">warning</span>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">Account Age Velocity</p>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-0.5">Average age of accounts reduced due to recent openings.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Actionable Advice (Span 12) */}
          <div className="md:col-span-12 bg-surface-container border border-outline-variant/30 rounded-xl p-6 md:p-8 mt-4">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-1/3">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Optimization Pathways</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Algorithmic recommendations to shift probability into the &gt;95% confidence tier.</p>
              </div>
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-surface-container-low border border-outline-variant/20 p-4 rounded-lg flex flex-col gap-2">
                  <span className="material-symbols-outlined text-primary mb-1">pause_circle</span>
                  <h4 className="font-label-md text-label-md text-on-surface font-semibold">Pause Applications</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">Halt any new credit inquiries for the next 90 days to allow recent hard pulls to age out of the primary risk window.</p>
                </div>
                <div className="bg-surface-container-low border border-outline-variant/20 p-4 rounded-lg flex flex-col gap-2">
                  <span className="material-symbols-outlined text-primary mb-1">account_balance</span>
                  <h4 className="font-label-md text-label-md text-on-surface font-semibold">Increase Line Limit</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">Request a limit increase on the oldest facility to rapidly decrease the overall utilization ratio without a hard pull.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
