import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Film,
  AlertCircle,
  Clock,
  Maximize,
  Sparkles,
} from 'lucide-react';

interface VideoPreviewPlayerProps {
  videoUrl: string;
  videoName?: string;
  onUploadClick?: () => void;
}

export const VideoPreviewPlayer: React.FC<VideoPreviewPlayerProps> = ({
  videoUrl,
  videoName,
  onUploadClick,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isBuffering, setIsBuffering] = useState<boolean>(false);

  // Reset player when URL changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setDimensions(null);
    setHasError(false);
    setErrorMessage('');

    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          setHasError(true);
          setErrorMessage('Playback error: ' + (e.message || 'Cannot play stream'));
        });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      setDimensions({
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      });
      setHasError(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  // If no video URL is configured
  if (!videoUrl) {
    return (
      <div className="relative aspect-video w-full rounded-xl border-2 border-dashed border-white/10 bg-[#0d0c0a] flex flex-col items-center justify-center p-8 text-center overflow-hidden group">
        <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform duration-300">
          <Film className="w-8 h-8" />
        </div>
        <h4 className="text-lg font-medium text-white mb-1">No Video Configured</h4>
        <p className="text-sm text-stone-400 max-w-md mb-6">
          Upload a high-resolution commercial video clip or Nigerian small-chops reel to power the interactive food animation sequence.
        </p>
        {onUploadClick && (
          <button
            type="button"
            onClick={onUploadClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm transition-colors shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Upload Video to Cloudinary
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Video Viewport Container */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl group select-none">
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-red-950/20 text-red-300">
            <AlertCircle className="w-10 h-10 mb-2 text-red-400" />
            <p className="font-semibold text-sm">Failed to Load Video Preview</p>
            <p className="text-xs text-stone-400 mt-1 max-w-md break-all">
              {errorMessage || 'The video URL could not be resolved or codec is not supported by your browser.'}
            </p>
            <p className="text-xs text-stone-500 mt-2">URL: {videoUrl}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              playsInline
              muted={isMuted}
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => {
                setIsBuffering(false);
                setIsPlaying(true);
              }}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onError={(e) => {
                const target = e.currentTarget;
                setHasError(true);
                setErrorMessage(
                  target.error?.message || 'Video stream decoding or network error'
                );
              }}
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
            />

            {/* Buffering Indicator */}
            {isBuffering && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
              </div>
            )}

            {/* Big Center Play Overlay (when paused) */}
            {!isPlaying && !hasError && (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] transition-opacity cursor-pointer group-hover:bg-black/20"
                aria-label="Play video"
              >
                <div className="w-16 h-16 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center pl-1 shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-200">
                  <Play className="w-7 h-7 fill-current" />
                </div>
              </button>
            )}

            {/* Video Watermark / Admin Overlay Indicator */}
            <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono tracking-wider font-semibold uppercase bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/20">
                Admin Preview Only
              </span>
              {dimensions && (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono text-stone-300 bg-black/70 backdrop-blur-md border border-white/10">
                  {dimensions.width}×{dimensions.height}
                </span>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-8 flex flex-col gap-2 opacity-95 transition-opacity">
              {/* Scrub Progress Bar */}
              <div className="relative flex items-center group/scrub">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.01"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:h-2 transition-all"
                />
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="p-1.5 rounded hover:bg-white/10 text-stone-200 hover:text-white transition-colors cursor-pointer"
                    title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleRestart}
                    className="p-1.5 rounded hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                    title="Restart from beginning"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1.5 rounded hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                  </button>

                  <div className="font-mono text-[11px] text-stone-300 flex items-center gap-1">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-stone-500">/</span>
                    <span className="text-stone-400">{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFullscreen}
                    className="p-1.5 rounded hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Video Quick Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-[#14120e] border border-white/5 rounded-lg px-3 py-2 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div className="truncate">
            <span className="text-stone-500 block text-[10px] uppercase font-mono">Duration</span>
            <span className="text-stone-200 font-mono font-medium">
              {duration ? `${duration.toFixed(1)}s` : '--'}
            </span>
          </div>
        </div>

        <div className="bg-[#14120e] border border-white/5 rounded-lg px-3 py-2 flex items-center gap-2">
          <Maximize className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div className="truncate">
            <span className="text-stone-500 block text-[10px] uppercase font-mono">Resolution</span>
            <span className="text-stone-200 font-mono font-medium">
              {dimensions ? `${dimensions.width} × ${dimensions.height}` : '--'}
            </span>
          </div>
        </div>

        <div className="bg-[#14120e] border border-white/5 rounded-lg px-3 py-2 flex items-center gap-2">
          <Film className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div className="truncate">
            <span className="text-stone-500 block text-[10px] uppercase font-mono">Aspect</span>
            <span className="text-stone-200 font-mono font-medium">
              {dimensions ? (dimensions.width / dimensions.height).toFixed(2) + ':1' : '16:9'}
            </span>
          </div>
        </div>

        <div className="bg-[#14120e] border border-white/5 rounded-lg px-3 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <div className="truncate">
            <span className="text-stone-500 block text-[10px] uppercase font-mono">Format</span>
            <span className="text-stone-200 font-mono font-medium truncate">
              {videoUrl.split('.').pop()?.split('?')[0]?.toUpperCase() || 'MP4'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
