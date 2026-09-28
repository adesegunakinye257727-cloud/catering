import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Sparkles,
  Check,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  MessageCircle,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface AppPlannerTabProps {
  initialPrefill?: {
    eventType?: string;
    selectedCake?: string;
    preselectedService?: string;
    needDetails?: string;
  };
}

export const AppPlannerTab: React.FC<AppPlannerTabProps> = ({ initialPrefill }) => {
  // Step 1: “What are you planning?”
  const [eventType, setEventType] = useState<string>('Wedding');

  // Step 2: “What do you need?”
  const [neededServices, setNeededServices] = useState<string[]>(['Cake', 'Decoration']);

  // Step 3: Additional specifics
  const [eventDate, setEventDate] = useState<string>('');
  const [guestCount, setGuestCount] = useState<string>('150');
  const [locationArea, setLocationArea] = useState<string>('Idowa-Ijebu, Ogun State');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [planSubmitted, setPlanSubmitted] = useState<boolean>(false);

  // Apply prefilled selections from other tabs if passed
  useEffect(() => {
    if (initialPrefill?.eventType) {
      const matchMap: Record<string, string> = {
        wedding: 'Wedding',
        birthday: 'Birthday',
        engagement: 'Engagement',
        celebration: 'Celebration',
        other: 'Other',
      };
      setEventType(matchMap[initialPrefill.eventType.toLowerCase()] || 'Wedding');
    }
    if (initialPrefill?.selectedCake) {
      if (!neededServices.includes('Cake')) {
        setNeededServices((prev) => [...prev, 'Cake']);
      }
      setSpecialNotes((prev) => (prev ? `${prev}, Cake: ${initialPrefill.selectedCake}` : `Cake: ${initialPrefill.selectedCake}`));
    }
  }, [initialPrefill]);

  // Options for “What are you planning?”
  const eventTypeOptions = [
    { id: 'Wedding', label: 'Wedding', icon: '💍', desc: 'Holy Matrimony & Reception' },
    { id: 'Birthday', label: 'Birthday', icon: '🎂', desc: 'Milestone Jubilee' },
    { id: 'Engagement', label: 'Engagement', icon: '🥁', desc: 'Traditional Introduction' },
    { id: 'Celebration', label: 'Celebration', icon: '✨', desc: 'Thanksgiving & Anniversaries' },
    { id: 'Other', label: 'Other', icon: '🎉', desc: 'Corporate / Bespoke Events' },
  ];

  // Options for “What do you need?”
  const neededOptions = [
    { id: 'Cake', label: 'Cake', icon: '🍰', desc: 'Multi-tier or bespoke design' },
    { id: 'Decoration', label: 'Decoration', icon: '💐', desc: 'Stage backdrop & hall drapes' },
    { id: 'Hall', label: 'Hall', icon: '🏛️', desc: 'Banquet venue booking' },
    { id: 'Rentals', label: 'Rentals', icon: '🍳', desc: 'Cooking pots, warmers & chairs' },
    { id: 'Music/Entertainment', label: 'Music/Entertainment', icon: '🎵', desc: 'Live band & drummers' },
    { id: 'Multiple Services', label: 'Multiple Services', icon: '👑', desc: 'Full turnkey event bundle' },
  ];

  const toggleService = (id: string) => {
    if (id === 'Multiple Services') {
      if (neededServices.includes('Multiple Services')) {
        setNeededServices(['Cake']);
      } else {
        setNeededServices(['Cake', 'Decoration', 'Hall', 'Rentals', 'Music/Entertainment', 'Multiple Services']);
      }
      return;
    }

    if (neededServices.includes(id)) {
      setNeededServices(neededServices.filter((s) => s !== id && s !== 'Multiple Services'));
    } else {
      setNeededServices([...neededServices, id]);
    }
  };

  const handleReset = () => {
    setEventType('Wedding');
    setNeededServices(['Cake', 'Decoration']);
    setEventDate('');
    setGuestCount('150');
    setLocationArea('Idowa-Ijebu, Ogun State');
    setSpecialNotes('');
    setPlanSubmitted(false);
  };

  // Build formatted message for single WhatsApp consultation action
  const generateWhatsAppUrl = () => {
    const summaryText = `*Oreofe HolluWar Celebration Plan Inquiry*
• *Event Type:* ${eventType}
• *Services Needed:* ${neededServices.join(', ')}
• *Approx. Date:* ${eventDate || 'Flexible / To be confirmed'}
• *Estimated Guests:* ${guestCount}
• *Location:* ${locationArea}
${specialNotes ? `• *Notes:* ${specialNotes}` : ''}

Hello Mrs. Kolawole (Oreofe HolluWar), I generated this celebration plan on your website app and would like to discuss booking and pricing.`;

    return `https://wa.me/2348057339399?text=${encodeURIComponent(summaryText)}`;
  };

  return (
    <div className="space-y-6 pb-24 text-stone-900">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[11px] font-mono uppercase font-semibold">
          <ClipboardList className="w-3.5 h-3.5 text-amber-600" />
          <span>Interactive Celebration Planner</span>
        </div>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-tight text-stone-950">
          Build Your Event Plan
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-light">
          Answer a few quick questions to receive a tailored plan and transparent consultation.
        </p>
      </div>

      {/* QUESTION 1: What are you planning? */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-amber-800 font-bold tracking-wider">
            Step 1 of 3
          </span>
          <span className="text-xs text-stone-400 font-sans">Single Choice</span>
        </div>

        <h3 className="font-cinzel text-lg sm:text-xl font-bold text-stone-950">
          What are you planning?
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {eventTypeOptions.map((opt) => {
            const isSelected = eventType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setEventType(opt.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
                    : 'border-stone-200/90 hover:border-amber-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{opt.icon}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-amber-600 bg-amber-600 text-white'
                        : 'border-stone-300'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>
                <div>
                  <span className="font-cinzel text-xs font-bold text-stone-900 block">
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-stone-500 font-sans block truncate">
                    {opt.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* QUESTION 2: What do you need? */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-amber-800 font-bold tracking-wider">
            Step 2 of 3
          </span>
          <span className="text-xs text-stone-400 font-sans">Multi-Select</span>
        </div>

        <h3 className="font-cinzel text-lg sm:text-xl font-bold text-stone-950">
          What do you need?
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {neededOptions.map((opt) => {
            const isSelected = neededServices.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleService(opt.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
                    : 'border-stone-200/90 hover:border-amber-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{opt.icon}</span>
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                      isSelected
                        ? 'border-amber-600 bg-amber-600 text-white'
                        : 'border-stone-300'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>
                <div>
                  <span className="font-cinzel text-xs font-bold text-stone-900 block">
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-stone-500 font-sans block truncate">
                    {opt.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* QUESTION 3: Details & Timeline */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-amber-800 font-bold tracking-wider">
            Step 3 of 3
          </span>
          <span className="text-xs text-stone-400 font-sans">Details</span>
        </div>

        <h3 className="font-cinzel text-lg sm:text-xl font-bold text-stone-950">
          When &amp; Where?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Estimated Date or Month
            </label>
            <input
              type="text"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              placeholder="e.g. November 2025, or Flexible"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Estimated Guest Count
            </label>
            <input
              type="text"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              placeholder="e.g. 150 - 250 guests"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1">
            Celebration Venue / Area
          </label>
          <input
            type="text"
            value={locationArea}
            onChange={(e) => setLocationArea(e.target.value)}
            placeholder="e.g. Idowa-Ijebu, Ijebu-Ode, Ago-Iwoye, or Ogun State"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1">
            Special Requests / Color Theme
          </label>
          <textarea
            rows={2}
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            placeholder="e.g. Royal blue & champagne gold theme, 4-tier red velvet cake..."
            className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-amber-500 resize-none"
          />
        </div>
      </div>

      {/* PLAN SUMMARY CARD */}
      <div className="rounded-3xl bg-gradient-to-br from-[#12100e] to-[#1c1814] border border-amber-500/30 text-white p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-cinzel text-sm font-bold text-white tracking-wide">
              Your Customized Celebration Plan
            </span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-mono text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-stone-400">Celebration Type:</span>
            <span className="font-bold text-amber-300">{eventType}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-stone-400">Services Included:</span>
            <span className="font-bold text-white text-right max-w-[65%] truncate">
              {neededServices.join(', ')}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-stone-400">Location:</span>
            <span className="text-stone-200 font-medium">{locationArea}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-stone-400">Estimated Guests:</span>
            <span className="text-stone-200 font-medium">{guestCount}</span>
          </div>
        </div>

        {/* Single Strategic WhatsApp Action */}
        <div className="pt-2">
          <a
            href={generateWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setPlanSubmitted(true)}
            className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current text-stone-950" />
            <span>Send Plan to Mrs. Kolawole</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};
