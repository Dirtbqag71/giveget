import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Certificate, Business } from '../../types';
import {
  ScanLine,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Receipt,
  RotateCcw,
  Building,
  User,
  X,
} from 'lucide-react';

interface MerchantRedemptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedCertificateId?: string;
}

type Step = 'SCAN' | 'VERIFIED' | 'CALCULATE' | 'CONFIRM' | 'SUCCESS' | 'ERROR';

export const MerchantRedemptionModal: React.FC<MerchantRedemptionModalProps> = ({
  isOpen,
  onClose,
  preSelectedCertificateId,
}) => {
  const {
    currentBusiness,
    certificates,
    businesses,
    verifyCertificate,
    redeemCertificate,
    switchActivePersona,
  } = useApp();

  const [step, setStep] = useState<Step>(preSelectedCertificateId ? 'VERIFIED' : 'SCAN');
  const [tokenInput, setTokenInput] = useState<string>(preSelectedCertificateId || '');
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);
  const [issuerBiz, setIssuerBiz] = useState<Business | null>(null);
  const [recipientBiz, setRecipientBiz] = useState<Business | null>(null);
  const [serviceTotal, setServiceTotal] = useState<number>(150);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [redemptionResult, setRedemptionResult] = useState<{
    certificate?: Certificate;
    balanceDue: number;
  } | null>(null);

  // If preSelectedCertificateId was passed, load it immediately
  React.useEffect(() => {
    if (preSelectedCertificateId) {
      handleLookup(preSelectedCertificateId);
    }
  }, [preSelectedCertificateId]);

  if (!isOpen) return null;

  const handleLookup = (code: string) => {
    setErrorMessage('');
    const res = verifyCertificate(code);
    if (!res.valid || !res.certificate) {
      setErrorMessage(res.error || 'Invalid QR code.');
      setStep('ERROR');
      return;
    }

    setActiveCert(res.certificate);
    setIssuerBiz(res.issuer || null);
    setRecipientBiz(res.recipient || null);
    setStep('VERIFIED');
  };

  const handleProceedToCalculate = () => {
    setStep('CALCULATE');
  };

  const handleProceedToConfirm = () => {
    setStep('CONFIRM');
  };

  const handleExecuteRedeem = () => {
    if (!activeCert) return;

    const res = redeemCertificate(
      activeCert.id,
      serviceTotal,
      `${currentBusiness.representative.firstName} ${currentBusiness.representative.lastName}`,
      `Redeemed at ${currentBusiness.name} merchant counter.`
    );

    if (!res.success) {
      setErrorMessage(res.error || 'Redemption failed.');
      setStep('ERROR');
      return;
    }

    setRedemptionResult({
      certificate: res.certificate,
      balanceDue: res.balanceDue,
    });
    setStep('SUCCESS');
  };

  const handleReset = () => {
    setStep('SCAN');
    setTokenInput('');
    setActiveCert(null);
    setErrorMessage('');
    setRedemptionResult(null);
  };

  // Computations for redemption screen
  const certValue = activeCert?.value || 100;
  const appliedCredit = Math.min(certValue, serviceTotal);
  const balanceDue = Math.max(0, serviceTotal - certValue);
  const isUnderValue = serviceTotal < certValue;
  const forfeitedAmount = isUnderValue ? certValue - serviceTotal : 0;

  // Active certificates available to test scan
  const activeCertsList = certificates.filter((c) => c.status === 'ACTIVE');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <ScanLine className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Merchant QR Redemption Terminal
              </h3>
              <p className="text-xs text-slate-500">
                Logged in as: <span className="font-semibold text-slate-700">{currentBusiness.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* STEP 1: SCAN OR SELECT */}
          {step === 'SCAN' && (
            <div className="space-y-5">
              <div className="text-center py-2">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <ScanLine className="w-8 h-8 animate-pulse" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  Scan Customer QR Certificate
                </h4>
                <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                  Hold camera up to customer's Give & Get certificate or enter the certificate code below.
                </p>
              </div>

              {/* Input for Certificate Token / ID */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <label className="text-xs font-semibold text-slate-700 block">
                  Certificate ID or Secure QR Token
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="e.g. GG-CERT-10082-A or GG-10024-A"
                    className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleLookup(tokenInput)}
                    disabled={!tokenInput.trim()}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    Verify
                  </button>
                </div>
              </div>

              {/* One-click demo certificates simulator */}
              <div className="border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold text-slate-500 block mb-2">
                  Demo Fast-Track: Select an Active Certificate in System
                </span>
                {activeCertsList.length === 0 ? (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                    No active certificates currently exist. Accept an exchange proposal first to generate certificates!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeCertsList.map((cert) => {
                      const issuer = businesses.find((b) => b.id === cert.issuerBusinessId);
                      const recipient = businesses.find((b) => b.id === cert.recipientBusinessId);
                      return (
                        <button
                          key={cert.id}
                          onClick={() => handleLookup(cert.id)}
                          className="w-full p-3 bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all duration-150 flex items-center justify-between group cursor-pointer"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-slate-900">
                                {cert.id}
                              </span>
                              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                ${cert.value}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Issued to <strong className="text-slate-700">{cert.recipientRepName}</strong> ({recipient?.name}) · Redeemable at <strong className="text-slate-700">{issuer?.name}</strong>
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: QR VERIFIED */}
          {step === 'VERIFIED' && activeCert && (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base font-bold text-emerald-950">
                    Valid Give and Get Certificate
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Verified live. This single-use credit is authentic, active, and ready to apply.
                  </p>
                </div>
              </div>

              {/* Certificate Details Card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-baseline justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Certificate Value
                    </span>
                    <span className="text-3xl font-extrabold text-slate-900 font-tabular">
                      ${activeCert.value}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Issued To</span>
                    <p className="font-bold text-slate-900 mt-0.5">{activeCert.recipientRepName}</p>
                    <p className="text-slate-600">{recipientBiz?.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Redeemable At</span>
                    <p className="font-bold text-slate-900 mt-0.5">{issuerBiz?.name}</p>
                    <p className="text-slate-600">{issuerBiz?.city}, CA</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
                  <span>Certificate ID: <strong className="font-mono text-slate-700">{activeCert.id}</strong></span>
                  <span>Expires: <strong>{new Date(activeCert.expiresAt).toLocaleDateString()}</strong></span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleProceedToCalculate}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  Continue to Redemption
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CALCULATE AMOUNT & OVERAGE */}
          {step === 'CALCULATE' && activeCert && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Enter Purchase or Service Total
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Input the bill total to calculate credit applied and any remaining customer balance.
                </p>
              </div>

              {/* Service Total Input */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="text-xs font-semibold text-slate-700 block">
                  Service / Bill Total ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={serviceTotal}
                    onChange={(e) => setServiceTotal(Math.max(1, Number(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-2xl font-bold font-tabular text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Quick amount buttons for demo convenience */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-500">Quick presets:</span>
                  {[83, 100, 128, 150, 220].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setServiceTotal(amt)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                        serviceTotal === amt
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Breakdown Ledger Card */}
              <div className="p-5 bg-white rounded-2xl border border-blue-200/90 shadow-xs space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Service Total</span>
                  <span className="font-bold font-tabular text-slate-900 text-base">
                    ${serviceTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-700 font-medium">Give & Get Credit</span>
                  <span className="font-bold font-tabular text-blue-700 text-base">
                    -${appliedCredit.toFixed(2)}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      BALANCE DUE
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Collect directly from customer
                    </span>
                  </div>
                  <span className="text-2xl font-extrabold font-tabular text-slate-900">
                    ${balanceDue.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Special Warning if below value */}
              {isUnderValue && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold">Single-use policy:</strong> This is a ${certValue} certificate. If redeemed against a ${serviceTotal} total, the remaining ${forfeitedAmount} unused balance will be forfeited.
                  </div>
                </div>
              )}

              {balanceDue > 0 && (
                <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 text-xs text-blue-900">
                  <strong className="font-semibold">Action Required:</strong> Collect the remaining <span className="font-bold">${balanceDue}</span> balance directly from {activeCert.recipientRepName} via your regular point-of-sale.
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('VERIFIED')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleProceedToConfirm}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  Redeem ${appliedCredit} Credit
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION MODAL */}
          {step === 'CONFIRM' && activeCert && (
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  Confirm Permanent Redemption?
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Are you sure? Once redeemed, this certificate is permanently invalid and cannot be used again by either party.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2 max-w-xs mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-bold text-slate-900">{activeCert.recipientRepName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Credit Consumed:</span>
                  <span className="font-bold text-blue-700">${appliedCredit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Remaining Balance:</span>
                  <span className="font-bold text-slate-900">${balanceDue}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep('CALCULATE')}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteRedeem}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Confirm Redemption
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REDEMPTION SUCCESS */}
          {step === 'SUCCESS' && redemptionResult && (
            <div className="space-y-5 text-center py-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase block">
                  Transaction Successful
                </span>
                <h4 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                  Certificate Redeemed
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  This QR code is now permanently invalid and logged in the Marin audit ledger.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Certificate ID:</span>
                  <span className="font-mono font-bold text-slate-900">{redemptionResult.certificate?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-bold text-slate-900">{redemptionResult.certificate?.recipientRepName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Total:</span>
                  <span className="font-bold text-slate-900">${redemptionResult.certificate?.purchaseTotal}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Applied Give & Get Credit:</span>
                  <span>-${redemptionResult.certificate?.appliedCredit}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-slate-900 font-bold">
                  <span>Customer Balance Collected:</span>
                  <span>${redemptionResult.balanceDue}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px] pt-1">
                  <span>Redemption Timestamp:</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 font-medium">
                Status: <strong className="font-bold">REDEEMED</strong>. If this QR is scanned again, the system will block reuse.
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Scan Another Code
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: ERROR / INVALID */}
          {step === 'ERROR' && (
            <div className="space-y-5 text-center py-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <XCircle className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900">
                  Verification Failed
                </h4>
                <p className="text-sm text-red-600 mt-2 max-w-sm mx-auto leading-relaxed">
                  {errorMessage}
                </p>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Try Another Certificate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
