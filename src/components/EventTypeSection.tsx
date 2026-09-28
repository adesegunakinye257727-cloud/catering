import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  EventTypeCard,
  subscribeToEventTypes,
  INITIAL_EVENT_TYPES,
} from '../services/eventTypeService';

interface EventTypeSectionProps {
  onPlanEventType?: (eventType: string) => void;
}

export const EventTypeSection: React.FC<EventTypeSectionProps> = ({ onPlanEventType }) => {
  const [cards, setCards] = useState<EventTypeCard[]>(INITIAL_EVENT_TYPES);
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time Firestore updates and custom window events
  useEffect(() => {
    const handleCards = (updated: EventTypeCard[]) => {
      const activeCards = updated.filter((c) => c.enabled !== false);
      setCards(activeCards.length > 0 ? activeCards : INITIAL_EVENT_TYPES);
    };

    const unsubscribe = subscribeToEventTypes(handleCards);

    const onCustomUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<EventTypeCard[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        handleCards(customEvent.detail);
      }
    };
    window.addEventListener('oreofe_event_types_updated', onCustomUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('oreofe_event_types_updated', onCustomUpdate);
    };
  }, []);

  // Update active dot index on scroll
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.firstElementChild ? (container.firstElementChild as HTMLElement).offsetWidth : 350;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < cards.length) {
      setActiveIndex(newIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const children = container.children;
    if (children[index]) {
      (children[index] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
      setActiveIndex(index);
    }
  };

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeIndex - 1);
    scrollToIndex(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(cards.length - 1, activeIndex + 1);
    scrollToIndex(nextIdx);
  };

  return (
    <section
      id="event-type"
      className="relative py-20 sm:py-28 bg-stone-50/70 text-stone-900 border-b border-stone-200/80 overflow-hidden"
      aria-label="What Are You Planning"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Left/Right Navigation Controls for Desktop */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 text-xs font-mono uppercase tracking-[0.2em] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Tailored For Your Occasion</span>
            </div>

            <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 mb-3">
              What Are You Planning?
            </h2>

            <p className="font-sans text-stone-600 text-sm sm:text-base font-light leading-relaxed">
              Every celebration has its own personality. Choose your event type to explore how we bring the cakes, royal decor, equipment, and entertainment together.
            </p>
          </div>

          {/* Carousel Arrows (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className={`p-3 rounded-full border transition-all cursor-pointer ${
                activeIndex === 0
                  ? 'border-stone-200 text-stone-300 opacity-40 cursor-not-allowed'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-amber-500 hover:text-amber-800 hover:shadow-md'
              }`}
              aria-label="Previous event card"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={activeIndex >= cards.length - 1}
              className={`p-3 rounded-full border transition-all cursor-pointer ${
                activeIndex >= cards.length - 1
                  ? 'border-stone-200 text-stone-300 opacity-40 cursor-not-allowed'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-amber-500 hover:text-amber-800 hover:shadow-md'
              }`}
              aria-label="Next event card"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 
          CARDS CONTAINER
          Mobile:
          - Shows one large card at a time (w-[84vw]).
          - Swipe horizontally.
          - Next card is slightly visible so users know there is more.
          Desktop:
          - Horizontal carousel layout with large image cards & clear visual CTA linking to celebration details.
        */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-6 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {cards.map((card, index) => {
            return (
              <div
                key={card.id}
                className="w-[84vw] sm:w-[380px] md:w-[420px] lg:w-[440px] shrink-0 snap-start flex flex-col group relative rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-md hover:shadow-2xl hover:border-amber-400 transition-all duration-300 select-none"
              >
                {/* Large Event Image with Ambient Gradient */}
                <div className="relative h-72 sm:h-80 md:h-96 w-full overflow-hidden bg-gradient-to-br from-stone-900 via-stone-950 to-[#191410]">
                  {card.imageUrl && !failedImages[card.id] && (
                    <img
                      key={card.imageUrl}
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                      onError={() => {
                        setFailedImages((prev) => ({ ...prev, [card.id]: true }));
                      }}
                    />
                  )}

                  {/* Gradient overlays for crisp contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-stone-950/50 via-transparent to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-950/80 backdrop-blur-md border border-white/20 text-amber-300 font-mono text-[11px] font-semibold uppercase tracking-wider shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      {card.tag || 'Oreofe HolluWar'}
                    </span>

                    <span className="font-cinzel text-xs font-bold text-white/80 tracking-widest bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Card Title & Content overlayed on the large image */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white tracking-wide mb-2 drop-shadow-md">
                      {card.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-200 font-light leading-relaxed line-clamp-3 mb-4 drop-shadow-sm">
                      {card.description}
                    </p>

                    {/* Clean Visual CTA Button transitioning to App Planner or contact */}
                    {onPlanEventType ? (
                      <button
                        type="button"
                        onClick={() => onPlanEventType(card.title)}
                        className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] cursor-pointer"
                      >
                        <span>{card.ctaText || `Plan Your ${card.title}`}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                      </button>
                    ) : (
                      <a
                        href="#contact"
                        className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] cursor-pointer"
                      >
                        <span>{card.ctaText || `Plan Your ${card.title}`}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Bottom Quick Feature bar */}
                <div className="p-4 bg-white border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                  <span className="font-medium text-stone-900">
                    Cakes • Decor • Halls • Rentals
                  </span>
                  <span className="font-mono text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Available
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 
          Mobile Swipe Indicator & Dot Pagination
        */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6 select-none">
          {cards.map((card, i) => (
            <button
              key={card.id}
              type="button"
              onClick={() => scrollToIndex(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === activeIndex
                  ? 'w-8 bg-amber-600'
                  : 'w-2 bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={`Go to ${card.title} card`}
            />
          ))}
        </div>

        <p className="text-center text-[11px] text-stone-400 font-mono mt-3 sm:hidden">
          Swipe left to see more celebrations →
        </p>
      </div>
    </section>
  );
};
