import React, { useState } from 'react';
import {
  Cake as CakeIcon,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  Clock,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { APP_CAKES, AppCake } from '../data/appData';
import { AppTab } from '../components/AppBottomNav';

interface AppCakesTabProps {
  onNavigateTab: (tab: AppTab, prefill?: any) => void;
  onSelectCake: (cake: AppCake) => void;
}

export const AppCakesTab: React.FC<AppCakesTabProps> = ({ onNavigateTab, onSelectCake }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filterSearch, setFilterSearch] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Cakes' },
    { id: 'wedding', label: 'Wedding' },
    { id: 'birthday', label: 'Birthday' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'celebration', label: 'Celebration' },
    { id: 'custom', label: 'Custom' },
  ];

  const filteredCakes = APP_CAKES.filter((cake) => {
    const matchesCategory = activeCategory === 'all' || cake.category === activeCategory;
    const matchesSearch =
      cake.title.toLowerCase().includes(filterSearch.toLowerCase()) ||
      cake.description.toLowerCase().includes(filterSearch.toLowerCase()) ||
      cake.flavorHighlights.some((f) => f.toLowerCase().includes(filterSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24 text-stone-900">
      {/* Tab Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[11px] font-mono uppercase font-semibold">
          <CakeIcon className="w-3.5 h-3.5 text-amber-600" />
          <span>Handcrafted Bakery Studio</span>
        </div>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-tight text-stone-950">
          Centerpiece Cakes
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-light">
          Browse by celebration category or request a customized fondant theme.
        </p>
      </div>

      {/* Category Pills Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm shadow-amber-500/30'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-amber-400 hover:text-stone-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Cake Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {filteredCakes.map((cake) => (
          <div
            key={cake.id}
            className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-400/80 transition-all flex flex-col justify-between group"
          >
            {/* Cake Photo */}
            <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-stone-100">
              <img
                src={cake.imageUrl}
                alt={cake.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-amber-300 font-mono text-[10px] font-semibold uppercase">
                  {cake.categoryLabel}
                </span>
                {cake.popular && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 font-mono text-[10px] font-bold uppercase shadow-sm">
                    Popular
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-stone-950 mb-1">
                  {cake.title}
                </h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed mb-3">
                  {cake.description}
                </p>

                {/* Tier specs */}
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{cake.tierInfo}</span>
                </div>

                {/* Flavors */}
                <div className="space-y-1.5 mb-2">
                  <span className="text-[10px] font-mono uppercase text-stone-400 font-semibold block">
                    Signature Flavors:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cake.flavorHighlights.map((flavor, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px]"
                      >
                        {flavor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-[11px] text-stone-500">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span className="truncate">{cake.leadTime}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab('planner', { selectedCake: cake.title, eventType: cake.category })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <span>Select for Plan</span>
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Cake Box */}
      <div className="rounded-3xl bg-amber-500/10 border border-amber-500/25 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="font-cinzel text-base sm:text-lg font-bold text-stone-950">
            Have a custom inspiration picture?
          </h4>
          <p className="text-xs text-stone-600 font-light mt-0.5 max-w-md">
            Mrs. Kolawole handles bespoke multi-tier and sculpted cakes matching any color theme.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('planner', { selectedCake: 'Custom Concept Cake', needDetails: 'Custom Cake' })}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider shrink-0 transition-all cursor-pointer"
        >
          <span>Start Custom Cake Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
