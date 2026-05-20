import React from 'react';

export default function AIExplainabilityReport({ setCurrentPage, session }) {
  const explanations = session?.explanations;
  const weights = explanations?.weights || [
    { name: 'Income Stability', weight: 40, value: 0 },
    { name: 'EMI Discipline', weight: 25, value: 0 },
    { name: 'Average Balance', weight: 20, value: 0 },
    { name: 'Spending Consistency', weight: 15, value: 0 },
  ];

  return (
    <div className="flex-1 w-full bg-background pb-24 md:pb-8">
      <div className="px-container-padding-mobile md:px-container-padding-desktop py-8 md:py-12 bg-surface-container-lowest border-b border-outline-variant/20 bg-intelligence-motif">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => setCurrentPage('lender')} className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm mb-6">
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
                {explanations?.summary || 'Comprehensive breakdown of algorithmic assessment and weighted factors influencing the final trust score.'}
              </p>
            </div>

            <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-6 flex items-center gap-6 shadow-2xl shadow-black/50">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 absolute" viewBox="0 0 36 36">
                  <path className="text-surface-variant" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                  <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${explanations?.trust_score || 0}, 100`} strokeLinecap="round" strokeWidth="3"></path>
                </svg>
                <span className="font-headline-md text-headline-md text-on-surface">{Math.round(explanations?.trust_score || 0)}</span>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Trust Index</p>
                <p className="font-label-md text-label-md text-primary">{explanations?.risk_category || 'Pending'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-base">
          <div className="md:col-span-5 bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">pie_chart</span>
              Algorithmic Weights
            </h2>
            <div className="space-y-6 flex-grow flex flex-col justify-center">
              {weights.map((item, index) => (
                <div key={item.name}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-label-md text-label-md text-on-surface">{item.name}</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{item.weight}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${item.weight}%`, opacity: 1 - index * 0.18 }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-7 bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 relative overflow-hidden">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">timeline</span>
              Behavioral Timeline
            </h2>
            <div className="relative border-l border-outline-variant/30 ml-3 space-y-8 pb-4">
              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-surface-container-low"></div>
                <p className="font-label-sm text-label-sm text-primary mb-1">Latest Run</p>
                <p className="font-label-md text-label-md text-on-surface">Trust score compiled</p>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-sm">{explanations?.summary || 'No explanation available yet.'}</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-error border-2 border-surface-container-low"></div>
                <p className="font-label-sm text-label-sm text-error mb-1">Risk window</p>
                <p className="font-label-md text-label-md text-on-surface">Repayment pressure assessed</p>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-sm">EMI load, balance buffer, and spending behavior were combined into a deterministic risk score.</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-surface-container-low"></div>
                <p className="font-label-sm text-label-sm text-primary mb-1">Recommendation layer</p>
                <p className="font-label-md text-label-md text-on-surface">Lenders ranked by fit</p>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-sm">Corvus matched lenders using trust score, DTI ratio, monthly income, and policy thresholds.</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <span className="material-symbols-outlined text-[96px] text-primary">trending_up</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Positive Drivers</h3>
            <ul className="space-y-4">
              {(explanations?.positives || ['Stable income patterns improve trust score.', 'Manageable EMI load supports repayment confidence.']).map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5 text-[20px] icon-fill">check_circle</span>
                  <div>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">{item}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-6 bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <span className="material-symbols-outlined text-[96px] text-error">trending_down</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Risk Factors</h3>
            <ul className="space-y-4">
              {(explanations?.negatives || ['Risk factors will be listed after analysis.']).map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-error mt-0.5 text-[20px]">warning</span>
                  <div>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">{item}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-12 bg-surface-container border border-outline-variant/30 rounded-xl p-6 md:p-8 mt-4">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-1/3">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Optimization Pathways</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Practical steps that can improve approval readiness in the next analysis cycle.</p>
              </div>
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(explanations?.improvements || ['Reduce EMI burden where possible.', 'Maintain steadier balances across the month.']).map((item) => (
                  <div key={item} className="bg-surface-container-low border border-outline-variant/20 p-4 rounded-lg flex flex-col gap-2">
                    <span className="material-symbols-outlined text-primary mb-1">insights</span>
                    <h4 className="font-label-md text-label-md text-on-surface font-semibold">Suggested action</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
