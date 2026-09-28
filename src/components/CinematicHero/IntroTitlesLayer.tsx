import React from 'react';
import { MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

interface IntroTitlesLayerProps {
  progress: number;
}

export const IntroTitlesLayer: React.FC<IntroTitlesLayerProps> = ({ progress }) => {
  // Title is fully visible at progress 0, fades out smoothly by progress 0.12 so video becomes dominant
  const opacity = Math.max(0, 1 - progress * 8.0);
  const translateY = -progress * 90;
  const scale = 1 - progress * 0.1;

  if (opacity <= 0.01) return null;

  return (
    <div
      id="intro-titles"
      className="absolute inset-0 flex flex-col justify-between items-center py-6 sm:py-10 px-4 sm:px-6 select-none z-20"
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        willChange: 'opacity, transform',
      }}
    >
      {/* Top Header Eyebrow */}
      <div className="w-full max-w-5xl flex justify-between items-center text-[10px] sm:text-xs tracking-[0.25em] text-[#E5A84B] font-mono uppercase">
        <span className="flex items-center gap-1.5 sm:gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E5A84B] animate-pulse" />
          Idowa-Ijebu, Ogun State
        </span>
        <span className="hidden sm:inline text-stone-400/80 font-sans tracking-widest text-[11px]">
          One-Stop Event Preparation
        </span>
        <span className="text-stone-300/80">Nigeria</span>
      </div>

      {/* Main Hero Messaging */}
      <div className="text-center max-w-3xl flex flex-col items-center px-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[10px] sm:text-xs font-mono uppercase tracking-widest mb-3">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Event Preparation &amp; Service Specialist
        </div>

        <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-2 sm:mb-3 bg-gradient-to-b from-[#FFFDF9] via-[#E8C68C] to-[#A37424] bg-clip-text text-transparent drop-shadow-2xl">
          OREOFE HOLLuwar
        </h1>
        <h2 className="font-cinzel text-lg sm:text-2xl md:text-3xl font-semibold tracking-[0.2em] text-amber-200/90 uppercase mb-3 sm:mb-4">
          CAKE &amp; EVENT
        </h2>

        <p className="font-cinzel text-base sm:text-xl md:text-2xl text-stone-100 font-medium tracking-wide mb-2 sm:mb-3 max-w-2xl">
          &ldquo;Everything You Need for Your Special Event&rdquo;
        </p>

        <p className="font-sans text-xs sm:text-sm md:text-base text-stone-300/90 font-light leading-relaxed max-w-xl mb-5 sm:mb-6">
          Cakes, decorations, rentals, venue booking and more &mdash; helping you bring your event together beautifully.
        </p>

        {/* Action CTAs (pointer-events-auto ensures buttons can be clicked directly) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pointer-events-auto">
          <a
            href="https://wa.me/2348057339399?text=Hello%20Oreofe%20HolluWar%20Cake%20and%20Event%2C%20I%20would%20like%20to%20enquire%20about%20your%20event%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href="#services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-stone-200 hover:text-white border border-white/20 font-medium text-xs sm:text-sm backdrop-blur-md transition-all cursor-pointer"
          >
            <span>Explore Our Services</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </a>
        </div>
      </div>

      {/* Bottom Drag Prompt */}
      <div className="flex flex-col items-center gap-1.5 text-stone-400/80">
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-amber-300/80">
          Drag Left / Right to Control Video &bull; Scroll to Explore
        </span>
        <div className="w-[1px] h-6 sm:h-9 bg-gradient-to-b from-[#E5A84B] to-transparent animate-pulse" />
      </div>
    </div>
  );
};
