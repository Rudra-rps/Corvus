import { useEffect, useRef, useState } from 'react';
import { fetchRecommendations } from '../lib/api';

export default function LenderRecommendations({ setCurrentPage, session }) {
  const userId = session?.user?.id;

  const [recommendations, setRecommendations] = useState(session?.recommendations || []);
  const [loading, setLoading] = useState(Boolean(userId));
  const [fetchError, setFetchError] = useState('');

  // Always fetch fresh from API on mount so navigating directly to this page always works
  useEffect(() => {
    if (!userId) return;
    fetchRecommendations(userId)
      .then((res) => {
        setRecommendations(res.recommendations || []);
      })
      .catch((err) => setFetchError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const topRecommendation = recommendations[0];
  const secondRecommendation = recommendations[1];
  const otherRecommendations = recommendations.slice(2);
  const scoreStatus = topRecommendation?.score_status || session?.dashboard?.metrics?.score_status || 'pending';

  const [messages, setMessages] = useState([
    { sender: 'agent', text: "I've ranked the best lenders for this profile. Ask me to compare rates, collateral assumptions, or approval confidence." },
  ]);
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const userMsg = inputVal;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputVal('');
    setTimeout(() => {
      const lender = topRecommendation?.name || topRecommendation?.lender?.name || 'the top lender';
      setMessages((prev) => [
        ...prev,
        { sender: 'agent', text: `${lender} remains the strongest fit. The ranking is driven by trust score, DTI tolerance, and monthly income alignment.` },
      ]);
    }, 900);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const probabilityColor = (p) => {
    if (p >= 70) return 'text-emerald-400';
    if (p >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const probabilityBg = (p) => {
    if (p >= 70) return 'bg-emerald-500';
    if (p >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const probabilityLabel = (p) => {
    if (p >= 70) return { text: 'High Match', icon: 'check_circle', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
    if (p >= 50) return { text: 'Moderate Match', icon: 'adjust', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
    return { text: 'Low Match', icon: 'remove', cls: 'bg-red-500/15 text-red-300 border-red-500/30' };
  };

  // Pull lender name: from direct API shape or from nested lender object
  const getName = (item) => item?.name || item?.lender?.name || 'Unknown';

  const recommendationCard = (item, label) => {
    const prob = Math.round(item?.approval_probability || 0);
    const badge = probabilityLabel(prob);
    const name = getName(item);
    const lenderType = item?.lender_type || item?.lender?.lender_type || '';
    const website = item?.website || item?.lender?.website || '';
    const disbursalSpeed = item?.disbursal_speed || item?.lender?.disbursal_speed || '';
    const processingFeeRange = item?.processing_fee_range || '';
    const minTenure = item?.min_tenure_months || item?.lender?.min_tenure_months || '';
    const maxTenure = item?.max_tenure_months || item?.lender?.max_tenure_months || '';
    const minLoan = item?.min_loan_amount || item?.lender?.min_loan_amount || 0;
    const maxLoan = item?.max_loan_amount || item?.lender?.max_loan_amount || 0;

    return (
      <div key={name} className="bg-surface-container-low card-border rounded-xl p-6 relative overflow-hidden group hover:bg-surface-container transition-colors duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-container/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

        {/* Header row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center border border-outline-variant font-bold text-xl text-on-surface">
              {name.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">{name}</h3>
                {lenderType && (
                  <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-surface-variant border border-outline-variant/50 text-on-surface-variant">
                    {lenderType}
                  </span>
                )}
              </div>
              <p className="font-label-md text-label-md text-on-surface-variant">{label}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`px-3 py-1 rounded-full border font-label-sm text-label-sm flex items-center gap-1 ${badge.cls}`}>
              <span className="material-symbols-outlined text-[14px]">{badge.icon}</span>
              {badge.text}
            </span>
            <span className={`text-3xl font-bold tabular-nums ${probabilityColor(prob)}`}>{prob}%</span>
            <span className="text-[10px] text-on-surface-variant">approval probability</span>
          </div>
        </div>

        {/* Probability bar */}
        <div className="mb-5">
          <div className="w-full bg-surface-variant rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-700 ${probabilityBg(prob)}`}
              style={{ width: `${prob}%` }}
            ></div>
          </div>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-surface p-3 rounded-lg border border-outline-variant/50">
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Interest Rate</p>
            <p className="font-label-md text-label-md text-on-surface text-sm">{item?.interest_rate_range || '-'}</p>
          </div>
          <div className="bg-surface p-3 rounded-lg border border-outline-variant/50">
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Loan Amount</p>
            <p className="font-label-md text-label-md text-on-surface text-sm">
              {minLoan > 0 ? `INR ${(minLoan/1000).toFixed(0)}K` : '-'} - INR {maxLoan > 0 ? `${(maxLoan/100000).toFixed(0)}L` : '-'}
            </p>
          </div>
          <div className="bg-surface p-3 rounded-lg border border-outline-variant/50">
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Tenure</p>
            <p className="font-label-md text-label-md text-on-surface text-sm">
              {minTenure && maxTenure ? `${minTenure}-${maxTenure} mo` : '-'}
            </p>
          </div>
          <div className="bg-surface p-3 rounded-lg border border-outline-variant/50">
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Processing Fee</p>
            <p className="font-label-md text-label-md text-on-surface text-sm">{processingFeeRange || '-'}</p>
          </div>
        </div>

        {/* Disbursal badge */}
        {disbursalSpeed && (
          <div className="flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-[14px] text-tertiary">bolt</span>
            <span className="text-xs text-tertiary font-medium">{disbursalSpeed} disbursal</span>
          </div>
        )}

        {/* AI Reasoning */}
        <div className="bg-surface/50 border border-outline-variant/30 rounded-lg p-4 mb-5">
          <p className="font-label-sm text-label-sm text-primary mb-2 flex items-center gap-1 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">psychology</span> AI Reasoning
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant text-sm">
            {item?.explanation || 'Run an analysis to see lender-specific reasoning.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center gap-3 border-t border-outline-variant/30 pt-4">
          <button
            onClick={() => setCurrentPage('explainability')}
            className="bg-surface-variant text-on-surface border border-outline-variant font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-surface-container-highest transition-colors flex items-center gap-2 text-sm"
          >
            View Underwriting Factors
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-tertiary-container text-on-tertiary-container font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-tertiary-container/80 transition-colors flex items-center gap-2 text-sm"
            >
              Apply Now
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4 text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] text-primary animate-spin">sync</span>
          <p className="font-label-md text-label-md">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-grid-pattern min-h-screen flex flex-col pb-24 md:pb-8">
      {/* Header */}
      <div className="px-container-padding-mobile md:px-container-padding-desktop py-8 md:py-12 border-b border-outline-variant bg-surface-container-lowest/50 backdrop-blur-sm relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-tertiary-container/30 text-tertiary border border-tertiary-container font-label-sm text-label-sm tracking-wider uppercase text-xs">
                {recommendations.length > 0 ? 'Analysis Complete' : 'No Analysis Yet'}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full border font-label-sm text-label-sm tracking-wider uppercase text-xs ${
                scoreStatus === 'verified' ? 'bg-emerald-500/10 text-emerald-200 border-emerald-300/20' : 'bg-sky-500/10 text-sky-200 border-sky-300/20'
              }`}>
                {scoreStatus}
              </span>
            </div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Lender Recommendations</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
              AI-driven lender matching based on trust score, debt burden, and inferred repayment capacity.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setCurrentPage('explainability')} className="bg-surface-container text-on-surface border border-outline-variant font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-surface-variant transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">security</span> View Risk Factors
            </button>
            <button onClick={() => setCurrentPage('ingest')} className="bg-tertiary-container text-on-tertiary-container font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-tertiary-container/90 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">refresh</span> Re-analyse
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto w-full px-container-padding-mobile md:px-container-padding-desktop py-8 gap-8 grid grid-cols-1 lg:grid-cols-12">
        {/* Left - Cards */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {fetchError && (
            <div className="p-4 bg-red-500/10 border border-red-400/20 rounded-xl text-red-200 text-sm">{fetchError}</div>
          )}

          {recommendations.length === 0 && !loading ? (
            <div className="bg-surface-container-low card-border rounded-xl p-12 flex flex-col items-center text-center gap-4">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant">search_off</span>
              <h3 className="font-headline-md text-on-surface">No matches found yet</h3>
              <p className="text-on-surface-variant text-sm max-w-md">
                Run a Quick Estimate, Manual Snapshot, or CSV upload to generate lender recommendations for this profile.
              </p>
              <button
                onClick={() => setCurrentPage('ingest')}
                className="mt-2 bg-tertiary-container text-on-tertiary-container font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-tertiary-container/80 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span> Start Analysis
              </button>
            </div>
          ) : (
            <>
              {topRecommendation && recommendationCard(topRecommendation, 'Best-fit recommendation', true)}
              {secondRecommendation && recommendationCard(secondRecommendation, 'Secondary recommendation', false)}
              {otherRecommendations.map((r, i) => recommendationCard(r, `Match #${i + 3}`, false))}
            </>
          )}
        </div>

        {/* Right - Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Market Context */}
          <div className="bg-surface-container-low card-border rounded-xl p-6">
            <h3 className="font-headline-md text-[18px] font-semibold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">data_usage</span> Market Context
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Matched Lenders</span>
                  <span className="font-label-sm text-label-sm text-primary">{recommendations.length}</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-1.5">
                  <div className="bg-tertiary-container h-1.5 rounded-full" style={{ width: `${Math.min(100, recommendations.length * 7)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Top Approval Probability</span>
                  <span className={`font-label-sm text-label-sm ${probabilityColor(Math.round(topRecommendation?.approval_probability || 0))}`}>
                    {Math.round(topRecommendation?.approval_probability || 0)}%
                  </span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${probabilityBg(topRecommendation?.approval_probability || 0)}`} style={{ width: `${topRecommendation?.approval_probability || 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Score Confidence</span>
                  <span className="font-label-sm text-label-sm text-on-surface">{scoreStatus}</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-1.5">
                  <div className="bg-outline h-1.5 rounded-full" style={{ width: `${scoreStatus === 'verified' ? 92 : 68}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Copilot */}
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
