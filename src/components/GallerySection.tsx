import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Cake, Utensils, Calendar, ExternalLink, MessageCircle } from 'lucide-react';

interface GalleryItem {
  id: string;
  category: 'Cakes' | 'Decorations' | 'Events' | 'Rentals';
  title: string;
  subtitle: string;
  badge: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-cake-1',
    category: 'Cakes',
    title: 'Bridal Grandeur Cake',
    subtitle: 'Multi-tier handcrafted wedding centerpiece with delicate gold details',
    badge: 'Wedding Masterpiece',
  },
  {
    id: 'g-dec-1',
    category: 'Decorations',
    title: 'Royal Engagement Stage Styling',
    subtitle: 'Traditional engagement backdrop with royal draping & ambient lighting',
    badge: 'Stage Decor',
  },
  {
    id: 'g-cake-2',
    category: 'Cakes',
    title: 'Golden Jubilee Celebration Cake',
    subtitle: '50th birthday custom tier with edible gold leaves and crown topper',
    badge: 'Milestone Birthday',
  },
  {
    id: 'g-rent-1',
    category: 'Rentals',
    title: 'Cast Iron Banquet Cooking Utensils',
    subtitle: 'Clean, heavy-duty commercial cooking pots & warming chaffing dishes',
    badge: 'Utensil Rentals',
  },
  {
    id: 'g-event-1',
    category: 'Events',
    title: 'Complete Reception Coordination',
    subtitle: 'Synchronized event hall arrangement, high table setup, and stage decor',
    badge: 'Full Event Setup',
  },
  {
    id: 'g-cake-3',
    category: 'Cakes',
    title: 'Traditional Bible & Calabash Engagement Cake',
    subtitle: 'Rich cultural fondant sculpturing for Yoruba traditional wedding ceremonies',
    badge: 'Cultural Engagement',
  },
  {
    id: 'g-dec-2',
    category: 'Decorations',
    title: 'Floral Entrance Walkway Arch',
    subtitle: 'Welcoming floral tunnel setup for grand guest arrivals',
    badge: 'Entrance Arch',
  },
  {
    id: 'g-rent-2',
    category: 'Rentals',
    title: 'Catering Coolers & Chaffing Warmers',
    subtitle: 'Insulated food storage and banquet serving equipment',
    badge: 'Catering Equipment',
  },
];

export const GallerySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Cakes' | 'Decorations' | 'Events' | 'Rentals'>('All');

  const filteredItems =
    activeTab === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeTab);

  return (
    <section id="gallery" className="relative py-24 sm:py-32 bg-[#080706] text-stone-100 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono uppercase tracking-widest mb-4">
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            Celebration Portfolio
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Gallery &amp; Showcase
          </h2>

          <p className="font-sans text-stone-300 text-sm sm:text-base font-light leading-relaxed">
            Browse our work across custom cakes, event decor setups, utensil rentals, and live event preparations.
          </p>

          <div className="mt-3 inline-block px-3 py-1 rounded-md bg-white/[0.03] border border-white/10 text-[11px] font-mono text-stone-400">
            Note: Client photo slots are structured to showcase real event photography.
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {(['All', 'Cakes', 'Decorations', 'Events', 'Rentals'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Masonry / Grid Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-[#12100d] border border-white/10 hover:border-amber-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl hover:-translate-y-1"
            >
              {/* Image Frame Placeholder */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-[#1a1713] via-[#14120e] to-[#0c0a08] p-6 flex flex-col items-center justify-center text-center border-b border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-radial-at-c from-amber-500/5 via-transparent to-transparent pointer-events-none" />

                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  {item.category === 'Cakes' ? (
                    <Cake className="w-6 h-6" />
                  ) : item.category === 'Decorations' ? (
                    <Sparkles className="w-6 h-6" />
                  ) : item.category === 'Rentals' ? (
                    <Utensils className="w-6 h-6" />
                  ) : (
                    <Calendar className="w-6 h-6" />
                  )}
                </div>

                <span className="text-xs font-mono text-amber-300/90 font-medium">
                  {item.category}
                </span>

                <div className="mt-2 px-2.5 py-0.5 rounded bg-black/40 border border-white/10 text-[9px] font-mono text-stone-400">
                  Client Photo Frame
                </div>

                <span className="absolute top-2.5 right-2.5 text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-stone-300">
                  {item.badge}
                </span>
              </div>

              {/* Caption */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-cinzel text-base font-bold text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-400 font-light leading-relaxed mb-4">
                    {item.subtitle}
                  </p>
                </div>

                <a
                  href={`https://wa.me/2348057339399?text=${encodeURIComponent(
                    `Hello Mrs. Kolawole, I saw the ${item.title} in your gallery and would like to enquire about something similar.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Enquire Similar</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-xs text-stone-400 mb-4">
            Want to see our latest cakes and event pictures on WhatsApp?
          </p>
          <a
            href="https://wa.me/2348057339399?text=Hello%20Mrs.%20Kolawole%2C%20please%20send%20me%20your%20latest%20cake%20and%20event%20pictures%20on%20WhatsApp."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-stone-200 hover:text-white text-xs font-medium transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Request Latest Photos on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
