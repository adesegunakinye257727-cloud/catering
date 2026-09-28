import React from 'react';
import { MousePointerClick, MessageSquare, CalendarClock, PartyPopper, MessageCircle, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Choose',
      subtitle: 'Select What You Need',
      description:
        'Browse our cakes, event decorations, cooking utensil rentals, halls, or live music entertainment.',
      icon: MousePointerClick,
    },
    {
      number: '02',
      title: 'Tell Us',
      subtitle: 'Share Your Date & Style',
      description:
        'Send a quick WhatsApp message with your event date, location, guest count, and design vision.',
      icon: MessageSquare,
    },
    {
      number: '03',
      title: 'We Arrange',
      subtitle: 'Complete Coordination',
      description:
        'Mrs. Kolawole & our team bake your cake fresh, prep rental equipment, and style your venue on schedule.',
      icon: CalendarClock,
    },
    {
      number: '04',
      title: 'Celebrate',
      subtitle: 'Enjoy With Your Guests',
      description:
        'Step into a breathtaking celebration without stress. Everything is ready for you and your loved ones to enjoy.',
      icon: PartyPopper,
    },
  ];

  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 bg-white text-stone-900 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 text-xs font-mono uppercase tracking-[0.2em] mb-4">
            <span>Simple 4-Step Journey</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 mb-3">
            How It Works
          </h2>

          <p className="font-sans text-stone-600 text-sm sm:text-base font-light leading-relaxed max-w-lg mx-auto">
            Planning your event should be exciting, friendly, and straightforward. Here is our seamless process:
          </p>
        </div>

        {/* Visual Flow: Choose → Tell Us → We Arrange → Celebrate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-stone-50 border border-stone-200/90 hover:border-amber-400 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all hover:shadow-lg group"
              >
                <div>
                  {/* Step Number & Connector indicator */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center font-mono text-sm shadow-md shadow-amber-500/20">
                      {step.number}
                    </span>

                    {index < steps.length - 1 && (
                      <span className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-stone-400 uppercase tracking-widest">
                        <span>Next</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                      </span>
                    )}
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-cinzel text-xl font-bold text-stone-950 mb-1">
                    {step.title}
                  </h3>

                  <span className="text-xs font-mono text-amber-800 font-semibold block mb-3">
                    {step.subtitle}
                  </span>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-200/60 flex items-center gap-1.5 text-xs font-medium text-stone-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Step {step.number} of 04</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Link */}
        <div className="mt-14 text-center">
          <a
            href="https://wa.me/2348057339399?text=Hello%20Mrs.%20Kolawole%2C%20I%20would%20like%20to%20start%20planning%20my%20event%20with%20Oreofe%20HolluWar."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm tracking-wide shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Start Step 1: Tell Us What You Need</span>
          </a>
        </div>
      </div>
    </section>
  );
};
