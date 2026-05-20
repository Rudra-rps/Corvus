import React from 'react';

export default function UnderwritingCockpit({ setCurrentPage }) {
  return (
    <div className="flex-1 w-full bg-grid-pattern min-h-screen flex flex-col pb-24">
      {/* Header */}
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
          <button 
            onClick={() => setCurrentPage('onboarding')}
            className="hidden sm:flex bg-primary hover:bg-white text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg transition-colors gap-2 items-center"
          >
            New Analysis
            <span className="material-symbols-outlined text-[16px]">add</span>
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="flex-grow p-container-padding-mobile md:p-container-padding-desktop overflow-y-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          
          {/* Top Bento Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-base">
            {/* Entity profile card */}
            <div className="lg:col-span-4 bg-surface-container-low card-border rounded-xl p-6 flex flex-col gap-4">
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Entity Profile</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center font-bold text-headline-md text-on-surface">
                  AM
                </div>
                <div>
                  <h4 className="font-headline-md text-[18px] text-on-surface font-semibold">Apex Manufacturing</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">Industrial Goods • Sector Tier 1</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Gst Registration</span>
                  <span className="font-label-md text-label-md text-on-surface">Verified</span>
                </div>
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Incorporation</span>
                  <span className="font-label-md text-label-md text-on-surface">8.4 Years</span>
                </div>
              </div>
            </div>

            {/* Financial health card */}
            <div className="lg:col-span-5 bg-surface-container-low card-border rounded-xl p-6 flex flex-col gap-4">
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Financial Health Vectors</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30 flex flex-col justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">DSCR</span>
                  <span className="font-headline-md text-headline-md text-primary mt-2">2.41x</span>
                </div>
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30 flex flex-col justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">DTI Ratio</span>
                  <span className="font-headline-md text-headline-md text-primary mt-2">32%</span>
                </div>
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30 flex flex-col justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">EBITDA Mgn</span>
                  <span className="font-headline-md text-headline-md text-primary mt-2">18.4%</span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">
                Cashflow profiles suggest stable debt service capacity over the trailing 12-month window.
              </p>
            </div>

            {/* Trust Indicator card */}
            <div className="lg:col-span-3 bg-surface-container-low card-border rounded-xl p-6 flex flex-col justify-between items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/10 rounded-full blur-xl -mr-6 -mt-6"></div>
              <div className="w-full">
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Credit Trust Index</h3>
                <div className="flex justify-between items-baseline mt-4">
                  <span className="font-display-lg text-[48px] font-bold text-tertiary">88</span>
                  <span className="font-label-sm text-label-sm text-tertiary bg-tertiary-container/30 px-2 py-0.5 rounded border border-tertiary-container">High Confidence</span>
                </div>
              </div>
              <div className="w-full mt-4">
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary w-[88%] rounded-full"></div>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-2 block text-xs">
                  Updated 3 minutes ago by consensus
                </span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-base">
            {/* Cashflow Consistency */}
            <div className="bg-surface-container-low card-border rounded-xl p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-md text-[18px] text-on-surface font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                  Cashflow Consistency
                </h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Trailing 6 Months</span>
              </div>
              <div className="h-48 w-full mt-4 flex items-end">
                <svg className="w-full h-full" viewBox="0 0 500 150">
                  <defs>
                    <linearGradient id="gradient-line-1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c5c6cc" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#c5c6cc" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  {/* Fill Under Curve */}
                  <path d="M 0 100 Q 100 30 200 80 T 400 50 T 500 40 L 500 150 L 0 150 Z" fill="url(#gradient-line-1)" />
                  {/* Curve Line */}
                  <path d="M 0 100 Q 100 30 200 80 T 400 50 T 500 40" fill="none" stroke="#c5c6cc" strokeWidth="2.5" />
                  {/* Nodes */}
                  <circle cx="100" cy="55" r="4" fill="#c5c6cc" />
                  <circle cx="200" cy="80" r="4" fill="#c5c6cc" />
                  <circle cx="300" cy="65" r="4" fill="#c5c6cc" />
                  <circle cx="400" cy="50" r="4" fill="#c5c6cc" />
                  <circle cx="500" cy="40" r="4" fill="#c5c6cc" />
                </svg>
              </div>
              <div className="flex justify-between font-mono text-[10px] text-on-surface-variant px-1">
                <span>NOV</span>
                <span>DEC</span>
                <span>JAN</span>
                <span>FEB</span>
                <span>MAR</span>
                <span>APR</span>
              </div>
            </div>

            {/* Cash Flow Balance Trends */}
            <div className="bg-surface-container-low card-border rounded-xl p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-md text-[18px] text-on-surface font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">query_stats</span>
                  EOD Balance Velocity
                </h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Daily Average</span>
              </div>
              <div className="h-48 w-full mt-4 flex items-end">
                <svg className="w-full h-full" viewBox="0 0 500 150">
                  <defs>
                    <linearGradient id="gradient-line-2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#507cff" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#507cff" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  {/* Fill Under Curve */}
                  <path d="M 0 120 C 100 110 150 40 250 50 T 400 90 T 500 30 L 500 150 L 0 150 Z" fill="url(#gradient-line-2)" />
                  {/* Curve Line */}
                  <path d="M 0 120 C 100 110 150 40 250 50 T 400 90 T 500 30" fill="none" stroke="#507cff" strokeWidth="2.5" />
                  {/* Nodes */}
                  <circle cx="100" cy="115" r="4" fill="#507cff" />
                  <circle cx="200" cy="45" r="4" fill="#507cff" />
                  <circle cx="300" cy="60" r="4" fill="#507cff" />
                  <circle cx="400" cy="90" r="4" fill="#507cff" />
                  <circle cx="500" cy="30" r="4" fill="#507cff" />
                </svg>
              </div>
              <div className="flex justify-between font-mono text-[10px] text-on-surface-variant px-1">
                <span>W1</span>
                <span>W2</span>
                <span>W3</span>
                <span>W4</span>
                <span>W5</span>
                <span>W6</span>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-base">
            {/* Transaction Categories */}
            <div className="lg:col-span-6 bg-surface-container-low card-border rounded-xl p-6 flex flex-col gap-4">
              <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">Vendor Outflow Profile</h3>
              <div className="space-y-4 mt-2">
                <div>
                  <div className="flex justify-between text-label-sm font-label-sm mb-1.5">
                    <span className="text-on-surface">Raw Materials Procurement</span>
                    <span className="text-on-surface-variant">₹2.4Cr (40%)</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[40%] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-label-sm font-label-sm mb-1.5">
                    <span className="text-on-surface">Operational & Overheads</span>
                    <span className="text-on-surface-variant">₹1.5Cr (25%)</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary/80 w-[25%] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-label-sm font-label-sm mb-1.5">
                    <span className="text-on-surface">Salaries & Payroll</span>
                    <span className="text-on-surface-variant">₹1.2Cr (20%)</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary/60 w-[20%] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-label-sm font-label-sm mb-1.5">
                    <span className="text-on-surface">Debt Servicing</span>
                    <span className="text-on-surface-variant">₹0.9Cr (15%)</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary/40 w-[15%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Consensus / Findings */}
            <div className="lg:col-span-6 bg-surface-container-low card-border rounded-xl p-6 flex flex-col gap-4">
              <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">Agent Finding Log</h3>
              <div className="flex-1 flex flex-col gap-3 max-h-[220px] overflow-y-auto">
                <div className="bg-surface-container-lowest p-3.5 rounded-lg border border-outline-variant/20 flex gap-3 items-start">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">verified_user</span>
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface block font-semibold">Consensus Established</span>
                    <span className="font-body-md text-body-md text-on-surface-variant text-sm mt-0.5 block">
                      All three agents verified 12-month payroll stability records. Confidence index set to High.
                    </span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-3.5 rounded-lg border border-outline-variant/20 flex gap-3 items-start">
                  <span className="material-symbols-outlined text-tertiary text-[18px] mt-0.5">hub</span>
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface block font-semibold">Graph Ingestion Complete</span>
                    <span className="font-body-md text-body-md text-on-surface-variant text-sm mt-0.5 block">
                      Loaded 48 corporate nodes and 124 link weightings. Systemic dependencies mapped successfully.
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
