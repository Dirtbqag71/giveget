import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Business, ExchangeAmount } from '../../types';
import {
  Search,
  Filter,
  Star,
  CheckCircle2,
  MapPin,
  ArrowUpDown,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface DiscoverScreenProps {
  onSelectBusiness: (businessId: string) => void;
  onProposeExchange: (businessId: string) => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  onSelectBusiness,
  onProposeExchange,
}) => {
  const { businesses, currentBusiness } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAmount, setSelectedAmount] = useState<number | 'all'>('all');
  const [filterNeedsOnly, setFilterNeedsOnly] = useState(false);
  const [filterOffersOnly, setFilterOffersOnly] = useState(false);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'Chiropractic / Wellness', label: 'Wellness & Health' },
    { id: 'Restaurant', label: 'Restaurants & Food' },
    { id: 'Photography & Video', label: 'Creative & Media' },
    { id: 'Printing & Signage', label: 'Printing & Paper' },
    { id: 'Commercial Cleaning', label: 'Cleaning & Facilities' },
    { id: 'Auto Services', label: 'Auto & Fleet' },
  ];

  const filteredBusinesses = businesses.filter((b) => {
    // Don't show current business in discover list
    if (b.id === currentBusiness.id) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.name.toLowerCase().includes(q);
      const matchCat = b.category.toLowerCase().includes(q);
      const matchDesc = b.description.toLowerCase().includes(q);
      const matchCity = b.city.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchDesc && !matchCity) return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && b.category !== selectedCategory) {
      return false;
    }

    // Amount filter
    if (selectedAmount !== 'all') {
      if (!b.supportedAmounts.includes(selectedAmount as ExchangeAmount)) {
        return false;
      }
    }

    // Special match filters
    if (filterNeedsOnly && b.id !== 'marin-spine') {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Search and Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Discover Local Businesses
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Exchange equal-value business credits with verified companies across Marin County.
        </p>
      </div>

      {/* Large Search Bar - Inspired by Airbnb & Faire */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="What type of business are you looking for? (e.g. Chiropractor, Photography, Printing)"
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
        />
      </div>

      {/* Category Pills & Quick Filter Controls */}
      <div className="space-y-3">
        {/* Category horizontal scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Secondary Filters Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-medium text-slate-500">Amount:</span>
            {['all', 50, 100, 200, 300, 500].map((amt) => (
              <button
                key={amt}
                onClick={() => setSelectedAmount(amt as any)}
                className={`px-2.5 py-1 rounded-lg font-bold font-tabular cursor-pointer ${
                  selectedAmount === amt
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {amt === 'all' ? 'All Values' : `$${amt}`}
              </button>
            ))}
          </div>

          {/* Quick toggle chips */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterNeedsOnly(!filterNeedsOnly)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterNeedsOnly
                  ? 'bg-blue-50 text-blue-700 border border-blue-300'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Has Something I Need
            </button>
          </div>
        </div>
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredBusinesses.map((biz) => {
          const isTopMatch = biz.id === 'marin-spine';

          return (
            <div
              key={biz.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Visual Header / Cover Canvas */}
                <div className="relative h-32 bg-gradient-to-br from-slate-100 via-blue-50/50 to-slate-100 p-4 flex flex-col justify-between border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200">
                      {biz.category}
                    </span>

                    {isTopMatch ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-700 bg-blue-100/90 px-2.5 py-1 rounded-md border border-blue-200">
                        <Sparkles className="w-3 h-3 text-blue-600" />
                        96% MATCH
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white/80 px-2 py-0.5 rounded">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {biz.city}, CA
                      </span>
                    )}
                  </div>

                  {/* Business Monogram / Logo Badge */}
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-white text-base shadow-sm ring-2 ring-white"
                      style={{ backgroundColor: biz.accentColor || '#2563EB' }}
                    >
                      {biz.logoInitial}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {biz.name}
                      </h3>
                      <p className="text-xs text-slate-500">{biz.representative.firstName} {biz.representative.lastName} · {biz.representative.jobTitle}</p>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {biz.description}
                  </p>

                  {/* Trust & Exchanges Stats */}
                  <div className="flex items-center justify-between text-xs text-slate-500 py-1 border-y border-slate-100">
                    <div className="flex items-center gap-1 text-slate-800 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{biz.rating}</span>
                      <span className="text-slate-400 font-normal">({biz.reviewCount})</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold text-slate-800">{biz.completedExchanges}</span>
                      <span>completed trades</span>
                    </div>
                  </div>

                  {/* Denominations */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Available Exchange Credits
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {biz.supportedAmounts.map((amt) => (
                        <span
                          key={amt}
                          className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[11px] font-bold font-tabular text-slate-700"
                        >
                          ${amt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 pt-0 flex gap-2">
                <button
                  onClick={() => onSelectBusiness(biz.id)}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer text-center"
                >
                  View Profile
                </button>
                <button
                  onClick={() => onProposeExchange(biz.id)}
                  className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                >
                  Propose $100
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
