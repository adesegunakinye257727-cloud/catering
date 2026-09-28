import React from 'react';
import {
  Sliders,
  Smartphone,
  Monitor,
  MousePointer2,
  Power,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface SettingsCardProps {
  enabled: boolean;
  scrollControlled: boolean;
  mobileEnabled: boolean;
  desktopEnabled: boolean;
  sectionHeight: number;
  onFieldChange: <K extends 'enabled' | 'scrollControlled' | 'mobileEnabled' | 'desktopEnabled' | 'sectionHeight'>(
    field: K,
    value: any
  ) => void;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  enabled,
  scrollControlled,
  mobileEnabled,
  desktopEnabled,
  sectionHeight,
  onFieldChange,
}) => {
  return (
    <div className="bg-[#12100d] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="space-y-0.5">
          <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            Animation & Playback Settings
          </h3>
          <p className="text-xs text-stone-400">
            Configure how the cinematic experience behaves across viewports and scroll interactions.
          </p>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="space-y-4">
        {/* Animation Enabled */}
        <div className="p-4 rounded-xl bg-[#0e0c09] border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <Power className={`w-4 h-4 ${enabled ? 'text-emerald-400' : 'text-stone-500'}`} />
              <span className="text-sm font-medium text-stone-200">Animation Enabled</span>
            </div>
            <p className="text-xs text-stone-400">
              Master switch. When OFF, the cinematic video system is completely suppressed on the site.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onFieldChange('enabled', !enabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              enabled ? 'bg-amber-500' : 'bg-stone-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Scroll Controlled */}
        <div className="p-4 rounded-xl bg-[#0e0c09] border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <MousePointer2
                className={`w-4 h-4 ${scrollControlled ? 'text-amber-400' : 'text-stone-500'}`}
              />
              <span className="text-sm font-medium text-stone-200">Scroll Controlled</span>
            </div>
            <p className="text-xs text-stone-400">
              Binds the video playback progress directly to the visitor&apos;s vertical scroll position.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={scrollControlled}
            onClick={() => onFieldChange('scrollControlled', !scrollControlled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              scrollControlled ? 'bg-amber-500' : 'bg-stone-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                scrollControlled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Mobile Enabled */}
        <div className="p-4 rounded-xl bg-[#0e0c09] border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <Smartphone
                className={`w-4 h-4 ${mobileEnabled ? 'text-amber-400' : 'text-stone-500'}`}
              />
              <span className="text-sm font-medium text-stone-200">Mobile Enabled</span>
            </div>
            <p className="text-xs text-stone-400">
              Allow the interactive video sequence to execute on mobile smartphones and small tablets.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={mobileEnabled}
            onClick={() => onFieldChange('mobileEnabled', !mobileEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              mobileEnabled ? 'bg-amber-500' : 'bg-stone-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                mobileEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Desktop Enabled */}
        <div className="p-4 rounded-xl bg-[#0e0c09] border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <Monitor
                className={`w-4 h-4 ${desktopEnabled ? 'text-amber-400' : 'text-stone-500'}`}
              />
              <span className="text-sm font-medium text-stone-200">Desktop Enabled</span>
            </div>
            <p className="text-xs text-stone-400">
              Execute full ultra-high fidelity video animations on laptops, desktops, and large screens.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={desktopEnabled}
            onClick={() => onFieldChange('desktopEnabled', !desktopEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              desktopEnabled ? 'bg-amber-500' : 'bg-stone-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                desktopEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Section Height Input */}
        <div className="p-4 rounded-xl bg-[#0e0c09] border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <label htmlFor="sectionHeightInput" className="text-sm font-medium text-stone-200">
                Section Height
              </label>
            </div>
            <span className="text-xs font-mono text-amber-400/90 font-medium">
              {sectionHeight}vh
            </span>
          </div>

          <p className="text-xs text-stone-400">
            Defines the total vertical scroll depth dedicated to scrubbing through the video sequence.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <input
              id="sectionHeightInput"
              type="number"
              min={100}
              max={3000}
              step={50}
              value={sectionHeight}
              onChange={(e) => onFieldChange('sectionHeight', Number(e.target.value))}
              className="w-32 px-3 py-2 rounded-lg bg-[#14120e] border border-white/10 text-stone-100 font-mono text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
            <span className="text-xs font-mono text-stone-500 uppercase">vh (Viewport Height)</span>
          </div>

          <div className="pt-1">
            <input
              type="range"
              min={100}
              max={1500}
              step={50}
              value={sectionHeight}
              onChange={(e) => onFieldChange('sectionHeight', Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-stone-500 mt-1">
              <span>100vh (Fast)</span>
              <span>500vh (Recommended Default)</span>
              <span>1500vh (Slow Cinematic)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
