import React from 'react';
import { Cake, Sparkles, Building2, Utensils, Music, ChevronRight } from 'lucide-react';

interface QuickChip {
  id: string;
  name: string;
  targetId: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const QUICK_CHIPS: QuickChip[] = [
  { id: 'cakes', name: 'Cakes', targetId: '#cakes', icon: Cake, tag: 'Bespoke Baking' },
  { id: 'decorations', name: 'Decorations', targetId: '#event-services', icon: Sparkles, tag: 'Stage & Ambiance' },
  { id: 'halls', name: 'Halls', targetId: '#event-services', icon: Building2, tag: 'Venue Booking' },
  { id: 'rentals', name: 'Rentals', targetId: '#event-services', icon: Utensils, tag: 'Cooking Utensils' },
  { id: 'musicians', name: 'Musicians', targetId: '#event-services', icon: Music, tag: 'Live Entertainment' },
];

interface QuickServicesChipsProps {
  onSelectService?: (serviceType: 'cakes' | 'events') => void;
}

export const QuickServicesChips: React.FC<QuickServicesChipsProps> = ({ onSelectService }) => {
  return (
    <section id="quick-services" className="relative py-6 bg-white border-b border-stone-100 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-stone-500 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Quick Services
          </span>
          <span className="text-[11px] text-stone-400 font-sans hidden sm:inline">
            Scroll or tap to browse in app
          </span>
        </div>

        {/* Small Horizontal Scrollable Service Chips */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar py-1">
          {QUICK_CHIPS.map((chip) => {
            const Icon = chip.icon;
            const handleClick = (e: React.MouseEvent) => {
              if (onSelectService) {
                e.preventDefault();
                onSelectService(chip.id === 'cakes' ? 'cakes' : 'events');
              }
            };

            return (
              <a
                key={chip.id}
                href={chip.targetId}
                onClick={handleClick}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-stone-50 hover:bg-amber-500/10 border border-stone-200/80 hover:border-amber-400 text-stone-800 hover:text-amber-900 transition-all shadow-xs hover:shadow-sm shrink-0 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform shadow-xs">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-sans font-semibold text-xs text-stone-900 group-hover:text-amber-950">
                    {chip.name}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono -mt-0.5">
                    {chip.tag}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
