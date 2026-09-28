import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Database,
  Cloud,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { useCinematicConfig } from './hooks/useCinematicConfig';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { VideoManagementCard } from './components/VideoManagementCard';
import { SettingsCard } from './components/SettingsCard';
import { EventTypesManagementCard } from './components/EventTypesManagementCard';
import { StatsManagementCard } from './components/StatsManagementCard';
import { TestimonialsManagementCard } from './components/TestimonialsManagementCard';
import { ConversationCtaManagementCard } from './components/ConversationCtaManagementCard';
import { AboutOlfManagementCard } from './components/AboutOlfManagementCard';
import { ServicesOfferedManagementCard } from './components/ServicesOfferedManagementCard';
import { AdminTabType } from './components/AdminSidebar';

interface AdminDashboardProps {
  onViewPublicSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewPublicSite }) => {
  const {
    config,
    loading,
    saving,
    error,
    setError,
    successMessage,
    firestoreStatus,
    isDirty,
    videoStatus,
    updateField,
    setVideoData,
    replaceVideo,
    removeVideo,
    discardChanges,
    saveChanges,
  } = useCinematicConfig();

  const [activeTab, setActiveTab] = useState<AdminTabType>('services-offered');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080706] text-[#F3EFEA] flex flex-col md:flex-row antialiased selection:bg-amber-500/30 selection:text-amber-200">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex md:h-screen md:sticky md:top-0">
        <AdminSidebar
          activeTab={activeTab}
          onTabSelect={setActiveTab}
          onViewPublicSite={onViewPublicSite}
          firestoreStatus={firestoreStatus}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85%] bg-[#0d0c0a] h-full shadow-2xl flex flex-col z-10">
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <span className="font-serif font-bold text-white tracking-wide">D&apos;ATELIER ADMIN</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AdminSidebar
                activeTab={activeTab}
                onTabSelect={(tab) => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                onViewPublicSite={() => {
                  setMobileMenuOpen(false);
                  onViewPublicSite();
                }}
                firestoreStatus={firestoreStatus}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <AdminHeader
          title={
            activeTab === 'services-offered'
              ? 'Services Offered'
              : activeTab === 'conversation-cta'
              ? 'Conversation Banner'
              : activeTab === 'about-olf'
              ? 'About Us & Leadership'
              : activeTab === 'event-types'
              ? 'Event Types'
              : activeTab === 'stats'
              ? 'Animated Statistics'
              : activeTab === 'testimonials'
              ? 'Client Testimonials'
              : 'Cinematic Video'
          }
          subtitle={
            activeTab === 'services-offered'
              ? 'Manage titles, descriptions, dedicated card photos, and display order for What Oreofe HolluWar Offers.'
              : activeTab === 'conversation-cta'
              ? "Replace the large background image for the full-width 'Your event starts with one conversation' banner."
              : activeTab === 'about-olf'
              ? "Update the dedicated Founder/CEO photo and leadership profile for Mrs. Kolawole F. Adenike."
              : activeTab === 'event-types'
              ? "Manage the interactive 'What Are You Planning?' large image cards."
              : activeTab === 'stats'
              ? 'Update the 4 animated milestone statistics displayed on the homepage.'
              : activeTab === 'testimonials'
              ? "Manage genuine client feedback for the 'What Our Clients Say' section."
              : 'Manage the video used for the interactive food animation.'
          }
          isDirty={activeTab === 'cinematic-video' ? isDirty : false}
          isSaving={saving}
          onSave={saveChanges}
          onDiscard={discardChanges}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Global Notifications / Alerts */}
        <div className="max-w-7xl w-full mx-auto px-6 pt-5 space-y-3">
          {/* Success Banner */}
          {activeTab === 'cinematic-video' && successMessage && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-between shadow-lg shadow-emerald-950/20 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {activeTab === 'cinematic-video' && error && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start justify-between shadow-lg shadow-red-950/20 animate-in fade-in duration-200">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold block">Notice</span>
                  <p className="text-stone-300 leading-relaxed">{error}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Firestore API Notice if in fallback mode */}
          {firestoreStatus === 'fallback' && (
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-amber-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Firestore local session:</strong> Settings are active and safely cached. In your Firebase console, ensure the Cloud Firestore database is created under project <code>catering-37587</code>.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Loading State or Dashboard Body */}
        <main className="max-w-7xl w-full mx-auto px-6 py-6 flex-1 space-y-6">
          {activeTab === 'services-offered' ? (
            <ServicesOfferedManagementCard />
          ) : activeTab === 'conversation-cta' ? (
            <ConversationCtaManagementCard />
          ) : activeTab === 'about-olf' ? (
            <AboutOlfManagementCard />
          ) : activeTab === 'event-types' ? (
            <EventTypesManagementCard />
          ) : activeTab === 'stats' ? (
            <StatsManagementCard />
          ) : activeTab === 'testimonials' ? (
            <TestimonialsManagementCard />
          ) : loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
              <p className="text-sm text-stone-400">Loading cinematicHero configuration from Firestore...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Primary Video Management Section (visual focus: 7 cols on desktop) */}
              <div className="lg:col-span-7 space-y-6">
                <VideoManagementCard
                  videoUrl={config.videoUrl}
                  videoName={config.videoName}
                  cloudinaryPublicId={config.cloudinaryPublicId}
                  status={videoStatus}
                  onFieldChange={(field, val) => updateField(field, val)}
                  onReplaceVideo={replaceVideo}
                  onRemoveVideo={removeVideo}
                />
              </div>

              {/* Settings & Configuration Section (5 cols on desktop) */}
              <div className="lg:col-span-5 space-y-6">
                <SettingsCard
                  enabled={config.enabled}
                  scrollControlled={config.scrollControlled}
                  mobileEnabled={config.mobileEnabled}
                  desktopEnabled={config.desktopEnabled}
                  sectionHeight={config.sectionHeight}
                  onFieldChange={updateField}
                />

                {/* Firestore Sync Architecture Info Card */}
                <div className="bg-[#12100d] border border-white/5 rounded-2xl p-5 text-xs text-stone-400 space-y-2.5">
                  <div className="flex items-center gap-2 text-stone-300 font-medium">
                    <Database className="w-4 h-4 text-amber-400" />
                    <span>Firestore Document Target</span>
                  </div>
                  <div className="font-mono text-[11px] bg-black/40 p-2.5 rounded-lg border border-white/5 text-stone-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Collection:</span>
                      <span className="text-amber-400">websiteContent</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Document:</span>
                      <span className="text-amber-400">cinematicHero</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    Changes saved here directly update the <code>cinematicHero</code> document in Firestore. The public website remains unaffected in this phase.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
