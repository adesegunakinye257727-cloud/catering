import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Sparkles } from 'lucide-react';
import {
  ConversationCtaData,
  DEFAULT_CONVERSATION_CTA,
  subscribeToConversationCta,
} from '../services/conversationCtaService';

export const FinalCTASection: React.FC = () => {
  const [ctaData, setCtaData] = useState<ConversationCtaData>(DEFAULT_CONVERSATION_CTA);
  const [name, setName] = useState('');
  const [eventType, setEventType] = useState('Wedding Celebration');
  const [eventDate, setEventDate] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Bespoke Cake',
    'Event Decoration',
  ]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToConversationCta((data) => {
      setCtaData(data);
    });
    return () => unsubscribe();
  }, []);

  const availableServices = [
    'Bespoke Cake',
    'Event Decoration',
    'Utensil Rentals',
    'Hall Booking',
    'Musicians & Entertainment',
    'Full Event Support',
  ];

  const toggleService = (srv: string) => {
    if (selectedServices.includes(srv)) {
      setSelectedServices(selectedServices.filter((s) => s !== srv));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceList =
      selectedServices.length > 0 ? selectedServices.join(', ') : 'General Enquiry';
    const text = `Hello Mrs. Kolawole (Oreofe HolluWar Cake & Event),
My Name: ${name || 'Prospective Celebrant'}
Event Type: ${eventType}
Event Date: ${eventDate || 'To be decided'}
Services Needed: ${serviceList}
Additional Notes: ${notes || 'Looking forward to discussing further.'}`;

    const num = ctaData.whatsappNumber || '2348057339399';
    const url = `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const hasBgImage = Boolean(ctaData.backgroundImageUrl && ctaData.backgroundImageUrl.trim().length > 0);
  const whatsappNum = ctaData.whatsappNumber || '2348057339399';

  return (
    <section id="contact" className="relative w-full py-12 sm:py-20 bg-stone-900/5 text-stone-900 border-b border-stone-200/80">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 
          1. CONVERSATION BANNER CARD
          - Fills the available container width & height cleanly.
          - If background image is present, displays it with crisp dark scrim.
          - If NO image is selected, displays an elegant dark royal gradient without empty image errors.
          - Keeps only the "Chat on WhatsApp" button.
        */}
        <div
          className={`relative w-full min-h-[460px] sm:min-h-[520px] rounded-3xl p-8 sm:p-14 lg:p-20 overflow-hidden shadow-2xl flex flex-col justify-center items-center text-center transition-all ${
            hasBgImage
              ? 'text-white border border-amber-500/25 bg-stone-950'
              : 'text-white border border-amber-500/30 bg-gradient-to-br from-stone-950 via-[#181412] to-stone-900'
          }`}
          style={
            hasBgImage
              ? {
                  backgroundImage: `url(${ctaData.backgroundImageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        >
          {/* Subtle Ambient / Overlay Gradients */}
          {hasBgImage ? (
            <div className="absolute inset-0 bg-stone-950/80 sm:bg-stone-950/75 backdrop-blur-[1px]" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          )}

          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-mono uppercase tracking-[0.2em] mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Direct Line to Mrs. Kolawole</span>
            </div>

            {/* Requested Heading: "Your Event Starts With Our Conversation" */}
            <h2 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">
              {ctaData.heading || 'Your Event Starts With Our Conversation'}
            </h2>

            <p className="font-sans text-stone-300 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl mb-8">
              {ctaData.subheading ||
                'Reach out today to check date availability, choose your cake design, and secure your event preparations.'}
            </p>

            {/* Kept: Only the "Chat on WhatsApp" Button */}
            <a
              href={`https://wa.me/${whatsappNum}?text=Hello%20Mrs.%20Kolawole%20(Oreofe%20HolluWar)%2C%20I%20would%20like%20to%20discuss%20an%20upcoming%20event.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm sm:text-base tracking-wide shadow-2xl shadow-emerald-500/30 hover:scale-105 transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>{ctaData.buttonText || 'Chat on WhatsApp'}</span>
            </a>
          </div>
        </div>

        {/* 
          2. QUICK EVENT INQUIRY BUILDER
          - Clean WhatsApp enquiry action
        */}
        <div className="w-full bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="font-cinzel text-2xl font-bold text-stone-950 mb-2">
              Quick Event Inquiry Builder
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 font-light">
              Select your services below to generate a pre-formatted WhatsApp message for instant booking.
            </p>
          </div>

          <form onSubmit={handleSendWhatsApp} className="space-y-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mrs. Adeola"
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1.5">
                  Event Type
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                >
                  <option value="Wedding Celebration">Wedding Celebration</option>
                  <option value="Birthday Party">Birthday Party</option>
                  <option value="Engagement / Traditional">Engagement / Traditional</option>
                  <option value="Family Celebration">Family Celebration</option>
                  <option value="Other Milestone Event">Other Milestone Event</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">
                Services You Need (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {availableServices.map((srv) => {
                  const isChecked = selectedServices.includes(srv);
                  return (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => toggleService(srv)}
                      className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-amber-500 text-stone-950 font-semibold shadow-xs'
                          : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-amber-400'
                      }`}
                    >
                      {isChecked ? `✓ ${srv}` : srv}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
