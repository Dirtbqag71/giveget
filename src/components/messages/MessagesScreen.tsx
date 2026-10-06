import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Business, Message, ExchangeAmount } from '../../types';
import { Send, ArrowUpDown, ShieldCheck, CheckCheck, User } from 'lucide-react';

interface MessagesScreenProps {
  onProposeExchange: (businessId: string, amount: ExchangeAmount) => void;
  defaultPartnerId?: string;
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({
  onProposeExchange,
  defaultPartnerId,
}) => {
  const { currentBusiness, partnerBusiness, businesses, messages, sendMessage } = useApp();
  const [activePartnerId, setActivePartnerId] = useState<string>(
    defaultPartnerId || partnerBusiness.id
  );
  const [inputText, setInputText] = useState('');

  const activePartner = businesses.find((b) => b.id === activePartnerId) || partnerBusiness;

  // Filter messages for this conversation pair
  const conversationMessages = messages.filter((m) => {
    const isSender = m.senderBusinessId === currentBusiness.id && m.recipientBusinessId === activePartner.id;
    const isReceiver = m.senderBusinessId === activePartner.id && m.recipientBusinessId === currentBusiness.id;
    return isSender || isReceiver;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(activePartner.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row h-[750px] animate-in fade-in duration-200">
      {/* Sidebar - Contacts */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/70 p-4 flex flex-col">
        <h2 className="text-base font-bold text-slate-900 mb-3 px-1">
          Business Conversations
        </h2>

        <div className="space-y-1.5 flex-1 overflow-y-auto">
          {businesses
            .filter((b) => b.id !== currentBusiness.id)
            .map((biz) => {
              const isSelected = biz.id === activePartner.id;
              return (
                <button
                  key={biz.id}
                  onClick={() => setActivePartnerId(biz.id)}
                  className={`w-full p-3 rounded-2xl text-left transition-all flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-white shadow-xs border border-blue-200 ring-1 ring-blue-500/20'
                      : 'hover:bg-white/60 text-slate-600'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0"
                    style={{ backgroundColor: biz.accentColor || '#2563EB' }}
                  >
                    {biz.logoInitial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{biz.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {biz.representative.firstName} {biz.representative.lastName}
                    </p>
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm"
              style={{ backgroundColor: activePartner.accentColor || '#3B82F6' }}
            >
              {activePartner.logoInitial}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {activePartner.name}
              </h3>
              <p className="text-xs text-slate-500">
                Representative: {activePartner.representative.firstName} {activePartner.representative.lastName} · {activePartner.category}
              </p>
            </div>
          </div>

          {/* Quick Action Button in Header */}
          <button
            onClick={() => onProposeExchange(activePartner.id, 100)}
            className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
            Propose $100 Exchange
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
          {/* Quick Action Banner at top if trading with Marin Spine */}
          {activePartner.id === 'marin-spine' && (
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                Direct Trade Opportunity
              </span>
              <p className="text-xs text-blue-900 font-medium">
                Both businesses agree on equal-value credit trading. Ready to propose?
              </p>
              <button
                onClick={() => onProposeExchange(activePartner.id, 100)}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                PROPOSE $100 EXCHANGE
              </button>
            </div>
          )}

          {conversationMessages.map((msg) => {
            const isMe = msg.senderBusinessId === currentBusiness.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-slate-400 mb-1 px-1">
                  {msg.senderRepName} · {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* If message contained a proposal button */}
                  {msg.isQuickAction && msg.quickActionAmount && (
                    <div className="mt-2.5 pt-2 border-t border-white/20">
                      <button
                        onClick={() => onProposeExchange(activePartner.id, msg.quickActionAmount!)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          isMe
                            ? 'bg-white text-blue-600 hover:bg-blue-50'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        Review ${msg.quickActionAmount} Proposal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-slate-100 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${activePartner.representative.firstName} at ${activePartner.name}...`}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-2xl transition-colors cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
