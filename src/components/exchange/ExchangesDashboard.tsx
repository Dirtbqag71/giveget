import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Exchange, Certificate } from '../../types';
import {
  ArrowUpDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  QrCode,
  Star,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Send,
} from 'lucide-react';

interface ExchangesDashboardProps {
  onViewCredit: (certificateId: string) => void;
  onOpenMessage: (businessId: string) => void;
  onOpenScannerForCert: (certificateId: string) => void;
}

export const ExchangesDashboard: React.FC<ExchangesDashboardProps> = ({
  onViewCredit,
  onOpenMessage,
  onOpenScannerForCert,
}) => {
  const {
    currentBusiness,
    businesses,
    exchanges,
    certificates,
    acceptExchange,
    declineExchange,
    submitRating,
    ratings,
    switchActivePersona,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'requests' | 'active' | 'completed'>('requests');
  const [selectedExchangeId, setSelectedExchangeId] = useState<string | null>(null);

  // Rating modal state
  const [ratingExchangeId, setRatingExchangeId] = useState<string | null>(null);
  const [honored, setHonored] = useState<boolean>(true);
  const [wouldTradeAgain, setWouldTradeAgain] = useState<boolean>(true);
  const [stars, setStars] = useState<number>(5);
  const [comment, setComment] = useState<string>('Seamless trade! Great communication and honored immediately.');

  // Filter exchanges
  const myExchanges = exchanges.filter(
    (e) =>
      e.initiatingBusinessId === currentBusiness.id ||
      e.receivingBusinessId === currentBusiness.id
  );

  const pendingRequests = myExchanges.filter(
    (e) => e.status === 'PROPOSED'
  );

  const activeTrades = myExchanges.filter(
    (e) => e.status === 'CERTIFICATES_ISSUED' || e.status === 'PARTIALLY_REDEEMED'
  );

  const completedTrades = myExchanges.filter(
    (e) => e.status === 'COMPLETE' || e.status === 'DECLINED'
  );

  const handleAccept = (eId: string) => {
    acceptExchange(eId);
  };

  const handleDecline = (eId: string) => {
    declineExchange(eId);
  };

  const handleSaveRating = () => {
    if (!ratingExchangeId) return;
    submitRating(ratingExchangeId, honored, wouldTradeAgain, stars, comment);
    setRatingExchangeId(null);
  };

  const selectedExchange = exchanges.find((e) => e.id === selectedExchangeId);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Exchanges & Transactions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor proposed equal trades, active certificates, and completed business exchanges.
          </p>
        </div>

        {/* Persona hint if tester needs to accept */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Active View:</span>
          <button
            onClick={switchActivePersona}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 rounded-xl text-xs font-bold text-blue-700 shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Click to toggle business perspective"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
            Switch to {currentBusiness.id === 'tipsy-dumpling' ? 'Marin Spine' : 'Tipsy Dumpling'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Requests</span>
          {pendingRequests.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 font-extrabold">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'active'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Active Trades</span>
          {activeTrades.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800 font-extrabold">
              {activeTrades.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'completed'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Completed History</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600 font-medium">
            {completedTrades.length}
          </span>
        </button>
      </div>

      {/* TAB 1: REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
              <Clock className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-bold text-slate-700">No pending exchange requests right now.</p>
              <p className="text-xs text-slate-500 mt-1">
                When another business proposes a trade or when you send one, it will appear here.
              </p>
            </div>
          ) : (
            pendingRequests.map((ex) => {
              const isReceiver = ex.receivingBusinessId === currentBusiness.id;
              const otherBizId = isReceiver ? ex.initiatingBusinessId : ex.receivingBusinessId;
              const otherBiz = businesses.find((b) => b.id === otherBizId);

              return (
                <div
                  key={ex.id}
                  className="bg-white rounded-2xl border border-blue-200/90 shadow-xs p-6 space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                        {isReceiver ? 'Incoming Exchange Request' : 'Proposal Sent — Awaiting Response'}
                      </span>
                      <span className="text-slate-400 font-mono text-xs">{ex.id}</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(ex.proposedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Spec Receiver Card: You Give / You Receive */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {isReceiver ? 'You Give' : 'They Receive'}
                      </span>
                      <p className="text-base font-extrabold text-slate-900">
                        ${ex.amount} {currentBusiness.name} Credit
                      </p>
                      <p className="text-xs text-slate-500">Equal trade credit</p>
                    </div>

                    <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                        {isReceiver ? 'You Receive' : 'You Receive'}
                      </span>
                      <p className="text-base font-extrabold text-blue-600">
                        ${ex.amount} {otherBiz?.name} Credit
                      </p>
                      <p className="text-xs text-slate-500">Representative: {ex.initiatingRepName}</p>
                    </div>
                  </div>

                  {ex.notes && (
                    <p className="text-xs text-slate-600 italic bg-white p-3 rounded-lg border border-slate-100">
                      "{ex.notes}"
                    </p>
                  )}

                  {/* Actions for Receiver */}
                  {isReceiver ? (
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        onClick={() => handleAccept(ex.id)}
                        className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        ACCEPT EXCHANGE (${ex.amount})
                      </button>

                      <button
                        onClick={() => handleDecline(ex.id)}
                        className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
                      >
                        DECLINE
                      </button>

                      <button
                        onClick={() => onOpenMessage(otherBizId)}
                        className="py-2.5 px-4 text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ml-auto"
                      >
                        <MessageSquare className="w-4 h-4" />
                        MESSAGE {ex.initiatingRepName.split(' ')[0]}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-500" />
                        Waiting for {otherBiz?.name} to accept. Switch persona at top to test acceptance!
                      </span>
                      <button
                        onClick={switchActivePersona}
                        className="text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        Log in as {otherBiz?.name} →
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: ACTIVE TRADES */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeTrades.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
              <QrCode className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-bold text-slate-700">No active trades currently in progress.</p>
              <p className="text-xs text-slate-500 mt-1">
                Accepted trades will show here with their active single-use QR certificates.
              </p>
            </div>
          ) : (
            activeTrades.map((ex) => {
              const otherBizId =
                ex.initiatingBusinessId === currentBusiness.id
                  ? ex.receivingBusinessId
                  : ex.initiatingBusinessId;
              const otherBiz = businesses.find((b) => b.id === otherBizId);

              const certsForThisEx = certificates.filter((c) => c.exchangeId === ex.id);
              const myCert = certsForThisEx.find(
                (c) => c.recipientBusinessId === currentBusiness.id
              );
              const theirCert = certsForThisEx.find(
                (c) => c.recipientBusinessId !== currentBusiness.id
              );

              return (
                <div
                  key={ex.id}
                  className="bg-white rounded-2xl border border-blue-200/90 shadow-xs p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-400 block">{ex.id}</span>
                      <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                        {currentBusiness.name} ↔ {otherBiz?.name}
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ${ex.amount} ↔ ${ex.amount} Active
                    </span>
                  </div>

                  {/* Both Certificates status badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {myCert && (
                      <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-blue-700 uppercase block">
                            Your Credit to Spend
                          </span>
                          <p className="text-xs font-bold text-slate-900 mt-0.5">
                            ${myCert.value} at {otherBiz?.name}
                          </p>
                          <span className="text-[11px] font-semibold text-emerald-600">
                            Status: {myCert.status}
                          </span>
                        </div>
                        <button
                          onClick={() => onViewCredit(myCert.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          Show QR
                        </button>
                      </div>
                    )}

                    {theirCert && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">
                            Their Credit at {currentBusiness.name}
                          </span>
                          <p className="text-xs font-bold text-slate-900 mt-0.5">
                            ${theirCert.value} held by {theirCert.recipientRepName}
                          </p>
                          <span className="text-[11px] font-semibold text-slate-600">
                            Status: {theirCert.status}
                          </span>
                        </div>
                        {theirCert.status === 'ACTIVE' && (
                          <button
                            onClick={() => onOpenScannerForCert(theirCert.id)}
                            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 text-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Redeem
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>
                      Accepted on {new Date(ex.acceptedAt || '').toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => setSelectedExchangeId(ex.id)}
                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      View Audit Timeline →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: COMPLETED HISTORY (Mercury / Wise Inspired) */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {completedTrades.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
              <CheckCircle2 className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-bold text-slate-700">No completed trades yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Completed exchanges where both single-use certificates were redeemed will appear here.
              </p>
            </div>
          ) : (
            completedTrades.map((ex) => {
              const otherBizId =
                ex.initiatingBusinessId === currentBusiness.id
                  ? ex.receivingBusinessId
                  : ex.initiatingBusinessId;
              const otherBiz = businesses.find((b) => b.id === otherBizId);
              const alreadyRated = ratings.some((r) => r.exchangeId === ex.id);

              return (
                <div
                  key={ex.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">{ex.id}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3" />
                          COMPLETE
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {currentBusiness.name} ↔ {otherBiz?.name}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-extrabold text-slate-900 font-tabular">
                        ${ex.amount} ↔ ${ex.amount}
                      </span>
                      <p className="text-[11px] text-slate-500">Equal value trade</p>
                    </div>
                  </div>

                  {/* Mercury Timeline details */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between text-slate-600">
                      <span>Proposed:</span>
                      <span>{new Date(ex.proposedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Accepted & Certificates Issued:</span>
                      <span>{new Date(ex.acceptedAt || ex.proposedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Final Redemption & Settlement:</span>
                      <span>{new Date(ex.completedAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Rating Callout */}
                  <div className="flex items-center justify-between pt-1">
                    {alreadyRated ? (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        Rating submitted for this trade
                      </span>
                    ) : (
                      <button
                        onClick={() => setRatingExchangeId(ex.id)}
                        className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        Rate this Exchange
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedExchangeId(ex.id)}
                      className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      View Timeline Details →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* DETAILED TIMELINE MODAL (Spec: Exchange History GG-10082) */}
      {selectedExchange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600">Exchange {selectedExchange.id}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Audit History & Timeline
                </h3>
              </div>
              <button
                onClick={() => setSelectedExchangeId(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                <span className="text-slate-500">Trade Value:</span>
                <span className="font-bold text-slate-900 font-tabular">${selectedExchange.amount} ↔ ${selectedExchange.amount}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                <span className="text-slate-500">Participants:</span>
                <span className="font-bold text-slate-900">
                  {selectedExchange.initiatingRepName} & {selectedExchange.receivingRepName}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-bold text-emerald-600">{selectedExchange.status}</span>
              </div>
            </div>

            {/* Step Timeline */}
            <div className="space-y-3 text-xs pl-2 border-l-2 border-blue-500 my-4">
              <div className="relative pl-3">
                <div className="absolute -left-[11px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600" />
                <p className="font-bold text-slate-900">Exchange Proposed</p>
                <p className="text-slate-500">
                  {new Date(selectedExchange.proposedAt).toLocaleDateString()} by {selectedExchange.initiatingRepName}
                </p>
              </div>

              {selectedExchange.acceptedAt && (
                <div className="relative pl-3">
                  <div className="absolute -left-[11px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <p className="font-bold text-slate-900">Exchange Accepted</p>
                  <p className="text-slate-500">
                    {new Date(selectedExchange.acceptedAt).toLocaleDateString()} by {selectedExchange.receivingRepName}
                  </p>
                </div>
              )}

              {selectedExchange.certificateAId && (
                <div className="relative pl-3">
                  <div className="absolute -left-[11px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <p className="font-bold text-slate-900">Certificates Issued</p>
                  <p className="text-slate-500">
                    Tokens {selectedExchange.certificateAId} and {selectedExchange.certificateBId} generated with single-use security.
                  </p>
                </div>
              )}

              {selectedExchange.status === 'COMPLETE' && (
                <div className="relative pl-3">
                  <div className="absolute -left-[11px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <p className="font-bold text-emerald-700">Both Certificates Redeemed</p>
                  <p className="text-slate-500">
                    Trade fully completed and logged in Marin local exchange ledger.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedExchangeId(null)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Close Timeline
            </button>
          </div>
        </div>
      )}

      {/* RATING MODAL (Spec: Ratings & Reputation) */}
      {ratingExchangeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Rate Your Trade Experience
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Feedback helps maintain trust in the Marin County business community.
              </p>
            </div>

            {/* Question 1: Honor */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Did the business honor the certificate?
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setHonored(true)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                    honored
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Yes, honored
                </button>
                <button
                  type="button"
                  onClick={() => setHonored(false)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                    !honored
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Question 2: Trade Again */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Would you trade with them again?
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setWouldTradeAgain(true)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                    wouldTradeAgain
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setWouldTradeAgain(false)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                    !wouldTradeAgain
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Question 3: Stars */}
            <div className="space-y-1.5 text-center">
              <label className="text-xs font-semibold text-slate-700 block">
                Overall experience (1–5 stars)
              </label>
              <div className="flex items-center justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStars(s)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        s <= stars
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Comment (Optional)
              </label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRatingExchangeId(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRating}
                className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
