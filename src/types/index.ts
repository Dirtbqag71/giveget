export type ExchangeAmount = 50 | 100 | 200 | 300 | 500;

export interface Representative {
  firstName: string;
  lastName: string;
  jobTitle: string;
  phone: string;
  email: string;
  isPrimary?: boolean;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  secondaryCategories?: string[];
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
  googleBusinessUrl?: string;
  yelpUrl?: string;
  logoInitial?: string;
  accentColor?: string;
  rating: number;
  reviewCount: number;
  completedExchanges: number;
  tradeAgainPct: number;
  verified: boolean;
  acceptingExchanges: boolean;
  supportedAmounts: ExchangeAmount[];
  representative: Representative;
  memberSince: string;
}

export interface Give {
  id: string;
  businessId: string;
  title: string;
  category: string;
  description: string;
  amounts: ExchangeAmount[];
  restrictions: string;
  expirationPolicy: string;
  active: boolean;
  createdAt: string;
}

export interface Get {
  id: string;
  businessId: string;
  title: string;
  rawText: string;
  interpretedCategory: string;
  useType: string;
  locationArea: string;
  compatibleAmounts: ExchangeAmount[];
  matchCount: number;
  active: boolean;
  createdAt: string;
}

export type ExchangeStatus =
  | 'PROPOSED'
  | 'ACCEPTED'
  | 'CERTIFICATES_ISSUED'
  | 'PARTIALLY_REDEEMED'
  | 'COMPLETE'
  | 'DECLINED'
  | 'CANCELLED';

export interface Exchange {
  id: string; // e.g. GG-10082
  initiatingBusinessId: string;
  receivingBusinessId: string;
  initiatingRepName: string;
  receivingRepName: string;
  amount: ExchangeAmount;
  status: ExchangeStatus;
  proposedAt: string;
  acceptedAt?: string;
  declinedAt?: string;
  completedAt?: string;
  notes?: string;
  certificateAId?: string; // Certificate given to initiating business
  certificateBId?: string; // Certificate given to receiving business
}

export type CertificateStatus = 'ACTIVE' | 'REDEEMED' | 'EXPIRED' | 'VOID';

export interface Certificate {
  id: string; // e.g. GG-CERT-10082-A
  exchangeId: string;
  issuerBusinessId: string; // Business providing the service/credit
  recipientBusinessId: string; // Business that holds and can spend the credit
  recipientRepName: string;
  value: ExchangeAmount;
  secureQrToken: string;
  status: CertificateStatus;
  issuedAt: string;
  expiresAt: string;
  redeemedAt?: string;
  redeemedByRepName?: string;
  purchaseTotal?: number;
  appliedCredit?: number;
  remainingBalanceDue?: number;
  notes?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderBusinessId: string;
  senderRepName: string;
  recipientBusinessId: string;
  text: string;
  sentAt: string;
  isQuickAction?: boolean;
  quickActionAmount?: ExchangeAmount;
}

export interface Rating {
  id: string;
  exchangeId: string;
  reviewerBusinessId: string;
  reviewerRepName?: string;
  reviewedBusinessId: string;
  honoredCertificate: boolean;
  wouldTradeAgain: boolean;
  stars: number;
  comment: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  businessId: string;
  repName: string;
  timestamp: string;
  details: string;
}
