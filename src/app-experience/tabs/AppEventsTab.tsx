import React, { useState } from 'react';
import {
  CalendarDays,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  Utensils,
  Music2,
  CalendarCheck,
  MapPin,
} from 'lucide-react';
import { APP_SERVICES, AppEventService } from '../data/appData';
import { AppTab } from '../components/AppBottomNav';

interface AppEventsTabProps {
  onNavigateTab: (tab: AppTab, prefill?: any) => void;
}

export const AppEventsTab: React.FC<AppEventsTabProps> = ({ onNavigateTab }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'All Services' },
    { id: 'wedding', label: 'Weddings' },
    { id: 'birthday', label: 'Birthdays' },
    { id: 'engagement', label: 'Engagements' },
    { id: 'celebration', label: 'Celebrations & Rentals' },
  ];

  const filteredServices = APP_SERVICES.filter((srv) => {
    if (selectedFilter === 'all') return true;
    return srv.eventType === selectedFilter || srv.id.includes(selectedFilter);
  });

  return (
    <div className="space-y-6 pb-24 text-stone-900">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[11px] font-mono uppercase font-semibold">
          <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
          <span>Full Celebration Management</span>
        </div>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-tight text-stone-950">
          Event Types &amp; Services
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-light">
          From stage decorations to large community cooking utensils and sound in Ogun State.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {filterTabs.map((tab) => {
          const isSelected = selectedFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-amber-400'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Services List */}
      <div className="space-y-5">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col md:flex-row group"
          >
            {/* Image */}
            <div className="relative md:w-5/12 h-52 md:h-auto overflow-hidden bg-stone-100 shrink-0">
              <img
                src={srv.imageUrl}
                alt={srv.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-amber-300 font-mono text-[10px] font-semibold uppercase">
                  {srv.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:w-7/12 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-stone-950 mb-1.5">
                  {srv.title}
                </h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed mb-4">
                  {srv.description}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5 pt-3 border-t border-stone-100">
                  <span className="text-[10px] font-mono text-stone-400 uppercase font-semibold block">
                    What is Included:
                  </span>
                  {srv.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-stone-400">
                  Idowa-Ijebu, Ogun State
                </span>

                <button
                  type="button"
                  onClick={() =>
                    onNavigateTab('planner', {
                      eventType: srv.eventType,
                      preselectedService: srv.title,
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs transition-all hover:scale-105 cursor-pointer"
                >
                  <span>Add to Planner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
