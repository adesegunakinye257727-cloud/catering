import React from 'react';
import { MessageCircle, MapPin, Phone, Heart } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="relative bg-[#070605] text-stone-400 border-t border-amber-500/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-md">
                <span className="font-cinzel text-sm">O</span>
              </div>
              <div>
                <span className="font-cinzel text-sm font-bold text-white tracking-wider block">
                  OREOFE HOLLuwar
                </span>
                <span className="text-[9px] tracking-[0.2em] font-sans text-amber-400 uppercase">
                  Cake &amp; Event
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Everything you need to prepare for your special event, brought together in one place in Idowa-Ijebu, Ogun State.
            </p>

            <div className="text-[11px] text-stone-400 space-y-0.5">
              <span className="text-amber-400 font-semibold block">Mrs. Kolawole F. Adenike</span>
              <span>Managing Director / CEO</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <span className="font-cinzel text-xs font-bold text-white uppercase tracking-wider block">
              Quick Navigation
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#cinematic-hero-section" className="hover:text-amber-300 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#quick-services" className="hover:text-amber-300 transition-colors">
                  Quick Services
                </a>
              </li>
              <li>
                <a href="#cakes" className="hover:text-amber-300 transition-colors">
                  Occasion Cakes
                </a>
              </li>
              <li>
                <a href="#event-services" className="hover:text-amber-300 transition-colors">
                  Decor &amp; Rentals
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-amber-300 transition-colors">
                  Gallery Showcase
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-amber-300 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-300 transition-colors">
                  Contact &amp; Bookings
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services Summary */}
          <div className="space-y-3">
            <span className="font-cinzel text-xs font-bold text-white uppercase tracking-wider block">
              Event Offerings
            </span>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>&bull; Wedding &amp; Birthday Cakes</li>
              <li>&bull; Traditional Engagement Cakes</li>
              <li>&bull; Event Hall &amp; Stage Decor</li>
              <li>&bull; Utensil &amp; Equipment Rentals</li>
              <li>&bull; Event Hall Booking Assistance</li>
              <li>&bull; Musicians &amp; Live Entertainment</li>
              <li>&bull; End-to-End Event Coordination</li>
            </ul>
          </div>

          {/* Col 4: Location & WhatsApp */}
          <div className="space-y-4">
            <span className="font-cinzel text-xs font-bold text-white uppercase tracking-wider block">
              Reach Out Directly
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-stone-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Idowa-Ijebu, Ogun State, Nigeria</span>
              </div>

              <div className="flex items-start gap-2 text-stone-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <a href="tel:08057339399" className="hover:text-emerald-300 font-mono">
                  08057339399
                </a>
              </div>
            </div>

            <div>
              <a
                href="https://wa.me/2348057339399"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            &copy; {new Date().getFullYear()} Oreofe HolluWar Cake &amp; Event. Idowa-Ijebu, Ogun State. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            {onAdminClick && (
              <button
                type="button"
                onClick={onAdminClick}
                className="text-[11px] text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
              >
                Cinematic Video Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
