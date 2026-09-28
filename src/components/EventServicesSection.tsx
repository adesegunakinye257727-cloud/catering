import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  Utensils,
  Music2,
  CalendarCheck,
  ArrowRight,
  CheckCircle2,
  MapPin,
} from 'lucide-react';

interface EventServiceItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  highlights: string[];
  icon: React.ComponentType<{ className?: string }>;
  whatsappMessage: string;
}

const EVENT_SERVICES: EventServiceItem[] = [
  {
    id: 'decorations',
    title: 'Decorations',
    category: 'Stage & Ambiance',
    summary:
      'Transforming your wedding, birthday, or engagement hall into a breathtaking space with royal stage backdrops, custom floral archways, high-table styling, and romantic ambient lighting.',
    highlights: [
      'Alaga / Traditional Engagement stage backdrops',
      'Bridal high-table luxury drapery & centerpieces',
      'Entrance floral archways and walkway carpets',
      'Customized photo booth & step-and-repeat backdrops',
    ],
    icon: Sparkles,
    whatsappMessage: 'Hello Mrs. Kolawole, I would like to enquire about your Event Decoration services.',
  },
  {
    id: 'hall-booking',
    title: 'Hall Booking',
    category: 'Venue Coordination',
    summary:
      'Finding the perfect venue with adequate capacity, stable generator power, secure parking, and clean facilities across Idowa-Ijebu and Ogun State. We handle date reservation liaisons for you.',
    highlights: [
      'Venue capacity guidance for your guest list',
      'Inspection of ventilation, AC & generator power',
      'Date reservation liaison with event hall management',
      'Proximity and parking logistics for invited guests',
    ],
    icon: Building2,
    whatsappMessage: 'Hello Mrs. Kolawole, I would like assistance with Hall Booking for my event.',
  },
  {
    id: 'rentals',
    title: 'Utensil Rentals',
    category: 'Cooking & Party Equipment',
    summary:
      'Heavy-duty cooking equipment and banquet infrastructure ready for your family cooks and caterers. We deliver on time to your venue so preparation runs seamlessly without equipment shortage.',
    highlights: [
      'Giant cast-iron cooking pots & industrial burners',
      'Stainless steel food warming chafers & spoons',
      'Commercial cooling tubs & mobile drink coolers',
      'Banquet tables, comfortable chairs & table covers',
    ],
    icon: Utensils,
    whatsappMessage: 'Hello Mrs. Kolawole, I would like to rent cooking utensils and party equipment for my event.',
  },
  {
    id: 'musicians',
    title: 'Musicians',
    category: 'Live Entertainment',
    summary:
      'Elevating the joy of your event with trusted musical talent. From traditional Yoruba talking drummers and live gospel/juju bands to professional DJs and charismatic masters of ceremonies.',
    highlights: [
      'Live traditional cultural drummers & percussion',
      'Experienced wedding reception DJs & MCs',
      'Concert-grade speakers and microphone systems',
      'Seamless coordination with church & family itinerary',
    ],
    icon: Music2,
    whatsappMessage: 'Hello Mrs. Kolawole, I would like to enquire about musicians and entertainment for my event.',
  },
  {
    id: 'event-support',
    title: 'Event Support',
    category: 'Full Coordination',
    summary:
      'Stress-free event management so celebrants and families can simply enjoy their special day. We coordinate arrival timelines, supervise vendor setups, and maintain smooth flow from opening to finale.',
    highlights: [
      'Pre-event checklist and itinerary creation',
      'On-site supervision of cake and rental deliveries',
      'Family reception protocol and ushering guidance',
      'Real-time problem solving throughout the ceremony',
    ],
    icon: CalendarCheck,
    whatsappMessage: 'Hello Mrs. Kolawole, I would like to discuss full Event Preparation Support.',
  },
];

export const EventServicesSection: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>('decorations');

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? '' : id));
  };

  return (
    <section id="event-services" className="relative py-20 sm:py-28 bg-white text-stone-900 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 text-xs font-mono uppercase tracking-[0.2em] mb-4">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Serving Idowa-Ijebu &amp; Ogun State</span>
            </div>

            <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 mb-3">
              Event Services
            </h2>

            <p className="font-sans text-stone-600 text-sm sm:text-base font-light leading-relaxed">
              We bring together decor, halls, utensils, and music into one cohesive experience. Everything you need is handled in one place with care.
            </p>
          </div>

          <div className="shrink-0">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-md hover:scale-105 cursor-pointer"
            >
              <span>Book Event Services</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 
          Interactive Cards for:
          Decorations, Hall Booking, Utensil Rentals, Musicians, Event Support
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVENT_SERVICES.map((srv) => {
            const Icon = srv.icon;
            const isExpanded = expandedId === srv.id;

            return (
              <div
                key={srv.id}
                className={`bg-stone-50 border rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all shadow-xs hover:shadow-md ${
                  isExpanded ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-500/5' : 'border-stone-200/90'
                }`}
              >
                <div>
                  {/* Top Bar with Icon & Category */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 text-amber-700 flex items-center justify-center shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800 font-semibold bg-amber-500/15 px-3 py-1 rounded-full">
                      {srv.category}
                    </span>
                  </div>

                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-950 mb-2">
                    {srv.title}
                  </h3>

                  <p className="text-stone-600 text-xs sm:text-sm font-light leading-relaxed mb-4">
                    {srv.summary}
                  </p>

                  {/* Highlights List */}
                  <div className="space-y-2 pt-3 border-t border-stone-200/70 mb-5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block font-semibold">
                      Key Highlights:
                    </span>
                    {srv.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="pt-4 border-t border-stone-200/70 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-mono text-stone-400">
                    Idowa-Ijebu &amp; Ogun State
                  </span>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs tracking-wide transition-all cursor-pointer"
                  >
                    <span>Enquire Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
