import React, { useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface CinematicVideoPlayerProps {
  videoSrc?: string;
  isMuted?: boolean;
}

export const CinematicVideoPlayer: React.FC<CinematicVideoPlayerProps> = ({
  videoSrc = 'https://res.cloudinary.com/tomxzhw2/video/upload/v1790382611/cinematic_assets/ypod2xlgp8e6zqk3gp4w.mp4',
  isMuted = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;

    const playVideo = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsReady(true);
            setLoadError(null);
          })
          .catch(() => {
            // Autoplay policy fallback: guarantee muted playback
            if (!video.muted) {
              video.muted = true;
              video.play().catch(() => {});
            }
          });
      }
    };

    const handleLoadedData = () => {
      setIsReady(true);
      playVideo();
    };

    const handleError = () => {
      setLoadError('Cinematic video reel connecting...');
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleLoadedData);
    video.addEventListener('error', handleError);

    if (video.readyState >= 2) {
      handleLoadedData();
    } else {
      playVideo();
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [videoSrc, isMuted]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#080706]">
      {/* Loading Overlay */}
      {!isReady && !loadError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#080706] text-[#F3EFEA] gap-4 pointer-events-none transition-opacity duration-300">
          <div className="relative flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
            <Loader2 className="absolute text-amber-400 w-5 h-5 animate-pulse" />
          </div>
          <div className="text-center">
            <span className="font-cinzel text-base tracking-widest text-[#E5A84B] font-semibold block mb-1">
              OREOFE HOLLUWAR
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#CBB89D]/70 font-mono">
              Loading Cinematic Video...
            </span>
          </div>
        </div>
      )}

      {/* Load Error State */}
      {loadError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#080706] p-6 text-center text-[#F3EFEA]">
          <AlertCircle className="w-9 h-9 text-amber-400 mb-3" />
          <h3 className="font-cinzel text-lg text-amber-200 mb-2">Video Reel Connecting</h3>
          <p className="text-xs text-[#A89F93] max-w-md font-mono mb-4">{loadError}</p>
          <button
            type="button"
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.load();
                videoRef.current.play().catch(() => {});
              }
            }}
            className="px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-mono tracking-wider hover:bg-amber-500/30 transition-all cursor-pointer pointer-events-auto"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Autoplaying, Looping Background Video */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="auto"
        controls={false}
        className="w-full h-full object-cover pointer-events-none will-change-transform scale-105"
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%',
        }}
      />

      {/* Subtle Cinematic Vignette & Framing */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/35 to-black/70" />
      <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-transparent to-black/60" />
      <div className="absolute inset-0 film-grain pointer-events-none opacity-25 mix-blend-overlay" />
    </div>
  );
};
