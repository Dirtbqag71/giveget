import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Plus,
  ShieldCheck,
  ChevronRight,
  QrCode,
  ScanLine,
} from 'lucide-react';
import { GiveGetLogo } from '../common/GiveGetLogo';

interface HomeDashboardProps {
  onViewMatch: () => void;
  onViewProfile: (businessId: string) => void;
  onProposeExchange: (businessId: string) => void;
  onOpenScanner: () => void;
  onNavigate: (tab: string) => void;
  onOpenSignUp?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onViewMatch,
  onViewProfile,
  onProposeExchange,
  onOpenScanner,
  onNavigate,
  onOpenSignUp,
}) => {
  const {
    currentBusiness,
    partnerBusiness,
    gives,
    gets,
    exchanges,
    certificates,
    auditLogs,
    switchActivePersona,
  } = useApp();

  const myGives = gives.filter((g) => g.businessId === currentBusiness.id);
  const myGets = gets.filter((g) => g.businessId === currentBusiness.id);
  const myActiveCredits = certificates.filter(
    (c) => c.recipientBusinessId === currentBusiness.id && c.status === 'ACTIVE'
  );
  const myRequests = exchanges.filter(
    (e) => e.receivingBusinessId === currentBusiness.id && e.status === 'PROPOSED'
  );
  const myCompleted = exchanges.filter(
    (e) =>
      (e.initiatingBusinessId === currentBusiness.id ||
        e.receivingBusinessId === currentBusiness.id) &&
      e.status === 'COMPLETE'
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Good morning, {currentBusiness.representative.firstName}.
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              Verified Local
            </span>
          </div>
          <p className="text-base font-semibold text-blue-600 mt-0.5">
            {currentBusiness.name}
            <span className="text-slate-400 font-normal ml-2">
              · {currentBusiness.city}, Marin County, CA
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {onOpenSignUp && (
            <button
              onClick={onOpenSignUp}
              className="px-3.5 py-2.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              Sign Up Business
            </button>
          )}

          <button
            onClick={onOpenScanner}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <ScanLine className="w-4 h-4" />
            Merchant QR Scanner
          </button>
        </div>
      </div>

      {/* 4 Mercury-style Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: New Matches */}
        <div
          onClick={onViewMatch}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              New Matches
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-tabular">
              3
            </span>
            <span className="text-xs font-semibold text-emerald-600">Top: 96% match</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Ready for equal trade</p>
        </div>

        {/* Card 2: Exchange Requests */}
        <div
          onClick={() => onNavigate('exchanges')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Exchange Requests
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-tabular">
              {myRequests.length > 0 ? myRequests.length : 2}
            </span>
            <span className="text-xs font-medium text-slate-500">Pending</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Requires your review</p>
        </div>

        {/* Card 3: Active Credits */}
        <div
          onClick={() => onNavigate('wallet')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Credits
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <QrCode className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-tabular">
              {myActiveCredits.length > 0 ? myActiveCredits.length : 4}
            </span>
            <span className="text-xs font-semibold text-blue-600">In your wallet</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Single-use QR codes</p>
        </div>

        {/* Card 4: Completed Exchanges */}
        <div
          onClick={() => onNavigate('exchanges')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Completed Exchanges
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-tabular">
              {12 + myCompleted.length}
            </span>
            <span className="text-xs font-semibold text-emerald-600">100% honored</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Marin network total</p>
        </div>
      </div>

      {/* BEST MATCHES SECTION - Exact Spec Match */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Best Matches
            </h2>
            <p className="text-xs text-slate-500">
              Businesses offering what you need and seeking what you have in Marin County.
            </p>
          </div>
          <button
            onClick={() => onNavigate('discover')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            Browse all 87 businesses
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* First Card: Marin Spine and Wellness (96% Match) */}
        <div className="bg-white rounded-2xl border border-blue-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden">
          {/* Top highlight accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  96% MATCH
                </span>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs font-medium text-slate-600">
                  {partnerBusiness.category} · {partnerBusiness.city}, CA
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {partnerBusiness.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                  {partnerBusiness.description}
                </p>
              </div>

              {/* Match alignment grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    They Give ({partnerBusiness.name})
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    {partnerBusiness.id === 'tipsy-dumpling'
                      ? 'Chinese Food & Dim Sum Credit'
                      : 'Chiropractic Services'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {partnerBusiness.id === 'tipsy-dumpling'
                      ? 'Handmade dim sum & authentic cuisine'
                      : 'Spinal adjustments & wellness care'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    They Want ({partnerBusiness.name})
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    {partnerBusiness.id === 'tipsy-dumpling'
                      ? 'Chiropractic & Wellness Services'
                      : 'Chinese Food / Restaurant Credit'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {partnerBusiness.id === 'tipsy-dumpling'
                      ? 'For employee physical health'
                      : 'For staff dining & team meals'}
                  </p>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                    You Offer ({currentBusiness.name})
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    {currentBusiness.id === 'tipsy-dumpling'
                      ? 'Chinese Food & Dim Sum Credit'
                      : 'Chiropractic Services Credit'}
                  </p>
                  <p className="text-[11px] text-blue-600">Direct equal-value trade</p>
                </div>
              </div>

              {/* Available Values */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-slate-600">Available Values:</span>
                <div className="flex items-center gap-1.5">
                  {[50, 100, 200, 300, 500].map((val) => (
                    <span
                      key={val}
                      className={`px-2 py-0.5 rounded text-xs font-bold font-tabular ${
                        val === 100
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      ${val}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Match CTA buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 justify-center">
              <button
                onClick={onViewMatch}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                VIEW MATCH
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onViewProfile(partnerBusiness.id)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                View Business Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE GIVES & GETS 2-COLUMN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* YOUR ACTIVE GIVES */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Your Active Gives
              </h3>
              <p className="text-xs text-slate-500">
                What your business offers in exchange for credits
              </p>
            </div>
            <button
              onClick={() => onNavigate('gives')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              Manage Gives
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {myGives.map((give) => (
              <div
                key={give.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{give.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{give.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    ACTIVE
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-500 font-medium">Denominations:</span>
                  {give.amounts.map((amt) => (
                    <span
                      key={amt}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold font-tabular text-slate-800"
                    >
                      ${amt}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* YOUR ACTIVE GETS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Your Active Gets
              </h3>
              <p className="text-xs text-slate-500">
                Products and services your business currently needs
              </p>
            </div>
            <button
              onClick={() => onNavigate('gets')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              Manage Gets
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {myGets.map((get) => (
              <div
                key={get.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{get.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{get.useType} · {get.locationArea}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {get.matchCount} matches
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Recent Activity
        </h3>

        <div className="divide-y divide-slate-100">
          {auditLogs.slice(0, 4).map((log) => (
            <div key={log.id} className="py-3 flex items-start gap-3 text-xs">
              <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <p className="text-slate-900 font-medium">{log.details}</p>
                <span className="text-slate-400 text-[11px]">
                  {new Date(log.timestamp).toLocaleDateString()} at{' '}
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
