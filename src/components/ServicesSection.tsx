import React from 'react';
import {
  Cake,
  Sparkles,
  Utensils,
  Building2,
  Music,
  CheckCircle,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  whatsappMessage: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'cakes',
    title: 'Cakes',
    subtitle: 'Occasion & Celebration Masterpieces',
    description:
      'Wedding cakes, birthday cakes, engagement cakes and cakes for special occasions crafted with fine taste and stunning presentation.',
    highlights: ['Wedding Cakes', 'Birthday Celebrations', 'Traditional Engagements', 'Milestone Parties'],
    icon: Cake,
    tag: 'Signature Specialty',
    whatsappMessage: 'Hello Oreofe HolluWar Cake and Event, I would like to enquire about ordering a cake for my upcoming event.',
  },
  {
    id: 'decorations',
    title: 'Event Decorations',
    subtitle: 'Transforming Venues with Elegance',
    description:
      'Beautiful decoration setups for weddings, engagements, birthdays and celebrations that create a memorable ambiance.',
    highlights: ['Stage & Backdrop Styling', 'Celebration Table Settings', 'Entrance & Walkway Decor', 'Color Theme Coordination'],
    icon: Sparkles,
    tag: 'Atmosphere & Styling',
    whatsappMessage: 'Hello Oreofe HolluWar Cake and Event, I would like to enquire about your Event Decoration services.',
  },
  {
    id: 'rentals',
    title: 'Rentals',
    subtitle: 'Cooking Utensils & Equipment',
    description:
      'Cooking utensils, event equipment and other useful items available for rental to make event cooking and hosting seamless.',
    highlights: ['Large Cooking Utensils', 'Catering & Serving Gear', 'Cooling & Warming Units', 'Event Accessories'],
    icon: Utensils,
    tag: 'Reliable Equipment',
    whatsappMessage: 'Hello Oreofe HolluWar Cake and Event, I would like to enquire about renting cooking utensils and event equipment.',
  },
  {
    id: 'hall-booking',
    title: 'Hall Booking',
    subtitle: 'Finding & Securing Your Venue',
    description:
      'Help with finding and booking a suitable event venue in Idowa-Ijebu and surrounding communities to host your guests comfortably.',
    highlights: ['Venue Recommendations', 'Capacity Matching', 'Location Coordination', 'Hassle-Free Booking Assistance'],
    icon: Building2,
    tag: 'Venue Coordination',
    whatsappMessage: 'Hello Oreofe HolluWar Cake and Event, I would like assistance with finding and booking an event hall/venue.',
  },
  {
    id: 'entertainment',
    title: 'Musicians & Entertainment',
    subtitle: 'Music, Sound & Celebratory Energy',
    description:
      'Musician and entertainment booking for celebrations and events to ensure your guests celebrate with lively rhythm and joy.',
    highlights: ['Live Musicians', 'Traditional & Contemporary Acts', 'MC & Sound Liaison', 'Celebratory Ambiance'],
    icon: Music,
    tag: 'Live Entertainment',
    whatsappMessage: 'Hello Oreofe HolluWar Cake and Event, I would like to enquire about booking musicians/entertainment for my event.',
  },
  {
    id: 'event-prep',
    title: 'Event Preparation',
    subtitle: 'Complete Hands-On Support',
    description:
      'Additional event support based on the customer’s needs, organizing all the essential moving parts so you can celebrate peacefully.',
    highlights: ['Comprehensive Checklist', 'Vendor Synchronizing', 'On-the-Day Preparation', 'Tailored Support'],
    icon: CheckCircle,
    tag: 'Full Coordination',
    whatsappMessage: 'Hello Oreofe HolluWar Cake and Event, I would like to discuss general event preparation support for my celebration.',
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="relative py-24 sm:py-32 bg-[#0c0a08] text-stone-100 overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-amber-500/[0.03] blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Comprehensive Event Services
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Everything You Need for Your Event
          </h2>

          <p className="font-sans text-stone-300 text-sm sm:text-base md:text-lg font-light leading-relaxed">
            From the first preparation to the final detail, we help make your special occasion come together.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            const waUrl = `https://wa.me/2348057339399?text=${encodeURIComponent(service.whatsappMessage)}`;

            return (
              <div
                key={service.id}
                className="group relative bg-[#14120e] hover:bg-[#181510] border border-white/10 hover:border-amber-500/40 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 shadow-xl hover:-translate-y-1"
              >
                {/* Top Row: Icon & Tag */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-stone-400">
                      0{index + 1} &bull; {service.tag}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-amber-400/80 font-medium mb-3">
                    {service.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-stone-300 leading-relaxed font-light mb-6">
                    {service.description}
                  </p>

                  {/* Key Highlights list */}
                  <ul className="space-y-2 mb-8 pt-4 border-t border-white/5">
                    {service.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-stone-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom WhatsApp CTA */}
                <div>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-stone-200 hover:text-emerald-300 text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer group/btn"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Enquire on WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover/btn:translate-x-1 group-hover/btn:text-emerald-300 transition-all" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner Note */}
        <div className="mt-14 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono uppercase text-amber-400 tracking-wider font-semibold">
              Personalized Event Packages
            </span>
            <p className="text-sm text-stone-300">
              Need a bundled combination of cakes, decor, rentals, and hall booking for your special day?
            </p>
          </div>
          <a
            href="https://wa.me/2348057339399?text=Hello%20Mrs.%20Kolawole%20Adenike%2C%20I%20would%20like%20to%20discuss%20a%20combined%20package%20for%20my%20event."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs tracking-wider uppercase whitespace-nowrap shadow-lg shadow-amber-500/10 transition-all cursor-pointer"
          >
            Discuss Complete Package
          </a>
        </div>
      </div>
    </section>
  );
};
