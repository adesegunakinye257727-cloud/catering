import React, { useState, useEffect } from 'react';
import {
  Info,
  Sparkles,
  HelpCircle,
  Quote,
  Phone,
  MapPin,
  ChevronRight,
  ArrowLeft,
  Heart,
  Clock,
  ExternalLink,
  ShieldCheck,
  MousePointerClick,
  MessageSquare,
  CalendarClock,
  PartyPopper,
} from 'lucide-react';
import {
  TestimonialItem,
  subscribeToTestimonials,
  INITIAL_TESTIMONIALS,
} from '../../services/testimonialsService';

interface AppMoreTabProps {
  onReturnToHomepage: () => void;
  onOpenAdmin?: () => void;
}

export const AppMoreTab: React.FC<AppMoreTabProps> = ({ onReturnToHomepage, onOpenAdmin }) => {
  const [activeSection, setActiveSection] = useState<'menu' | 'about' | 'how-it-works' | 'reviews' | 'contact' | 'location'>('menu');
  const [reviews, setReviews] = useState<TestimonialItem[]>(INITIAL_TESTIMONIALS);

  useEffect(() => {
    const unsubscribe = subscribeToTestimonials((items) => {
      const activeOnly = items.filter((t) => t.active !== false);
      setReviews(activeOnly.length > 0 ? activeOnly : INITIAL_TESTIMONIALS);
    });
    return () => unsubscribe();
  }, []);

  const menuItems = [
    {
      id: 'about' as const,
      title: 'About Us',
      subtitle: 'Mrs. Kolawole F. Adenike & our journey',
      icon: Info,
      color: 'bg-amber-500/10 text-amber-700',
    },
    {
      id: 'how-it-works' as const,
      title: 'How It Works',
      subtitle: 'Choose → Tell Us → We Arrange → Celebrate',
      icon: HelpCircle,
      color: 'bg-emerald-500/10 text-emerald-700',
    },
    {
      id: 'reviews' as const,
      title: 'Reviews',
      subtitle: 'Verified celebrant feedback',
      icon: Quote,
      color: 'bg-amber-500/10 text-amber-700',
    },
    {
      id: 'contact' as const,
      title: 'Contact',
      subtitle: 'Official line, phone & consultation',
      icon: Phone,
      color: 'bg-stone-500/10 text-stone-800',
    },
    {
      id: 'location' as const,
      title: 'Location',
      subtitle: 'Idowa-Ijebu, Ogun State & coverage radius',
      icon: MapPin,
      color: 'bg-amber-500/10 text-amber-700',
    },
  ];

  return (
    <div className="space-y-6 pb-24 text-stone-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-tight text-stone-950">
            More Options &amp; Info
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light">
            Company information, client feedback, and contact details.
          </p>
        </div>

        {activeSection !== 'menu' && (
          <button
            type="button"
            onClick={() => setActiveSection('menu')}
            className="inline-flex items-center gap-1 text-xs text-amber-800 font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to More</span>
          </button>
        )}
      </div>

      {/* Main Menu List */}
      {activeSection === 'menu' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs divide-y divide-stone-100 overflow-hidden">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-stone-50 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-2xl ${item.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-cinzel text-sm sm:text-base font-bold text-stone-950 group-hover:text-amber-800 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-stone-500 font-sans font-light">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              );
            })}
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-3xl bg-stone-900 text-white p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="font-cinzel text-base font-bold text-white">
                Cinematic Brand Experience
              </h4>
            </div>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              Prefer the full visual website with our interactive cinematic video animation, stacked service cards, and full brand story?
            </p>
            <button
              type="button"
              onClick={onReturnToHomepage}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>Return to Story Homepage</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* SUB-SECTION 1: About Us */}
      {activeSection === 'about' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-5 animate-in fade-in duration-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-mono uppercase font-semibold">
            <Info className="w-3.5 h-3.5" />
            <span>Leadership &amp; Vision</span>
          </div>

          <h3 className="font-cinzel text-2xl font-bold text-stone-950">
            About Oreofe HolluWar Cake &amp; Event
          </h3>

          <div className="space-y-3.5 text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            <p>
              Founded and directed by <strong className="text-stone-950 font-medium">Mrs. Kolawole F. Adenike</strong>, Oreofe HolluWar Cake and Event was established in Idowa-Ijebu, Ogun State, to provide celebrants with peace of mind.
            </p>
            <p>
              Rather than coordinating separate vendors for custom cakes, hall decoration, cooking utensil rentals, halls, and musicians, our team brings every essential element under one experienced and dedicated organizer.
            </p>
            <p>
              We pride ourselves on fresh ingredients, impeccable attention to detail, respectful Yoruba cultural etiquette, and transparent communication.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700">
            <span className="font-semibold text-stone-950 block mb-1">Our Core Values:</span>
            <span>Uncompromising freshness • Royal stage decor • Timely delivery across Ogun State</span>
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: How It Works */}
      {activeSection === 'how-it-works' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-mono uppercase font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Simple 4-Step Journey</span>
          </div>

          <h3 className="font-cinzel text-2xl font-bold text-stone-950">
            How It Works
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center font-mono text-xs shrink-0">
                01
              </span>
              <div>
                <h4 className="font-cinzel text-base font-bold text-stone-950">Choose</h4>
                <p className="text-xs text-stone-600 font-light mt-0.5">
                  Browse centerpiece cakes, stage backdrops, utensil sets, or music services.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center font-mono text-xs shrink-0">
                02
              </span>
              <div>
                <h4 className="font-cinzel text-base font-bold text-stone-950">Tell Us</h4>
                <p className="text-xs text-stone-600 font-light mt-0.5">
                  Share your celebration date, guest count, location, and theme in our Planner.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center font-mono text-xs shrink-0">
                03
              </span>
              <div>
                <h4 className="font-cinzel text-base font-bold text-stone-950">We Arrange</h4>
                <p className="text-xs text-stone-600 font-light mt-0.5">
                  Mrs. Kolawole bakes your cake fresh, readies rental equipment, and coordinates stage setup.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center font-mono text-xs shrink-0">
                04
              </span>
              <div>
                <h4 className="font-cinzel text-base font-bold text-stone-950">Celebrate</h4>
                <p className="text-xs text-stone-600 font-light mt-0.5">
                  Step into an unforgettable celebration without stress alongside your loved ones.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 3: Reviews */}
      {activeSection === 'reviews' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-mono uppercase font-semibold">
            <Quote className="w-3.5 h-3.5" />
            <span>Honored Celebrants</span>
          </div>

          <h3 className="font-cinzel text-2xl font-bold text-stone-950">
            Client Testimonials
          </h3>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {rev.clientPhotoUrl ? (
                      <img
                        src={rev.clientPhotoUrl}
                        alt={rev.clientName}
                        className="w-9 h-9 rounded-full object-cover border border-amber-400"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-amber-500/15 text-amber-800 font-bold flex items-center justify-center font-cinzel text-xs">
                        {rev.clientName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-cinzel text-sm font-bold text-stone-950">
                        {rev.clientName}
                      </h4>
                      <span className="text-[10px] text-amber-700 font-mono">
                        Verified Celebrant
                      </span>
                    </div>
                  </div>

                  {rev.eventType && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                      {rev.eventType}
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-700 italic font-light leading-relaxed">
                  &ldquo;{rev.testimonial}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-SECTION 4: Contact */}
      {activeSection === 'contact' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-5 animate-in fade-in duration-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-mono uppercase font-semibold">
            <Phone className="w-3.5 h-3.5" />
            <span>Direct Inquiries</span>
          </div>

          <h3 className="font-cinzel text-2xl font-bold text-stone-950">
            Contact Information
          </h3>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-start gap-3">
              <Phone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 text-[11px] block">Official Phone &amp; WhatsApp:</span>
                <a href="tel:08057339399" className="font-bold text-stone-950 text-sm hover:underline">
                  08057339399
                </a>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 text-[11px] block">Location &amp; Studio:</span>
                <span className="font-bold text-stone-950 text-sm">
                  Idowa-Ijebu, Ogun State, Nigeria
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 text-[11px] block">Consultation Hours:</span>
                <span className="font-medium text-stone-800">
                  Monday – Saturday: 8:00 AM – 7:00 PM
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 5: Location */}
      {activeSection === 'location' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-5 animate-in fade-in duration-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-mono uppercase font-semibold">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Service Radius</span>
          </div>

          <h3 className="font-cinzel text-2xl font-bold text-stone-950">
            Idowa-Ijebu &amp; Ogun State
          </h3>

          <div className="space-y-3 text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            <p>
              Oreofe HolluWar Cake and Event operates from <strong className="text-stone-900 font-medium">Idowa-Ijebu</strong>, serving celebrations across:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-stone-700">
              <li>Idowa-Ijebu</li>
              <li>Ijebu-Ode</li>
              <li>Ago-Iwoye</li>
              <li>Ijebu-Igbo</li>
              <li>Sagamu and surrounding Ogun State districts</li>
            </ul>
            <p>
              Equipment deliveries, fresh cake setup, and decor logistics are handled promptly by our local crew.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
