import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Certificate, Business } from '../../types';
import { GiveGetLogo } from './GiveGetLogo';
import { CheckCircle2, ShieldCheck, Clock, AlertTriangle, Copy, Check, QrCode as QrIcon } from 'lucide-react';

interface QrCertificateCardProps {
  certificate: Certificate;
  issuerBusiness?: Business;
  recipientBusiness?: Business;
  onRedeemClick?: () => void;
  showRedeemAction?: boolean;
  compact?: boolean;
}

export const QrCertificateCard: React.FC<QrCertificateCardProps> = ({
  certificate,
  issuerBusiness,
  recipientBusiness,
  onRedeemClick,
  showRedeemAction = false,
  compact = false,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const qrPayload = `https://giveandget.app/c/${certificate.secureQrToken}`;

  useEffect(() => {
    QRCode.toDataURL(qrPayload, {
      width: compact ? 160 : 240,
      margin: 1,
      color: {
        dark: '#172033',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR generation error:', err));
  }, [qrPayload, compact]);

  const copyToken = () => {
    navigator.clipboard?.writeText(certificate.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isRedeemed = certificate.status === 'REDEEMED';
  const isExpired = certificate.status === 'EXPIRED';

  const formattedExpires = new Date(certificate.expiresAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`relative bg-white rounded-2xl border border-blue-200/90 shadow-sm overflow-hidden transition-all duration-200 ${
        isRedeemed ? 'opacity-85 grayscale-[0.25]' : 'hover:shadow-md'
      } ${compact ? 'p-4 max-w-sm' : 'p-6 sm:p-8 max-w-md mx-auto'}`}
      style={{
        boxShadow: isRedeemed
          ? '0 1px 3px rgba(0,0,0,0.05)'
          : '0 4px 20px -2px rgba(37, 99, 235, 0.08), 0 2px 6px -1px rgba(0,0,0,0.02)',
      }}
    >
      {/* Decorative top security border line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600" />

      {/* Subtle watermark exchange icon */}
      <div className="absolute -top-10 -right-10 pointer-events-none opacity-[0.03]">
        <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor">
          <path d="M38 72 C 22 66, 16 48, 28 34 C 38 22, 58 20, 68 28 C 76 34, 76 46, 68 52 C 58 60, 44 64, 38 72" />
        </svg>
      </div>

      {/* Header Row */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <GiveGetLogo variant="full" size="sm" showBetaBadge={false} />

        {/* Status Badge */}
        {isRedeemed ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
            REDEEMED
          </span>
        ) : isExpired ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            EXPIRED
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ACTIVE
          </span>
        )}
      </div>

      {/* Value & Title Banner */}
      <div className="py-5 text-center">
        <span className="text-[11px] font-bold tracking-widest uppercase text-blue-600 block mb-1">
          B2B Business Credit Certificate
        </span>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-tabular">
            ${certificate.value}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-slate-500">USD</span>
        </div>
        <p className="text-base sm:text-lg font-bold text-slate-800 mt-1">
          {issuerBusiness?.name || 'Issuer Business'}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          Valid toward eligible products & services
        </p>
      </div>

      {/* QR Code Container */}
      <div className="relative my-2 p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 text-center flex flex-col items-center justify-center">
        {qrDataUrl ? (
          <div className="relative p-2 bg-white rounded-lg shadow-xs border border-slate-200 inline-block">
            <img
              src={qrDataUrl}
              alt={`Give and Get QR Certificate ${certificate.id}`}
              className={`w-36 h-36 sm:w-44 sm:h-44 object-contain ${
                isRedeemed ? 'opacity-40' : ''
              }`}
            />
            {isRedeemed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-lg backdrop-blur-[1px]">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mb-1" />
                <span className="text-xs font-bold text-slate-900 tracking-wide uppercase">
                  Redeemed
                </span>
                <span className="text-[10px] text-slate-500">
                  {certificate.redeemedAt
                    ? new Date(certificate.redeemedAt).toLocaleDateString()
                    : 'Single-use applied'}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-36 h-36 sm:w-44 sm:h-44 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            <QrIcon className="w-12 h-12" />
          </div>
        )}

        {/* Security watermark footer */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Single-use verifiable token</span>
          <span>·</span>
          <button
            onClick={copyToken}
            className="hover:text-blue-600 font-mono text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors"
            title="Click to copy ID"
          >
            {certificate.id}
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Recipient & Expiration Details Grid */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-left">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Issued To
          </span>
          <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
            {certificate.recipientRepName}
          </p>
          <p className="text-[11px] text-slate-600 truncate">
            {recipientBusiness?.name || 'Authorized Business'}
          </p>
        </div>

        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Expires
          </span>
          <p className="text-xs font-bold text-slate-900 mt-0.5">
            {formattedExpires}
          </p>
          <p className="text-[11px] text-slate-500 font-mono truncate">
            Exch: {certificate.exchangeId}
          </p>
        </div>
      </div>

      {/* Redeemed Audit Stamp if already used */}
      {isRedeemed && certificate.purchaseTotal !== undefined && (
        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
          <div className="flex justify-between font-medium">
            <span>Service Total:</span>
            <span className="font-tabular font-bold text-slate-900">${certificate.purchaseTotal}</span>
          </div>
          <div className="flex justify-between font-medium text-emerald-700">
            <span>Credit Applied:</span>
            <span className="font-tabular font-bold">-${certificate.appliedCredit}</span>
          </div>
          <div className="flex justify-between font-medium border-t border-slate-200 mt-1 pt-1 text-slate-900 font-bold">
            <span>Customer Paid Difference:</span>
            <span className="font-tabular">${certificate.remainingBalanceDue}</span>
          </div>
        </div>
      )}

      {/* Merchant / Redemption Callout */}
      {showRedeemAction && !isRedeemed && onRedeemClick && (
        <div className="mt-5 pt-3">
          <button
            onClick={onRedeemClick}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            Scan / Redeem as Merchant
          </button>
        </div>
      )}
    </div>
  );
};
