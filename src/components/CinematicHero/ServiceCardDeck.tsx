import React from 'react';
import { Cake, Sparkles, Utensils, Building2, Music, CalendarCheck, ArrowRight, MessageCircle } from 'lucide-react';

export interface ServiceCardItem {
  id: string;
  number: string;
  title: string;
  description: string;
  details: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  link: string;
}

export const HERO_SERVICE_CARDS: ServiceCardItem[] = [
  {
    id: 'cakes',
    number: '01',
    title: 'Cakes',
    description: 'Wedding cakes, birthday cakes, engagement cakes and custom designs.',
    details: 'Masterfully baked celebration cakes tailored with exquisite fondant art, rich sponge layers, and handcrafted decorative floristry.',
    icon: Cake,
    tag: 'Artisanal Confectionery',
    link: '#cakes',
  },
  {
    id: 'decorations',
    number: '02',
    title: 'Event Decorations',
    description: 'Bespoke stage designs, floral arches, luxury table setups, and ambient lighting.',
    details: 'Breathtaking venue transformations reflecting regal elegance, custom color palettes, and royal banquet styling.',
    icon: Sparkles,
    tag: 'Venue Styling',
    link: '#event-services',
  },
  {
    id: 'rentals',
    number: '03',
    title: 'Rentals',
    description: 'Quality banquet chairs, luxury tables, canopies, cooling vans, and catering utensils.',
    details: 'High-grade ceremonial infrastructure, mobile refrigeration units, chafing dishes, and glassware delivered on schedule.',
    icon: Utensils,
    tag: 'Event Infrastructure',
    link: '#event-services',
  },
  {
    id: 'hall-booking',
    number: '04',
    title: 'Hall Booking',
    description: 'Premium event centers and banquet halls coordination for your ceremony.',
    details: 'Seamless reservations and logistical coordination at premier banquet venues and outdoor reception gardens.',
    icon: Building2,
    tag: 'Venue Coordination',
    link: '#event-services',
  },
  {
    id: 'entertainment',
    number: '05',
    title: 'Musicians & Entertainment',
    description: 'Live traditional bands, professional DJs, MCs, and sound system engineering.',
    details: 'Enthralling live musical performances, master-of-ceremonies coordination, and concert-grade acoustics for vibrant celebrations.',
    icon: Music,
    tag: 'Live Entertainment',
    link: '#event-services',
  },
  {
    id: 'event-prep',
    number: '06',
    title: 'Event Preparation',
    description: 'Complete end-to-end planning, event coordination, and vendor management.',
    details: 'Flawless ceremonial timeline orchestration, guest ushering protocols, and vendor synchronization from inception to finale.',
    icon: CalendarCheck,
    tag: 'Full Management',
    link: '#contact',
  },
];

interface ServiceCardDeckProps {
  progress: number; // 0.0 to 1.0 (scroll-driven)
}

export const ServiceCardDeck: React.FC<ServiceCardDeckProps> = ({ progress }) => {
  // Service cards active between scroll progress 0.24 and 0.88
  const DECK_START = 0.24;
  const DECK_END = 0.88;
  const cardCount = HERO_SERVICE_CARDS.length;
  const totalSpan = DECK_END - DECK_START;
  const slotSpan = totalSpan / cardCount; // ~0.106 per card

  // Overall deck visibility
  let deckOpacity = 0;
  if (progress >= DECK_START - 0.02 && progress <= DECK_END + 0.02) {
    if (progress < DECK_START + 0.03) {
      deckOpacity = Math.max(0, (progress - (DECK_START - 0.02)) / 0.05);
    } else if (progress > DECK_END - 0.03) {
      deckOpacity = Math.max(0, ((DECK_END + 0.02) - progress) / 0.05);
    } else {
      deckOpacity = 1;
    }
  }

  if (deckOpacity <= 0.001) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center px-4 sm:px-6"
      style={{ opacity: deckOpacity }}
    >
      <div className="relative w-full max-w-lg h-[430px] sm:h-[460px] flex items-center justify-center">
        {HERO_SERVICE_CARDS.map((card, index) => {
          const cardStart = DECK_START + index * slotSpan;
          const cardExit = cardStart + slotSpan;

          let translateX = 0; // percentage
          let translateY = 0; // pixels
          let scale = 1;
          let rotate = 0; // degrees
          let cardOpacity = 0;
          let zIndex = 10;
          let isInteractive = false;

          if (progress < cardStart) {
            // Card is stacked behind waiting in the deck
            // Calculate how many positions behind the current active card it is
            const distance = (cardStart - progress) / slotSpan; // e.g. 0.0 to 5.0
            
            // Physical playing-card stack coordinates:
            // Staggered slightly down & right with subtle rotation
            const stackStep = Math.min(3, distance);
            translateY = stackStep * 8;
            translateX = stackStep * 10;
            scale = Math.max(0.88, 1 - stackStep * 0.04);
            rotate = stackStep * 1.5;
            cardOpacity = Math.max(0, 0.85 - stackStep * 0.25);
            zIndex = 30 - Math.round(stackStep * 5);
          } else if (progress >= cardStart && progress <= cardExit) {
            // Card is in its active window
            const localT = (progress - cardStart) / slotSpan; // 0.0 to 1.0

            if (localT <= 0.60) {
              // Active Front Card of the Deck
              translateX = 0;
              translateY = 0;
              scale = 1;
              rotate = 0;
              cardOpacity = 1;
              zIndex = 40;
              isInteractive = true;
            } else {
              // Exiting Phase: Current card slides horizontally to the left!
              const exitT = (localT - 0.60) / 0.40; // 0.0 to 1.0
              // Ease-in movement sliding left
              translateX = -exitT * 125; // slides off-screen to the left
              translateY = -exitT * 8;
              scale = 1 - exitT * 0.06;
              rotate = -exitT * 8; // gentle counter-clockwise deal angle
              cardOpacity = Math.max(0, 1 - exitT * 1.25);
              zIndex = 45;
              isInteractive = exitT < 0.3;
            }
          } else {
            // Card has exited to the left
            translateX = -135;
            translateY = -12;
            scale = 0.9;
            rotate = -10;
            cardOpacity = 0;
            zIndex = 5;
          }

          const IconComponent = card.icon;

          return (
            <div
              key={card.id}
              className={`absolute w-full max-w-md sm:max-w-lg rounded-3xl p-6 sm:p-8 backdrop-blur-2xl border border-amber-500/30 bg-[#0d0b09]/88 text-[#F3EFEA] will-change-transform ${
                isInteractive ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
              style={{
                transform: `translate3d(${translateX}%, ${translateY}px, 0) scale(${scale}) rotate(${rotate}deg)`,
                opacity: cardOpacity,
                zIndex,
                boxShadow:
                  '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 24px rgba(229, 168, 75, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
              }}
            >
              {/* Card Header: Tag & Sequence Number */}
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-amber-300 font-semibold">
                    {card.tag}
                  </span>
                </div>
                <span className="font-cinzel text-xs sm:text-sm font-bold text-amber-400/80 tracking-widest">
                  {card.number} / 06
                </span>
              </div>

              {/* Icon & Title */}
              <div className="flex items-center gap-4 mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide">
                    {card.title}
                  </h3>
                  <div className="h-0.5 w-12 bg-gradient-to-r from-amber-400 to-transparent mt-1" />
                </div>
              </div>

              {/* Core Description */}
              <p className="text-sm sm:text-base font-medium text-amber-100/90 leading-relaxed mb-3">
                {card.description}
              </p>

              {/* Supporting Detail */}
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed mb-6 line-clamp-3">
                {card.details}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={card.link}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-amber-500/25 cursor-pointer"
                >
                  <span>Explore Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`https://wa.me/2348057339399?text=${encodeURIComponent(
                    `Hello Oreofe HolluWar, I am interested in your ${card.title} service.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 hover:text-emerald-200 transition-all cursor-pointer shadow-sm"
                  title={`Book ${card.title} on WhatsApp`}
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
