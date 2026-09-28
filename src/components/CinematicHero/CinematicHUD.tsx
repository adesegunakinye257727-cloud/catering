import React, { useState } from 'react';
import { Volume2, VolumeX, Eye, EyeOff, Film, HelpCircle } from 'lucide-react';
import { CINEMATIC_SHOTS, VideoShotDescriptor } from '../../types/cinematic';
import { cinematicAudio } from './CinematicAudio';

interface CinematicHUDProps {
  progress: number; // 0..1
  duration: number; // video duration in seconds
  activeShot?: VideoShotDescriptor;
  onSeek: (targetProgress: number) => void;
  videoSrc?: string;
  onUpdateVideoSrc?: (newSrc: string) => void;
  isDragging?: boolean;
}

export const CinematicHUD: React.FC<CinematicHUDProps> = ({
  progress,
  duration,
  activeShot,
  onSeek,
  videoSrc = 'https://res.cloudinary.com/tomxzhw2/video/upload/v1790382611/cinematic_assets/ypod2xlgp8e6zqk3gp4w.mp4',
  onUpdateVideoSrc,
  isDragging = false,
}) => {
  const [audioActive, setAudioActive] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showAssetInfo, setShowAssetInfo] = useState(false);
  const [customSrcInput, setCustomSrcInput] = useState('');

  // Fallback to activeShot lookup if not passed
  const currentShot =
    activeShot ||
    CINEMATIC_SHOTS.find(
      (shot) => progress >= shot.scrollRange[0] && progress <= shot.scrollRange[1]
    ) ||
    CINEMATIC_SHOTS[0];

  const handleToggleAudio = () => {
    const active = cinematicAudio.toggle(progress);
    setAudioActive(active);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 sm:p-6 select-none">
      {/* Top Bar: Controls (without any frame counters, percentage or speed indicators) */}
      <div className="w-full flex items-center justify-between pointer-events-auto gap-2">
        {/* Left: Shot Identification Badge (clean, no timecode or percentages) */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
          <div className="flex items-center gap-2 bg-[#0F0D0A]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/25 text-[#E5A84B] text-[10px] sm:text-xs font-mono tracking-wider shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-semibold text-white">{currentShot.label}</span>
            <span className="text-[#A39281] hidden xs:inline">&bull;</span>
            <span className="text-[#E6B874] truncate max-w-[140px] xs:max-w-none">{currentShot.sublabel}</span>
          </div>
        </div>

        {/* Right: Audio, Asset Info & View Mode */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Video Asset Path Info Modal Toggle */}
          <button
            onClick={() => setShowAssetInfo(!showAssetInfo)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#0F0D0A]/80 border border-white/10 text-[#C5BBAF] hover:text-white hover:border-amber-500/40 text-[11px] font-sans transition-all cursor-pointer shadow-sm"
            title="Video Source File Information"
            aria-label="Video Source Information"
          >
            <HelpCircle size={13} className="text-amber-400" />
            <span className="hidden sm:inline font-mono text-[10px]">Asset Info</span>
          </button>

          {/* Atmosphere Sound Toggle */}
          <button
            onClick={handleToggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-sans transition-all duration-200 border cursor-pointer shadow-sm ${
              audioActive
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-[#0F0D0A]/80 border-white/10 text-[#C5BBAF] hover:text-white hover:border-white/20'
            }`}
            title="Toggle Kitchen Sound"
            aria-label="Toggle Atmosphere Sound"
          >
            {audioActive ? <Volume2 size={13} className="text-amber-400" /> : <VolumeX size={13} />}
            <span className="hidden sm:inline font-medium">
              {audioActive ? 'Audio On' : 'Audio Off'}
            </span>
          </button>

          {/* Minimal View Toggle */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0F0D0A]/80 border border-white/10 text-[#C5BBAF] hover:text-white hover:border-white/20 text-[11px] font-sans transition-all duration-200 cursor-pointer shadow-sm"
            title="Toggle Controls"
            aria-label="Toggle Controls"
          >
            {showControls ? <EyeOff size={13} /> : <Eye size={13} />}
            <span className="hidden sm:inline font-medium">
              {showControls ? 'Clean View' : 'Show Controls'}
            </span>
          </button>
        </div>
      </div>

      {/* Asset Info Flyout */}
      {showAssetInfo && (
        <div className="w-full max-w-lg mx-auto bg-[#0F0D0A]/95 backdrop-blur-2xl border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl pointer-events-auto text-[#F3EFEA] transition-all my-auto z-40">
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-amber-400" />
              <span className="font-cinzel text-sm text-amber-300 font-semibold tracking-wider">
                Video Commercial Source
              </span>
            </div>
            <button
              onClick={() => setShowAssetInfo(false)}
              className="text-xs text-[#A89F93] hover:text-white cursor-pointer px-2 py-0.5 rounded"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-[#C5BBAF] leading-relaxed mb-3">
            Active cinematic animation asset hosted on Cloudinary and synchronized with Firestore:
          </p>
          <div className="bg-black/60 rounded-lg p-2.5 font-mono text-[11px] text-amber-300 border border-amber-500/20 mb-3 break-all select-all">
            {videoSrc}
          </div>

          {/* Test Custom Video URL input */}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <span className="text-[10px] text-[#CBB89D] uppercase tracking-wider font-mono">
              Test an immediate custom video URL:
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSrcInput}
                onChange={(e) => setCustomSrcInput(e.target.value)}
                placeholder="https://example.com/commercial.mp4"
                className="flex-1 bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={() => {
                  if (customSrcInput.trim() && onUpdateVideoSrc) {
                    onUpdateVideoSrc(customSrcInput.trim());
                    setShowAssetInfo(false);
                  }
                }}
                className="px-3 py-1.5 bg-amber-500/30 hover:bg-amber-500/50 border border-amber-400 text-amber-300 rounded-lg text-xs font-mono cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Rail: Clean Visual Scrub Line (Clean, NO numbers, NO percentages) */}
      {showControls && (
        <div className="w-full max-w-xl mx-auto pointer-events-auto transition-all duration-300">
          <div className="bg-[#0D0B09]/80 backdrop-blur-md border border-amber-500/20 rounded-2xl px-4 py-2.5 shadow-2xl flex flex-col gap-2">
            {/* Direct Slider Scrub Track (without numbers) */}
            <div className="relative w-full flex items-center group cursor-pointer py-1">
              <input
                type="range"
                min="0"
                max="1000"
                value={Math.round(progress * 1000)}
                onChange={(e) => onSeek(Number(e.target.value) / 1000)}
                className="w-full h-1 bg-[#26211C] rounded-full appearance-none cursor-pointer accent-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                style={{
                  background: `linear-gradient(to right, #F59E0B 0%, #F59E0B ${progress * 100}%, #26211C ${progress * 100}%, #26211C 100%)`,
                }}
                aria-label="Direct Timeline Control"
              />

              {/* Shot Split Markers on Track */}
              {CINEMATIC_SHOTS.map((shot) => (
                <div
                  key={`dot-${shot.shotNumber}`}
                  className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-amber-200/40 pointer-events-none"
                  style={{ left: `${shot.scrollRange[0] * 100}%` }}
                />
              ))}
            </div>

            {/* Bottom Clean Status (No numbers, no percentages, no speed indicators) */}
            <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isDragging ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                <span>{isDragging ? 'CONTROLLING TIMELINE' : 'DIRECT 1:1 DRAG'}</span>
              </span>

              <span className="text-stone-400/70 uppercase">
                Drag left / right
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
