import React, { useState, useEffect } from 'react';
import {
  Upload,
  RefreshCw,
  Trash2,
  ExternalLink,
  Film,
  Sparkles,
  Cloud,
  CheckCircle2,
} from 'lucide-react';
import { VideoPreviewPlayer } from './VideoPreviewPlayer';
import { VideoUploadModal } from './VideoUploadModal';

interface VideoManagementCardProps {
  videoUrl: string;
  videoName: string;
  cloudinaryPublicId: string;
  status: 'active' | 'inactive' | 'no-video';
  onFieldChange: (field: 'videoUrl' | 'videoName' | 'cloudinaryPublicId', value: string) => void;
  onReplaceVideo: (data: {
    videoUrl: string;
    cloudinaryPublicId: string;
    videoName: string;
  }) => Promise<boolean>;
  onRemoveVideo: () => void;
}

export const VideoManagementCard: React.FC<VideoManagementCardProps> = ({
  videoUrl,
  videoName,
  cloudinaryPublicId,
  status,
  onFieldChange,
  onReplaceVideo,
  onRemoveVideo,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [justReplaced, setJustReplaced] = useState(false);

  // Clear "just replaced" banner after 8 seconds
  useEffect(() => {
    if (justReplaced) {
      const timer = setTimeout(() => {
        setJustReplaced(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [justReplaced]);

  const handleReplacementSuccess = async (data: {
    videoUrl: string;
    cloudinaryPublicId: string;
    videoName: string;
  }) => {
    const success = await onReplaceVideo(data);
    if (success) {
      setJustReplaced(true);
    }
    return success;
  };

  const getStatusBadge = () => {
    if (justReplaced) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Active (New Video)
        </span>
      );
    }

    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Inactive (Disabled)
          </span>
        );
      case 'no-video':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-500/10 text-stone-400 border border-stone-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
            No Video
          </span>
        );
    }
  };

  return (
    <div className="bg-[#12100d] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
      {/* Top Header of Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <Film className="w-5 h-5 text-amber-400" />
              {justReplaced ? 'New Video' : 'Current Video'}
            </h3>
            {getStatusBadge()}
          </div>
          <p className="text-xs text-stone-400">
            {justReplaced
              ? 'Successfully updated in Firestore. The new video is now active.'
              : 'The video currently configured for the interactive cinematic animation.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {videoUrl ? (
            <>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold transition-all shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Replace Video
              </button>

              <button
                type="button"
                onClick={onRemoveVideo}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-medium transition-colors border border-red-500/20 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Video
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-colors shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Video
            </button>
          )}
        </div>
      </div>

      {/* Video Preview Viewport */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-mono tracking-wider uppercase text-stone-400">
            {justReplaced ? 'New Video Preview' : 'Current Video Preview'}
          </label>
          {justReplaced && (
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Refreshed with new video
            </span>
          )}
        </div>
        <VideoPreviewPlayer
          videoUrl={videoUrl}
          videoName={videoName}
          onUploadClick={() => setIsModalOpen(true)}
        />
      </div>

      {/* Video Metadata Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Video Name */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-xs font-medium text-stone-300">
            Filename / Video Title
          </label>
          <input
            type="text"
            value={videoName}
            onChange={(e) => onFieldChange('videoName', e.target.value)}
            placeholder="e.g. Master Food Sequence (Nigerian Small Chops 4K)"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#0a0907] border border-white/10 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Cloudinary Video URL */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-stone-300">
              Cloudinary Video URL
            </label>
            {videoUrl && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                Direct Link <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <div className="relative">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => onFieldChange('videoUrl', e.target.value)}
              placeholder="https://res.cloudinary.com/.../video/upload/..."
              className="w-full pl-3.5 pr-8 py-2.5 rounded-lg bg-[#0a0907] border border-white/10 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 transition-colors font-mono text-xs"
            />
            <Cloud className="w-4 h-4 text-stone-500 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Cloudinary Public ID */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-stone-300">
            Cloudinary Public ID
          </label>
          <input
            type="text"
            value={cloudinaryPublicId}
            onChange={(e) => onFieldChange('cloudinaryPublicId', e.target.value)}
            placeholder="e.g. cinematic_assets/food_chops_sequence"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#0a0907] border border-white/10 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 transition-colors font-mono text-xs"
          />
        </div>
      </div>

      {/* Cloudinary Storage Architecture Notice */}
      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-stone-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Actual video media is hosted securely on Cloudinary. Firestore document <code>cinematicHero</code> stores the active video URL and metadata.
          </span>
        </div>
        <span className="font-mono text-[10px] text-stone-500 shrink-0 hidden sm:inline">
          tomxzhw2
        </span>
      </div>

      {/* Replace / Upload Video Modal */}
      <VideoUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReplaceSuccess={handleReplacementSuccess}
        currentVideoName={videoName}
        currentPublicId={cloudinaryPublicId}
        isReplacing={Boolean(videoUrl)}
      />
    </div>
  );
};
