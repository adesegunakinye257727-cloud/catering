import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <div className="fixed bottom-6 left-6 z-40">
      <a
        href="https://wa.me/2348057339399?text=Hello%20Oreofe%20HolluWar%20Cake%20and%20Event%2C%20I%20would%20like%20to%20enquire%20about%20your%20services."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold text-xs shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 cursor-pointer"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline font-sans tracking-wide">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
};
