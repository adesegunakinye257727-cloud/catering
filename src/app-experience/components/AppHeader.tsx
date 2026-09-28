import React from 'react';
import { ArrowLeft, Sparkles, MapPin } from 'lucide-react';
import { AppTab } from './AppBottomNav';

interface AppHeaderProps {
  activeTab: AppTab;
  onReturnToHomepage: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ activeTab, onReturnToHomepage }) => {
  const getTabTitle = (tab: AppTab) => {
    switch (tab) {
      case 'home':
        return 'Event & Cake Hub';
      case 'cakes':
        return 'Cake Gallery';
      case 'events':
        return 'Event Services';
      case 'planner':
        return 'Event Planner';
      case 'more':
        return 'Information & Guide';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0d0c0a]/95 backdrop-blur-md border-b border-amber-500/20 px-4 py-3 select-none">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-md shadow-amber-500/20">
            <span className="font-cinzel text-sm">O</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-cinzel text-xs sm:text-sm font-bold text-white tracking-wider">
                OREOFE HOLLUWAR
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 font-semibold uppercase">
                App
              </span>
            </div>
            <p className="text-[11px] text-amber-400/90 font-medium">
              {getTabTitle(activeTab)}
            </p>
          </div>
        </div>

        {/* Right: Quick Action to Return to Story Homepage */}
        <button
          type="button"
          onClick={onReturnToHomepage}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-stone-200 hover:text-white text-xs font-medium transition-all hover:scale-105 cursor-pointer"
          title="Return to the Cinematic Brand Homepage"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xs:inline text-[11px]">Brand Story</span>
        </button>
      </div>
    </header>
  );
};
