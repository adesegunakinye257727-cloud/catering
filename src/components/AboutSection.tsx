import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, User } from 'lucide-react';
import {
  AboutData,
  DEFAULT_ABOUT_DATA,
  subscribeToAbout,
} from '../services/aboutService';

export const AboutSection: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutData>(DEFAULT_ABOUT_DATA);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAbout((data) => {
      setAboutData(data);
      setImageError(false);
    });
    return () => unsubscribe();
  }, []);

  const imageSrc = !imageError && aboutData.founderImageUrl
    ? aboutData.founderImageUrl
    : DEFAULT_ABOUT_DATA.founderImageUrl;

  return (
    <section id="about" className="relative py-20 sm:py-28 bg-stone-50/50 text-stone-900 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Founder & CEO Card */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="relative space-y-6">
                {/* 1. Single Clean Portrait Image Display (No awkward cropping, no stretching, no multiple layers) */}
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-sm bg-stone-100 border border-stone-200/90">
                  {aboutData.founderImageUrl ? (
                    <img
                      src={imageSrc}
                      alt={aboutData.founderName}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-6 text-center">
                      <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center mb-3">
                        <User className="w-10 h-10" />
                      </div>
                      <span className="font-cinzel text-lg font-bold text-stone-800">
                        {aboutData.founderName}
                      </span>
                      <span className="text-xs text-stone-500 mt-1">Founder &amp; CEO</span>
                    </div>
                  )}
                </div>

                {/* 2. Text: Kept: “Founder & CEO — Mrs. Kolawole F. Adenike” */}
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-800 font-bold block">
                    Founder &amp; CEO — {aboutData.founderName}
                  </span>
                  <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-stone-950">
                    {aboutData.founderName}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 font-sans">
                    {aboutData.founderRole}
                  </p>
                </div>

                {/* 3. Action: Keep only the “Get in Touch” button */}
                <div className="pt-2">
                  <a
                    href="#contact"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer hover:shadow-lg"
                  >
                    <span>Get in Touch</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative (OLF completely removed, heading is "About Us") */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 text-xs font-mono uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>About Us</span>
            </div>

            <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 leading-tight">
              About Us &mdash; Oreofe HolluWar Cake &amp; Event
            </h2>

            <div className="space-y-4 text-stone-600 text-sm sm:text-base font-light leading-relaxed">
              <p>
                At Oreofe HolluWar Cake and Event, every celebration is treated with the care and reverence it deserves. Celebrating a wedding, milestone birthday, traditional introduction, or anniversary is an intimate family milestone that requires thoughtful preparation.
              </p>
              <p>
                Founded and directed by <strong className="text-stone-950 font-medium">Mrs. Kolawole F. Adenike</strong> in Idowa-Ijebu, our enterprise was born to ease the burden on celebrants and families across Ogun State and neighboring regions.
              </p>
              <p>
                Instead of dealing with scattered providers for cakes, decor, cooking utensils, halls, and musicians, Oreofe HolluWar brings all essential components together under one dedicated and trustworthy coordinator.
              </p>
            </div>

            {/* Commitments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-1">
                <span className="font-cinzel text-sm font-bold text-stone-950 block">
                  One-Stop Convenience
                </span>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  Cakes, decor, utensils, venue, and music arranged in complete harmony.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-1">
                <span className="font-cinzel text-sm font-bold text-stone-950 block">
                  Timely Execution
                </span>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  Punctual delivery and venue setup so your family hosts guests with absolute peace of mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
