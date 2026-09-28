import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Film,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Database,
  Cloud,
} from 'lucide-react';
import { uploadVideoToCloudinary } from '../../cloudinary';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplaceSuccess: (data: {
    videoUrl: string;
    cloudinaryPublicId: string;
    videoName: string;
  }) => Promise<boolean>;
  currentVideoName?: string;
  currentPublicId?: string;
  isReplacing?: boolean;
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  onReplaceSuccess,
  currentVideoName,
  currentPublicId,
  isReplacing = true,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'selected' | 'uploading' | 'updating-firestore' | 'success' | 'error'
  >('idle');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setVideoName('');
      setUploadStatus('idle');
      setProgress(0);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // File validation function
  const validateAndSelectFile = (file: File) => {
    setError(null);

    // 1. Validate non-empty file
    if (!file || file.size === 0) {
      setError('The selected file is empty. Please choose a valid video file.');
      return;
    }

    // 2. Validate that the file is a video
    const isVideoMime = file.type && file.type.startsWith('video/');
    const validExtensions = /\.(mp4|webm|mov|m4v|mkv|avi|ogv)$/i;
    const hasVideoExtension = validExtensions.test(file.name);

    if (!isVideoMime && !hasVideoExtension) {
      setError(
        `Selected file "${file.name}" is not a recognized video format. Please select an MP4, WebM, or MOV video.`
      );
      setSelectedFile(null);
      return;
    }

    // 3. Accepted file
    setSelectedFile(file);
    setUploadStatus('selected');

    // Auto-generate clean video label from filename if empty
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const formatted = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    setVideoName(formatted);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  const handleStartReplacement = async () => {
    if (!selectedFile) {
      setError('Please select a video file first before proceeding.');
      return;
    }

    // Step 1: Upload to Cloudinary
    setUploadStatus('uploading');
    setProgress(2);
    setError(null);

    try {
      // Direct signed upload to Cloudinary (using user's tomxzhw2 account)
      const cloudinaryResult = await uploadVideoToCloudinary(selectedFile, {
        folder: 'cinematic_assets',
        onProgress: (pct) => setProgress(pct),
      });

      if (!cloudinaryResult || !cloudinaryResult.url) {
        throw new Error('Cloudinary did not return a valid video URL.');
      }

      setProgress(100);

      // Step 2: Update Firestore Document (websiteContent/cinematicHero)
      setUploadStatus('updating-firestore');

      const firestoreSuccess = await onReplaceSuccess({
        videoUrl: cloudinaryResult.url,
        cloudinaryPublicId: cloudinaryResult.publicId,
        videoName: videoName.trim() || selectedFile.name,
      });

      if (!firestoreSuccess) {
        throw new Error(
          'Cloudinary upload succeeded, but updating the Firestore cinematicHero document failed.'
        );
      }

      // Step 3: Success state
      setUploadStatus('success');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Video replacement error:', err);
      setUploadStatus('error');
      setError(
        err?.message ||
          'Upload to Cloudinary failed. The existing active video has been kept untouched.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#14120e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e0c09]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">
                {isReplacing ? 'Replace Cinematic Video' : 'Upload Cinematic Video'}
              </h3>
              <p className="text-xs text-stone-400">
                Cloudinary Storage $\rightarrow$ Firestore Sync
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={uploadStatus === 'uploading' || uploadStatus === 'updating-firestore'}
            className="p-1 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Step Indicator */}
        <div className="px-6 py-3 bg-[#0a0907] border-b border-white/5 flex items-center justify-between text-[11px] font-mono">
          <div
            className={`flex items-center gap-1.5 ${
              uploadStatus === 'idle' || uploadStatus === 'selected'
                ? 'text-amber-400 font-semibold'
                : 'text-stone-400'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Select Video</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-stone-600" />

          <div
            className={`flex items-center gap-1.5 ${
              uploadStatus === 'uploading'
                ? 'text-amber-400 font-semibold'
                : 'text-stone-400'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Cloudinary Upload</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-stone-600" />

          <div
            className={`flex items-center gap-1.5 ${
              uploadStatus === 'updating-firestore' || uploadStatus === 'success'
                ? 'text-emerald-400 font-semibold'
                : 'text-stone-400'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Update Firestore</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Current Active Video Note (if replacing) */}
          {isReplacing && currentPublicId && (
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-stone-400 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-stone-500 block">
                  Current Active Video
                </span>
                <span className="text-stone-200 font-medium truncate max-w-sm block">
                  {currentVideoName || currentPublicId}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                To be replaced
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block text-red-200">Upload / Validation Error</span>
                <p className="leading-relaxed">{error}</p>
                <p className="text-[11px] text-stone-400">
                  Your current active video remains safely intact and unchanged in Firestore.
                </p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {uploadStatus === 'success' && (
            <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold block text-white text-sm">
                  Cinematic video updated successfully!
                </span>
                <p className="text-stone-300 mt-0.5">
                  Firestore document updated and dashboard preview refreshed with the new video.
                </p>
              </div>
            </div>
          )}

          {/* Dropzone */}
          {uploadStatus !== 'success' && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => {
                if (uploadStatus !== 'uploading' && uploadStatus !== 'updating-firestore') {
                  fileInputRef.current?.click();
                }
              }}
              className={`relative border-2 border-dashed rounded-xl p-7 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                selectedFile
                  ? 'border-amber-500/50 bg-amber-500/5'
                  : 'border-white/15 bg-white/[0.02] hover:border-amber-400/30 hover:bg-white/[0.04]'
              } ${
                uploadStatus === 'uploading' || uploadStatus === 'updating-firestore'
                  ? 'pointer-events-none opacity-80'
                  : ''
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.webm,.mov,.m4v,.mkv"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                    <Film className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block font-semibold">
                      Selected Video File
                    </span>
                    <p className="font-semibold text-white text-sm truncate max-w-md mt-0.5">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'video/mp4'}
                    </p>
                  </div>
                  {uploadStatus === 'selected' && (
                    <p className="text-xs text-amber-400/80 pt-1">
                      Click to choose a different video file
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-stone-300 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">
                      Click to choose video from device or drag & drop
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Accepts MP4, WebM, MOV video files
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Video Name / Label Input */}
          {selectedFile && uploadStatus !== 'success' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-300">
                Video Name / Label for Firestore
              </label>
              <input
                type="text"
                value={videoName}
                onChange={(e) => setVideoName(e.target.value)}
                disabled={uploadStatus === 'uploading' || uploadStatus === 'updating-firestore'}
                placeholder="e.g. Master Food Sequence (Nigerian Small Chops 4K)"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e0c09] border border-white/10 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 transition-colors disabled:opacity-50"
              />
            </div>
          )}

          {/* Progress Indicator (when uploading or saving) */}
          {(uploadStatus === 'uploading' || uploadStatus === 'updating-firestore') && (
            <div className="space-y-2 p-4 rounded-xl bg-[#0a0907] border border-white/5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-stone-300 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  {uploadStatus === 'uploading'
                    ? 'Uploading video to Cloudinary...'
                    : 'Updating Firestore document websiteContent/cinematicHero...'}
                </span>
                <span className="text-amber-400 font-bold">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] text-stone-500 font-mono">
                {uploadStatus === 'uploading'
                  ? `Streaming directly to Cloudinary cloud: ${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'tomxzhw2'}`
                  : 'Updating document cinematicHero in Firestore'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0e0c09] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={uploadStatus === 'uploading' || uploadStatus === 'updating-firestore'}
            className="px-4 py-2 rounded-lg text-stone-400 hover:text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-30"
          >
            {uploadStatus === 'success' ? 'Close' : 'Cancel'}
          </button>

          {uploadStatus !== 'success' && (
            <button
              type="button"
              onClick={handleStartReplacement}
              disabled={!selectedFile || uploadStatus === 'uploading' || uploadStatus === 'updating-firestore'}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none text-stone-950 font-semibold text-xs transition-colors cursor-pointer shadow-lg shadow-amber-500/10"
            >
              {uploadStatus === 'uploading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading {progress}%...
                </>
              ) : uploadStatus === 'updating-firestore' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Syncing Firestore...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload & Replace Video
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
