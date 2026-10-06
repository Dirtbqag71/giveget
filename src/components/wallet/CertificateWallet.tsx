import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Certificate, Business } from '../../types';
import { QrCertificateCard } from '../common/QrCertificateCard';
import {
  QrCode,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  X,
  CreditCard,
} from 'lucide-react';

interface CertificateWalletProps {
  onOpenScannerForCert: (certificateId: string) => void;
}

export const CertificateWallet: React.FC<CertificateWalletProps> = ({
  onOpenScannerForCert,
}) => {
  const { currentBusiness, businesses, certificates } = useApp();
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'REDEEMED' | 'EXPIRED'>('ACTIVE');
  const [selectedCertForModal, setSelectedCertForModal] = useState<Certificate | null>(null);

  // Certificates where currentBusiness is the recipient (i.e. they hold the credit to spend)
  const myHeldCerts = certificates.filter(
    (c) => c.recipientBusinessId === currentBusiness.id
  );

  const filteredCerts = myHeldCerts.filter((c) => c.status === activeTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Credits & Certificates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Single-use Give & Get QR credits earned from exchanges, redeemable at partner businesses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
            Wallet Owner: {currentBusiness.representative.firstName} ({currentBusiness.name})
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        {(['ACTIVE', 'REDEEMED', 'EXPIRED'] as const).map((tab) => {
          const count = myHeldCerts.filter((c) => c.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === tab ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Certificates */}
      {filteredCerts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No {activeTab.toLowerCase()} credits found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === 'ACTIVE'
              ? 'Accept an equal-value exchange proposal to receive verified business certificates in your wallet.'
              : `Your ${activeTab.toLowerCase()} certificates will be archived here for reference.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => {
            const issuer = businesses.find((b) => b.id === cert.issuerBusinessId);

            return (
              <div
                key={cert.id}
                className="bg-white rounded-2xl border border-blue-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {cert.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        cert.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cert.status}
                    </span>
                  </div>

                  {/* Issuer & Value */}
                  <div className="py-3 text-center">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-tabular">
                      ${cert.value}
                    </span>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                      Business Credit
                    </p>
                    <h3 className="text-base font-bold text-slate-800 mt-2">
                      {issuer?.name || 'Issuer Business'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Redeemable in {issuer?.city}, CA
                    </p>
                  </div>

                  {/* Recipient info */}
                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>Issued to:</span>
                      <strong className="text-slate-800">{cert.recipientRepName}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Expires:</span>
                      <strong className="text-slate-800">{new Date(cert.expiresAt).toLocaleDateString()}</strong>
                    </div>
                  </div>
                </div>

                {/* View QR Button */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => setSelectedCertForModal(cert)}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <QrCode className="w-4 h-4" />
                    VIEW QR CERTIFICATE
                  </button>

                  {cert.status === 'ACTIVE' && (
                    <button
                      onClick={() => onOpenScannerForCert(cert.id)}
                      className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Simulate Merchant Scan & Redemption
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL DIGITAL CERTIFICATE MODAL */}
      {selectedCertForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md max-h-[95vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCertForModal(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <QrCertificateCard
              certificate={selectedCertForModal}
              issuerBusiness={businesses.find((b) => b.id === selectedCertForModal.issuerBusinessId)}
              recipientBusiness={businesses.find((b) => b.id === selectedCertForModal.recipientBusinessId)}
              showRedeemAction={selectedCertForModal.status === 'ACTIVE'}
              onRedeemClick={() => {
                const cId = selectedCertForModal.id;
                setSelectedCertForModal(null);
                onOpenScannerForCert(cId);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
