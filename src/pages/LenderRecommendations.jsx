import React, { useState, useRef, useEffect } from 'react';

export default function LenderRecommendations({ setCurrentPage }) {
  const [messages, setMessages] = useState([
    { sender: 'agent', text: "I've analyzed the HDFC parameters. Would you like me to draft a preliminary pitch structure highlighting the DSCR strength?" },
    { sender: 'user', text: "Yes, generate the draft." },
    { sender: 'agent', text: "Generating pitch structure...\n\n**Apex manufacturing Pitch Deck Outline**\n1. Executive Summary: Highlighting 2.41x DSCR.\n2. Collateral position: Standard margins with high liquidity.\n3. Debt maturity profile: 5-7 year tenure optimization." }
  ]);
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = inputVal;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputVal('');

    // Simulate Agent Response
    setTimeout(() => {
      let replyText = "Analyzing parameters...";
      if (userMsg.toLowerCase().includes('rate') || userMsg.toLowerCase().includes('hdfc')) {
        replyText = "HDFC's estimated rate range of 8.2% - 8.5% is locked for 15 days. I've updated the interest risk model accordingly.";
      } else if (userMsg.toLowerCase().includes('icici') || userMsg.toLowerCase().includes('collateral')) {
        replyText = "For ICICI Bank, adding a corporate guarantee shifts the match probability from 68% to 79%. Would you like me to add it?";
      } else {
        replyText = "Understood. Re-scoring underwriting factors based on your query. Let me know if you would like me to compile the final recommendation report.";
      }
      setMessages(prev => [...prev, { sender: 'agent', text: replyText }]);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 w-full bg-grid-pattern min-h-screen flex flex-col pb-24 md:pb-8">
      {/* Page Header */}
      <div className="px-container-padding-mobile md:px-container-padding-desktop py-8 md:py-12 border-b border-outline-variant bg-surface-container-lowest/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23507cff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-tertiary-container/30 text-tertiary border border-tertiary-container font-label-sm text-label-sm tracking-wider uppercase text-xs">Analysis Complete</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">ID: C-8842-X</span>
            </div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Lender Recommendations</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">AI-driven credit match probability based on real-time market data and entity risk profile.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setCurrentPage('explainability')}
              className="bg-surface-container text-on-surface border border-outline-variant font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-surface-variant transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">security</span> View Risk Factors
            </button>
            <button 
              onClick={() => alert("Dossier exported to PDF.")}
              className="bg-tertiary-container text-on-tertiary-container font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-tertiary-container/90 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">download</span> Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Content Canvas */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-container-padding-mobile md:px-container-padding-desktop py-8 gap-8 grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Recommendations Grid (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Match 1: High Probability */}
          <div className="bg-surface-container-low card-border rounded-xl p-6 relative overflow-hidden group hover:bg-surface-container transition-colors duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-container/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center border border-outline-variant">
                  <span className="font-headline-md text-headline-md text-on-surface">H</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">HDFC Bank</h3>
                  <p className="font-label-md text-label-md text-on-surface-variant">Tier 1 Corporate Lending</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-3 py-1 rounded-full bg-tertiary-container/30 text-tertiary border border-tertiary-container font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] icon-fill">check_circle</span> High Probability Match
                </span>
                <span className="font-display-lg text-headline-md text-tertiary mt-1">94%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-surface p-3 rounded-lg border border-outline-variant/50">
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Est. Rate</p>
                <p className="font-label-md text-label-md text-on-surface">8.2% - 8.5%</p>
              </div>
              <div className="bg-surface p-3 rounded-lg border border-outline-variant/50">
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Max Quantum</p>
                <p className="font-label-md text-label-md text-on-surface">₹500Cr</p>
              </div>
              <div className="bg-surface p-3 rounded-lg border border-outline-variant/50">
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Tenure</p>
                <p className="font-label-md text-label-md text-on-surface">5-7 Years</p>
              </div>
              <div className="bg-surface p-3 rounded-lg border border-outline-variant/50">
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Collateral Req.</p>
                <p className="font-label-md text-label-md text-on-surface">Standard</p>
              </div>
            </div>
            <div className="bg-surface/50 border border-outline-variant/30 rounded-lg p-4 mb-6">
              <p className="font-label-sm text-label-sm text-primary mb-2 flex items-center gap-1 uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px]">psychology</span> AI Reasoning
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                Strong alignment with HDFC's current sector appetite (Manufacturing). The entity's robust DSCR (2.41x) offsets the slight inventory aging concerns. Recent policy shifts indicate high liquidity for this exact profile.
              </p>
            </div>
            <div className="flex justify-end gap-3 border-t border-outline-variant/30 pt-4">
              <button className="text-on-surface hover:text-primary font-label-md text-label-md px-4 py-2 transition-colors">Dismiss</button>
              <button 
                onClick={() => setCurrentPage('explainability')}
                className="bg-surface-variant text-on-surface border border-outline-variant font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-surface-container-highest transition-colors flex items-center gap-2 group"
              >
                View Underwriting Factors <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Match 2: Medium Probability */}
          <div className="bg-surface-container-low card-border rounded-xl p-6 relative overflow-hidden group hover:bg-surface-container transition-colors duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center border border-outline-variant">
                  <span className="font-headline-md text-headline-md text-on-surface">I</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">ICICI Bank</h3>
                  <p className="font-label-md text-label-md text-on-surface-variant">Commercial Banking Group</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant border border-outline-variant font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">remove</span> Medium Probability
                </span>
                <span className="font-display-lg text-headline-md text-on-surface mt-1">68%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-surface p-3 rounded-lg border border-outline-variant/50">
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Est. Rate</p>
                <p className="font-label-md text-label-md text-on-surface">8.6% - 8.9%</p>
              </div>
              <div className="bg-surface p-3 rounded-lg border border-outline-variant/50">
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Max Quantum</p>
                <p className="font-label-md text-label-md text-on-surface">₹400Cr</p>
              </div>
              <div className="bg-surface p-3 rounded-lg border border-outline-variant/50">
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Tenure</p>
                <p className="font-label-md text-label-md text-on-surface">3-5 Years</p>
              </div>
              <div className="bg-surface p-3 rounded-lg border border-outline-variant/50">
                <p className="font-label-sm text-label-sm text-on-error mb-1">Collateral Req.</p>
                <p className="font-label-md text-label-md text-error">Strict (&gt;1.2x)</p>
              </div>
            </div>
            <div className="bg-surface/50 border border-outline-variant/30 rounded-lg p-4 mb-6">
              <p className="font-label-sm text-label-sm text-primary mb-2 flex items-center gap-1 uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px]">psychology</span> AI Reasoning
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                ICICI's recent credit tightening in this sector lowers the primary score. However, historical relationship nodes suggest a path to approval if collateral requirements are met or a corporate guarantee is provided.
              </p>
            </div>
            <div className="flex justify-end gap-3 border-t border-outline-variant/30 pt-4">
              <button 
                onClick={() => setCurrentPage('explainability')}
                className="bg-surface-variant text-on-surface border border-outline-variant font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-surface-container-highest transition-colors flex items-center gap-2"
              >
                View Underwriting Factors <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Insights & Context (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Global Metrics Card */}
          <div className="bg-surface-container-low card-border rounded-xl p-6">
            <h3 className="font-headline-md text-[18px] font-semibold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">data_usage</span> Market Context
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Sector Liquidity Index</span>
                  <span className="font-label-sm text-label-sm text-primary">High</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-1.5">
                  <div className="bg-tertiary-container h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Average Yield Curve</span>
                  <span className="font-label-sm text-label-sm text-on-surface">8.45%</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-1.5">
                  <div className="bg-outline h-1.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant/30">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">Key Detracting Factor</p>
              <div className="bg-surface p-3 rounded border border-on-error/20 flex gap-3 items-start">
                <span className="material-symbols-outlined text-error text-[18px] mt-0.5">warning</span>
                <p className="font-label-sm text-label-sm text-on-surface text-xs leading-normal">
                  Recent dip in operating margins (-2% QoQ) may trigger enhanced scrutiny from Tier 2 lenders.
                </p>
              </div>
            </div>
          </div>

          {/* AI Agent Chat Box */}
          <div className="bg-surface-container-low card-border rounded-xl p-6 flex flex-col h-[350px]">
            <h3 className="font-headline-md text-[18px] font-semibold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">smart_toy</span> Agent Copilot
            </h3>
            <div className="flex-grow overflow-y-auto mb-4 space-y-3 pr-1 text-xs">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-lg border max-w-[85%] whitespace-pre-wrap ${
                    msg.sender === 'agent' 
                      ? 'bg-surface border-outline-variant/50 rounded-tl-none self-start text-on-surface' 
                      : 'bg-tertiary-container/20 border-tertiary-container/30 rounded-tr-none ml-auto text-tertiary'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSend} className="relative mt-auto">
              <input 
                className="w-full bg-surface border border-outline-variant rounded-lg py-2 pl-3 pr-10 font-label-sm text-label-sm text-on-surface focus:outline-none focus:border-tertiary-container focus:ring-1 focus:ring-tertiary-container" 
                placeholder="Ask agent..." 
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
