import React from 'react';
import { useApp } from '../../context/AppContext';
import { Business, ExchangeAmount } from '../../types';
import {
  ShieldCheck,
  Star,
  CheckCircle2,
  MapPin,
  Phone,
  Globe,
  MessageSquare,
  ArrowUpDown,
  ThumbsUp,
  Clock,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

interface BusinessProfileViewProps {
  businessId: string;
  onBack: () => void;
  onProposeExchange: (businessId: string) => void;
  onOpenMessage: (businessId: string) => void;
}

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  businessId,
  onBack,
  onProposeExchange,
  onOpenMessage,
}) => {
  const { businesses, gives, gets } = useApp();

  const business = businesses.find((b) => b.id === businessId) || businesses[1];
  const businessGives = gives.filter((g) => g.businessId === business.id);
  const businessGets = gets.filter((g) => g.businessId === business.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Business Discovery
      </button>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Cover Band */}
        <div className="h-40 sm:h-48 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 relative p-6 flex flex-col justify-between text-white">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Marin Business
            </span>
            <span className="text-xs font-medium text-blue-100">
              Member since {business.memberSince}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-blue-100">
            <MapPin className="w-4 h-4 text-blue-200" />
            <span>{business.address}, {business.city}, {business.state} {business.zip}</span>
          </div>
        </div>

        {/* Profile Info Bar */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            <div className="flex items-end gap-4">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center font-extrabold text-white text-2xl sm:text-3xl shadow-lg ring-4 ring-white shrink-0"
                style={{ backgroundColor: business.accentColor || '#2563EB' }}
              >
                {business.logoInitial}
              </div>

              <div className="pt-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {business.name}
                </h1>
                <p className="text-sm font-semibold text-blue-600">
                  {business.category}
                </p>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenMessage(business.id)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-slate-500" />
                Message Business
              </button>
              <button
                onClick={() => onProposeExchange(business.id)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <ArrowUpDown className="w-4 h-4" />
                Propose Exchange
              </button>
            </div>
          </div>

          {/* Representative & Contact metadata row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Authorized Representative</span>
              <p className="font-bold text-slate-900 mt-0.5">
                {business.representative.firstName} {business.representative.lastName}
              </p>
              <p className="text-slate-500">{business.representative.jobTitle}</p>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Direct Phone</span>
              <p className="font-bold text-slate-900 mt-0.5">{business.phone}</p>
              <p className="text-slate-500">Verified Mobile</p>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Official Website</span>
              <a
                href={business.website}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-blue-600 hover:underline mt-0.5 block truncate"
              >
                {business.website.replace('https://', '')}
              </a>
              <p className="text-slate-500">Local Domain</p>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Accepting Trades</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Active in Network
              </span>
              <p className="text-slate-500">Equal values</p>
            </div>
          </div>

          {/* Exchange Reputation Box - Exact spec numbers */}
          <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Exchange Reputation & Trust Score
            </h3>

            <div className="grid grid-cols-3 gap-4 text-center divide-x divide-slate-200">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-tabular block">
                  {business.completedExchanges}
                </span>
                <span className="text-xs text-slate-600 font-medium">Successful Exchanges</span>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-tabular">
                    {business.rating}
                  </span>
                </div>
                <span className="text-xs text-slate-600 font-medium">Network Rating</span>
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-tabular block">
                  {business.tradeAgainPct}%
                </span>
                <span className="text-xs text-slate-600 font-medium">Would Trade Again</span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">About</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {business.description}
            </p>
          </div>

          {/* Available Gives & Looking For Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Available Gives */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
                Available Gives
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {businessGives[0]?.title || `${business.name} Service Credit`}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {businessGives[0]?.description || 'Use toward eligible appointments and services.'}
              </p>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Exchange Values Supported:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {business.supportedAmounts.map((amt) => (
                    <span
                      key={amt}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold font-tabular"
                    >
                      ${amt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Looking For */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Looking For (Gets)
              </span>
              <ul className="space-y-2 text-xs text-slate-700">
                {businessGets.length > 0 ? (
                  businessGets.map((g) => (
                    <li key={g.id} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{g.title} ({g.useType})</span>
                    </li>
                  ))
                ) : business.id === 'tipsy-dumpling' ? (
                  <>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Chiropractic Services (Employee Wellness)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Food Photography & Instagram Video</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Commercial Window Cleaning</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Chinese Food & Restaurant Dining Credit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Commercial Photography & Video</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Patient Brochure Printing & Signage</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
