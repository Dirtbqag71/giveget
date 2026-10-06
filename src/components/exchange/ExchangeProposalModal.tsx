import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Business, ExchangeAmount } from '../../types';
import { ArrowUpDown, ShieldCheck, X, Check, Info } from 'lucide-react';
import { GiveGetLogo } from '../common/GiveGetLogo';

interface ExchangeProposalModalProps {
  targetBusiness: Business;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (exchangeId: string) => void;
}

export const ExchangeProposalModal: React.FC<ExchangeProposalModalProps> = ({
  targetBusiness,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentBusiness, proposeExchange } = useApp();
  const [selectedAmount, setSelectedAmount] = useState<ExchangeAmount>(100);
  const [note, setNote] = useState<string>('Looking forward to trying your services and building a great local trading relationship.');
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const amounts: ExchangeAmount[] = [50, 100, 200, 300, 500];

  const handleConfirm = () => {
    setSubmitting(true);
    setTimeout(() => {
      const res = proposeExchange(targetBusiness.id, selectedAmount, note);
      setSubmitting(false);
      onSuccess(res.exchange.id);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              New Trade Proposal
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">Marin County, CA</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              Exchange with {targetBusiness.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select an equal value to exchange. Both businesses receive credits of matching worth.
            </p>
          </div>

          {/* Amount Selector - Spec: Large selectable amount buttons, Blue fill when selected */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5 text-center">
              How much would you like to exchange?
            </label>
            <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
              {amounts.map((amt) => {
                const isSelected = selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedAmount(amt)}
                    className={`py-3 px-2 rounded-xl font-bold text-base sm:text-lg transition-all duration-150 cursor-pointer flex flex-col items-center justify-center border font-tabular ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-102 ring-2 ring-blue-600/20'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>${amt}</span>
                    {isSelected && (
                      <span className="text-[10px] font-semibold tracking-wide uppercase opacity-90">
                        Selected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wise-inspired "You Give / You Get" Transaction Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-5 space-y-4">
            {/* YOU GIVE */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  YOU GIVE
                </span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {currentBusiness.name}
                </p>
                <p className="text-xs text-slate-500">
                  ${selectedAmount} Business Credit
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900 font-tabular">
                  ${selectedAmount}
                </span>
                <span className="block text-[11px] text-slate-400 font-medium">Equal Credit</span>
              </div>
            </div>

            {/* Exchange Symbol Divider */}
            <div className="relative flex items-center justify-center -my-2 z-10">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white shadow-xs flex items-center justify-center border-4 border-slate-50">
                <ArrowUpDown className="w-4 h-4" />
              </div>
            </div>

            {/* YOU GET */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">
                  YOU GET
                </span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {targetBusiness.name}
                </p>
                <p className="text-xs text-slate-500">
                  ${selectedAmount} Service Credit
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-blue-600 font-tabular">
                  ${selectedAmount}
                </span>
                <span className="block text-[11px] text-blue-500 font-medium">Equal Credit</span>
              </div>
            </div>

            {/* Exchange Summary line */}
            <div className="pt-2 text-center border-t border-slate-200">
              <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-800">
                <span>Exchange Value:</span>
                <span className="text-blue-600 font-tabular font-extrabold">
                  ${selectedAmount} ↔ ${selectedAmount}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                No cash is processed through Give and Get. Free during beta.
              </p>
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Note for {targetBusiness.representative.firstName} (Optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a friendly note about what you're looking to exchange..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? 'Sending Proposal...' : `Confirm $${selectedAmount} Exchange`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
