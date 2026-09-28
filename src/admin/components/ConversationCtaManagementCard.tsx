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
  MessageCircle,
  Trash2,
} from 'lucide-react';
import {
  ConversationCtaData,
  DEFAULT_CONVERSATION_CTA,
  getConversationCta,
  saveConversationCta,
} from '../../services/conversationCtaService';
import { uploadToCloudinary } from '../../cloudinary';

export const ConversationCtaManagementCard: React.FC = () => {
  const [data, setData] = useState<ConversationCtaData>(DEFAULT_CONVERSATION_CTA);
  const [originalData, setOriginalData] = useState<ConversationCtaData>(DEFAULT_CONVERSATION_CTA);
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
        const loaded = await getConversationCta();
        setData(loaded);
        setOriginalData(loaded);
      } catch (err: any) {
        setFeedback({ type: 'error', message: 'Failed to load conversation CTA: ' + err.message });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (field: keyof ConversationCtaData, value: string) => {
    const updated = { ...data, [field]: value };
    setData(updated);
    setIsDirty(JSON.stringify(updated) !== JSON.stringify(originalData));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please select an image file (JPEG, PNG, WebP).' });
      return;
    }

    setUploading(true);
    setUploadProgress('Uploading background image to Cloudinary...');
    setFeedback(null);

    try {
      const result = await uploadToCloudinary(file, 'conversation_assets');

      handleChange('backgroundImageUrl', result.url);
      setFeedback({ type: 'success', message: 'Background image uploaded successfully! Click Save to apply.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Image upload failed: ' + (err.message || 'Unknown error') });
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveBgImage = () => {
    handleChange('backgroundImageUrl', '');
    setFeedback({ type: 'success', message: 'Background image removed. A clean dark background will be used. Click Save to apply.' });
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      await saveConversationCta(data);
      setOriginalData(data);
      setIsDirty(false);
      setFeedback({ type: 'success', message: 'Conversation Banner settings saved successfully!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save changes.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setData(originalData);
    setIsDirty(false);
    setFeedback(null);
  };

  const handleSetSampleImage = (url: string) => {
    handleChange('backgroundImageUrl', url);
  };

  const hasBgImage = Boolean(data.backgroundImageUrl && data.backgroundImageUrl.trim().length > 0);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <p className="text-sm text-stone-400">Loading Conversation Banner settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Cloudinary Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header and Controls */}
      <div className="bg-[#12100d] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Conversation CTA Banner</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              “Your Event Starts With Our Conversation”
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
              Upload a custom background photo or remove the image completely to use a clean background. Fills the full width &amp; designated area.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {isDirty && (
              <button
                type="button"
                onClick={handleReset}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium cursor-pointer transition-colors"
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
                  ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-amber-500/20 hover:scale-105'
                  : 'bg-white/10 text-stone-300 hover:bg-white/15'
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

        {/* Feedback Message */}
        {feedback && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center justify-between animate-in fade-in duration-200 ${
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
              className="text-stone-400 hover:text-white ml-2 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Live Card Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
              Live Preview: {hasBgImage ? 'With Photo Background' : 'Clean Background (No Image)'}
            </span>
            <span className="text-[11px] text-stone-400">
              Fills full width of section
            </span>
          </div>

          <div
            className={`relative w-full rounded-2xl p-8 sm:p-12 overflow-hidden shadow-2xl text-center border flex flex-col items-center justify-center min-h-[300px] transition-all ${
              hasBgImage
                ? 'border-amber-500/30 bg-stone-950'
                : 'border-amber-500/40 bg-gradient-to-br from-stone-950 via-[#181412] to-stone-900'
            }`}
            style={
              hasBgImage
                ? {
                    backgroundImage: `url(${data.backgroundImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : undefined
            }
          >
            {/* Dark overlay when image present */}
            {hasBgImage && <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-[1px]" />}

            <div className="relative z-10 max-w-xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 text-[10px] font-mono uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Direct Line to Mrs. Kolawole</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {data.heading || 'Your Event Starts With Our Conversation'}
              </h3>

              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                {data.subheading}
              </p>

              <div className="pt-2">
                <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500 text-stone-950 font-bold text-xs shadow-xl">
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{data.buttonText || 'Chat on WhatsApp'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Background Image Upload & Config Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-white/5">
          {/* Left: Upload Button & Direct URL */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-300 font-semibold flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Background Image</span>
            </h4>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex-1 inline-flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-md shadow-amber-500/10 hover:scale-[1.01]"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{uploadProgress || 'Uploading to Cloudinary...'}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload New Photo</span>
                    </>
                  )}
                </button>

                {hasBgImage && (
                  <button
                    type="button"
                    onClick={handleRemoveBgImage}
                    className="inline-flex items-center gap-1.5 px-3 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove Image</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-mono text-stone-400 mb-1">
                  Or enter Direct Image URL:
                </label>
                <input
                  type="text"
                  value={data.backgroundImageUrl}
                  onChange={(e) => handleChange('backgroundImageUrl', e.target.value)}
                  placeholder="https://... (leave empty for clean background)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080706] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Quick sample backdrops */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-stone-500 uppercase block">
                  Quick Select Premium Backdrop:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleSetSampleImage(
                        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-stone-300 font-mono transition-colors cursor-pointer"
                  >
                    Royal Banquet Hall
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSetSampleImage(
                        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1920&q=80'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-stone-300 font-mono transition-colors cursor-pointer"
                  >
                    Wedding Stage Lights
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Card Text & WhatsApp Configuration */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-300 font-semibold flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Card Heading &amp; WhatsApp Line</span>
            </h4>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-stone-400 mb-1">
                  Card Heading
                </label>
                <input
                  type="text"
                  value={data.heading}
                  onChange={(e) => handleChange('heading', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080706] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-stone-400 mb-1">
                  Subheading
                </label>
                <textarea
                  rows={2}
                  value={data.subheading}
                  onChange={(e) => handleChange('subheading', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080706] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-stone-400 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={data.buttonText}
                    onChange={(e) => handleChange('buttonText', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080706] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-stone-400 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={data.whatsappNumber}
                    onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080706] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
