import React from 'react';
import {
  LayoutDashboard,
  Film,
  Clock,
  Settings,
  Sparkles,
  ExternalLink,
  Cloud,
  Database,
  ChevronRight,
  ShieldCheck,
  BarChart3,
  Quote,
  Image as ImageIcon,
  User,
} from 'lucide-react';

export type AdminTabType =
  | 'dashboard'
  | 'services-offered'
  | 'conversation-cta'
  | 'about-olf'
  | 'cinematic-video'
  | 'event-types'
  | 'stats'
  | 'testimonials'
  | 'timeline'
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTabType;
  onTabSelect: (tab: AdminTabType) => void;
  onViewPublicSite: () => void;
  firestoreStatus?: 'connected' | 'offline' | 'fallback';
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabSelect,
  onViewPublicSite,
  firestoreStatus = 'connected',
}) => {
  const navItems = [
    {
      id: 'services-offered' as const,
      label: 'Services Offered',
      icon: Sparkles,
      badge: '8 Items',
      enabled: true,
    },
    {
      id: 'conversation-cta' as const,
      label: 'Conversation Banner',
      icon: ImageIcon,
      badge: 'Live',
      enabled: true,
    },
    {
      id: 'about-olf' as const,
      label: 'About Us',
      icon: User,
      badge: 'Live',
      enabled: true,
    },
    {
      id: 'cinematic-video' as const,
      label: 'Cinematic Video',
      icon: Film,
      badge: 'Active',
      enabled: true,
    },
    {
      id: 'event-types' as const,
      label: 'Event Types',
      icon: Sparkles,
      badge: 'Live',
      enabled: true,
    },
    {
      id: 'stats' as const,
      label: 'Animated Stats',
      icon: BarChart3,
      badge: 'Live',
      enabled: true,
    },
    {
      id: 'testimonials' as const,
      label: 'Testimonials',
      icon: Quote,
      badge: 'Live',
      enabled: true,
    },
    {
      id: 'timeline' as const,
      label: 'Timeline',
      icon: Clock,
      badge: 'Phase 2',
      enabled: false,
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
      badge: 'Future',
      enabled: false,
    },
  ];

  return (
    <aside className="w-64 bg-[#0d0c0a] border-r border-white/10 flex flex-col justify-between shrink-0 select-none">
      {/* Brand & Studio Title */}
      <div>
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-amber-500/10">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-white text-base tracking-wide">
                D&apos;ATELIER
              </h1>
              <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 block -mt-0.5">
                Cinematic Engine
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-4 space-y-1">
          <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-2">
            Navigation
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isClickable = item.enabled;

            return (
              <button
                key={item.id}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onTabSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20'
                    : isClickable
                    ? 'text-stone-300 hover:text-white hover:bg-white/5 cursor-pointer'
                    : 'text-stone-500 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </div>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : isClickable
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-white/5 text-stone-500'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Integration Status & Switch to Public Site */}
      <div className="p-4 border-t border-white/5 space-y-3">
        {/* Cloudinary Integration Badge */}
        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Cloud className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-stone-300 text-[11px]">Cloudinary</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            tomxzhw2
          </span>
        </div>

        {/* Firestore Database Badge */}
        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-stone-300 text-[11px]">Firestore</span>
          </div>
          <span className="text-[10px] font-mono text-stone-300 flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                firestoreStatus === 'connected'
                  ? 'bg-emerald-400'
                  : firestoreStatus === 'fallback'
                  ? 'bg-amber-400'
                  : 'bg-stone-500'
              }`}
            />
            catering-37587
          </span>
        </div>

        {/* Switch to Public Site button */}
        <button
          type="button"
          onClick={onViewPublicSite}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-medium transition-colors border border-white/10 cursor-pointer"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
        </button>
      </div>
    </aside>
  );
};
