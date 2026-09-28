import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Upload,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  RotateCcw,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import {
  EventTypeCard,
  getEventTypes,
  saveEventTypesConfig,
  INITIAL_EVENT_TYPES,
} from '../../services/eventTypeService';
import { uploadToCloudinary } from '../../cloudinary';

export const EventTypesManagementCard: React.FC = () => {
  const [cards, setCards] = useState<EventTypeCard[]>([]);
  const [originalCards, setOriginalCards] = useState<EventTypeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const targetCardIdForUpload = useRef<string | null>(null);

  // Load from Firestore on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getEventTypes();
        setCards(data);
        setOriginalCards(data);
      } catch (err: any) {
        setFeedback({ type: 'error', message: 'Failed to load event types: ' + err.message });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Check if modified
  const checkIfDirty = (current: EventTypeCard[]) => {
    setIsDirty(JSON.stringify(current) !== JSON.stringify(originalCards));
  };

  // Field change
  const handleFieldChange = (id: string, field: keyof EventTypeCard, value: any) => {
    setCards((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, [field]: value } : c));
      checkIfDirty(updated);
      return updated;
    });
  };

  // Toggle enable/disable
  const handleToggleEnable = (id: string) => {
    setCards((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c));
      checkIfDirty(updated);
      return updated;
    });
  };

  // Reorder: Move Up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setCards((prev) => {
      const updated = [...prev];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      const reindexed = updated.map((c, i) => ({ ...c, order: i + 1 }));
      checkIfDirty(reindexed);
      return reindexed;
    });
  };

  // Reorder: Move Down
  const handleMoveDown = (index: number) => {
    if (index === cards.length - 1) return;
    setCards((prev) => {
      const updated = [...prev];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      const reindexed = updated.map((c, i) => ({ ...c, order: i + 1 }));
      checkIfDirty(reindexed);
      return reindexed;
    });
  };

  // Trigger file selection for card image upload
  const triggerImageUpload = (cardId: string) => {
    targetCardIdForUpload.current = cardId;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Handle file selected from file picker
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const cardId = targetCardIdForUpload.current;
    if (!file || !cardId) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please select a valid image file (JPG, PNG, WebP).' });
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'Image size exceeds 15MB limit.' });
      return;
    }

    setUploadingCardId(cardId);
    setUploadProgress('Uploading image to Cloudinary...');
    try {
      const res = await uploadToCloudinary(file, 'event_types');
      if (res && res.url) {
        // Single atomic state update to prevent state batching closure bugs
        const updatedCards = cards.map((c) =>
          c.id === cardId
            ? {
                ...c,
                imageUrl: res.url,
                cloudinaryPublicId: res.publicId || '',
              }
            : c
        );

        setCards(updatedCards);
        setOriginalCards(updatedCards);
        setIsDirty(false);

        // Auto-save immediately to Firestore so changes reflect on public site instantly
        await saveEventTypesConfig(updatedCards);

        setFeedback({
          type: 'success',
          message: 'Image uploaded and published live to public website successfully!',
        });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Upload failed: ' + (err.message || 'Network error') });
    } finally {
      setUploadingCardId(null);
      setUploadProgress(null);
      targetCardIdForUpload.current = null;
    }
  };

  // Handle direct image removal with auto-save
  const handleRemoveImage = async (cardId: string) => {
    const updatedCards = cards.map((c) =>
      c.id === cardId ? { ...c, imageUrl: '', cloudinaryPublicId: '' } : c
    );
    setCards(updatedCards);
    setOriginalCards(updatedCards);
    setIsDirty(false);
    await saveEventTypesConfig(updatedCards);
    setFeedback({ type: 'success', message: 'Image removed from event card.' });
  };

  // Add new event type card
  const handleAddNewCard = () => {
    const newId = 'event-' + Date.now();
    const newCard: EventTypeCard = {
      id: newId,
      title: 'New Event Type',
      description: 'Describe this special celebration and how Oreofe HolluWar supports your plans.',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
      order: cards.length + 1,
      enabled: true,
      tag: 'Special Occasion',
      ctaText: 'Plan This Event',
      whatsappMessage: 'Hello Mrs. Kolawole, I would like to enquire about your services for a new event.',
    };
    const updated = [...cards, newCard];
    setCards(updated);
    checkIfDirty(updated);
  };

  // Delete card
  const handleDeleteCard = (id: string) => {
    if (cards.length <= 1) {
      setFeedback({ type: 'error', message: 'You must keep at least one event type card.' });
      return;
    }
    const updated = cards.filter((c) => c.id !== id).map((c, i) => ({ ...c, order: i + 1 }));
    setCards(updated);
    checkIfDirty(updated);
  };

  // Save all changes to Firestore
  const handleSaveChanges = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const success = await saveEventTypesConfig(cards);
      if (success) {
        setOriginalCards([...cards]);
        setIsDirty(false);
        setFeedback({
          type: 'success',
          message: 'All Event Types were successfully saved to Firestore and are now live on the public site!',
        });
      } else {
        setFeedback({
          type: 'error',
          message: 'Saved to local cache, but Firestore connection encountered an error.',
        });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Save error: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (window.confirm('Reset all Event Types to initial default values?')) {
      setCards(INITIAL_EVENT_TYPES);
      checkIfDirty(INITIAL_EVENT_TYPES);
    }
  };

  // Discard edits
  const handleDiscard = () => {
    setCards([...originalCards]);
    setIsDirty(false);
    setFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Homepage Section</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            &ldquo;What Are You Planning?&rdquo; Event Types
          </h2>
          <p className="text-xs text-stone-400 max-w-xl mt-1 leading-relaxed">
            Customize the large image cards displayed on the homepage. Upload photos, modify titles and descriptions, toggle visibility, and drag or reorder cards.
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
            onClick={handleSaveChanges}
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
            <span>{saving ? 'Saving to Firestore...' : 'Save to Firestore'}</span>
          </button>
        </div>
      </div>

      {/* Notifications Banner */}
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

      {/* Uploading progress notification */}
      {uploadingCardId && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          <span>{uploadProgress || 'Processing image upload...'}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
          <p className="text-xs text-stone-400 font-mono">Loading cards from Firestore...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cards.map((card, index) => {
            const isCardUploading = uploadingCardId === card.id;

            return (
              <div
                key={card.id}
                className={`p-5 rounded-2xl border transition-all ${
                  card.enabled
                    ? 'bg-white/[0.02] border-white/10 hover:border-amber-500/30'
                    : 'bg-black/40 border-white/5 opacity-60'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  {/* Left Column: Image Preview & Change Button */}
                  <div className="lg:col-span-4">
                    <div className="relative h-44 w-full rounded-xl overflow-hidden bg-stone-900 border border-white/10 group">
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                      {/* Image Upload Overlay Button */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => triggerImageUpload(card.id)}
                          disabled={isCardUploading}
                          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Image</span>
                        </button>
                      </div>

                      {/* Status indicator on image */}
                      <div className="absolute top-2.5 left-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                            card.enabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {card.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white/90 font-medium">
                        <span className="truncate">{card.title}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => triggerImageUpload(card.id)}
                            className="text-[10px] text-amber-300 hover:underline flex items-center gap-1 cursor-pointer bg-black/60 px-2 py-0.5 rounded"
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span>Change</span>
                          </button>
                          {card.imageUrl && (
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(card.id)}
                              className="text-[10px] text-red-300 hover:underline cursor-pointer bg-black/60 px-2 py-0.5 rounded"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Direct Image URL input for flexibility */}
                    <div className="mt-2.5">
                      <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block mb-1">
                        Image URL (Cloudinary or Direct)
                      </label>
                      <input
                        type="text"
                        value={card.imageUrl}
                        onChange={(e) => handleFieldChange(card.id, 'imageUrl', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-stone-300 text-xs focus:outline-none focus:border-amber-500/50 font-mono"
                      />
                    </div>
                  </div>

                  {/* Middle Column: Title, Description, Tag & CTA */}
                  <div className="lg:col-span-6 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mb-1">
                          Event Title
                        </label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => handleFieldChange(card.id, 'title', e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-semibold focus:outline-none focus:border-amber-500/50"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mb-1">
                          Category Badge / Tag
                        </label>
                        <input
                          type="text"
                          value={card.tag}
                          onChange={(e) => handleFieldChange(card.id, 'tag', e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-amber-300 text-xs font-mono focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mb-1">
                        Short Friendly Description
                      </label>
                      <textarea
                        rows={2}
                        value={card.description}
                        onChange={(e) => handleFieldChange(card.id, 'description', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-stone-200 text-xs leading-relaxed focus:outline-none focus:border-amber-500/50 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mb-1">
                          Card Button Label
                        </label>
                        <input
                          type="text"
                          value={card.ctaText}
                          onChange={(e) => handleFieldChange(card.id, 'ctaText', e.target.value)}
                          placeholder="e.g. Plan Your Wedding"
                          className="w-full px-3.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-stone-200 text-xs focus:outline-none focus:border-amber-500/50"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mb-1">
                          WhatsApp Pre-filled Text
                        </label>
                        <input
                          type="text"
                          value={card.whatsappMessage}
                          onChange={(e) => handleFieldChange(card.id, 'whatsappMessage', e.target.value)}
                          className="w-full px-3.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-stone-300 text-xs focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions (Reorder, Toggle, Delete) */}
                  <div className="lg:col-span-2 flex lg:flex-col items-center justify-end gap-2 border-t lg:border-t-0 lg:border-l border-white/10 pt-3 lg:pt-0 lg:pl-4">
                    {/* Reorder Up / Down */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        title="Move Card Up"
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
                        disabled={index === cards.length - 1}
                        title="Move Card Down"
                        className={`p-2 rounded-lg border text-xs transition-all ${
                          index === cards.length - 1
                            ? 'border-white/5 text-stone-600 opacity-40 cursor-not-allowed'
                            : 'border-white/10 bg-white/5 text-stone-300 hover:text-white hover:bg-white/10 cursor-pointer'
                        }`}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Enable / Disable Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleEnable(card.id)}
                      title={card.enabled ? 'Click to disable' : 'Click to enable'}
                      className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        card.enabled
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-stone-800 text-stone-400 border border-white/10 hover:bg-stone-700'
                      }`}
                    >
                      {card.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{card.enabled ? 'Enabled' : 'Disabled'}</span>
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteCard(card.id)}
                      title="Remove Card"
                      className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bottom Action Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleAddNewCard}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-stone-200 text-xs font-medium transition-all hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add Another Event Type</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
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
