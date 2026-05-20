import React, { useEffect, useRef, useState } from 'react';

export default function LenderRecommendations({ setCurrentPage, session }) {
  const recommendations = session?.recommendations || [];
  const topRecommendation = recommendations[0];
  const secondRecommendation = recommendations[1];
  const [messages, setMessages] = useState([
    { sender: 'agent', text: "I've ranked the best lenders for this profile. Ask me to compare rates, collateral assumptions, or approval confidence." },
  ]);
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      return;
    }

    const userMsg = inputVal;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputVal('');

    setTimeout(() => {
      const lender = topRecommendation?.name || topRecommendation?.lender?.name || 'the top lender';
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: `${lender} remains the strongest fit. The current ranking is being driven by trust score, DTI tolerance, and monthly income alignment.`,
        },
      ]);
    }, 900);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const recommendationCard = (item, label, positive = true) => (
    <div className="bg-surface-container-low card-border rounded-xl p-6 relative overflow-hidden group hover:bg-surface-container transition-colors duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-container/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center border border-outline-variant">
            <span className="font-headline-md text-headline-md text-on-surface">{(item?.name || item?.lender?.name || '?').slice(0, 1)}</span>
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">{item?.name || item?.lender?.name || 'Pending lender'}</h3>
            <p className="font-label-md text-label-md text-on-surface-variant">{label}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-3 py-1 rounded-full border font-label-sm text-label-sm flex items-center gap-1 ${
            positive ? 'bg-tertiary-container/30 text-tertiary border-tertiary-container' : 'bg-surface-variant text-on-surface-variant border-outline-variant'
          }`}>
            <span className="material-symbols-outlined text-[14px]">{positive ? 'check_circle' : 'remove'}</span>
            {positive ? 'High Probability Match' : 'Secondary Match'}
          </span>
          <span className={`font-display-lg text-headline-md mt-1 ${positive ? 'text-tertiary' : 'text-on-surface'}`}>{Math.round(item?.approval_probability || 0)}%</span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface p-3 rounded-lg border border-outline-variant/50">
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Est. Rate</p>
          <p className="font-label-md text-label-md text-on-surface">{item?.interest_rate_range || 'Pending'}</p>
        </div>
        <div className="bg-surface p-3 rounded-lg border border-outline-variant/50">
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Max Quantum</p>
          <p className="font-label-md text-label-md text-on-surface">₹{Math.round(item?.max_loan_amount || 0).toLocaleString()}</p>
        </div>
        <div className="bg-surface p-3 rounded-lg border border-outline-variant/50">
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Rank</p>
          <p className="font-label-md text-label-md text-on-surface">#{item?.rank || '-'}</p>
        </div>
      </div>
      <div className="bg-surface/50 border border-outline-variant/30 rounded-lg p-4 mb-6">
        <p className="font-label-sm text-label-sm text-primary mb-2 flex items-center gap-1 uppercase tracking-wider">
          <span className="material-symbols-outlined text-[14px]">psychology</span> AI Reasoning
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant text-sm">
          {item?.explanation || 'Complete an analysis run to see lender-specific reasoning.'}
        </p>
      </div>
      <div className="flex justify-end gap-3 border-t border-outline-variant/30 pt-4">
        <button onClick={() => setCurrentPage('explainability')} className="bg-surface-variant text-on-surface border border-outline-variant font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-surface-container-highest transition-colors flex items-center gap-2">
          View Underwriting Factors
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 w-full bg-grid-pattern min-h-screen flex flex-col pb-24 md:pb-8">
      <div className="px-container-padding-mobile md:px-container-padding-desktop py-8 md:py-12 border-b border-outline-variant bg-surface-container-lowest/50 backdrop-blur-sm relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-tertiary-container/30 text-tertiary border border-tertiary-container font-label-sm text-label-sm tracking-wider uppercase text-xs">Analysis Complete</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">ID: C-8842-X</span>
            </div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Lender Recommendations</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">AI-driven lender matching based on trust score, debt burden, and inferred repayment capacity.</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setCurrentPage('explainability')} className="bg-surface-container text-on-surface border border-outline-variant font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-surface-variant transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">security</span> View Risk Factors
            </button>
            <button onClick={() => alert('Dossier exported to PDF.')} className="bg-tertiary-container text-on-tertiary-container font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-tertiary-container/90 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span> Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto w-full px-container-padding-mobile md:px-container-padding-desktop py-8 gap-8 grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-8 flex flex-col gap-6">
          {recommendationCard(topRecommendation, 'Best-fit recommendation', true)}
          {recommendationCard(secondRecommendation, 'Secondary recommendation', false)}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-low card-border rounded-xl p-6">
            <h3 className="font-headline-md text-[18px] font-semibold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">data_usage</span> Market Context
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Recommendation Depth</span>
                  <span className="font-label-sm text-label-sm text-primary">{recommendations.length}</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-1.5">
                  <div className="bg-tertiary-container h-1.5 rounded-full" style={{ width: `${Math.min(100, recommendations.length * 25)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Top Approval Probability</span>
                  <span className="font-label-sm text-label-sm text-on-surface">{Math.round(topRecommendation?.approval_probability || 0)}%</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-1.5">
                  <div className="bg-outline h-1.5 rounded-full" style={{ width: `${topRecommendation?.approval_probability || 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low card-border rounded-xl p-6 flex flex-col h-[350px]">
            <h3 className="font-headline-md text-[18px] font-semibold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">smart_toy</span> Agent Copilot
            </h3>
            <div className="flex-grow overflow-y-auto mb-4 space-y-3 pr-1 text-xs">
              {messages.map((msg, idx) => (
                <div key={idx} className={`p-3 rounded-lg border max-w-[85%] whitespace-pre-wrap ${msg.sender === 'agent' ? 'bg-surface border-outline-variant/50 rounded-tl-none self-start text-on-surface' : 'bg-tertiary-container/20 border-tertiary-container/30 rounded-tr-none ml-auto text-tertiary'}`}>
                  <p>{msg.text}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSend} className="relative mt-auto">
              <input className="w-full bg-surface border border-outline-variant rounded-lg py-2 pl-3 pr-10 font-label-sm text-label-sm text-on-surface focus:outline-none focus:border-tertiary-container focus:ring-1 focus:ring-tertiary-container" placeholder="Ask agent..." type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
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
