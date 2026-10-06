import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Business,
  Give,
  Get,
  Exchange,
  Certificate,
  Message,
  Rating,
  AuditLog,
  ExchangeAmount,
} from '../types';
import {
  INITIAL_BUSINESSES,
  INITIAL_GIVES,
  INITIAL_GETS,
  INITIAL_EXCHANGES,
  INITIAL_CERTIFICATES,
  INITIAL_MESSAGES,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';

interface AppContextType {
  // Active Persona
  activeBusinessId: string;
  setActiveBusinessId: (id: string) => void;
  currentBusiness: Business;
  partnerBusiness: Business;
  switchActivePersona: () => void;

  // Data
  businesses: Business[];
  gives: Give[];
  gets: Get[];
  exchanges: Exchange[];
  certificates: Certificate[];
  messages: Message[];
  ratings: Rating[];
  auditLogs: AuditLog[];

  // Exchange actions
  proposeExchange: (
    toBusinessId: string,
    amount: ExchangeAmount,
    note?: string
  ) => { success: boolean; exchange: Exchange };
  acceptExchange: (exchangeId: string) => {
    success: boolean;
    exchange: Exchange;
    certA: Certificate;
    certB: Certificate;
  };
  declineExchange: (exchangeId: string) => void;

  // QR & Redemption
  verifyCertificate: (tokenOrId: string) => {
    valid: boolean;
    certificate?: Certificate;
    issuer?: Business;
    recipient?: Business;
    error?: string;
  };
  redeemCertificate: (
    certificateId: string,
    serviceTotal: number,
    redeemingRepName: string,
    notes?: string
  ) => {
    success: boolean;
    certificate?: Certificate;
    balanceDue: number;
    error?: string;
  };

  // Gives & Gets
  createGive: (giveData: Omit<Give, 'id' | 'businessId' | 'createdAt'>) => void;
  updateGive: (giveId: string, updates: Partial<Give>) => void;
  createGet: (getData: Omit<Get, 'id' | 'businessId' | 'createdAt' | 'matchCount'>) => void;
  updateGet: (getId: string, updates: Partial<Get>) => void;

  // Messaging & Feedback
  sendMessage: (toBusinessId: string, text: string, quickActionAmount?: ExchangeAmount) => void;
  submitRating: (
    exchangeId: string,
    honored: boolean,
    wouldTradeAgain: boolean,
    stars: number,
    comment: string
  ) => void;

  // Business settings & Onboarding
  toggleAcceptingExchanges: (businessId: string) => void;
  registerNewBusiness: (businessData: Partial<Business>, repData: Business['representative']) => string;

  // Active view routing helper
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedBusinessIdForProfile: string | null;
  setSelectedBusinessIdForProfile: (id: string | null) => void;
  selectedExchangeForDetail: string | null;
  setSelectedExchangeForDetail: (id: string | null) => void;
  latestAcceptedExchange: { exchange: Exchange; certA: Certificate; certB: Certificate } | null;
  clearLatestAcceptedExchange: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeBusinessId, setActiveBusinessId] = useState<string>('tipsy-dumpling');
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [gives, setGives] = useState<Give[]>(INITIAL_GIVES);
  const [gets, setGets] = useState<Get[]>(INITIAL_GETS);
  const [exchanges, setExchanges] = useState<Exchange[]>(INITIAL_EXCHANGES);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedBusinessIdForProfile, setSelectedBusinessIdForProfile] = useState<string | null>(null);
  const [selectedExchangeForDetail, setSelectedExchangeForDetail] = useState<string | null>(null);
  const [latestAcceptedExchange, setLatestAcceptedExchange] = useState<{
    exchange: Exchange;
    certA: Certificate;
    certB: Certificate;
  } | null>(null);

  const currentBusiness =
    businesses.find((b) => b.id === activeBusinessId) || businesses[0];

  // The primary trade partner for demos (Tipsy Dumpling ↔ Marin Spine)
  const partnerBusiness =
    businesses.find(
      (b) => b.id === (activeBusinessId === 'tipsy-dumpling' ? 'marin-spine' : 'tipsy-dumpling')
    ) || businesses[1];

  const switchActivePersona = () => {
    setActiveBusinessId((prev) =>
      prev === 'tipsy-dumpling' ? 'marin-spine' : 'tipsy-dumpling'
    );
  };

  // Add audit log helper
  const addAuditLog = (action: string, businessId: string, repName: string, details: string) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      businessId,
      repName,
      timestamp: new Date().toISOString(),
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Propose Exchange Flow
  const proposeExchange = (
    toBusinessId: string,
    amount: ExchangeAmount,
    note?: string
  ) => {
    const targetBusiness = businesses.find((b) => b.id === toBusinessId);
    if (!targetBusiness) throw new Error('Target business not found');

    const exchangeId = `GG-${10000 + exchanges.length + 1}`;
    const newExchange: Exchange = {
      id: exchangeId,
      initiatingBusinessId: currentBusiness.id,
      receivingBusinessId: toBusinessId,
      initiatingRepName: `${currentBusiness.representative.firstName} ${currentBusiness.representative.lastName}`,
      receivingRepName: `${targetBusiness.representative.firstName} ${targetBusiness.representative.lastName}`,
      amount,
      status: 'PROPOSED',
      proposedAt: new Date().toISOString(),
      notes: note || `Trade agreement for $${amount} equal-value business credit.`,
    };

    setExchanges((prev) => [newExchange, ...prev]);

    // Also add to message conversation
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: [currentBusiness.id, toBusinessId].sort().join('-'),
      senderBusinessId: currentBusiness.id,
      senderRepName: currentBusiness.representative.firstName,
      recipientBusinessId: toBusinessId,
      text: `Proposed an equal exchange of $${amount} Give & Get business credit: "${currentBusiness.name} ($${amount}) ↔ ${targetBusiness.name} ($${amount})".`,
      sentAt: new Date().toISOString(),
      isQuickAction: true,
      quickActionAmount: amount,
    };
    setMessages((prev) => [...prev, newMsg]);

    addAuditLog(
      'EXCHANGE_PROPOSED',
      currentBusiness.id,
      currentBusiness.representative.firstName,
      `Proposed $${amount} exchange (${exchangeId}) with ${targetBusiness.name}`
    );

    return { success: true, exchange: newExchange };
  };

  // Accept Exchange Flow: Generates TWO unique certificates!
  const acceptExchange = (exchangeId: string) => {
    const exchange = exchanges.find((e) => e.id === exchangeId);
    if (!exchange) throw new Error('Exchange not found');

    const initBiz = businesses.find((b) => b.id === exchange.initiatingBusinessId)!;
    const recvBiz = businesses.find((b) => b.id === exchange.receivingBusinessId)!;

    const certAId = `${exchangeId}-A`;
    const certBId = `${exchangeId}-B`;
    const issueDate = new Date().toISOString();
    const expireDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

    // Certificate A: Issued by Receiving Business, Given to Initiating Business
    // e.g. Darren at Tipsy Dumpling receives a $100 Marin Spine and Wellness credit!
    const certA: Certificate = {
      id: certAId,
      exchangeId: exchange.id,
      issuerBusinessId: exchange.receivingBusinessId,
      recipientBusinessId: exchange.initiatingBusinessId,
      recipientRepName: exchange.initiatingRepName,
      value: exchange.amount,
      secureQrToken: `GG-TOK-${exchange.receivingBusinessId.toUpperCase()}-${exchange.amount}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      status: 'ACTIVE',
      issuedAt: issueDate,
      expiresAt: expireDate,
      notes: `Issued to ${exchange.initiatingRepName} (${initBiz.name}) for use at ${recvBiz.name}.`,
    };

    // Certificate B: Issued by Initiating Business, Given to Receiving Business
    // e.g. Chappy at Marin Spine receives a $100 Tipsy Dumpling credit!
    const certB: Certificate = {
      id: certBId,
      exchangeId: exchange.id,
      issuerBusinessId: exchange.initiatingBusinessId,
      recipientBusinessId: exchange.receivingBusinessId,
      recipientRepName: exchange.receivingRepName,
      value: exchange.amount,
      secureQrToken: `GG-TOK-${exchange.initiatingBusinessId.toUpperCase()}-${exchange.amount}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      status: 'ACTIVE',
      issuedAt: issueDate,
      expiresAt: expireDate,
      notes: `Issued to ${exchange.receivingRepName} (${recvBiz.name}) for use at ${initBiz.name}.`,
    };

    const updatedExchange: Exchange = {
      ...exchange,
      status: 'CERTIFICATES_ISSUED',
      acceptedAt: issueDate,
      certificateAId: certAId,
      certificateBId: certBId,
    };

    setExchanges((prev) => prev.map((e) => (e.id === exchangeId ? updatedExchange : e)));
    setCertificates((prev) => [certA, certB, ...prev]);

    // Update business stats
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === initBiz.id || b.id === recvBiz.id) {
          return { ...b, completedExchanges: b.completedExchanges + 1 };
        }
        return b;
      })
    );

    addAuditLog(
      'EXCHANGE_ACCEPTED',
      currentBusiness.id,
      currentBusiness.representative.firstName,
      `Accepted exchange ${exchangeId}. Generated certificates ${certAId} & ${certBId}.`
    );

    setLatestAcceptedExchange({ exchange: updatedExchange, certA, certB });

    return { success: true, exchange: updatedExchange, certA, certB };
  };

  const declineExchange = (exchangeId: string) => {
    setExchanges((prev) =>
      prev.map((e) =>
        e.id === exchangeId
          ? { ...e, status: 'DECLINED', declinedAt: new Date().toISOString() }
          : e
      )
    );
    addAuditLog(
      'EXCHANGE_DECLINED',
      currentBusiness.id,
      currentBusiness.representative.firstName,
      `Declined exchange ${exchangeId}`
    );
  };

  // QR Code Verification
  const verifyCertificate = (tokenOrId: string) => {
    const cleaned = tokenOrId.trim();
    const cert = certificates.find(
      (c) =>
        c.id.toLowerCase() === cleaned.toLowerCase() ||
        c.secureQrToken.toLowerCase() === cleaned.toLowerCase()
    );

    if (!cert) {
      return { valid: false, error: 'Certificate not found. Please verify the code or QR scan.' };
    }

    const issuer = businesses.find((b) => b.id === cert.issuerBusinessId);
    const recipient = businesses.find((b) => b.id === cert.recipientBusinessId);

    if (cert.status === 'REDEEMED') {
      return {
        valid: false,
        certificate: cert,
        issuer,
        recipient,
        error: `This certificate was already redeemed on ${new Date(cert.redeemedAt || '').toLocaleDateString()} at ${new Date(cert.redeemedAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Single-use QR codes cannot be reused.`,
      };
    }

    if (cert.status === 'EXPIRED') {
      return {
        valid: false,
        certificate: cert,
        issuer,
        recipient,
        error: 'This certificate has expired.',
      };
    }

    if (new Date(cert.expiresAt).getTime() < Date.now()) {
      return {
        valid: false,
        certificate: cert,
        issuer,
        recipient,
        error: 'This certificate has passed its expiration date.',
      };
    }

    return { valid: true, certificate: cert, issuer, recipient };
  };

  // QR Single-Use Redemption
  const redeemCertificate = (
    certificateId: string,
    serviceTotal: number,
    redeemingRepName: string,
    notes?: string
  ) => {
    const cert = certificates.find((c) => c.id === certificateId);
    if (!cert) return { success: false, balanceDue: 0, error: 'Certificate not found.' };

    if (cert.status !== 'ACTIVE') {
      return {
        success: false,
        balanceDue: 0,
        error: `Cannot redeem certificate with status ${cert.status}. It can only be redeemed once.`,
      };
    }

    // Applied credit cannot exceed certificate value
    const appliedCredit = Math.min(cert.value, serviceTotal);
    const balanceDue = Math.max(0, serviceTotal - cert.value);
    const redeemedAt = new Date().toISOString();

    const updatedCert: Certificate = {
      ...cert,
      status: 'REDEEMED',
      redeemedAt,
      redeemedByRepName: redeemingRepName,
      purchaseTotal: serviceTotal,
      appliedCredit,
      remainingBalanceDue: balanceDue,
      notes: notes || `Redeemed by ${redeemingRepName}. Total: $${serviceTotal}, Applied: $${appliedCredit}, Balance due: $${balanceDue}.`,
    };

    setCertificates((prev) => prev.map((c) => (c.id === certificateId ? updatedCert : c)));

    // Check parent exchange status
    const parentExchange = exchanges.find((e) => e.id === cert.exchangeId);
    if (parentExchange) {
      // Find the counterpart certificate
      const counterpartCert = certificates.find(
        (c) => c.exchangeId === parentExchange.id && c.id !== certificateId
      );

      const isCounterpartRedeemed = counterpartCert?.status === 'REDEEMED';
      const newStatus = isCounterpartRedeemed ? 'COMPLETE' : 'PARTIALLY_REDEEMED';

      setExchanges((prev) =>
        prev.map((e) =>
          e.id === parentExchange.id
            ? {
                ...e,
                status: newStatus,
                completedAt: newStatus === 'COMPLETE' ? redeemedAt : undefined,
              }
            : e
        )
      );
    }

    addAuditLog(
      'CERTIFICATE_REDEEMED',
      cert.issuerBusinessId,
      redeemingRepName,
      `Redeemed certificate ${cert.id} ($${cert.value}). Bill: $${serviceTotal}, Balance due: $${balanceDue}. Status permanently set to REDEEMED.`
    );

    return { success: true, certificate: updatedCert, balanceDue };
  };

  // Gives & Gets CRUD
  const createGive = (giveData: Omit<Give, 'id' | 'businessId' | 'createdAt'>) => {
    const newGive: Give = {
      ...giveData,
      id: `give-${currentBusiness.id}-${Date.now()}`,
      businessId: currentBusiness.id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setGives((prev) => [newGive, ...prev]);
    addAuditLog('GIVE_CREATED', currentBusiness.id, currentBusiness.representative.firstName, `Created Give: ${newGive.title}`);
  };

  const updateGive = (giveId: string, updates: Partial<Give>) => {
    setGives((prev) => prev.map((g) => (g.id === giveId ? { ...g, ...updates } : g)));
  };

  const createGet = (getData: Omit<Get, 'id' | 'businessId' | 'createdAt' | 'matchCount'>) => {
    const newGet: Get = {
      ...getData,
      id: `get-${currentBusiness.id}-${Date.now()}`,
      businessId: currentBusiness.id,
      matchCount: 3, // calculated default
      createdAt: new Date().toISOString().split('T')[0],
    };
    setGets((prev) => [newGet, ...prev]);
    addAuditLog('GET_CREATED', currentBusiness.id, currentBusiness.representative.firstName, `Created Get: ${newGet.title}`);
  };

  const updateGet = (getId: string, updates: Partial<Get>) => {
    setGets((prev) => prev.map((g) => (g.id === getId ? { ...g, ...updates } : g)));
  };

  // Messaging
  const sendMessage = (toBusinessId: string, text: string, quickActionAmount?: ExchangeAmount) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: [currentBusiness.id, toBusinessId].sort().join('-'),
      senderBusinessId: currentBusiness.id,
      senderRepName: currentBusiness.representative.firstName,
      recipientBusinessId: toBusinessId,
      text,
      sentAt: new Date().toISOString(),
      isQuickAction: !!quickActionAmount,
      quickActionAmount,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Ratings
  const submitRating = (
    exchangeId: string,
    honored: boolean,
    wouldTradeAgain: boolean,
    stars: number,
    comment: string
  ) => {
    const exchange = exchanges.find((e) => e.id === exchangeId);
    if (!exchange) return;

    const reviewedBizId =
      exchange.initiatingBusinessId === currentBusiness.id
        ? exchange.receivingBusinessId
        : exchange.initiatingBusinessId;

    const newRating: Rating = {
      id: `rating-${Date.now()}`,
      exchangeId,
      reviewerBusinessId: currentBusiness.id,
      reviewerRepName: currentBusiness.representative.firstName,
      reviewedBusinessId: reviewedBizId,
      honoredCertificate: honored,
      wouldTradeAgain,
      stars,
      comment,
      createdAt: new Date().toISOString(),
    };

    setRatings((prev) => [newRating, ...prev]);
    addAuditLog('RATING_SUBMITTED', currentBusiness.id, currentBusiness.representative.firstName, `Rated exchange ${exchangeId}: ${stars} stars.`);
  };

  const toggleAcceptingExchanges = (businessId: string) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === businessId ? { ...b, acceptingExchanges: !b.acceptingExchanges } : b))
    );
  };

  const registerNewBusiness = (
    businessData: Partial<Business>,
    repData: Business['representative']
  ) => {
    const newId = (businessData.name || 'new-business')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    const newBiz: Business = {
      id: newId,
      name: businessData.name || 'New Marin Business',
      category: businessData.category || 'Local Services',
      description: businessData.description || 'Verified local Marin business.',
      address: businessData.address || 'Marin County, CA',
      city: businessData.city || 'San Rafael',
      state: 'CA',
      zip: businessData.zip || '94901',
      phone: businessData.phone || repData.phone,
      website: businessData.website || '',
      logoInitial: (businessData.name || 'NB').substring(0, 2).toUpperCase(),
      accentColor: '#2563EB',
      rating: 5.0,
      reviewCount: 1,
      completedExchanges: 0,
      tradeAgainPct: 100,
      verified: true,
      acceptingExchanges: true,
      supportedAmounts: [50, 100, 200, 300, 500],
      representative: repData,
      memberSince: 'October 2026',
    };

    setBusinesses((prev) => [...prev, newBiz]);
    setActiveBusinessId(newId);
    addAuditLog('BUSINESS_REGISTERED', newId, repData.firstName, `Business ${newBiz.name} registered.`);
    return newId;
  };

  const clearLatestAcceptedExchange = () => {
    setLatestAcceptedExchange(null);
  };

  return (
    <AppContext.Provider
      value={{
        activeBusinessId,
        setActiveBusinessId,
        currentBusiness,
        partnerBusiness,
        switchActivePersona,
        businesses,
        gives,
        gets,
        exchanges,
        certificates,
        messages,
        ratings,
        auditLogs,
        proposeExchange,
        acceptExchange,
        declineExchange,
        verifyCertificate,
        redeemCertificate,
        createGive,
        updateGive,
        createGet,
        updateGet,
        sendMessage,
        submitRating,
        toggleAcceptingExchanges,
        registerNewBusiness,
        activeTab,
        setActiveTab,
        selectedBusinessIdForProfile,
        setSelectedBusinessIdForProfile,
        selectedExchangeForDetail,
        setSelectedExchangeForDetail,
        latestAcceptedExchange,
        clearLatestAcceptedExchange,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
