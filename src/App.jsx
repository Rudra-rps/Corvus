import React, { useState } from 'react';
import SideNavBar from './components/SideNavBar';
import MobileHeader from './components/MobileHeader';
import BottomNavBar from './components/BottomNavBar';
import AgentStrip from './components/AgentStrip';

// Pages
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
  
  // Simulation statuses for the bottom agent consensus pipeline
  const [agentStatus, setAgentStatus] = useState({
    parsing: 'Standby',
    stability: 'Standby',
    risk: 'Standby'
  });

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('cockpit');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('landing');
  };

  // Determine if we should show the full dashboard shell (sidebar, bottom nav, mobile header)
  const isDashboardLayout = isLoggedIn && currentPage !== 'landing';

  // Render the current page component
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage setCurrentPage={setCurrentPage} />;
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} setCurrentPage={setCurrentPage} />;
      case 'cockpit':
        return <UnderwritingCockpit setCurrentPage={setCurrentPage} />;
      case 'onboarding':
        return <BorrowerProfile setCurrentPage={setCurrentPage} />;
      case 'ingest':
        return <FinancialDataCenter setCurrentPage={setCurrentPage} setAgentStatus={setAgentStatus} />;
      case 'engine':
        return <AIIntelligenceEngine setCurrentPage={setCurrentPage} setAgentStatus={setAgentStatus} />;
      case 'explainability':
        return <AIExplainabilityReport setCurrentPage={setCurrentPage} />;
      case 'lender':
        return <LenderRecommendations setCurrentPage={setCurrentPage} />;
      default:
        return <UnderwritingCockpit setCurrentPage={setCurrentPage} />;
    }
  };

  if (!isDashboardLayout) {
    // Public routes (Landing page or Login card page)
    return renderPage();
  }

  // Dashboard routes wrapped with sidebar navigation framework
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col md:flex-row relative">
      {/* Sidebar - Visible on Desktop only */}
      <SideNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen relative">
        {/* Mobile Header - Visible on Mobile only */}
        <MobileHeader setCurrentPage={setCurrentPage} />

        {/* Current Active Subpage */}
        <main className="flex-1 flex flex-col relative">
          {renderPage()}
        </main>

        {/* Bottom Consensus Pipeline strip */}
        <AgentStrip 
          parsingStatus={agentStatus.parsing} 
          stabilityStatus={agentStatus.stability} 
          riskStatus={agentStatus.risk} 
        />

        {/* Mobile Bottom Navigation Bar - Visible on Mobile only */}
        <BottomNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
}
