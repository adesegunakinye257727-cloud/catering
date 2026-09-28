import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Upload,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  RotateCcw,
  Image as ImageIcon,
  Layers,
  MessageCircle,
} from 'lucide-react';
import {
  ServiceOfferedItem,
  getServicesOffered,
  saveServicesOffered,
  INITIAL_SERVICES_OFFERED,
} from '../../services/servicesOfferedService';
import { uploadToCloudinary } from '../../cloudinary';

export const ServicesOfferedManagementCard: React.FC = () => {
  const [services, setServices] = useState<ServiceOfferedItem[]>([]);
  const [originalServices, setOriginalServices] = useState<ServiceOfferedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingServiceId, setUploadingServiceId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const targetServiceIdForUpload = useRef<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getServicesOffered();
        setServices(data);
        setOriginalServices(data);
      } catch (err: any) {
        setFeedback({ type: 'error', message: 'Failed to load services: ' + err.message });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const checkIfDirty = (current: ServiceOfferedItem[]) => {
    setIsDirty(JSON.stringify(current) !== JSON.stringify(originalServices));
  };

  const handleFieldChange = (id: string, field: keyof ServiceOfferedItem, value: any) => {
    setServices((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, [field]: value } : s));
      checkIfDirty(updated);
      return updated;
    });
  };

  const handleToggleEnable = (id: string) => {
    setServices((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
      checkIfDirty(updated);
      return updated;
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setServices((prev) => {
      const updated = [...prev];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      const reindexed = updated.map((s, i) => ({ ...s, order: i + 1 }));
      checkIfDirty(reindexed);
      return reindexed;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === services.length - 1) return;
    setServices((prev) => {
      const updated = [...prev];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      const reindexed = updated.map((s, i) => ({ ...s, order: i + 1 }));
      checkIfDirty(reindexed);
      return reindexed;
    });
  };

  const triggerImageUpload = (serviceId: string) => {
    targetServiceIdForUpload.current = serviceId;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const serviceId = targetServiceIdForUpload.current;
    if (!file || !serviceId) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please select a valid image file (JPG, PNG, WebP).' });
      return;
    }

    setUploadingServiceId(serviceId);
    setUploadProgress('Uploading image to Cloudinary...');
    try {
      const res = await uploadToCloudinary(file, 'services_offered');
      if (res && res.url) {
        // Atomic state update
        const updatedServices = services.map((s) =>
          s.id === serviceId
            ? {
                ...s,
                imageUrl: res.url,
                cloudinaryPublicId: res.publicId || '',
              }
            : s
        );

        setServices(updatedServices);
        setOriginalServices(updatedServices);
        setIsDirty(false);

        // Auto-save immediately to Firestore
        await saveServicesOffered(updatedServices);

        setFeedback({
          type: 'success',
          message: 'Service image uploaded and published live to public website!',
        });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Upload failed: ' + (err.message || 'Network error') });
    } finally {
      setUploadingServiceId(null);
      setUploadProgress(null);
      targetServiceIdForUpload.current = null;
    }
  };

  const handleRemoveImage = async (serviceId: string) => {
    const updatedServices = services.map((s) =>
      s.id === serviceId ? { ...s, imageUrl: '', cloudinaryPublicId: '' } : s
    );
    setServices(updatedServices);
    setOriginalServices(updatedServices);
    setIsDirty(false);
    await saveServicesOffered(updatedServices);
    setFeedback({ type: 'success', message: 'Service image removed.' });
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      await saveServicesOffered(services);
      setOriginalServices(services);
      setIsDirty(false);
      setFeedback({ type: 'success', message: 'All service changes saved successfully!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save services.' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset all services to the 8 standard Oreofe HolluWar offerings?')) {
      setServices(INITIAL_SERVICES_OFFERED);
      checkIfDirty(INITIAL_SERVICES_OFFERED);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <p className="text-sm text-stone-400">Loading services configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Top Banner & Control Bar */}
      <div className="bg-[#12100d] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>What Oreofe HolluWar Offers</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Manage Services Offered
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl">
              Edit title, description, dedicated card photo, display order, and active/inactive status
              for all services (Alaga, Eru Iyawo, Proposal Letters, Cakes, Surprises, Catering, MC, Training).
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            {isDirty && (
              <button
                type="button"
                onClick={() => {
                  setServices(originalServices);
                  setIsDirty(false);
                }}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium cursor-pointer transition-colors"
              >
                <span>Discard Changes</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveAll}
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
                  <span>{isDirty ? 'Save All Changes' : 'Saved'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback Message */}
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
              className="text-stone-400 hover:text-white ml-2 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Service Cards List */}
        <div className="space-y-6">
          {services.map((service, index) => {
            const isUploading = uploadingServiceId === service.id;

            return (
              <div
                key={service.id}
                className={`border rounded-2xl p-5 sm:p-6 transition-all ${
                  service.enabled
                    ? 'bg-[#171411] border-white/10 hover:border-amber-500/30'
                    : 'bg-[#0f0d0b] border-white/5 opacity-60'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Image Preview & Upload */}
                  <div className="lg:col-span-4 space-y-3">
                    <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-black/60 border border-white/10 group">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />

                      {/* Top Overlay Badge */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-stone-950/80 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                          #{service.order}
                        </span>
                      </div>

                      {/* Upload Loading Overlay */}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center p-3 text-center">
                          <Loader2 className="w-6 h-6 animate-spin text-amber-400 mb-1" />
                          <span className="text-[11px] text-amber-200 font-mono">
                            {uploadProgress || 'Uploading...'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => triggerImageUpload(service.id)}
                          disabled={isUploading}
                          className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold cursor-pointer transition-all hover:scale-[1.01]"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Photo</span>
                        </button>

                        {service.imageUrl && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(service.id)}
                            title="Remove photo from service"
                            className="px-2.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-mono transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-stone-400 mb-0.5">
                          Or Direct Image URL:
                        </label>
                        <input
                          type="text"
                          value={service.imageUrl}
                          onChange={(e) => handleFieldChange(service.id, 'imageUrl', e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-[11px] font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Fields, Reordering & Active Status */}
                  <div className="lg:col-span-8 space-y-4">
                    {/* Header Row: Title & Action Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          Service {index + 1} of {services.length}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                            service.enabled
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-stone-500/15 text-stone-400 border border-stone-500/30'
                          }`}
                        >
                          {service.enabled ? 'Active / Visible' : 'Inactive / Hidden'}
                        </span>
                      </div>

                      {/* Controls: Reorder & Active Toggle */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          title="Move up in order"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === services.length - 1}
                          title="Move down in order"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleEnable(service.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                            service.enabled
                              ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                              : 'bg-stone-800 text-stone-400 hover:bg-stone-700 border border-white/10'
                          }`}
                        >
                          {service.enabled ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Inputs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-stone-400 mb-1">
                          Service Title
                        </label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => handleFieldChange(service.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-stone-400 mb-1">
                          Badge / Category Tag
                        </label>
                        <input
                          type="text"
                          value={service.tag}
                          onChange={(e) => handleFieldChange(service.id, 'tag', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-stone-400 mb-1">
                        Primary Description
                      </label>
                      <textarea
                        rows={2}
                        value={service.description}
                        onChange={(e) => handleFieldChange(service.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-stone-400 mb-1">
                        Why You Need It / Authentic Value Detail
                      </label>
                      <textarea
                        rows={2}
                        value={service.whyNeedIt}
                        onChange={(e) => handleFieldChange(service.id, 'whyNeedIt', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
