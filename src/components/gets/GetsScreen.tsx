import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Get, ExchangeAmount } from '../../types';
import { Plus, Sparkles, CheckCircle2, ArrowRight, X, Search, ShieldCheck } from 'lucide-react';

interface GetsScreenProps {
  onViewMatchForGet?: (get: Get) => void;
}

export const GetsScreen: React.FC<GetsScreenProps> = ({ onViewMatchForGet }) => {
  const { currentBusiness, gets, createGet, setActiveTab } = useApp();
  const myGets = gets.filter((g) => g.businessId === currentBusiness.id);

  const [isAdding, setIsAdding] = useState(false);
  const [conversationalInput, setConversationalInput] = useState(
    'We need a chiropractor for one of our employees.'
  );

  // Simulated AI interpretation derived from the prompt
  const getInterpretation = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('chiro') || lower.includes('back') || lower.includes('wellness') || lower.includes('doctor')) {
      return {
        title: 'Chiropractic & Wellness Services',
        category: 'Chiropractic / Healthcare',
        use: 'Employee Wellness',
        area: 'Marin County, CA',
        amounts: [50, 100, 200, 300, 500] as ExchangeAmount[],
      };
    }
    if (lower.includes('photo') || lower.includes('video') || lower.includes('shoot') || lower.includes('instagram')) {
      return {
        title: 'Commercial Photography & Video',
        category: 'Photography & Video',
        use: 'Marketing & Brand Media',
        area: 'Marin County, CA',
        amounts: [100, 200, 300, 500] as ExchangeAmount[],
      };
    }
    if (lower.includes('clean') || lower.includes('window') || lower.includes('wash')) {
      return {
        title: 'Commercial Cleaning Services',
        category: 'Commercial Cleaning',
        use: 'Facility Maintenance',
        area: 'Central Marin, CA',
        amounts: [50, 100, 200] as ExchangeAmount[],
      };
    }
    if (lower.includes('print') || lower.includes('menu') || lower.includes('sign') || lower.includes('card')) {
      return {
        title: 'Commercial Printing & Signage',
        category: 'Printing & Signage',
        use: 'Marketing Collateral',
        area: 'Marin County, CA',
        amounts: [50, 100, 200, 300, 500] as ExchangeAmount[],
      };
    }
    return {
      title: 'Local B2B Professional Services',
      category: 'Business Services',
      use: 'Operations Support',
      area: 'Marin County, CA',
      amounts: [50, 100, 200, 300, 500] as ExchangeAmount[],
    };
  };

  const interpretation = getInterpretation(conversationalInput);

  const handleSaveGet = () => {
    createGet({
      title: interpretation.title,
      rawText: conversationalInput,
      interpretedCategory: interpretation.category,
      useType: interpretation.use,
      locationArea: interpretation.area,
      compatibleAmounts: interpretation.amounts,
      active: true,
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Gets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Tell Give and Get what products or services your business wants in Marin County.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add New Get
        </button>
      </div>

      {/* List of Gets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {myGets.map((get) => (
          <div
            key={get.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 shadow-xs hover:border-blue-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {get.interpretedCategory}
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {get.matchCount} matches
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-2">{get.title}</h3>
              <p className="text-xs text-slate-600 italic mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                "{get.rawText}"
              </p>

              <div className="mt-3 text-xs space-y-1 text-slate-500">
                <p>Use: <strong className="text-slate-800">{get.useType}</strong></p>
                <p>Area: <strong className="text-slate-800">{get.locationArea}</strong></p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Created {new Date(get.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => setActiveTab('discover')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Matches
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CONVERSATIONAL CREATE GET MODAL (Exact Spec Design) */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Conversational Request
              </span>
              <button
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Spec Headline */}
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                What does your business need?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Describe in plain English what you want from another Marin business.
              </p>
            </div>

            {/* Large text box */}
            <div>
              <textarea
                rows={3}
                value={conversationalInput}
                onChange={(e) => setConversationalInput(e.target.value)}
                placeholder="e.g. We need a chiropractor for one of our employees."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <div className="flex gap-2 mt-2">
                <span className="text-[11px] text-slate-400">Sample ideas:</span>
                {[
                  'We need a chiropractor for an employee',
                  'Need food photography for our new menu',
                  'Looking for monthly storefront window cleaning',
                ].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setConversationalInput(sample)}
                    className="text-[11px] text-blue-600 hover:underline truncate max-w-[140px] cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Spec AI Interpretation Card */}
            <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200/80 space-y-2.5 text-xs">
              <div className="flex items-center gap-1.5 text-blue-700 font-bold uppercase text-[10px] tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                AI Interpretation
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px]">Category:</span>
                  <strong className="text-slate-900">{interpretation.category}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Use:</span>
                  <strong className="text-slate-900">{interpretation.use}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Area:</span>
                  <strong className="text-slate-900">{interpretation.area}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Compatible Values:</span>
                  <strong className="text-blue-700 font-tabular">$50, $100, $200, $300, $500</strong>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveGet}
                className="flex-1 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer shadow-xs"
              >
                SAVE GET
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
