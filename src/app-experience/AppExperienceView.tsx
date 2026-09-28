import React, { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { AppBottomNav, AppTab } from './components/AppBottomNav';
import { AppHomeTab } from './tabs/AppHomeTab';
import { AppCakesTab } from './tabs/AppCakesTab';
import { AppEventsTab } from './tabs/AppEventsTab';
import { AppPlannerTab } from './tabs/AppPlannerTab';
import { AppMoreTab } from './tabs/AppMoreTab';
import { CakeDetailsModal } from './components/CakeDetailsModal';
import { AppCake } from './data/appData';

interface AppExperienceViewProps {
  initialTab?: AppTab;
  onReturnToHomepage: () => void;
  onOpenAdmin?: () => void;
}

export const AppExperienceView: React.FC<AppExperienceViewProps> = ({
  initialTab = 'home',
  onReturnToHomepage,
  onOpenAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<AppTab>(initialTab);
  const [selectedCakeForModal, setSelectedCakeForModal] = useState<AppCake | null>(null);
  const [plannerPrefill, setPlannerPrefill] = useState<any>(null);

  const handleTabChange = (tab: AppTab, prefill?: any) => {
    if (prefill) {
      setPlannerPrefill(prefill);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanWithCake = (cake: AppCake) => {
    setSelectedCakeForModal(null);
    handleTabChange('planner', {
      selectedCake: cake.title,
      eventType: cake.category,
    });
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 flex flex-col antialiased selection:bg-amber-500 selection:text-white">
      {/* Top Header */}
      <AppHeader
        activeTab={activeTab}
        onReturnToHomepage={onReturnToHomepage}
      />

      {/* Main Tab Content Body (Scrollable with mobile container styling) */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-4 sm:pt-6">
        {activeTab === 'home' && (
          <AppHomeTab
            onNavigateTab={handleTabChange}
            onSelectCake={(cake) => setSelectedCakeForModal(cake)}
          />
        )}

        {activeTab === 'cakes' && (
          <AppCakesTab
            onNavigateTab={handleTabChange}
            onSelectCake={(cake) => setSelectedCakeForModal(cake)}
          />
        )}

        {activeTab === 'events' && (
          <AppEventsTab onNavigateTab={handleTabChange} />
        )}

        {activeTab === 'planner' && (
          <AppPlannerTab initialPrefill={plannerPrefill} />
        )}

        {activeTab === 'more' && (
          <AppMoreTab
            onReturnToHomepage={onReturnToHomepage}
            onOpenAdmin={onOpenAdmin}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar - Remains visible while scrolling */}
      <AppBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => handleTabChange(tab)}
      />

      {/* Cake Details Preview Modal */}
      <CakeDetailsModal
        cake={selectedCakeForModal}
        onClose={() => setSelectedCakeForModal(null)}
        onPlanWithCake={handlePlanWithCake}
      />
    </div>
  );
};
