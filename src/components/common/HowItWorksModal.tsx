import React from 'react';
import { X, CheckCircle2, ArrowRight, ShieldCheck, QrCode } from 'lucide-react';
import { GiveGetLogo } from './GiveGetLogo';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOnboarding: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onStartOnboarding,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      title: 'Create Your Business Profile',
      desc: 'Paste your Google Business or Yelp link. We pre-populate your business name, address, photos, and categories in seconds.',
    },
    {
      num: '02',
      title: 'Add Your Gives',
      desc: 'Tell us what your business can offer in exchange (e.g. $100 dining credit, chiropractic care, printing).',
    },
    {
      num: '03',
      title: 'Add Your Gets',
      desc: 'Tell us what your business needs (e.g. employee wellness, window cleaning, menu photography).',
    },
    {
      num: '04',
      title: 'Find a Match',
      desc: 'Discover complementary Marin businesses or let the Give & Get matching engine recommend high-fit partners.',
    },
    {
      num: '05',
      title: 'Agree on an Equal Amount',
      desc: 'Choose a standardized amount: $50 ↔ $50, $100 ↔ $100, $200 ↔ $200, $300 ↔ $300, or $500 ↔ $500.',
    },
    {
      num: '06',
      title: 'Exchange & Redeem Securely',
      desc: 'Each business gets a secure one-time QR certificate. If your bill exceeds the credit, pay only the difference directly to the merchant.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <GiveGetLogo variant="full" size="sm" showBetaBadge={true} />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How Give and Get Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Turn what your business has into what your business needs — without cash changing hands through the platform.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((s) => (
            <div
              key={s.num}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold text-blue-600">
                  {s.num}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{s.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Beta Notice & Tax Disclaimer */}
        <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs text-blue-950 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-blue-700">
            <ShieldCheck className="w-4 h-4" />
            <span>Free Marin County Beta</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Exchange values are entered and agreed upon directly by participating businesses. Businesses should consult their accountant regarding bookkeeping or tax reporting related to barter and trade transactions.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl cursor-pointer"
          >
            Close Guide
          </button>
          <button
            onClick={() => {
              onClose();
              onStartOnboarding();
            }}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer shadow-xs"
          >
            Join Marin Beta
          </button>
        </div>
      </div>
    </div>
  );
};
