import React from 'react';
import { Layers, Clock, Users, MapPin, CheckCircle2 } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const points = [
    {
      title: 'Multiple Event Services',
      description:
        'Instead of dealing with separate cake bakers, decoration decorators, equipment rental shops, and hall agents, you can bundle your key services through one direct contact.',
      icon: Layers,
    },
    {
      title: 'Convenient Planning',
      description:
        'Save precious time and reduce celebration anxiety by having your order, deliveries, and setup schedules coordinated under a single responsible plan.',
      icon: Clock,
    },
    {
      title: 'Personalized Service',
      description:
        'Every wedding, birthday, or engagement has its own budget, theme, and family traditions. We take time to listen and tailor each item to your preferences.',
      icon: Users,
    },
    {
      title: 'One Place for Your Event Needs',
      description:
        'Based locally in Idowa-Ijebu, Ogun State, we are on the ground and accessible for consultations, physical previews, and dependable on-time delivery.',
      icon: MapPin,
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-[#0c0a08] text-stone-100 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono uppercase tracking-widest mb-4">
            Practical Benefits
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Why Choose Oreofe HolluWar
          </h2>

          <p className="font-sans text-stone-300 text-sm sm:text-base font-light leading-relaxed">
            The practical advantages of working with an integrated event service in Idowa-Ijebu.
          </p>
        </div>

        {/* 4 Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt) => {
            const Icon = pt.icon;
            return (
              <div
                key={pt.title}
                className="bg-[#14120e] border border-white/10 hover:border-amber-500/30 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all hover:bg-[#181510]"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                    {pt.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                    {pt.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Service</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
