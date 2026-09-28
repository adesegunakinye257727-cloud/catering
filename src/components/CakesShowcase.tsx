import React, { useState } from 'react';
import { Cake, Sparkles, ArrowRight } from 'lucide-react';

interface CakeItem {
  id: string;
  category: 'wedding' | 'birthday' | 'engagement' | 'custom';
  title: string;
  description: string;
  tierInfo: string;
  flavorHighlights: string[];
  leadTime: string;
  tag: string;
  imageUrl: string;
}

const CAKE_ITEMS: CakeItem[] = [
  // Wedding
  {
    id: 'w1',
    category: 'wedding',
    title: 'Royal Ivory & Gold Bridal Tier',
    description: 'A grand 4-tier artisanal centerpiece layered with delicate edible gold accents, handcrafted floral crowns, and royal monogram plaque.',
    tierInfo: '4 Tiers (serves 200–350 guests)',
    flavorHighlights: ['Rich Vanilla Velvet', 'Chocolate Ganache', 'Fruit Cake Infusion'],
    leadTime: 'Order 2–4 weeks in advance',
    tag: 'Grand Bridal',
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'w2',
    category: 'wedding',
    title: 'Floral Cascade Romance Tier',
    description: 'Elegant white fondant textured finish draped with soft cascading sugar roses and pearl bead borders matching your bridal theme.',
    tierInfo: '3 Tiers (serves 120–180 guests)',
    flavorHighlights: ['Red Velvet Sponge', 'Sweet Cream Cream-Cheese', 'Caramel Drizzle'],
    leadTime: 'Order 2–3 weeks in advance',
    tag: 'Classic Romance',
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
  },

  // Birthday
  {
    id: 'b1',
    category: 'birthday',
    title: 'Golden Jubilee Celebration Cake',
    description: 'Exquisite 50th / 60th milestone birthday cake styled with metallic gold leaf, custom acrylic age crown, and layered gourmet sponge.',
    tierInfo: '2–3 Tiers (customized)',
    flavorHighlights: ['Moist Marble Sponge', 'Salted Caramel', 'Fresh Strawberry Swirl'],
    leadTime: 'Order 5–7 days in advance',
    tag: 'Milestone Jubilee',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'b2',
    category: 'birthday',
    title: 'Kids & Teens Joyful Themed Cake',
    description: 'Vibrant, colorful cake tailored to favorite cartoon characters, sports themes, or playful confetti designs with delicious moist vanilla core.',
    tierInfo: '1–2 Tiers (party size)',
    flavorHighlights: ['Classic Funfetti', 'Double Chocolate', 'Cookies & Cream'],
    leadTime: 'Order 4–5 days in advance',
    tag: 'Playful & Colorful',
    imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
  },

  // Engagement
  {
    id: 'e1',
    category: 'engagement',
    title: 'Traditional Alaga Introduction Cake',
    description: 'Authentic Yoruba traditional engagement presentation styled like a sacred Holy Bible, cultural calabash, or luxury luggage box.',
    tierInfo: 'Sculpted Traditional Tier',
    flavorHighlights: ['Rich Fruit & Brandy Sponge', 'Classic Spiced Vanilla', 'Almond Buttercream'],
    leadTime: 'Order 1–2 weeks in advance',
    tag: 'Traditional Introduction',
    imageUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'e2',
    category: 'engagement',
    title: 'Aso-Oke & Coral Beads Tribute Cake',
    description: 'Stunning cultural tribute cake with fondant coral bead strands, woven Aso-Oke pattern textures, and gold blessing lettering.',
    tierInfo: '2 Tiers Traditional Display',
    flavorHighlights: ['Velvet Sponge', 'Caramel Buttercream', 'Orange Blossom'],
    leadTime: 'Order 1–2 weeks in advance',
    tag: 'Cultural Elegance',
    imageUrl: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80',
  },

  // Custom
  {
    id: 'c1',
    category: 'custom',
    title: 'Bespoke Concept & Dream Creations',
    description: 'Have a Pinterest inspiration or unique sketch? Mrs. Kolawole crafts custom structural cakes, graduation diplomas, and architectural shapes.',
    tierInfo: 'Any custom shape or tier configuration',
    flavorHighlights: ['Custom recipe selection', 'Choice of 4+ flavor pairings'],
    leadTime: 'Consultation on WhatsApp',
    tag: 'Your Dream Design',
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
  },
];

type CategoryKey = 'wedding' | 'birthday' | 'engagement' | 'custom';

const CATEGORY_TABS: { key: CategoryKey; label: string }[] = [
  { key: 'wedding', label: 'Wedding' },
  { key: 'birthday', label: 'Birthday' },
  { key: 'engagement', label: 'Engagement' },
  { key: 'custom', label: 'Custom' },
];

interface CakesShowcaseProps {
  onFindACake?: () => void;
}

export const CakesShowcase: React.FC<CakesShowcaseProps> = ({ onFindACake }) => {
  const [activeTab, setActiveTab] = useState<CategoryKey>('wedding');

  const displayedCakes = CAKE_ITEMS.filter((item) => item.category === activeTab);

  return (
    <section id="cakes" className="relative py-20 sm:py-28 bg-stone-50/60 text-stone-900 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 text-xs font-mono uppercase tracking-[0.2em] mb-4">
            <Cake className="w-3.5 h-3.5 text-amber-600" />
            <span>Handcrafted Confectionery</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 mb-3">
            Cake Showcase
          </h2>

          <p className="font-sans text-stone-600 text-sm sm:text-base font-light leading-relaxed max-w-lg mx-auto">
            Freshly baked in Idowa-Ijebu with premium ingredients, breathtaking aesthetics, and irresistible taste.
          </p>
        </div>

        {/* Category Tabs: Wedding, Birthday, Engagement, Custom */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-12 overflow-x-auto no-scrollbar py-1">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/25 scale-105'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-400 hover:text-stone-950'
                }`}
              >
                {tab.label} Cakes
              </button>
            );
          })}
        </div>

        {/* Displayed Cake Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {displayedCakes.map((cake) => (
            <div
              key={cake.id}
              className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:border-amber-400/80 transition-all flex flex-col justify-between group"
            >
              {/* Photo Area */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-100">
                <img
                  src={cake.imageUrl}
                  alt={cake.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-amber-300 font-mono text-[11px] font-semibold uppercase tracking-wider shadow-sm">
                    {cake.tag}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-950 mb-2">
                    {cake.title}
                  </h3>

                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light mb-4">
                    {cake.description}
                  </p>

                  {/* Tier / Guests */}
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 font-medium mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{cake.tierInfo}</span>
                  </div>

                  {/* Flavors */}
                  <div className="space-y-1.5 mb-6">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block font-semibold">
                      Popular Flavors:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cake.flavorHighlights.map((flavor, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-sans"
                        >
                          {flavor}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer with Lead Time & Booking Action */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-stone-500 font-sans">
                    {cake.leadTime}
                  </span>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-all shadow-xs hover:shadow-md cursor-pointer"
                  >
                    <span>Enquire Cake</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Order Box */}
        <div className="mt-12 max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-cinzel text-lg font-bold text-stone-950">
              Need a completely custom cake style?
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 font-light mt-0.5">
              Share your reference design or flavor preferences during your event consultation.
            </p>
          </div>

          {onFindACake ? (
            <button
              type="button"
              onClick={onFindACake}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md"
            >
              <span>Find a Cake in App</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          ) : (
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider shrink-0 transition-all cursor-pointer"
            >
              <span>Request Custom Cake</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
