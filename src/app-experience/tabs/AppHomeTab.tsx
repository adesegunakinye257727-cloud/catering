import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  Cake,
  CalendarDays,
  PartyPopper,
  Tag,
  Star,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { AppTab } from '../components/AppBottomNav';
import { APP_CAKES, APP_PROMOTIONS, AppCake, AppEventService, APP_SERVICES } from '../data/appData';

interface AppHomeTabProps {
  onNavigateTab: (tab: AppTab, prefill?: any) => void;
  onSelectCake: (cake: AppCake) => void;
}

export const AppHomeTab: React.FC<AppHomeTabProps> = ({ onNavigateTab, onSelectCake }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Live search filtering across cakes and services
  const filteredCakes = APP_CAKES.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = APP_SERVICES.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasSearch = searchQuery.trim().length > 0;

  const eventCategories = [
    { id: 'wedding', name: 'Wedding', icon: '💍', subtitle: 'Royal Stage & Cakes' },
    { id: 'birthday', name: 'Birthday', icon: '🎂', subtitle: 'Milestone Jubilees' },
    { id: 'engagement', name: 'Engagement', icon: '🥁', subtitle: 'Traditional Alaga' },
    { id: 'celebration', name: 'Celebration', icon: '✨', subtitle: 'Family Gatherings' },
    { id: 'other', name: 'Rentals & More', icon: '🍳', subtitle: 'Utensils & Halls' },
  ];

  return (
    <div className="space-y-6 pb-24 text-stone-900">
      {/* 1. App Search Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cakes, events or services..."
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 p-1 rounded-full text-stone-400 hover:text-stone-700 text-xs bg-stone-100"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* If Searching, show instant matched results */}
      {hasSearch && (
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
              Search Results ({filteredCakes.length + filteredServices.length})
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-amber-700 font-medium hover:underline"
            >
              Clear
            </button>
          </div>

          {filteredCakes.length === 0 && filteredServices.length === 0 ? (
            <p className="text-xs text-stone-500 text-center py-4 font-mono">
              No matching cakes or services found for &ldquo;{searchQuery}&rdquo;.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredCakes.map((cake) => (
                <div
                  key={cake.id}
                  onClick={() => onSelectCake(cake)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors border border-transparent hover:border-stone-200"
                >
                  <img
                    src={cake.imageUrl}
                    alt={cake.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono text-amber-700 uppercase font-semibold">
                      Cake • {cake.categoryLabel}
                    </span>
                    <h4 className="text-xs font-bold text-stone-900 truncate">
                      {cake.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate">{cake.tierInfo}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                </div>
              ))}

              {filteredServices.map((srv) => (
                <div
                  key={srv.id}
                  onClick={() => onNavigateTab('events')}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors border border-transparent hover:border-stone-200"
                >
                  <img
                    src={srv.imageUrl}
                    alt={srv.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono text-amber-700 uppercase font-semibold">
                      Service • {srv.category}
                    </span>
                    <h4 className="text-xs font-bold text-stone-900 truncate">
                      {srv.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate">{srv.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Large Featured Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#12100e] via-[#1a1714] to-[#26201b] border border-amber-500/30 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-mono uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Event Hub</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            Plan Your Celebration in Minutes
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-md">
            Custom wedding &amp; milestone cakes, royal stage decor, cooking utensil rentals, and celebration support in Idowa-Ijebu.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => onNavigateTab('planner')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/30 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Launch Event Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('cakes')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-medium transition-all cursor-pointer"
            >
              <span>Browse Cakes</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Popular Event Categories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-stone-950">
            Popular Event Categories
          </h3>
          <button
            type="button"
            onClick={() => onNavigateTab('events')}
            className="text-xs text-amber-800 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {eventCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onNavigateTab('planner', { eventType: cat.id })}
              className="bg-white border border-stone-200/90 hover:border-amber-400 rounded-2xl p-3.5 text-left transition-all hover:shadow-md group cursor-pointer flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div>
                <span className="font-cinzel text-xs font-bold text-stone-900 block group-hover:text-amber-800 transition-colors">
                  {cat.name}
                </span>
                <span className="text-[10px] text-stone-500 font-sans block truncate">
                  {cat.subtitle}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Featured Cakes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-stone-950">
              Featured Centerpiece Cakes
            </h3>
            <p className="text-[11px] text-stone-500 font-sans">
              Hand-baked and styled by Mrs. Kolawole
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('cakes')}
            className="text-xs text-amber-800 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>See All Cakes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 snap-x no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {APP_CAKES.map((cake) => (
            <div
              key={cake.id}
              onClick={() => onSelectCake(cake)}
              className="w-64 sm:w-72 shrink-0 snap-start bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                <img
                  src={cake.imageUrl}
                  alt={cake.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-amber-300 font-mono text-[10px] font-semibold uppercase">
                    {cake.categoryLabel}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                    {cake.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-light line-clamp-2 mt-0.5">
                    {cake.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-stone-600 font-medium truncate">
                    {cake.tierInfo}
                  </span>
                  <span className="text-amber-700 font-semibold shrink-0">View Details &rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Promotions / Recommendations */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-amber-600" />
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-stone-950">
            Promotions &amp; Packages
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {APP_PROMOTIONS.map((promo) => (
            <div
              key={promo.id}
              className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-900">
                    {promo.badge}
                  </span>
                </div>
                <h4 className="font-cinzel text-sm sm:text-base font-bold text-stone-950">
                  {promo.title}
                </h4>
                <p className="text-[11px] text-amber-900/80 font-medium mb-1.5">
                  {promo.subtitle}
                </p>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {promo.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab(promo.targetTab)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-semibold text-xs transition-all cursor-pointer"
              >
                <span>{promo.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
