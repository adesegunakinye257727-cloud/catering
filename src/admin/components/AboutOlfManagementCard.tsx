import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  RotateCcw,
  User,
  Trash2,
} from 'lucide-react';
import {
  AboutData,
  DEFAULT_ABOUT_DATA,
  getAboutData,
  saveAboutData,
} from '../../services/aboutService';
import { uploadToCloudinary } from '../../cloudinary';

export const AboutOlfManagementCard: React.FC = () => {
  const [data, setData] = useState<AboutData>(DEFAULT_ABOUT_DATA);
  const [originalData, setOriginalData] = useState<AboutData>(DEFAULT_ABOUT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const loaded = await getAboutData();
        setData(loaded);
        setOriginalData(loaded);
      } catch (err: any) {
        setFeedback({ type: 'error', message: 'Failed to load About Us data: ' + err.message });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (field: keyof AboutData, value: string) => {
    const updated = { ...data, [field]: value };
    setData(updated);
    setIsDirty(JSON.stringify(updated) !== JSON.stringify(originalData));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please select an image file.' });
      return;
    }

    setUploading(true);
    setUploadProgress('Uploading Founder photo to Cloudinary...');
    setFeedback(null);

    try {
      const result = await uploadToCloudinary(file, 'founder_assets');

      handleChange('founderImageUrl', result.url);
      setFeedback({ type: 'success', message: 'Founder photo uploaded successfully! Click Save to apply.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Photo upload failed: ' + (err.message || 'Unknown error') });
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = () => {
    handleChange('founderImageUrl', '');
    setFeedback({ type: 'success', message: 'Photo removed. Click Save to apply.' });
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      await saveAboutData(data);
      setOriginalData(data);
      setIsDirty(false);
      setFeedback({ type: 'success', message: 'About Us founder profile saved successfully!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save changes.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <p className="text-sm text-stone-400">Loading About Us settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="bg-[#12100d] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Founder &amp; Leadership Profile</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              About Us Founder &amp; CEO Card
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
              Manage the dedicated image area and details for Mrs. Kolawole F. Adenike. Changes save to Firestore and reflect immediately on the public website.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {isDirty && (
              <button
                type="button"
                onClick={() => {
                  setData(originalData);
                  setIsDirty(false);
                }}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Discard</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs shadow-lg transition-all cursor-pointer ${
                isDirty
                  ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-amber-500/20'
                  : 'bg-white/10 text-stone-300'
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isDirty ? 'Save Changes' : 'Saved'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center justify-between ${
              feedback.type === 'success'
                ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-200'
                : 'bg-red-950/40 border border-red-500/30 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-stone-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Card Preview */}
          <div className="md:col-span-5 bg-white text-stone-900 rounded-3xl p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80">
              {data.founderImageUrl ? (
                <img
                  src={data.founderImageUrl}
                  alt={data.founderName}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-4">
                  <User className="w-12 h-12 text-stone-300 mb-2" />
                  <span className="text-xs font-mono">No Image Selected</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 font-bold block">
                {data.founderTitle}
              </span>
              <h4 className="font-serif text-xl font-bold text-stone-950">
                {data.founderName}
              </h4>
              <p className="text-xs text-stone-500">
                {data.founderRole}
              </p>
            </div>

            <div className="pt-2">
              <div className="w-full text-center py-2.5 rounded-full bg-stone-900 text-white font-semibold text-xs tracking-wider uppercase">
                Get in Touch
              </div>
            </div>
          </div>

          {/* Form Controls */}
          <div className="md:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
              <div>
                <label className="block text-xs font-mono text-stone-300 mb-2">
                  Founder Photo (Dedicated Image Area)
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer shadow-md transition-all"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{uploadProgress || 'Uploading...'}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload Photo to Cloudinary</span>
                      </>
                    )}
                  </button>

                  {data.founderImageUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1">
                  Or Direct Image URL:
                </label>
                <input
                  type="text"
                  value={data.founderImageUrl}
                  onChange={(e) => handleChange('founderImageUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080706] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1">
                  Founder Name
                </label>
                <input
                  type="text"
                  value={data.founderName}
                  onChange={(e) => handleChange('founderName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080706] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1">
                  Sub-title / Role Line
                </label>
                <input
                  type="text"
                  value={data.founderRole}
                  onChange={(e) => handleChange('founderRole', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080706] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
