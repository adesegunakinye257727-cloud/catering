import React, { useState } from 'react';
import {
  MessageCircle,
  MapPin,
  Phone,
  Calendar,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [eventType, setEventType] = useState('Wedding Celebration');
  const [eventDate, setEventDate] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Bespoke Cake',
    'Event Decoration',
  ]);
  const [notes, setNotes] = useState('');

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

    const url = `https://wa.me/2348057339399?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const availableServices = [
    'Bespoke Cake',
    'Event Decoration',
    'Utensil Rentals',
    'Hall Booking',
    'Musicians & Entertainment',
    'Event Preparation Support',
  ];

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-[#0c0a08] text-stone-100 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-4">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            Get in Touch
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Contact &amp; Event Booking
          </h2>

          <p className="font-sans text-stone-300 text-sm sm:text-base font-light leading-relaxed">
            Ready to plan your special occasion? Connect directly with Mrs. Kolawole on WhatsApp for friendly advice, cake designs, and full event coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Direct Business Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#14120e] border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-semibold block mb-1">
                  Business Name
                </span>
                <h3 className="font-cinzel text-2xl font-bold text-white">
                  Oreofe HolluWar Cake &amp; Event
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  M.D / CEO: Mrs. Kolawole F. Adenike
                </p>
              </div>

              {/* Direct Details */}
              <div className="space-y-4 pt-4 border-t border-white/10 text-sm text-stone-300">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase text-stone-400 block">
                      Physical Location
                    </span>
                    <span className="text-stone-100 font-medium text-sm">
                      Idowa-Ijebu, Ogun State, Nigeria
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase text-stone-400 block">
                      WhatsApp &amp; Phone Line
                    </span>
                    <a
                      href="tel:08057339399"
                      className="text-stone-100 hover:text-emerald-400 font-mono font-medium text-base transition-colors"
                    >
                      08057339399
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase text-stone-400 block">
                      Consultation Hours
                    </span>
                    <span className="text-stone-200 text-xs">
                      Monday &ndash; Saturday &bull; Prompt response on WhatsApp
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Direct WhatsApp Button */}
              <div className="pt-2">
                <a
                  href="https://wa.me/2348057339399"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Chat With Us on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Quick Notice Card */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-stone-400 space-y-1">
              <span className="text-amber-400 font-medium block">
                Planning Ahead for Best Dates
              </span>
              <p className="leading-relaxed">
                We recommend booking wedding and milestone cakes 2–4 weeks in advance to ensure slot reservation and pristine decoration finishing.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Event Planner Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#14120e] border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl space-y-6">
              <div>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-1">
                  Plan Your Event via WhatsApp
                </h3>
                <p className="text-xs text-stone-400 font-light">
                  Select your needed services and event date. Clicking below opens a pre-composed WhatsApp message directly to Mrs. Kolawole.
                </p>
              </div>

              <form onSubmit={handleSendWhatsApp} className="space-y-4">
                {/* Your Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-stone-300">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Adebayo Ogunlesi"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a0907] border border-white/10 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                {/* Event Type & Date Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-stone-300">
                      Type of Event
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0907] border border-white/10 text-sm text-stone-100 focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="Wedding Celebration">Wedding Celebration</option>
                      <option value="Traditional Engagement / Introduction">Traditional Engagement / Introduction</option>
                      <option value="Birthday Party">Birthday Party</option>
                      <option value="Child Dedication">Child Dedication</option>
                      <option value="Funeral / Thanksgiving Reception">Funeral / Thanksgiving Reception</option>
                      <option value="Anniversary / Milestone">Anniversary / Milestone</option>
                      <option value="General Event Preparation">General Event Preparation</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-stone-300">
                      Estimated Event Date
                    </label>
                    <input
                      type="text"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      placeholder="e.g. Next month, Nov 15th"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0a0907] border border-white/10 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Services Checkboxes */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-medium text-stone-300">
                    Select Services You Require (Tap to toggle):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableServices.map((srv) => {
                      const isSelected = selectedServices.includes(srv);
                      return (
                        <button
                          key={srv}
                          type="button"
                          onClick={() => toggleService(srv)}
                          className={`px-3 py-2 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                              : 'bg-white/5 border-white/10 text-stone-400 hover:text-stone-200 hover:bg-white/10'
                          }`}
                        >
                          <span className="truncate">{srv}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 ml-1 text-amber-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-medium text-stone-300">
                    Additional Notes / Specific Requests
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell us about your colors, guest size, cake flavor preferences, or special venue requirements..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a0907] border border-white/10 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                {/* Submit Form to WhatsApp */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Event Details via WhatsApp</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
