import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, CalendarCheck, Smile, Award, Users } from 'lucide-react';
import {
  StatsData,
  subscribeToStats,
  INITIAL_STATS,
} from '../services/statsService';

// Ease out cubic function for smooth number counting deceleration
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export const AnimatedStatsSection: React.FC = () => {
  const [stats, setStats] = useState<StatsData>(INITIAL_STATS);
  const [displayValues, setDisplayValues] = useState<{
    eventsCompleted: number;
    happyCustomers: number;
    yearsOfExperience: number;
    happyClients: number;
  }>({
    eventsCompleted: 0,
    happyCustomers: 0,
    yearsOfExperience: 0,
    happyClients: 0,
  });

  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimatedRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);

  // Subscribe to real-time Firestore updates
  useEffect(() => {
    const unsubscribe = subscribeToStats((updated) => {
      setStats(updated);
      // If already animated, immediately sync display values to new values
      if (hasAnimatedRef.current) {
        setDisplayValues({
          eventsCompleted: updated.eventsCompleted,
          happyCustomers: updated.happyCustomers,
          yearsOfExperience: updated.yearsOfExperience,
          happyClients: updated.happyClients,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // IntersectionObserver to trigger animation once
  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          startCountingAnimation(stats);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [stats]);

  const startCountingAnimation = (targetStats: StatsData) => {
    const duration = 3800; // 3.8 seconds (within the 3–5 seconds requirement)
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeOutCubic(progress);

      setDisplayValues({
        eventsCompleted: Math.round(targetStats.eventsCompleted * easeProgress),
        happyCustomers: Math.round(targetStats.happyCustomers * easeProgress),
        yearsOfExperience: Math.round(targetStats.yearsOfExperience * easeProgress),
        happyClients: Math.round(targetStats.happyClients * easeProgress),
      });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValues({
          eventsCompleted: targetStats.eventsCompleted,
          happyCustomers: targetStats.happyCustomers,
          yearsOfExperience: targetStats.yearsOfExperience,
          happyClients: targetStats.happyClients,
        });
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const statItems = [
    {
      id: 'eventsCompleted',
      label: 'Events Completed',
      value: displayValues.eventsCompleted,
      suffix: '+',
      icon: CalendarCheck,
      color: 'from-amber-400 to-amber-600',
    },
    {
      id: 'happyCustomers',
      label: 'Happy Customers',
      value: displayValues.happyCustomers,
      suffix: '+',
      icon: Smile,
      color: 'from-emerald-400 to-emerald-600',
    },
    {
      id: 'yearsOfExperience',
      label: 'Years of Experience',
      value: displayValues.yearsOfExperience,
      suffix: '+',
      icon: Award,
      color: 'from-amber-500 to-amber-700',
    },
    {
      id: 'happyClients',
      label: 'Happy Clients',
      value: displayValues.happyClients,
      suffix: '+',
      icon: Users,
      color: 'from-amber-400 to-emerald-500',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="animated-stats"
      className="relative py-12 sm:py-16 bg-white border-b border-stone-100 overflow-hidden"
      aria-label="Our Milestones"
    >
      {/* Background Soft Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-50/50 via-white to-white" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="relative bg-stone-50/80 hover:bg-stone-50 border border-stone-200/80 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-all group"
              >
                {/* Decorative Icon */}
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200/90 text-amber-700 flex items-center justify-center mb-4 shadow-xs group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6 text-amber-600" />
                </div>

                {/* Animated Count Number */}
                <div className="flex items-baseline justify-center gap-0.5 mb-1.5 font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-950">
                  <span>{item.value.toLocaleString()}</span>
                  <span className="text-amber-500 text-2xl sm:text-3xl font-normal font-sans">
                    {item.suffix}
                  </span>
                </div>

                {/* Label */}
                <span className="font-sans text-xs sm:text-sm font-medium text-stone-600">
                  {item.label}
                </span>

                <div className="w-8 h-0.5 bg-amber-400/40 rounded-full mt-3 group-hover:w-12 transition-all" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
