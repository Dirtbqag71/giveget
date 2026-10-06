import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ArrowUpDown,
  Building,
  ShieldCheck,
  MapPin,
} from 'lucide-react';

interface MatchDetailViewProps {
  onBack: () => void;
  onProposeExchange: (businessId: string) => void;
  onViewProfile: (businessId: string) => void;
}

export const MatchDetailView: React.FC<MatchDetailViewProps> = ({
  onBack,
  onProposeExchange,
  onViewProfile,
}) => {
  const { currentBusiness, partnerBusiness } = useApp();

  const getOfferingForBusiness = (bizId: string) => {
    if (bizId === 'tipsy-dumpling') {
      return {
        givesTitle: 'Chinese Food & Dim Sum Credit',
        givesDesc: 'Handmade dim sum, Taiwanese specialties & craft teas',
        needsTitle: 'Chiropractic & Wellness Services',
        needsDesc: 'Spinal adjustments and recovery for kitchen team',
      };
    }
    if (bizId === 'marin-spine') {
      return {
        givesTitle: 'Chiropractic Services & Wellness',
        givesDesc: 'Integrative spinal decompression & postural rehab',
        needsTitle: 'Chinese Food & Restaurant Credit',
        needsDesc: 'Team dining and staff appreciation meals',
      };
    }
    return {
      givesTitle: 'Business Service Credit',
      givesDesc: 'Verified goods & services credit',
      needsTitle: 'Local B2B Services',
      needsDesc: 'Complementary local exchange',
    };
  };

  const currentInfo = getOfferingForBusiness(currentBusiness.id);
  const partnerInfo = getOfferingForBusiness(partnerBusiness.id);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl border border-blue-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-8">
        {/* Match Header Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-4 h-4 text-blue-600" />
            96% DIRECT MATCH
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mutual Trade Opportunity
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Give and Get analyzed active Gives & Gets across Marin County and found exceptional complementarity.
          </p>
        </div>

        {/* Visual Business A ↔ Business B Exchange Bridge */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Left: Current Business */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-1">
            <div
              className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center font-bold text-white text-base shadow-xs"
              style={{ backgroundColor: currentBusiness.accentColor || '#2563EB' }}
            >
              {currentBusiness.logoInitial}
            </div>
            <h3 className="text-base font-bold text-slate-900 pt-1">
              {currentBusiness.name}
            </h3>
            <p className="text-xs text-slate-500">{currentBusiness.city}, CA</p>
            <div className="mt-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Offers</span>
              <span className="font-semibold text-slate-800">{currentInfo.givesTitle}</span>
            </div>
          </div>

          {/* Center: Exchange Arrow Bridge */}
          <div className="text-center flex flex-col items-center justify-center py-2">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-md flex items-center justify-center mb-1">
              <ArrowUpDown className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-blue-700 tracking-wide uppercase">
              Equal Value
            </span>
            <span className="text-sm font-bold text-slate-900 font-tabular">$100 ↔ $100</span>
          </div>

          {/* Right: Partner Business */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-1">
            <div
              className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center font-bold text-white text-base shadow-xs"
              style={{ backgroundColor: partnerBusiness.accentColor || '#3B82F6' }}
            >
              {partnerBusiness.logoInitial}
            </div>
            <h3 className="text-base font-bold text-slate-900 pt-1">
              {partnerBusiness.name}
            </h3>
            <p className="text-xs text-slate-500">{partnerBusiness.city}, CA</p>
            <div className="mt-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Offers</span>
              <span className="font-semibold text-blue-600">{partnerInfo.givesTitle}</span>
            </div>
          </div>
        </div>

        {/* Why This Works - Accurate attribution based on each business */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Why this works:
          </h2>

          <div className="space-y-3">
            {[
              `Tipsy Dumpling offers Chinese food & handmade dim sum credit.`,
              `Marin Spine and Wellness provides chiropractic care & wellness services.`,
              `Tipsy Dumpling needs chiropractic services for employee back wellness.`,
              `Marin Spine and Wellness wants Chinese food & restaurant credit for team dining.`,
              `Both businesses support $100 equal-value exchanges.`,
              `Both businesses are located locally in Marin County.`,
            ].map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200/80 text-xs sm:text-sm text-slate-800 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary CTA from Spec */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onProposeExchange(partnerBusiness.id)}
            className="flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            PROPOSE $100 EXCHANGE
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onViewProfile(partnerBusiness.id)}
            className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
          >
            View Business Profile
          </button>
        </div>
      </div>
    </div>
  );
};
