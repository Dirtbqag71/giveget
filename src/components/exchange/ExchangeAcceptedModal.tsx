import React from 'react';
import { useApp } from '../../context/AppContext';
import { Exchange, Certificate } from '../../types';
import { CheckCircle2, ArrowRight, ShieldCheck, QrCode } from 'lucide-react';
import { GiveGetLogo } from '../common/GiveGetLogo';

interface ExchangeAcceptedModalProps {
  exchange: Exchange;
  certA: Certificate;
  certB: Certificate;
  onClose: () => void;
  onViewCredit: (certificateId: string) => void;
  onViewExchange: (exchangeId: string) => void;
}

export const ExchangeAcceptedModal: React.FC<ExchangeAcceptedModalProps> = ({
  exchange,
  certA,
  certB,
  onClose,
  onViewCredit,
  onViewExchange,
}) => {
  const { businesses, currentBusiness } = useApp();

  const initBiz = businesses.find((b) => b.id === exchange.initiatingBusinessId);
  const recvBiz = businesses.find((b) => b.id === exchange.receivingBusinessId);

  // Determine which certificate belongs to the current viewer
  const myCert = certA.recipientBusinessId === currentBusiness.id ? certA : certB;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-blue-200 overflow-hidden text-center p-6 sm:p-8"
        style={{
          background: 'linear-gradient(180deg, #F0F7FF 0%, #FFFFFF 35%, #FFFFFF 100%)',
        }}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-40 bg-blue-400/15 blur-3xl pointer-events-none rounded-full" />

        {/* Brand Icon & Celebration Marker */}
        <div className="relative mb-5 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-md flex items-center justify-center mb-3">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-blue-600">
            Exchange Approved & Confirmed
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            YOU'VE GOT A DEAL
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Your Give and Get certificates are ready to use.
          </p>
        </div>

        {/* Deal Summary Card */}
        <div className="p-5 bg-white rounded-2xl border border-blue-100 shadow-xs mb-6 text-left space-y-3.5">
          {/* Header 100 ↔ 100 */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="text-left">
              <span className="text-xs text-slate-500 font-medium block">{initBiz?.name}</span>
              <span className="text-xl font-extrabold text-slate-900 font-tabular">${exchange.amount}</span>
            </div>
            <div className="px-3 py-1 bg-blue-50 text-blue-700 font-extrabold text-sm rounded-full border border-blue-200">
              ↔
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-medium block">{recvBiz?.name}</span>
              <span className="text-xl font-extrabold text-blue-600 font-tabular">${exchange.amount}</span>
            </div>
          </div>

          {/* Two certificates details */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>
                  <strong className="text-slate-900">{exchange.initiatingRepName}</strong> receives:
                </span>
              </div>
              <span className="font-bold text-slate-900">
                ${exchange.amount} {recvBiz?.name} Credit
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>
                  <strong className="text-slate-900">{exchange.receivingRepName}</strong> receives:
                </span>
              </div>
              <span className="font-bold text-blue-600">
                ${exchange.amount} {initBiz?.name} Credit
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Two unique, single-use QR certificates generated & saved to wallet.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => onViewCredit(myCert.id)}
            className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-sm transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            View My Credit (${exchange.amount})
          </button>

          <button
            onClick={() => onViewExchange(exchange.id)}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            View Exchange Details
          </button>
        </div>
      </div>
    </div>
  );
};
