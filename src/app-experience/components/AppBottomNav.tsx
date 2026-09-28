import React from 'react';
import { Home, Cake, CalendarDays, ClipboardList, MoreHorizontal } from 'lucide-react';

export type AppTab = 'home' | 'cakes' | 'events' | 'planner' | 'more';

interface AppBottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const AppBottomNav: React.FC<AppBottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'home' as AppTab,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'cakes' as AppTab,
      label: 'Cakes',
      icon: Cake,
    },
    {
      id: 'events' as AppTab,
      label: 'Events',
      icon: CalendarDays,
    },
    {
      id: 'planner' as AppTab,
      label: 'Planner',
      icon: ClipboardList,
      highlight: true,
    },
    {
      id: 'more' as AppTab,
      label: 'More',
      icon: MoreHorizontal,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0c0a]/95 backdrop-blur-xl border-t border-amber-500/20 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] select-none"
      aria-label="App Navigation"
    >
      <div className="max-w-lg mx-auto px-3 py-2 flex items-center justify-around pb-safe">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.highlight) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className="relative -top-2 flex flex-col items-center group cursor-pointer focus:outline-none"
                aria-label={tab.label}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-stone-950 scale-105 shadow-amber-500/40 ring-2 ring-amber-300'
                      : 'bg-stone-900 border border-amber-500/30 text-amber-400 hover:border-amber-400 hover:scale-105 shadow-black/40'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span
                  className={`text-[10px] mt-1 font-semibold tracking-wide transition-colors ${
                    isActive ? 'text-amber-400 font-bold' : 'text-stone-400 group-hover:text-stone-200'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 relative transition-colors cursor-pointer group focus:outline-none ${
                isActive ? 'text-amber-400' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {/* Active glow indicator pill */}
              {isActive && (
                <span className="absolute -top-2 w-8 h-1 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              )}
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-amber-500/15' : 'group-hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'stroke-[2.2]' : ''}`} />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
