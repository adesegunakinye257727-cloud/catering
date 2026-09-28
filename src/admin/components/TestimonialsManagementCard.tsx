import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Image as ImageIcon,
  User,
  Quote,
} from 'lucide-react';
import {
  TestimonialItem,
  getTestimonials,
  saveTestimonials,
  INITIAL_TESTIMONIALS,
} from '../../services/testimonialsService';
import { uploadToCloudinary } from '../../cloudinary';

export const TestimonialsManagementCard: React.FC = () => {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [originalItems, setOriginalItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const targetIdRef = useRef<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getTestimonials();
        setItems(data);
        setOriginalItems(data);
      } catch (err: any) {
        setFeedback({ type: 'error', message: 'Failed to load testimonials: ' + err.message });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const checkIfDirty = (current: TestimonialItem[]) => {
    setIsDirty(JSON.stringify(current) !== JSON.stringify(originalItems));
  };

  const handleFieldChange = (id: string, field: keyof TestimonialItem, value: any) => {
    const updated = items.map((t) => (t.id === id ? { ...t, [field]: value } : t));
    setItems(updated);
    checkIfDirty(updated);
  };

  const handleToggleActive = (id: string) => {
    const updated = items.map((t) => (t.id === id ? { ...t, active: !t.active } : t));
    setItems(updated);
    checkIfDirty(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...items];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    const reindexed = updated.map((t, i) => ({ ...t, order: i + 1 }));
    setItems(reindexed);
    checkIfDirty(reindexed);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    const reindexed = updated.map((t, i) => ({ ...t, order: i + 1 }));
    setItems(reindexed);
    checkIfDirty(reindexed);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((t) => t.id !== id).map((t, i) => ({ ...t, order: i + 1 }));
    setItems(updated);
    checkIfDirty(updated);
  };

  const handleAddNew = () => {
    const newItem: TestimonialItem = {
      id: 'test-' + Date.now(),
      clientName: 'New Client',
      testimonial: 'Share their feedback about the cake, decor, rental utensils, or celebration service.',
      eventType: 'Event Celebration',
      clientPhotoUrl: '',
      order: items.length + 1,
      active: true,
    };
    const updated = [...items, newItem];
    setItems(updated);
    checkIfDirty(updated);
  };

  const triggerPhotoUpload = (id: string) => {
    targetIdRef.current = id;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetId = targetIdRef.current;
    if (!file || !targetId) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please select a valid image file.' });
      return;
    }

    setUploadingId(targetId);
    try {
      const res = await uploadToCloudinary(file, 'client_photos');
      if (res && res.url) {
        handleFieldChange(targetId, 'clientPhotoUrl', res.url);
        setFeedback({ type: 'success', message: 'Client photo uploaded to Cloudinary successfully!' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Photo upload failed: ' + err.message });
    } finally {
      setUploadingId(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const ok = await saveTestimonials(items);
      if (ok) {
        setOriginalItems([...items]);
        setIsDirty(false);
        setFeedback({
          type: 'success',
          message: 'Client testimonials saved successfully to Firestore and updated on the live website!',
        });
      } else {
        setFeedback({
          type: 'error',
          message: 'Saved locally, but Firestore connection encountered an issue.',
        });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Save error: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setItems([...INITIAL_TESTIMONIALS]);
    checkIfDirty(INITIAL_TESTIMONIALS);
  };

  const handleDiscard = () => {
    setItems([...originalItems]);
    setIsDirty(false);
    setFeedback(null);
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Quote className="w-3.5 h-3.5" />
            <span>&ldquo;What Our Clients Say&rdquo;</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            Client Testimonials
          </h2>
          <p className="text-xs text-stone-400 max-w-xl mt-1 leading-relaxed">
            Manage genuine client reviews, event types, and optional photos. Reorder or activate/deactivate entries as needed.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isDirty && (
            <button
              type="button"
              onClick={handleDiscard}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 text-xs font-medium transition-all cursor-pointer"
            >
              Discard Changes
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !isDirty}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-md cursor-pointer ${
              isDirty
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed opacity-60'
            }`}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save to Firestore'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between shadow-lg ${
            feedback.type === 'success'
              ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-200'
              : 'bg-red-950/50 border border-red-500/30 text-red-200'
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

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
          <p className="text-xs text-stone-400 font-mono">Loading testimonials from Firestore...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => {
            const isUploading = uploadingId === item.id;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  item.active
                    ? 'bg-white/[0.02] border-white/10 hover:border-amber-500/30'
                    : 'bg-black/40 border-white/5 opacity-60'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  {/* Photo Column */}
                  <div className="lg:col-span-3 flex flex-col items-center sm:items-start">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-stone-900 border border-white/15 flex items-center justify-center mb-2 group">
                      {item.clientPhotoUrl ? (
                        <img
                          src={item.clientPhotoUrl}
                          alt={item.clientName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-stone-500 bg-stone-800">
                          <User className="w-7 h-7 mb-0.5" />
                          <span className="text-[9px] font-mono">No photo</span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => triggerPhotoUpload(item.id)}
                        disabled={isUploading}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-amber-400 text-xs font-mono transition-opacity cursor-pointer"
                      >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="w-full space-y-1">
                      <button
                        type="button"
                        onClick={() => triggerPhotoUpload(item.id)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 cursor-pointer"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>{item.clientPhotoUrl ? 'Change Photo' : 'Add Photo'}</span>
                      </button>

                      {item.clientPhotoUrl && (
                        <button
                          type="button"
                          onClick={() => handleFieldChange(item.id, 'clientPhotoUrl', '')}
                          className="text-[10px] text-stone-500 hover:text-red-400 font-mono block cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mb-1">
                          Client Name
                        </label>
                        <input
                          type="text"
                          value={item.clientName}
                          onChange={(e) => handleFieldChange(item.id, 'clientName', e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-semibold focus:outline-none focus:border-amber-500/50"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mb-1">
                          Event Type (Optional)
                        </label>
                        <input
                          type="text"
                          value={item.eventType || ''}
                          onChange={(e) => handleFieldChange(item.id, 'eventType', e.target.value)}
                          placeholder="e.g. Wedding Reception"
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-amber-300 text-xs font-mono focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mb-1">
                        Client Testimonial Statement
                      </label>
                      <textarea
                        rows={3}
                        value={item.testimonial}
                        onChange={(e) => handleFieldChange(item.id, 'testimonial', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-stone-200 text-xs leading-relaxed focus:outline-none focus:border-amber-500/50 resize-none"
                      />
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="lg:col-span-2 flex lg:flex-col items-center justify-end gap-2 border-t lg:border-t-0 lg:border-l border-white/10 pt-3 lg:pt-0 lg:pl-4">
                    {/* Reorder Up / Down */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        title="Move Up"
                        className={`p-2 rounded-lg border text-xs transition-all ${
                          index === 0
                            ? 'border-white/5 text-stone-600 opacity-40 cursor-not-allowed'
                            : 'border-white/10 bg-white/5 text-stone-300 hover:text-white hover:bg-white/10 cursor-pointer'
                        }`}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === items.length - 1}
                        title="Move Down"
                        className={`p-2 rounded-lg border text-xs transition-all ${
                          index === items.length - 1
                            ? 'border-white/5 text-stone-600 opacity-40 cursor-not-allowed'
                            : 'border-white/10 bg-white/5 text-stone-300 hover:text-white hover:bg-white/10 cursor-pointer'
                        }`}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Active toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(item.id)}
                      className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        item.active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-stone-800 text-stone-400 border border-white/10 hover:bg-stone-700'
                      }`}
                    >
                      {item.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{item.active ? 'Active' : 'Inactive'}</span>
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-stone-200 text-xs font-medium transition-all hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add Another Testimonial</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-300 font-mono transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Standard Defaults</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
