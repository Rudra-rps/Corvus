import React, { useState } from 'react';
import SideNavBar from './components/SideNavBar';
import MobileHeader from './components/MobileHeader';
import BottomNavBar from './components/BottomNavBar';
import AgentStrip from './components/AgentStrip';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import UnderwritingCockpit from './pages/UnderwritingCockpit';
import BorrowerProfile from './pages/BorrowerProfile';
import FinancialDataCenter from './pages/FinancialDataCenter';
import AIIntelligenceEngine from './pages/AIIntelligenceEngine';
import AIExplainabilityReport from './pages/AIExplainabilityReport';
import LenderRecommendations from './pages/LenderRecommendations';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [session, setSession] = useState({
    user: null,
    dashboard: null,
    recommendations: [],
    explanations: null,
  });
  const [agentStatus, setAgentStatus] = useState({
    parsing: 'Standby',
    stability: 'Standby',
    risk: 'Standby',
  });

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setSession((prev) => ({ ...prev, user }));
    setCurrentPage(user?.name ? 'cockpit' : 'onboarding');
  };

  const handleProfileSaved = (user) => {
    setSession((prev) => ({ ...prev, user }));
    setCurrentPage('ingest');
  };

  const handleAnalysisLoaded = ({ dashboard, recommendations, explanations }) => {
    setSession((prev) => ({
      ...prev,
      dashboard,
      recommendations,
      explanations,
    }));
    setCurrentPage('engine');
  };

  const isDashboardLayout = isLoggedIn && currentPage !== 'landing';

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage setCurrentPage={setCurrentPage} />;
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} setCurrentPage={setCurrentPage} />;
      case 'cockpit':
        return <UnderwritingCockpit setCurrentPage={setCurrentPage} session={session} />;
      case 'onboarding':
        return (
          <BorrowerProfile
            setCurrentPage={setCurrentPage}
            user={session.user}
            onProfileSaved={handleProfileSaved}
          />
        );
      case 'ingest':
        return (
          <FinancialDataCenter
            setCurrentPage={setCurrentPage}
            setAgentStatus={setAgentStatus}
            user={session.user}
            onAnalysisLoaded={handleAnalysisLoaded}
          />
        );
      case 'engine':
        return <AIIntelligenceEngine setCurrentPage={setCurrentPage} setAgentStatus={setAgentStatus} />;
      case 'explainability':
        return <AIExplainabilityReport setCurrentPage={setCurrentPage} session={session} />;
      case 'lender':
        return <LenderRecommendations setCurrentPage={setCurrentPage} session={session} />;
      default:
        return <UnderwritingCockpit setCurrentPage={setCurrentPage} session={session} />;
    }
  };

  if (!isDashboardLayout) {
    return renderPage();
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col md:flex-row relative">
      <SideNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen relative">
        <MobileHeader setCurrentPage={setCurrentPage} />
        <main className="flex-1 flex flex-col relative">{renderPage()}</main>
        <AgentStrip
          parsingStatus={agentStatus.parsing}
          stabilityStatus={agentStatus.stability}
          riskStatus={agentStatus.risk}
        />
        <BottomNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
}
