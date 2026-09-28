/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CinematicHero } from './components/CinematicHero/CinematicHero';
import { QuickServicesChips } from './components/QuickServicesChips';
import { AnimatedStatsSection } from './components/AnimatedStatsSection';
import { EventTypeSection } from './components/EventTypeSection';
import { WhatYouNeedToKnowSection } from './components/WhatYouNeedToKnowSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AboutSection } from './components/AboutSection';
import { FinalCTASection } from './components/FinalCTASection';
import { Footer } from './components/Footer';
import { HowItWorksModal } from './components/HowItWorksModal';
import { AdminDashboard } from './admin/AdminDashboard';
import { AppExperienceView } from './app-experience/AppExperienceView';
import { AppTab } from './app-experience/components/AppBottomNav';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  // Experience Mode: 'homepage' (brand/story experience) | 'app' (mobile-app-style experience) | 'admin'
  const [experience, setExperience] = useState<'homepage' | 'app' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin') return 'admin';
      if (hash === '#app' || hash === '#planner' || hash === '#cakes') return 'app';
    }
    return 'homepage';
  });

  const [appInitialTab, setAppInitialTab] = useState<AppTab>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#planner') return 'planner';
      if (hash === '#cakes') return 'cakes';
    }
    return 'home';
  });

  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin') {
        setExperience('admin');
      } else if (hash === '#app') {
        setExperience('app');
      } else if (hash === '#planner') {
        setAppInitialTab('planner');
        setExperience('app');
      } else if (hash === '#cakes') {
        setAppInitialTab('cakes');
        setExperience('app');
      } else if (!hash.startsWith('#admin') && !hash.startsWith('#app') && !hash.startsWith('#planner')) {
        // Only return to homepage if not an anchor within the page
        if (hash === '' || hash === '#homepage' || hash === '#story') {
          setExperience('homepage');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const switchToHomepage = () => {
    window.location.hash = '';
    setExperience('homepage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToApp = (tab: AppTab = 'home') => {
    setAppInitialTab(tab);
    setExperience('app');
    window.location.hash = tab === 'planner' ? 'planner' : tab === 'cakes' ? 'cakes' : 'app';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToAdmin = () => {
    window.location.hash = 'admin';
    setExperience('admin');
  };

  return (
    <>
      {/* 1. ADMIN DASHBOARD EXPERIENCE */}
      {experience === 'admin' && (
        <AdminDashboard onViewPublicSite={switchToHomepage} />
      )}

      {/* 2. APP EXPERIENCE (Mobile-app-style interface with fixed bottom navigation) */}
      {experience === 'app' && (
        <AppExperienceView
          initialTab={appInitialTab}
          onReturnToHomepage={switchToHomepage}
          onOpenAdmin={switchToAdmin}
        />
      )}

      {/* 3. HOMEPAGE BRAND/STORY EXPERIENCE */}
      {experience === 'homepage' && (
        <main className="min-h-screen bg-white text-stone-900 relative selection:bg-amber-500 selection:text-white">
          {/* Stable Fixed Navigation Bar */}
          <Navbar
            onAdminClick={switchToAdmin}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
            onLaunchApp={(tab) => switchToApp(tab || 'home')}
          />

          {/* 1. HERO: Preserved Autoplay Cinematic Video Experience */}
          <CinematicHero
            onLaunchApp={(tab) => switchToApp(tab || 'planner')}
          />

          {/* 2. QUICK SERVICES: Small Horizontal Scrollable Service Chips */}
          <QuickServicesChips
            onSelectService={(serviceType) => switchToApp(serviceType)}
          />

          {/* 3. ANIMATED STATS: Placed directly between Hero and “What Are You Planning?” */}
          <AnimatedStatsSection />

          {/* 4. EVENT TYPE: "What Are You Planning?" Interactive Large Image Cards */}
          <EventTypeSection
            onPlanEventType={() => switchToApp('planner')}
          />

          {/* 5. SERVICE SECTION: "What Oreofe HolluWar Offers" Layered Stack */}
          <WhatYouNeedToKnowSection
            onExploreService={(id) => switchToApp(id === 'cakes' ? 'cakes' : 'events')}
          />

          {/* 6. CLIENT TESTIMONIALS: "What Our Clients Say" Layered Card Stack */}
          <TestimonialsSection />

          {/* 7. ABOUT: Mrs. Kolawole F. Adenike, M.D/CEO */}
          <AboutSection />

          {/* 8. FINAL CTA: "Your event starts with one conversation." */}
          <FinalCTASection />

          {/* Footer */}
          <Footer onAdminClick={switchToAdmin} />

          {/* Dedicated How It Works Modal (Accessed via Hamburger Menu / Navigation) */}
          <HowItWorksModal
            isOpen={isHowItWorksOpen}
            onClose={() => setIsHowItWorksOpen(false)}
          />

          {/* Floating Admin Access Button */}
          <div className="fixed bottom-6 right-6 z-40">
            <button
              type="button"
              onClick={switchToAdmin}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-stone-900/90 hover:bg-stone-900 text-amber-400 hover:text-amber-300 font-medium text-xs shadow-2xl border border-amber-500/30 backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
              title="Access Admin Dashboard"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Admin Dashboard</span>
            </button>
          </div>
        </main>
      )}
    </>
  );
}
