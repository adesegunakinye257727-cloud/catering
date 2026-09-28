import React, { useEffect, useState } from 'react';
import { CinematicVideoPlayer } from './CinematicVideoPlayer';
import { cinematicAudio } from './CinematicAudio';
import { subscribeToCinematicHeroConfig } from '../../services/cinematicHeroService';
import { MessageCircle, Volume2, VolumeX, Sparkles, ChevronDown } from 'lucide-react';

interface CinematicHeroProps {
  onLaunchApp?: (tab?: 'home' | 'cakes' | 'events' | 'planner' | 'more') => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({ onLaunchApp }) => {
  // Atmosphere audio state
  const [audioActive, setAudioActive] = useState<boolean>(false);

  // Connected cinematic video source from Firestore configuration (Preserved)
  const [videoSrc, setVideoSrc] = useState<string>(
    'https://res.cloudinary.com/tomxzhw2/video/upload/v1790382611/cinematic_assets/ypod2xlgp8e6zqk3gp4w.mp4'
  );

  // Subscribe to live Firestore cinematicHero configuration
  useEffect(() => {
    const unsubscribe = subscribeToCinematicHeroConfig((config) => {
      if (config.videoUrl) {
        setVideoSrc(config.videoUrl);
      }
    });
    return () => unsubscribe();
  }, []);

  // Toggle ambient culinary sound
  const handleToggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const active = cinematicAudio.toggle(0.5);
    setAudioActive(active);
  };

  return (
    <section
      id="cinematic-hero-section"
      className="relative w-full min-h-[92vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-[#080706]"
      aria-label="Cinematic Hero"
    >
      {/* 1. Underlying Autoplay Looping Cinematic Video (Preserved) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <CinematicVideoPlayer
          videoSrc={videoSrc}
          isMuted={!audioActive}
        />
      </div>

      {/* 
        2. Hero Content Layer
        - Short headline: “Let’s Make Your Event Beautiful.”
        - Buttons: “Explore Services” and “Chat on WhatsApp”
      */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center flex flex-col items-center">
        {/* Quality Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-mono uppercase tracking-[0.25em] mb-6 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Oreofe HolluWar Cake &amp; Event</span>
        </div>

        {/* Short, Friendly, High-Impact Headline */}
        <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-4 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] max-w-4xl">
          Let’s Make Your Event Beautiful.
        </h1>

        {/* Supporting Text */}
        <p className="font-sans text-base sm:text-lg md:text-xl text-stone-200 font-light max-w-xl mb-8 sm:mb-10 leading-relaxed drop-shadow-md">
          Handcrafted cakes, royal event styling, utensil rentals, and celebration support in Idowa-Ijebu, Ogun State.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-5 w-full sm:w-auto">
          {onLaunchApp ? (
            <button
              type="button"
              onClick={() => onLaunchApp('planner')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/25 transition-all hover:scale-105 cursor-pointer"
            >
              Plan My Event
            </button>
          ) : (
            <a
              href="#quick-services"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm tracking-wide shadow-xl shadow-amber-500/25 transition-all hover:scale-105 cursor-pointer"
            >
              Explore Services
            </a>
          )}

          <a
            href="https://wa.me/2348057339399?text=Hello%20Oreofe%20HolluWar%20Cake%20and%20Event%2C%20I%20would%20like%20to%20enquire%20about%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 font-medium text-sm backdrop-blur-md transition-all hover:scale-105 cursor-pointer shadow-lg"
          >
            <MessageCircle className="w-4 h-4 fill-current text-emerald-400" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Subtle Scroll Invitation */}
      <a
        href="#quick-services"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-stone-300 hover:text-amber-300 transition-colors cursor-pointer group"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono group-hover:text-amber-300">
          Explore Services
        </span>
        <ChevronDown className="w-4 h-4 text-amber-400 animate-bounce" />
      </a>

      {/* Subtle Audio Atmosphere Toggle */}
      <button
        type="button"
        onClick={handleToggleAudio}
        className="absolute bottom-6 right-6 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/15 text-stone-300 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
        title={audioActive ? 'Mute atmosphere' : 'Play atmosphere'}
        aria-label="Toggle Atmosphere Audio"
      >
        {audioActive ? (
          <Volume2 className="w-4 h-4 text-amber-400" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </button>
    </section>
  );
};
