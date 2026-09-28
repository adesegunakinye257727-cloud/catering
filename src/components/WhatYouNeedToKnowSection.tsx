import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ArrowRight,
  ChevronUp,
  MessageCircle,
} from 'lucide-react';
import {
  ServiceOfferedItem,
  INITIAL_SERVICES_OFFERED,
  subscribeToServicesOffered,
} from '../services/servicesOfferedService';

interface WhatYouNeedToKnowSectionProps {
  onExploreService?: (serviceId?: string) => void;
}

export const WhatYouNeedToKnowSection: React.FC<WhatYouNeedToKnowSectionProps> = ({
  onExploreService,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [services, setServices] = useState<ServiceOfferedItem[]>(INITIAL_SERVICES_OFFERED);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [manualCardIndex, setManualCardIndex] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Subscribe to real-time updates from Firestore/local cache
  useEffect(() => {
    const handleServices = (data: ServiceOfferedItem[]) => {
      const activeServices = data.filter((item) => item.enabled !== false);
      if (activeServices.length > 0) {
        setServices(activeServices);
      }
    };

    const unsubscribe = subscribeToServicesOffered(handleServices);

    const onCustomUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ServiceOfferedItem[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        handleServices(customEvent.detail);
      }
    };
    window.addEventListener('oreofe_services_updated', onCustomUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('oreofe_services_updated', onCustomUpdate);
    };
  }, []);

  const cardCount = services.length;

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const totalScrollable = rect.height - window.innerHeight;
    if (totalScrollable <= 0) return;

    const rawProgress = -rect.top / totalScrollable;
    const progress = Math.min(1.0, Math.max(0.0, rawProgress));

    setScrollProgress(progress);
    if (progress > 0.05 && progress < 0.95 && manualCardIndex !== null) {
      setManualCardIndex(null);
    }
  }, [manualCardIndex]);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        handleScroll();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  const scrollSlot = scrollProgress * (cardCount - 1);
  const activeIndex =
    manualCardIndex !== null
      ? manualCardIndex
      : Math.min(cardCount - 1, Math.floor(scrollSlot));

  const fractionInSlot =
    manualCardIndex !== null ? 0 : scrollSlot - activeIndex;

  const handleAdvanceCard = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setManualCardIndex((prev) => {
      const current = prev !== null ? prev : activeIndex;
      if (current >= cardCount - 1) return 0;
      return current + 1;
    });
  };

  const handleWhatsAppInquiry = (service: ServiceOfferedItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      service.whatsappMessage ||
        `Hello Mrs. Kolawole (Oreofe HolluWar), I would like to enquire about your ${service.title} service.`
    );
    window.open(`https://wa.me/2348057339399?text=${msg}`, '_blank');
  };

  return (
    <section
      ref={containerRef}
      id="what-oreofe-offers"
      className="relative w-full h-[460vh] bg-white text-stone-900 border-b border-stone-200/80"
      aria-label="What Oreofe HolluWar Offers"
    >
      {/* 
        STICKY CARD STAGE
        Remains visually centered while the user scrolls or clicks through the card stack.
      */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
        {/* Subtle Ambient Decorative Backdrop */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/40 via-white to-white" />

        {/* Section Header */}
        <div className="relative z-10 text-center max-w-2xl mx-auto mb-4 sm:mb-6 pointer-events-none select-none">
          <h2 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 mb-1 sm:mb-2">
            What Oreofe HolluWar Offers
          </h2>
        </div>

        {/* 
          LAYERED CARD STACK CONTAINER
          Physical stacked cards with each service having its own attractive image & card.
          Upward smooth lift interaction on scroll or click.
        */}
        <div
          onClick={handleAdvanceCard}
          className="relative z-20 w-full max-w-lg sm:max-w-xl h-[490px] sm:h-[520px] flex items-center justify-center cursor-pointer"
          title="Click to advance to the next card"
        >
          {services.map((service, index) => {
            let translateY = 0;
            let scale = 1;
            let opacity = 0;
            let zIndex = 10;
            let isInteractive = false;

            if (index < activeIndex) {
              translateY = -135;
              scale = 0.95;
              opacity = 0;
              zIndex = 5;
              isInteractive = false;
            } else if (index === activeIndex) {
              if (manualCardIndex !== null || index === cardCount - 1 || fractionInSlot <= 0.35) {
                translateY = 0;
                scale = 1.0;
                opacity = 1.0;
                zIndex = 30;
                isInteractive = true;
              } else {
                const lift = (fractionInSlot - 0.35) / 0.65;
                translateY = -lift * 125;
                scale = 1.0 - lift * 0.04;
                opacity = Math.max(0, 1.0 - lift * 0.95);
                zIndex = 30;
                isInteractive = lift < 0.25;
              }
            } else if (index === activeIndex + 1) {
              if (manualCardIndex !== null || fractionInSlot <= 0.35) {
                translateY = 14;
                scale = 0.96;
                opacity = 0.85;
                zIndex = 20;
                isInteractive = false;
              } else {
                const emerge = (fractionInSlot - 0.35) / 0.65;
                translateY = (1.0 - emerge) * 14;
                scale = 0.96 + emerge * 0.04;
                opacity = 0.85 + emerge * 0.15;
                zIndex = 25;
                isInteractive = emerge > 0.75;
              }
            } else {
              const depth = index - activeIndex;
              translateY = Math.min(28, depth * 10);
              scale = Math.max(0.90, 1.0 - depth * 0.04);
              opacity = Math.max(0, 0.5 - depth * 0.15);
              zIndex = Math.max(1, 15 - depth);
              isInteractive = false;
            }

            const sequenceNum = String(index + 1).padStart(2, '0');
            const totalNum = String(cardCount).padStart(2, '0');

            return (
              <div
                key={service.id}
                className={`absolute w-full max-w-md sm:max-w-lg rounded-3xl p-5 sm:p-7 bg-[#151311] border border-amber-500/30 text-[#F9F7F4] transition-transform duration-200 will-change-transform flex flex-col justify-between ${
                  isInteractive ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
                style={{
                  height: '100%',
                  transform: `translate3d(0, ${translateY}${
                    index < activeIndex
                      ? '%'
                      : index === activeIndex && fractionInSlot > 0.35 && manualCardIndex === null
                      ? '%'
                      : 'px'
                  }, 0) scale(${scale})`,
                  opacity,
                  zIndex,
                  boxShadow:
                    '0 25px 60px -12px rgba(0, 0, 0, 0.55), 0 0 25px rgba(229, 168, 75, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.12)',
                }}
              >
                {/* 1. Large Dedicated Service Image */}
                <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-stone-900 border border-white/10 shrink-0 group">
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        // Hide broken image and show background
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-900 via-stone-950 to-[#191410] p-4 text-center">
                      <span className="font-cinzel text-lg font-bold text-amber-300 mb-1">{service.title}</span>
                      <span className="text-[11px] font-mono text-stone-400 uppercase tracking-widest">{service.tag}</span>
                    </div>
                  )}
                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-stone-950/85 backdrop-blur-md border border-amber-500/30 text-amber-300 font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                      {service.tag}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-950/85 backdrop-blur-md border border-white/15 font-cinzel text-[11px] sm:text-xs font-bold text-amber-400 tracking-wider">
                      {sequenceNum} / {totalNum}
                    </span>
                  </div>
                </div>

                {/* 2. Content Details */}
                <div className="space-y-2 pt-3 flex-1 flex flex-col justify-center">
                  <div>
                    <h3 className="font-cinzel text-lg sm:text-2xl font-bold text-white tracking-wide leading-tight">
                      {service.title}
                    </h3>
                    <div className="h-0.5 w-12 bg-gradient-to-r from-amber-400 to-transparent mt-1" />
                  </div>

                  {/* Primary Description */}
                  <p className="text-xs sm:text-sm font-medium text-amber-100/95 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>

                  {/* Why Need It Detail */}
                  <p className="text-[11px] sm:text-xs text-stone-300 font-light leading-relaxed line-clamp-2">
                    {service.whyNeedIt}
                  </p>
                </div>

                {/* 3. Action Buttons */}
                <div
                  className="flex items-center gap-2 pt-3 border-t border-white/10 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={(e) => handleWhatsAppInquiry(service, e)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Inquire via WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onExploreService) {
                        onExploreService(service.id);
                      }
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Friendly Interaction Controls (Next & Step Dots) */}
        <div className="relative z-30 flex items-center justify-between gap-4 mt-5 max-w-md w-full px-2">
          {/* Progress Dots */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {services.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setManualCardIndex(i)}
                aria-label={`Jump to service ${i + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === activeIndex
                    ? 'w-6 bg-amber-600'
                    : i < activeIndex
                    ? 'w-2 bg-stone-400'
                    : 'w-2 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>

          {/* Quick Tap Advance Control */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdvanceCard}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <span>Next</span>
              <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
