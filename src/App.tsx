import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { GiveGetLogo } from './components/common/GiveGetLogo';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { DiscoverScreen } from './components/discover/DiscoverScreen';
import { BusinessProfileView } from './components/profile/BusinessProfileView';
import { MatchDetailView } from './components/match/MatchDetailView';
import { ExchangesDashboard } from './components/exchange/ExchangesDashboard';
import { CertificateWallet } from './components/wallet/CertificateWallet';
import { GivesScreen } from './components/gives/GivesScreen';
import { GetsScreen } from './components/gets/GetsScreen';
import { MessagesScreen } from './components/messages/MessagesScreen';
import { ExchangeProposalModal } from './components/exchange/ExchangeProposalModal';
import { ExchangeAcceptedModal } from './components/exchange/ExchangeAcceptedModal';
import { MerchantRedemptionModal } from './components/redemption/MerchantRedemptionModal';
import { OnboardingWizardModal } from './components/onboarding/OnboardingWizardModal';
import { HowItWorksModal } from './components/common/HowItWorksModal';
import { MarinBetaAdminModal } from './components/common/MarinBetaAdminModal';

import {
  Home,
  Compass,
  ArrowUpDown,
  QrCode,
  Gift,
  Search,
  MessageSquare,
  Building,
  Settings,
  Sparkles,
  HelpCircle,
  Plus,
  ScanLine,
  Bell,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  User,
  RotateCw,
} from 'lucide-react';

function AppContent() {
  const {
    currentBusiness,
    partnerBusiness,
    businesses,
    activeTab,
    setActiveTab,
    selectedBusinessIdForProfile,
    setSelectedBusinessIdForProfile,
    switchActivePersona,
    latestAcceptedExchange,
    clearLatestAcceptedExchange,
    certificates,
  } = useApp();

  // Navigation Drawer for mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [proposalTargetId, setProposalTargetId] = useState<string>(partnerBusiness.id);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [preSelectedCertForScanner, setPreSelectedCertForScanner] = useState<string | undefined>(undefined);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);

  // Handle open proposal
  const handleOpenProposal = (targetId?: string) => {
    setProposalTargetId(targetId || partnerBusiness.id);
    setIsProposalOpen(true);
  };

  const handleOpenScanner = (certId?: string) => {
    setPreSelectedCertForScanner(certId);
    setIsScannerOpen(true);
  };

  const targetBizForProposal =
    businesses.find((b) => b.id === proposalTargetId) || partnerBusiness;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'gives', label: 'My Gives', icon: Gift },
    { id: 'gets', label: 'My Gets', icon: Search },
    { id: 'match', label: 'Matches', icon: Sparkles, badge: '96%' },
    { id: 'wallet', label: 'My Credits', icon: QrCode },
    { id: 'exchanges', label: 'Exchanges', icon: ArrowUpDown },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'profile', label: 'Business Profile', icon: Building },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-[#172033]">
      {/* DEMO PERSONA TOP BANNER - Enables frictionless switching for evaluation */}
      <div className="bg-slate-900 text-white text-xs px-4 py-2 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-slate-300 font-medium hidden sm:inline">Interactive B2B Prototype:</span>
          <span>
            Active as <strong className="text-white">{currentBusiness.representative.firstName} {currentBusiness.representative.lastName}</strong> ({currentBusiness.name})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Sign Up Business</span>
            <span className="sm:hidden">Sign Up</span>
          </button>

          <button
            onClick={switchActivePersona}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            title="Switch business perspective to test dual-sided trade and acceptance"
          >
            <RotateCw className="w-3 h-3" />
            Switch to {currentBusiness.id === 'tipsy-dumpling' ? 'Marin Spine' : 'Tipsy Dumpling'}
          </button>

          <button
            onClick={() => setIsHowItWorksOpen(true)}
            className="text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">How It Works</span>
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT WRAPPER: Sidebar + Content */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* DESKTOP SIDEBAR - Mercury / Stripe inspired */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-[#E4EAF1] bg-white p-5 space-y-6 sticky top-9 h-[calc(100vh-36px)] overflow-y-auto">
          {/* Logo */}
          <div className="pb-2">
            <button
              onClick={() => {
                setActiveTab('home');
                setSelectedBusinessIdForProfile(null);
              }}
              className="text-left cursor-pointer"
            >
              <GiveGetLogo variant="full" size="md" showBetaBadge={true} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && !selectedBusinessIdForProfile;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSelectedBusinessIdForProfile(null);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-blue-100 text-blue-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Terminal Button in Sidebar */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="w-full py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-blue-200"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              Sign Up Business
            </button>

            <button
              onClick={() => handleOpenScanner()}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <ScanLine className="w-4 h-4" />
              Redeem QR Code
            </button>

            <button
              onClick={() => setIsAdminOpen(true)}
              className="w-full py-2 px-3 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              Marin Beta Admin & Stats
            </button>
          </div>

          {/* User Business Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs shrink-0"
              style={{ backgroundColor: currentBusiness.accentColor || '#2563EB' }}
            >
              {currentBusiness.logoInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {currentBusiness.name}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {currentBusiness.representative.firstName} {currentBusiness.representative.lastName}
              </p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT VIEWPORT */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top Mobile / Tablet Header Bar */}
          <header className="lg:hidden bg-white border-b border-[#E4EAF1] px-4 py-3 flex items-center justify-between sticky top-9 z-30">
            <button
              onClick={() => {
                setActiveTab('home');
                setSelectedBusinessIdForProfile(null);
              }}
              className="cursor-pointer"
            >
              <GiveGetLogo variant="wordmark" size="sm" showBetaBadge={true} />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenScanner()}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl cursor-pointer"
                title="Scan QR"
              >
                <ScanLine className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                title="Messages"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </header>

          {/* Mobile Drawer Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-2 animate-in slide-in-from-top-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSelectedBusinessIdForProfile(null);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                    activeTab === item.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 text-blue-600" />
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => {
                    setIsAdminOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl text-center"
                >
                  Admin Stats
                </button>
                <button
                  onClick={() => {
                    setIsHowItWorksOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl text-center"
                >
                  How It Works
                </button>
              </div>
            </div>
          )}

          {/* Content View Container */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
            {/* If looking at a single business profile */}
            {selectedBusinessIdForProfile ? (
              <BusinessProfileView
                businessId={selectedBusinessIdForProfile}
                onBack={() => setSelectedBusinessIdForProfile(null)}
                onProposeExchange={(bId) => handleOpenProposal(bId)}
                onOpenMessage={(bId) => {
                  setSelectedBusinessIdForProfile(null);
                  setActiveTab('messages');
                }}
              />
            ) : (
              <>
                {activeTab === 'home' && (
                  <HomeDashboard
                    onViewMatch={() => setActiveTab('match')}
                    onViewProfile={(bId) => setSelectedBusinessIdForProfile(bId)}
                    onProposeExchange={(bId) => handleOpenProposal(bId)}
                    onOpenScanner={() => handleOpenScanner()}
                    onNavigate={(tab) => setActiveTab(tab)}
                    onOpenSignUp={() => setIsOnboardingOpen(true)}
                  />
                )}

                {activeTab === 'discover' && (
                  <DiscoverScreen
                    onSelectBusiness={(bId) => setSelectedBusinessIdForProfile(bId)}
                    onProposeExchange={(bId) => handleOpenProposal(bId)}
                  />
                )}

                {activeTab === 'match' && (
                  <MatchDetailView
                    onBack={() => setActiveTab('home')}
                    onProposeExchange={(bId) => handleOpenProposal(bId)}
                    onViewProfile={(bId) => setSelectedBusinessIdForProfile(bId)}
                  />
                )}

                {activeTab === 'wallet' && (
                  <CertificateWallet
                    onOpenScannerForCert={(cId) => handleOpenScanner(cId)}
                  />
                )}

                {activeTab === 'exchanges' && (
                  <ExchangesDashboard
                    onViewCredit={(cId) => {
                      setActiveTab('wallet');
                    }}
                    onOpenMessage={(bId) => {
                      setActiveTab('messages');
                    }}
                    onOpenScannerForCert={(cId) => handleOpenScanner(cId)}
                  />
                )}

                {activeTab === 'gives' && <GivesScreen />}

                {activeTab === 'gets' && (
                  <GetsScreen
                    onViewMatchForGet={() => setActiveTab('match')}
                  />
                )}

                {activeTab === 'messages' && (
                  <MessagesScreen
                    onProposeExchange={(bId) => handleOpenProposal(bId)}
                  />
                )}

                {activeTab === 'profile' && (
                  <BusinessProfileView
                    businessId={currentBusiness.id}
                    onBack={() => setActiveTab('home')}
                    onProposeExchange={() => handleOpenProposal(partnerBusiness.id)}
                    onOpenMessage={() => setActiveTab('messages')}
                  />
                )}
              </>
            )}
          </div>

          {/* Desktop Footer with Marin Buzz Co-Branding & Accounting Disclaimer */}
          <footer className="mt-auto border-t border-[#E4EAF1] bg-white px-6 py-6 text-xs text-slate-500">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <GiveGetLogo variant="wordmark" size="sm" showBetaBadge={false} />
                <span className="text-slate-300">·</span>
                <span>Free Beta for Marin County Businesses</span>
                <span className="text-slate-300">·</span>
                <span className="text-blue-600 font-semibold">Partner: Marin Buzz</span>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                <button
                  onClick={() => setIsHowItWorksOpen(true)}
                  className="hover:underline cursor-pointer"
                >
                  How It Works
                </button>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="hover:underline cursor-pointer"
                >
                  Network Metrics
                </button>
                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="hover:underline cursor-pointer text-blue-600 font-semibold"
                >
                  + Add Business
                </button>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (Spec Section 36) */}
      <nav className="lg:hidden bg-white border-t border-[#E4EAF1] px-2 py-1.5 flex items-center justify-around sticky bottom-0 z-40 shadow-md">
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'discover', label: 'Discover', icon: Compass },
          { id: 'gives', label: 'Gives', icon: Gift },
          { id: 'gets', label: 'Gets', icon: Search },
          { id: 'exchanges', label: 'Exchanges', icon: ArrowUpDown },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && !selectedBusinessIdForProfile;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSelectedBusinessIdForProfile(null);
              }}
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-bold cursor-pointer ${
                isActive ? 'text-blue-600' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* FLOATING ACTION BUTTON (+) FOR MOBILE (Spec Section 36) */}
      <div className="lg:hidden fixed bottom-16 right-4 z-40">
        <button
          onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center font-bold text-xl cursor-pointer"
        >
          {isPlusMenuOpen ? <X className="w-5 h-5" /> : <Plus className="w-6 h-6" />}
        </button>

        {isPlusMenuOpen && (
          <div className="absolute bottom-14 right-0 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1 animate-in fade-in slide-in-from-bottom-2">
            <button
              onClick={() => {
                setActiveTab('gives');
                setIsPlusMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 rounded-xl"
            >
              Create Give
            </button>
            <button
              onClick={() => {
                setActiveTab('gets');
                setIsPlusMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 rounded-xl"
            >
              Create Get
            </button>
            <button
              onClick={() => {
                handleOpenScanner();
                setIsPlusMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl"
            >
              Scan Certificate
            </button>
          </div>
        )}
      </div>

      {/* ALL INTERACTIVE MODALS */}
      {/* 1. Proposal Modal */}
      <ExchangeProposalModal
        targetBusiness={targetBizForProposal}
        isOpen={isProposalOpen}
        onClose={() => setIsProposalOpen(false)}
        onSuccess={(exId) => {
          setIsProposalOpen(false);
          setActiveTab('exchanges');
        }}
      />

      {/* 2. Acceptance Celebratory Modal */}
      {latestAcceptedExchange && (
        <ExchangeAcceptedModal
          exchange={latestAcceptedExchange.exchange}
          certA={latestAcceptedExchange.certA}
          certB={latestAcceptedExchange.certB}
          onClose={clearLatestAcceptedExchange}
          onViewCredit={(cId) => {
            clearLatestAcceptedExchange();
            setActiveTab('wallet');
          }}
          onViewExchange={(eId) => {
            clearLatestAcceptedExchange();
            setActiveTab('exchanges');
          }}
        />
      )}

      {/* 3. Merchant QR Redemption Terminal Modal */}
      <MerchantRedemptionModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        preSelectedCertificateId={preSelectedCertForScanner}
      />

      {/* 4. Onboarding Modal */}
      <OnboardingWizardModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={() => {
          setActiveTab('home');
        }}
      />

      {/* 5. How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onStartOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* 6. Marin Beta Admin Modal */}
      <MarinBetaAdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
