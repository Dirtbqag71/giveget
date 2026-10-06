import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Business, ExchangeAmount } from '../../types';
import {
  Building2,
  CheckCircle2,
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin,
  X,
  Star,
  ExternalLink,
  RotateCcw,
  Check,
  MessageSquare,
} from 'lucide-react';
import { GiveGetLogo } from '../common/GiveGetLogo';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type OnboardingStep =
  | 'WELCOME'
  | 'BUSINESS_SEARCH'
  | 'SEARCHING_LOADER'
  | 'CONFIRM_BUSINESS'
  | 'REP_DETAILS'
  | 'VERIFICATION_CODE'
  | 'FIRST_GIVE'
  | 'ACTIVATED';

interface DiscoveredBusinessInfo {
  name: string;
  city: string;
  category: string;
  description: string;
  address: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
  googleRating: number;
  googleReviewCount: number;
  yelpRating: number;
  yelpReviewCount: number;
  hours: string;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const { registerNewBusiness, createGive } = useApp();

  const [step, setStep] = useState<OnboardingStep>('WELCOME');

  // Step 1: Business Name & City
  const [businessNameInput, setBusinessNameInput] = useState('Tipsy Dumpling');
  const [cityInput, setCityInput] = useState('Greenbrae');

  // Discovered Business Profile Data from Google Maps & Yelp
  const [discoveredBiz, setDiscoveredBiz] = useState<DiscoveredBusinessInfo>({
    name: 'Tipsy Dumpling',
    city: 'Greenbrae',
    category: 'Restaurant / Casual Dining',
    description: 'Artisanal handmade dim sum, Taiwanese street food favorites, specialty craft teas, and local beers located in Bon Air Center.',
    address: '290 Bon Air Center',
    state: 'CA',
    zip: '94904',
    phone: '(415) 555-0192',
    website: 'https://tipsydumplingmarin.com',
    googleRating: 4.9,
    googleReviewCount: 142,
    yelpRating: 4.8,
    yelpReviewCount: 96,
    hours: 'Mon-Sun: 11:30 AM – 9:00 PM',
  });

  // Step 2: Representative Information
  const [repFirstName, setRepFirstName] = useState('Darren');
  const [repLastName, setRepLastName] = useState('Banks');
  const [repJobTitle, setRepJobTitle] = useState('Owner / Business Representative');
  const [repPhone, setRepPhone] = useState('(415) 555-0192');
  const [repEmail, setRepEmail] = useState('darren@tipsydumpling.com');
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [verificationChannel, setVerificationChannel] = useState<'SMS' | 'EMAIL'>('SMS');

  // Step 3: Verification Code Input
  const [verificationDigits, setVerificationDigits] = useState(['7', '4', '9', '2', '1', '8']);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  // Step 4: First Give Setup
  const [giveTitle, setGiveTitle] = useState('Tipsy Dumpling Business Credit');
  const [giveDescription, setGiveDescription] = useState('Valid toward all handcrafted dim sum, appetizers, and dining at Tipsy Dumpling.');
  const [giveAmounts, setGiveAmounts] = useState<ExchangeAmount[]>([50, 100, 200, 300, 500]);

  if (!isOpen) return null;

  // Preset quick Marin cities
  const marinCities = [
    'Greenbrae',
    'Corte Madera',
    'San Rafael',
    'Mill Valley',
    'Novato',
    'Sausalito',
    'Larkspur',
    'Tiburon',
  ];

  // Presets for quick testing
  const demoPresets = [
    {
      name: 'Tipsy Dumpling',
      city: 'Greenbrae',
      category: 'Restaurant',
      desc: 'Artisanal handmade dim sum, Taiwanese street food favorites, specialty craft teas, and local beers located in Bon Air Center.',
      addr: '290 Bon Air Center',
      zip: '94904',
      phone: '(415) 555-0192',
      web: 'https://tipsydumplingmarin.com',
      repFirst: 'Darren',
      repLast: 'Banks',
      repTitle: 'Owner / Business Representative',
      repEmail: 'darren@tipsydumpling.com',
    },
    {
      name: 'Marin Spine and Wellness',
      city: 'Corte Madera',
      category: 'Chiropractic / Wellness',
      desc: 'Integrative chiropractic adjustments, spinal rehabilitation, postural therapy, and deep-tissue recovery.',
      addr: '150 Nellen Ave, Suite 210',
      zip: '94925',
      phone: '(415) 555-0248',
      web: 'https://marinspinewellness.com',
      repFirst: 'Chappy',
      repLast: 'Wood',
      repTitle: 'Lead Practitioner & Co-Founder',
      repEmail: 'chappy@marinspinewellness.com',
    },
    {
      name: 'Tamalpais Clean & Clear Windows',
      city: 'Larkspur',
      category: 'Commercial Cleaning',
      desc: 'Eco-friendly commercial storefront window cleaning and solar panel washing servicing Marin businesses.',
      addr: '420 Magnolia Ave',
      zip: '94939',
      phone: '(415) 555-0943',
      web: 'https://tamalpaisclear.com',
      repFirst: 'Dave',
      repLast: 'Miller',
      repTitle: 'Owner / Operator',
      repEmail: 'dave@tamalpaisclear.com',
    },
  ];

  const handleSelectPreset = (preset: (typeof demoPresets)[0]) => {
    setBusinessNameInput(preset.name);
    setCityInput(preset.city);
    setRepFirstName(preset.repFirst);
    setRepLastName(preset.repLast);
    setRepJobTitle(preset.repTitle);
    setRepPhone(preset.phone);
    setRepEmail(preset.repEmail);
    setGiveTitle(`${preset.name} Business Credit`);
  };

  const handleStartSearch = () => {
    setStep('SEARCHING_LOADER');

    // Dynamically prepare discovered info based on user input
    setTimeout(() => {
      const matchPreset = demoPresets.find(
        (p) => p.name.toLowerCase() === businessNameInput.trim().toLowerCase()
      );

      if (matchPreset) {
        setDiscoveredBiz({
          name: matchPreset.name,
          city: matchPreset.city,
          category: matchPreset.category,
          description: matchPreset.desc,
          address: matchPreset.addr,
          state: 'CA',
          zip: matchPreset.zip,
          phone: matchPreset.phone,
          website: matchPreset.web,
          googleRating: 4.9,
          googleReviewCount: 138,
          yelpRating: 4.8,
          yelpReviewCount: 92,
          hours: 'Mon-Sun: 10:00 AM – 8:00 PM',
        });
      } else {
        // Construct realistic Google Maps + Yelp profile for custom business name
        setDiscoveredBiz({
          name: businessNameInput.trim(),
          city: cityInput.trim() || 'San Rafael',
          category: 'Local Goods & Professional Services',
          description: `Verified local business operating in ${cityInput.trim() || 'Marin County'}, California.`,
          address: `100 Main Street`,
          state: 'CA',
          zip: '94901',
          phone: repPhone || '(415) 555-0100',
          website: `https://${businessNameInput.toLowerCase().replace(/[^a-z0-9]/g, '')}marin.com`,
          googleRating: 4.9,
          googleReviewCount: 48,
          yelpRating: 4.7,
          yelpReviewCount: 34,
          hours: 'Mon-Sat: 9:00 AM – 6:00 PM',
        });
      }

      setStep('CONFIRM_BUSINESS');
    }, 700);
  };

  const handleSendCode = () => {
    setStep('VERIFICATION_CODE');
  };

  const handleDigitChange = (index: number, val: string) => {
    const nextDigits = [...verificationDigits];
    nextDigits[index] = val.slice(-1);
    setVerificationDigits(nextDigits);
  };

  const handleConfirmCode = () => {
    setIsCodeVerified(true);
    setTimeout(() => {
      setStep('FIRST_GIVE');
    }, 400);
  };

  const handleFinishOnboarding = () => {
    registerNewBusiness(
      {
        name: discoveredBiz.name,
        category: discoveredBiz.category,
        description: discoveredBiz.description,
        address: discoveredBiz.address,
        city: discoveredBiz.city,
        state: discoveredBiz.state,
        zip: discoveredBiz.zip,
        phone: discoveredBiz.phone,
        website: discoveredBiz.website,
        supportedAmounts: giveAmounts,
      },
      {
        firstName: repFirstName,
        lastName: repLastName,
        jobTitle: repJobTitle,
        phone: repPhone,
        email: repEmail,
        isPrimary: true,
      }
    );

    createGive({
      title: giveTitle,
      category: discoveredBiz.category,
      description: giveDescription,
      amounts: giveAmounts,
      restrictions: 'Not redeemable for cash. Single-use certificate.',
      expirationPolicy: '90 days after issuance.',
      active: true,
    });

    setStep('ACTIVATED');
    setTimeout(() => {
      onComplete();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top bar with new Give and Get Logo */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <img
              src="/give_get_blue_app_icon_latest.svg"
              alt="Give and Get"
              className="w-7 h-7 object-contain rounded-lg shadow-2xs"
            />
            <GiveGetLogo variant="wordmark" size="sm" showBetaBadge={true} />
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* SCREEN 1: WELCOME */}
          {step === 'WELCOME' && (
            <div className="text-center space-y-5 py-2">
              <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-md">
                <img
                  src="/give_get_blue_app_icon_latest.svg"
                  alt="Give and Get Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Trade business with businesses.
                </h2>
                <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                  Turn what your business has into what your business needs. Join local Marin County businesses trading equal-value credits.
                </p>
              </div>

              <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200 text-xs text-blue-900 font-semibold flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Free for Marin County businesses · No credit card required</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setStep('BUSINESS_SEARCH')}
                  className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-sm transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  Create Free Business Profile
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: REQUIRE BUSINESS NAME AND CITY */}
          {step === 'BUSINESS_SEARCH' && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Step 1 of 4
                  </span>
                  <span className="text-xs text-slate-400">Google Maps & Yelp Search</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                  What is your business?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your business name and city. We'll search Google Maps and Yelp to locate your public information.
                </p>
              </div>

              <div className="space-y-4">
                {/* Field 1: Business Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={businessNameInput}
                      onChange={(e) => setBusinessNameInput(e.target.value)}
                      placeholder="e.g. Tipsy Dumpling, Marin Spine and Wellness"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Field 2: City */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    City (Marin County) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      placeholder="e.g. Greenbrae, Corte Madera, San Rafael"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  {/* Marin City Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-2">
                    <span className="text-[11px] text-slate-400 font-medium mr-1">Marin cities:</span>
                    {marinCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => setCityInput(city)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          cityInput === city
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Demo Quick Presets */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                    1-Click Demo Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {demoPresets.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className="text-[11px] px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-400 text-slate-700 rounded-lg transition-colors cursor-pointer"
                      >
                        {preset.name} ({preset.city})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={!businessNameInput.trim() || !cityInput.trim()}
                  onClick={handleStartSearch}
                  className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  SEARCH GOOGLE MAPS & YELP
                </button>
              </div>
            </div>
          )}

          {/* SEARCHING LOADER ANIMATION */}
          {step === 'SEARCHING_LOADER' && (
            <div className="py-12 text-center space-y-5 animate-in fade-in duration-200">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                <Search className="w-6 h-6 text-blue-600 absolute inset-0 m-auto" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900">
                  Searching Google Maps & Yelp...
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Querying local records for <strong>"{businessNameInput}"</strong> in {cityInput}, CA
                </p>
              </div>

              <div className="max-w-xs mx-auto p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Google Places: Match located</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Yelp Fusion API: Verified listing found</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CONFIRM BUSINESS NAME */}
          {step === 'CONFIRM_BUSINESS' && (
            <div className="space-y-5">
              <div className="text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 font-extrabold text-xs rounded-full border border-emerald-200 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  We found your business on Google Maps & Yelp
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Please confirm your business name
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  We pre-populated your address, category, reviews, and contact info from public records.
                </p>
              </div>

              {/* Business Card Preview with Google Maps & Yelp badges */}
              <div className="p-5 bg-white rounded-2xl border border-blue-200 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-xs">
                      {discoveredBiz.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">
                        {discoveredBiz.name}
                      </h4>
                      <p className="text-xs text-blue-600 font-semibold">
                        {discoveredBiz.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      Google Maps
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                      Yelp
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {discoveredBiz.description}
                </p>

                {/* Ratings & Location Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Address
                    </span>
                    <p className="text-slate-900 font-medium mt-0.5">
                      {discoveredBiz.address}, {discoveredBiz.city}, CA {discoveredBiz.zip}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Ratings & Reviews
                    </span>
                    <p className="text-slate-900 font-semibold mt-0.5 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{discoveredBiz.googleRating} Google ({discoveredBiz.googleReviewCount})</span>
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      {discoveredBiz.yelpRating} ★ on Yelp ({discoveredBiz.yelpReviewCount})
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Phone:</span>
                    <span className="font-semibold text-slate-900">{discoveredBiz.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Website:</span>
                    <span className="font-semibold text-blue-600 truncate block">
                      {discoveredBiz.website.replace('https://', '')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirmation Actions */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('REP_DETAILS')}
                  className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  YES, THIS IS MY BUSINESS
                </button>

                <button
                  type="button"
                  onClick={() => setStep('BUSINESS_SEARCH')}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  Not my business / Search again
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REPRESENTATIVE DETAILS (NAME, JOB TITLE, PHONE, EMAIL) */}
          {step === 'REP_DETAILS' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                  Step 2 of 4
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                  Tell us who you are
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  We need your contact information to authorize trades and deliver single-use QR certificates.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {/* First and Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={repFirstName}
                      onChange={(e) => setRepFirstName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={repLastName}
                      onChange={(e) => setRepLastName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Job Title */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={repJobTitle}
                    onChange={(e) => setRepJobTitle(e.target.value)}
                    placeholder="e.g. Owner, General Manager, Business Representative"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Mobile Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={repPhone}
                        onChange={(e) => setRepPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Business Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={repEmail}
                        onChange={(e) => setRepEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Verification Channel Selector */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-semibold text-slate-700 block text-[11px]">
                    How should we send your verification confirmation?
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setVerificationChannel('SMS')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                        verificationChannel === 'SMS'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Send Text Message (SMS)
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerificationChannel('EMAIL')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                        verificationChannel === 'EMAIL'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Send Email
                    </button>
                  </div>
                </div>

                {/* Authorization checkbox */}
                <label className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={isAuthorized}
                    onChange={(e) => setIsAuthorized(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>
                    I am authorized to represent <strong>{discoveredBiz.name}</strong> for Give and Get exchanges.
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={!isAuthorized || !repFirstName || !repLastName || !repPhone || !repEmail}
                  onClick={handleSendCode}
                  className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  SEND CONFIRMATION CODE
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: VERIFY VIA TEXT OR EMAIL */}
          {step === 'VERIFICATION_CODE' && (
            <div className="space-y-5 text-center py-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                {verificationChannel === 'SMS' ? (
                  <MessageSquare className="w-8 h-8" />
                ) : (
                  <Mail className="w-8 h-8" />
                )}
              </div>

              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                  Step 3 of 4
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                  Confirm your {verificationChannel === 'SMS' ? 'Phone Number' : 'Email'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  We sent a 6-digit confirmation code to{' '}
                  <strong className="text-slate-800">
                    {verificationChannel === 'SMS' ? repPhone : repEmail}
                  </strong>
                  .
                </p>
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="flex justify-center items-center gap-2 max-w-xs mx-auto">
                {verificationDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    className="w-11 h-13 text-center text-xl font-bold font-mono bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                <span>Resend code in 45s</span>
                <span>·</span>
                <button
                  type="button"
                  onClick={() =>
                    setVerificationChannel(verificationChannel === 'SMS' ? 'EMAIL' : 'SMS')
                  }
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Send via {verificationChannel === 'SMS' ? 'Email' : 'SMS text'} instead
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleConfirmCode}
                  className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  CONFIRM & ACTIVATE BUSINESS
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SETUP FIRST GIVE */}
          {step === 'FIRST_GIVE' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                  Step 4 of 4
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                  Create Your First Give
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Specify the credit {discoveredBiz.name} offers to other Marin businesses in exchange.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Give Title</label>
                  <input
                    type="text"
                    value={giveTitle}
                    onChange={(e) => setGiveTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={giveDescription}
                    onChange={(e) => setGiveDescription(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">
                    Available Exchange Values
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {([50, 100, 200, 300, 500] as ExchangeAmount[]).map((amt) => (
                      <span
                        key={amt}
                        className="py-2.5 text-center bg-blue-50 border border-blue-200 text-blue-700 font-extrabold rounded-xl text-xs font-tabular"
                      >
                        ${amt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  START TRADING IN MARIN
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: ACTIVATED CELEBRATION */}
          {step === 'ACTIVATED' && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-lg ring-4 ring-blue-100">
                <img
                  src="/give_get_blue_app_icon_latest.svg"
                  alt="Give and Get"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">
                  Profile Activated
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                  Welcome to Give and Get!
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  {discoveredBiz.name} is now connected to the Marin County business credit network.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                Loading your business dashboard and matching engine...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
