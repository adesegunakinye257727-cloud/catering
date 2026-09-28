import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, ChevronRight, HelpCircle, Calendar } from 'lucide-react';

interface NavbarProps {
  onAdminClick?: () => void;
  onOpenHowItWorks: () => void;
  onLaunchApp?: (tab?: 'home' | 'cakes' | 'events' | 'planner' | 'more') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenHowItWorks, onLaunchApp }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#cinematic-hero-section' },
    { label: 'Quick Services', href: '#quick-services' },
    { label: 'Event Types', href: '#event-type' },
    { label: 'What We Offer', href: '#what-oreofe-offers' },
    { label: 'Cakes', href: '#cakes', action: () => onLaunchApp?.('cakes') },
    { label: 'Events', href: '#events', action: () => onLaunchApp?.('events') },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0907]/90 backdrop-blur-md border-b border-amber-500/20 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-[#080706]/90 via-[#080706]/60 to-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a href="#cinematic-hero-section" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <span className="font-cinzel text-base">O</span>
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel text-sm sm:text-base font-bold text-white tracking-wider group-hover:text-amber-300 transition-colors">
              OREOFE HOLLUWAR
            </span>
            <span className="text-[10px] tracking-[0.25em] font-sans text-amber-400/90 uppercase font-medium">
              Cake &amp; Event
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if (link.action) {
                  e.preventDefault();
                  link.action();
                }
              }}
              className="text-xs font-medium text-stone-300 hover:text-amber-300 transition-colors tracking-wide cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          {/* How It Works Button in Desktop Nav */}
          <button
            type="button"
            onClick={onOpenHowItWorks}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-amber-400/30"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How It Works</span>
          </button>
        </nav>

        {/* Right CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          {onLaunchApp ? (
            <button
              type="button"
              onClick={() => onLaunchApp('planner')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Plan My Event</span>
            </button>
          ) : (
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-all shadow-md shadow-amber-500/20 hover:scale-105 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Consultation</span>
            </a>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-stone-200 hover:text-white transition-colors cursor-pointer"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0a08] border-b border-amber-500/20 px-4 pt-3 pb-6 animate-in slide-in-from-top duration-200 space-y-3 shadow-2xl">
          <div className="px-2 py-1 text-[11px] text-amber-400/80 font-mono uppercase tracking-wider">
            Idowa-Ijebu, Ogun State &bull; Oreofe HolluWar
          </div>

          {/* Dedicated App Experience & How It Works Options in Hamburger Menu */}
          <div className="space-y-1.5 pb-1">
            {onLaunchApp && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLaunchApp('home');
                }}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-bold text-sm cursor-pointer shadow-md shadow-amber-500/20"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>Launch Event &amp; Cake App</span>
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider bg-stone-950/20 px-2 py-0.5 rounded text-stone-950">
                  App View &rarr;
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenHowItWorks();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold text-sm cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>How It Works</span>
              </div>
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
                4 Steps &rarr;
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (link.action) {
                    e.preventDefault();
                    link.action();
                  }
                }}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-stone-200 text-sm font-medium transition-colors cursor-pointer"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-stone-500" />
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Event Consultation</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
