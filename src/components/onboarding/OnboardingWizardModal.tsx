import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Business, ExchangeAmount } from '../../types';
import {
  Building,
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
} from 'lucide-react';
import { GiveGetLogo } from '../common/GiveGetLogo';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type OnboardingStep =
  | 'WELCOME'
  | 'URL_INPUT'
  | 'CONFIRM_BIZ'
  | 'REP_DETAILS'
  | 'VERIFICATION'
  | 'FIRST_GIVE'
  | 'DONE';

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const { registerNewBusiness, createGive, createGet } = useApp();

  const [step, setStep] = useState<OnboardingStep>('WELCOME');
  const [urlInput, setUrlInput] = useState('https://maps.google.com/?cid=tipsydumplingmarin');

  // Pre-populated business information
  const [bizData, setBizData] = useState({
    name: 'Tipsy Dumpling',
    category: 'Restaurant',
    description: 'Artisanal handmade dim sum, Taiwanese street food, and craft teas in Bon Air Center.',
    address: '290 Bon Air Center',
    city: 'Greenbrae',
    state: 'CA',
    zip: '94904',
    phone: '(415) 555-0192',
    website: 'https://tipsydumplingmarin.com',
  });

  // Representative Info
  const [firstName, setFirstName] = useState('Darren');
  const [lastName, setLastName] = useState('Banks');
  const [jobTitle, setJobTitle] = useState('Owner / Business Representative');
  const [phone, setPhone] = useState('(415) 555-0192');
  const [email, setEmail] = useState('darren@tipsydumpling.com');
  const [authorized, setAuthorized] = useState(true);

  // Verification Code
  const [smsCode, setSmsCode] = useState('7492');

  // First Give
  const [giveTitle, setGiveTitle] = useState('Tipsy Dumpling Business Credit');
  const [giveDescription, setGiveDescription] = useState('Valid toward all handcrafted dim sum and dining.');
  const [giveAmounts, setGiveAmounts] = useState<ExchangeAmount[]>([50, 100, 200, 300, 500]);

  if (!isOpen) return null;

  const handleLookupUrl = () => {
    // If user provided custom url, adjust sample business data
    if (urlInput.toLowerCase().includes('spine') || urlInput.toLowerCase().includes('wellness')) {
      setBizData({
        name: 'Marin Spine and Wellness',
        category: 'Chiropractic / Wellness',
        description: 'Integrative chiropractic adjustments, spinal rehabilitation, and recovery.',
        address: '150 Nellen Ave',
        city: 'Corte Madera',
        state: 'CA',
        zip: '94925',
        phone: '(415) 555-0248',
        website: 'https://marinspinewellness.com',
      });
      setFirstName('Chappy');
      setLastName('Wood');
      setJobTitle('Lead Practitioner & Co-Founder');
      setPhone('(415) 555-0248');
      setEmail('chappy@marinspinewellness.com');
      setGiveTitle('Marin Spine and Wellness Credit');
    }
    setStep('CONFIRM_BIZ');
  };

  const handleFinishOnboarding = () => {
    const newBizId = registerNewBusiness(
      {
        name: bizData.name,
        category: bizData.category,
        description: bizData.description,
        address: bizData.address,
        city: bizData.city,
        state: bizData.state,
        zip: bizData.zip,
        phone: bizData.phone,
        website: bizData.website,
        supportedAmounts: giveAmounts,
      },
      {
        firstName,
        lastName,
        jobTitle,
        phone,
        email,
        isPrimary: true,
      }
    );

    createGive({
      title: giveTitle,
      category: bizData.category,
      description: giveDescription,
      amounts: giveAmounts,
      restrictions: 'Not redeemable for cash. Single-use certificate.',
      expirationPolicy: '90 days after issuance.',
      active: true,
    });

    setStep('DONE');
    setTimeout(() => {
      onComplete();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <GiveGetLogo variant="wordmark" size="sm" showBetaBadge={true} />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* STEP 1: WELCOME */}
          {step === 'WELCOME' && (
            <div className="text-center space-y-5 py-4">
              <GiveGetLogo variant="icon" size="xl" className="mx-auto shadow-md" />
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Trade business with businesses.
                </h2>
                <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                  Give and Get helps local Marin County businesses exchange products and services using secure, equal-value business credits.
                </p>
              </div>

              <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200 text-xs text-blue-900 font-semibold">
                Free for Marin County businesses during beta · No credit card required
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setStep('URL_INPUT')}
                  className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  Create Free Business Profile
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PASTE URL */}
          {step === 'URL_INPUT' && (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                  Step 1 of 4
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                  Let's set up your business.
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Paste the link to your Google Business Profile or Yelp page. We automatically pre-populate your details.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Google Business or Yelp URL
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://maps.google.com/?cid=..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div className="flex gap-2 pt-1 text-[11px] text-slate-500">
                  <span>Demo quick presets:</span>
                  <button
                    onClick={() => setUrlInput('https://maps.google.com/?cid=tipsydumplingmarin')}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    Tipsy Dumpling
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => setUrlInput('https://maps.google.com/?cid=marinspinewellness')}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    Marin Spine
                  </button>
                </div>
              </div>

              <button
                onClick={handleLookupUrl}
                className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                FIND MY BUSINESS
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 3: CONFIRM PRE-POPULATED BUSINESS */}
          {step === 'CONFIRM_BIZ' && (
            <div className="space-y-5">
              <div className="text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 font-extrabold text-xs rounded-full border border-emerald-200 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  We found your business
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Is this your business?
                </h3>
              </div>

              {/* Clean Preview Card */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-lg">
                    {bizData.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{bizData.name}</h4>
                    <p className="text-xs text-blue-600 font-semibold">{bizData.category}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600">{bizData.description}</p>

                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Address:</span>
                    <span>{bizData.address}, {bizData.city}, CA</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Phone:</span>
                    <span>{bizData.phone}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setStep('REP_DETAILS')}
                  className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer"
                >
                  YES, THIS IS MY BUSINESS
                </button>
                <button
                  onClick={() => setStep('URL_INPUT')}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  EDIT BUSINESS INFORMATION
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REPRESENTATIVE DETAILS */}
          {step === 'REP_DETAILS' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                  Step 2 of 4
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Tell Us Who You Are
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Authorized contact details for trading and QR certificate approvals.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="font-semibold text-slate-700 block mb-1">Job Title / Role</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Business Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={authorized}
                  onChange={(e) => setAuthorized(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span>I am authorized to represent this business for Give and Get trades.</span>
              </label>

              <button
                disabled={!authorized}
                onClick={() => setStep('VERIFICATION')}
                className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer"
              >
                CREATE ACCOUNT
              </button>
            </div>
          )}

          {/* STEP 5: VERIFICATION */}
          {step === 'VERIFICATION' && (
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Phone className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Quick Verification
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  We sent a 4-digit verification code to <strong>{phone}</strong>.
                </p>
              </div>

              <div className="flex justify-center gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  className="w-32 text-center py-2.5 text-2xl tracking-widest font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <button
                onClick={() => setStep('FIRST_GIVE')}
                className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer"
              >
                BUILD MY GIVE AND GET PROFILE
              </button>
            </div>
          )}

          {/* STEP 6: CREATE FIRST GIVE */}
          {step === 'FIRST_GIVE' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                  Step 4 of 4
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Create Your First Give
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select what business credit you are ready to exchange with other businesses.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Give Title</label>
                  <input
                    type="text"
                    value={giveTitle}
                    onChange={(e) => setGiveTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={giveDescription}
                    onChange={(e) => setGiveDescription(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Available Exchange Amounts
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {([50, 100, 200, 300, 500] as ExchangeAmount[]).map((amt) => (
                      <span
                        key={amt}
                        className="py-2 text-center bg-blue-50 border border-blue-200 text-blue-700 font-bold rounded-lg text-xs font-tabular"
                      >
                        ${amt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleFinishOnboarding}
                className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                PUBLISH PROFILE & START TRADING
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 7: DONE */}
          {step === 'DONE' && (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">You're in!</h3>
              <p className="text-xs text-slate-500">
                Welcome to Give and Get Marin. Loading your business dashboard...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
