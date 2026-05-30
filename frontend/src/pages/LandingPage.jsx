
export default function LandingPage({ setCurrentPage }) {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col relative overflow-x-hidden bg-graph-motif">
      {/* Top Header */}
      <header className="w-full px-gutter max-w-7xl mx-auto h-20 flex justify-between items-center border-b border-outline-variant/30 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="font-display-lg text-headline-md font-bold tracking-tighter text-on-surface cursor-pointer" onClick={() => setCurrentPage('landing')}>
          Corvus AI
        </div>
        <nav className="hidden md:flex gap-8">
          <a className="text-on-surface-variant hover:text-on-surface transition-colors font-label-md text-label-md" href="#" onClick={(e) => e.preventDefault()}>Intelligence</a>
          <a className="text-on-surface-variant hover:text-on-surface transition-colors font-label-md text-label-md" href="#" onClick={(e) => e.preventDefault()}>Markets</a>
          <a className="text-on-surface-variant hover:text-on-surface transition-colors font-label-md text-label-md" href="#" onClick={(e) => e.preventDefault()}>Lenders</a>
          <a className="text-on-surface-variant hover:text-on-surface transition-colors font-label-md text-label-md" href="#" onClick={(e) => e.preventDefault()}>Governance</a>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentPage('login')}
            className="bg-tertiary-container hover:bg-tertiary-container/85 text-on-tertiary-container font-label-md text-label-md px-5 py-2.5 rounded-lg transition-colors border border-outline-variant/30 shadow-lg shadow-black/35"
          >
            Launch Terminal
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-gutter flex flex-col gap-16 py-16 md:py-24 relative z-10">
        <section className="text-center flex flex-col items-center gap-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/50">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-on-surface">Graphite Environment V1.2 Active</span>
          </div>
          <h1 className="font-display-lg text-headline-lg md:text-[64px] md:leading-[72px] tracking-tighter text-on-surface font-bold">
            Strategic Credit Intelligence for Complex Entities
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Beyond standard credit scoring. We analyze multi-dimensional transaction graphs, operational parameters, and behavioral vectors to map true underwriting risk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
            <button 
              onClick={() => setCurrentPage('login')}
              className="bg-primary hover:bg-white text-on-primary font-label-md text-label-md py-3.5 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(197,198,204,0.15)] font-semibold"
            >
              Launch Terminal
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <button 
              onClick={() => alert("Documentation loading...")}
              className="bg-surface-container border border-outline-variant hover:bg-surface-container-high text-on-surface font-label-md text-label-md py-3.5 px-8 rounded-lg transition-colors"
            >
              View Whitepaper
            </button>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-base mt-8">
          {/* Card 1 */}
          <div className="md:col-span-5 glass-panel rounded-xl p-8 flex flex-col justify-between min-h-[300px] hover:border-primary/30 transition-all duration-300 group">
            <div className="flex flex-col gap-4">
              <span className="material-symbols-outlined text-[36px] text-tertiary">hub</span>
              <h3 className="font-headline-md text-headline-md text-on-surface">Graph Neural Networks</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Mapping borrower interactions, supply chain links, and industry dependencies to reveal systemic risks undetected by standard balance sheets.
              </p>
            </div>
            <div className="w-full bg-surface-container-lowest h-[4px] rounded-full overflow-hidden mt-6">
              <div className="h-full bg-tertiary w-3/4 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="md:col-span-7 glass-panel rounded-xl p-8 flex flex-col justify-between min-h-[300px] hover:border-primary/30 transition-all duration-300 group">
            <div className="flex flex-col gap-4">
              <span className="material-symbols-outlined text-[36px] text-primary">psychology</span>
              <h3 className="font-headline-md text-headline-md text-on-surface">Multi-Agent Consensus</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Autonomous specialists run concurrent pipelines to verify stability vectors, transaction patterns, and risk factors, delivering a unified underwriting consensus.
              </p>
            </div>
            <div className="w-full bg-surface-container-lowest h-[4px] rounded-full overflow-hidden mt-6">
              <div className="h-full bg-primary w-1/2 group-hover:w-3/4 transition-all duration-500"></div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="md:col-span-12 glass-panel rounded-xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between hover:border-primary/30 transition-all duration-300">
            <div className="md:w-2/3 flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 bg-on-tertiary-container/10 border border-on-tertiary-container/30 px-3 py-1 rounded-full w-fit">
                <span className="font-label-sm text-[10px] text-on-tertiary-container uppercase tracking-wider">Explainability Protocol</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Explainable Decisions</h3>
              <p className="font-body-lg text-body-md text-on-surface-variant max-w-xl">
                No black boxes. Every trust score output is generated alongside a verifiable audit trail of algorithmic weights and risk timelines.
              </p>
            </div>
            <button 
              onClick={() => setCurrentPage('login')}
              className="bg-surface-variant hover:bg-surface-container-highest text-on-surface border border-outline-variant font-label-md text-label-md py-3 px-6 rounded-lg transition-colors flex items-center gap-2 shrink-0"
            >
              Analyze Live Profile
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 bg-surface-container-lowest border-t border-outline-variant mt-24">
        <div className="max-w-7xl mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="font-display-lg text-headline-md text-on-surface mb-2">Corvus AI</div>
            <p className="font-body-md text-body-md text-on-surface-variant">© 2026 Corvus AI. Strategic Credit Intelligence.</p>
          </div>
          <div className="flex flex-wrap gap-6 md:justify-end">
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4" href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4" href="#" onClick={(e) => e.preventDefault()}>Terms</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4" href="#" onClick={(e) => e.preventDefault()}>Security</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4" href="#" onClick={(e) => e.preventDefault()}>API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
