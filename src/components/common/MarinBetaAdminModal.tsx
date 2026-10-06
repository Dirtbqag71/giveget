import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  TrendingUp,
  Users,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Mail,
  ToggleLeft,
  ToggleRight,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { GiveGetLogo } from './GiveGetLogo';

interface MarinBetaAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarinBetaAdminModal: React.FC<MarinBetaAdminModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentBusiness, toggleAcceptingExchanges } = useApp();

  const [inviteBizName, setInviteBizName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  if (!isOpen) return null;

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviteSent(true);
    setTimeout(() => {
      setInviteBizName('');
      setInviteEmail('');
      setInviteSent(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <GiveGetLogo variant="icon" size="sm" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Marin County Beta & Network Admin
              </h2>
              <p className="text-xs text-slate-500">
                In partnership with <strong className="text-slate-800">Marin Buzz</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spec Launch Metrics Grid */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Marin County Network Liquidity
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-2xl font-extrabold text-slate-900 font-tabular">87</span>
              <p className="text-[11px] text-slate-500 font-medium">Marin Businesses</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-2xl font-extrabold text-slate-900 font-tabular">263</span>
              <p className="text-[11px] text-slate-500 font-medium">Active Gives</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-2xl font-extrabold text-slate-900 font-tabular">191</span>
              <p className="text-[11px] text-slate-500 font-medium">Active Gets</p>
            </div>

            <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200 text-center">
              <span className="text-2xl font-extrabold text-blue-700 font-tabular">$18,450</span>
              <p className="text-[11px] text-blue-600 font-semibold">Exchanged Value</p>
            </div>
          </div>
        </div>

        {/* Secondary metric stats */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <div>
            <span>Matches Created: <strong className="text-slate-900 font-tabular">418</strong></span>
            <span className="mx-2">·</span>
            <span>Exchanges Proposed: <strong className="text-slate-900 font-tabular">96</strong></span>
            <span className="mx-2">·</span>
            <span>Exchanges Completed: <strong className="text-emerald-700 font-tabular">54</strong></span>
          </div>

          <button
            onClick={() => alert('Exporting Marin Beta CSV ledger...')}
            className="text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>

        {/* Setting: Pause Exchanges Toggle (Spec Section 33) */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Accepting New Exchanges
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 max-w-sm">
              When turned OFF, existing certificates remain valid, but other businesses cannot send new proposals.
            </p>
          </div>

          <button
            onClick={() => toggleAcceptingExchanges(currentBusiness.id)}
            className="p-1 cursor-pointer"
          >
            {currentBusiness.acceptingExchanges ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                ON (Active)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-300">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                OFF (Paused)
              </span>
            )}
          </button>
        </div>

        {/* Invite a Business (Spec Section 34) */}
        <div className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Share2 className="w-4 h-4 text-blue-600" />
            Invite a Local Marin Business
          </h4>
          <p className="text-xs text-slate-500">
            Send an invitation link. When they join, {currentBusiness.name} will be suggested to trade immediately.
          </p>

          <form onSubmit={handleSendInvite} className="flex gap-2">
            <input
              type="text"
              value={inviteBizName}
              onChange={(e) => setInviteBizName(e.target.value)}
              placeholder="Business Name"
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
            />
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Contact Email"
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              SEND INVITE
            </button>
          </form>

          {inviteSent && (
            <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Invite sent to {inviteEmail}!
            </p>
          )}
        </div>

        {/* Tax Disclaimer */}
        <div className="p-4 bg-slate-100/60 rounded-2xl text-[11px] text-slate-500 leading-relaxed">
          <strong className="text-slate-700 block mb-0.5">Tax & Accounting Notice:</strong>
          Exchange values in Give and Get are mutually agreed upon by participating businesses. Businesses should consult their CPA or tax professional regarding bookkeeping, sales tax, or Form 1099-B obligations related to barter transactions.
        </div>
      </div>
    </div>
  );
};
