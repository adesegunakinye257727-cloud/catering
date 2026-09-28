import React from 'react';
import {
  X,
  Sparkles,
  MousePointerClick,
  MessageSquare,
  CalendarClock,
  PartyPopper,
  ArrowRight,
} from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      number: '01',
      title: 'Choose',
      subtitle: 'Select What You Need',
      description:
        'Browse our bespoke cakes, stage decorations, cooking utensil rentals, halls, or live music entertainment.',
      icon: MousePointerClick,
    },
    {
      number: '02',
      title: 'Tell Us',
      subtitle: 'Share Your Date & Style',
      description:
        'Share your event date, location, guest capacity, and design theme through our contact inquiry.',
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
        'Step into a breathtaking celebration without stress. Everything is in place for you and your loved ones to enjoy.',
      icon: PartyPopper,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-10 shadow-2xl text-stone-900 border border-stone-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 text-xs font-mono uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Simple 4-Step Journey</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-tight text-stone-950 mb-2">
            How It Works
          </h2>

          <p className="font-sans text-stone-600 text-xs sm:text-sm font-light max-w-md mx-auto">
            From your first idea to a glorious celebration, our 4-step process ensures a relaxed, unforgettable occasion.
          </p>
        </div>

        {/* Visual Flow: Choose → Tell Us → We Arrange → Celebrate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-stone-50 border border-stone-200/90 rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center font-mono text-xs shadow-xs">
                      {step.number}
                    </span>

                    {index < steps.length - 1 && (
                      <span className="hidden lg:flex items-center gap-1 text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                        <span>Next</span>
                        <ArrowRight className="w-3 h-3 text-amber-600" />
                      </span>
                    )}
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-amber-700 flex items-center justify-center mb-3 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-cinzel text-lg font-bold text-stone-950 mb-1">
                    {step.title}
                  </h3>

                  <span className="text-[11px] font-mono text-amber-800 font-semibold block mb-2">
                    {step.subtitle}
                  </span>

                  <p className="text-xs text-stone-600 leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center gap-1 text-[11px] font-medium text-stone-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Step {step.number} of 04</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="text-center pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#contact"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <span>Start Planning Your Event</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
