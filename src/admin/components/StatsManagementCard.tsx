import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  RotateCcw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  CalendarCheck,
  Smile,
  Award,
  Users,
} from 'lucide-react';
import {
  StatsData,
  getStats,
  saveStats,
  INITIAL_STATS,
} from '../../services/statsService';

export const StatsManagementCard: React.FC = () => {
  const [stats, setStats] = useState<StatsData>(INITIAL_STATS);
  const [originalStats, setOriginalStats] = useState<StatsData>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getStats();
        setStats(data);
        setOriginalStats(data);
      } catch (err: any) {
        setFeedback({ type: 'error', message: 'Failed to load stats: ' + err.message });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (field: keyof StatsData, value: string) => {
    const num = parseInt(value, 10);
    const updated = {
      ...stats,
      [field]: isNaN(num) ? 0 : Math.max(0, num),
    };
    setStats(updated);
    setIsDirty(JSON.stringify(updated) !== JSON.stringify(originalStats));
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const ok = await saveStats(stats);
      if (ok) {
        setOriginalStats({ ...stats });
        setIsDirty(false);
        setFeedback({
          type: 'success',
          message: 'Milestone stats saved successfully to Firestore and updated on the live website!',
        });
      } else {
        setFeedback({
          type: 'error',
          message: 'Saved to local cache, but Firestore connection encountered an error.',
        });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Save failed: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setStats({ ...INITIAL_STATS });
    setIsDirty(JSON.stringify(INITIAL_STATS) !== JSON.stringify(originalStats));
  };

  const handleDiscard = () => {
    setStats({ ...originalStats });
    setIsDirty(false);
    setFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Homepage Animated Milestone Numbers</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            Animated Statistics
          </h2>
          <p className="text-xs text-stone-400 max-w-xl mt-1 leading-relaxed">
            Update the 4 statistics displayed between the Hero and &ldquo;What Are You Planning?&rdquo;. The numbers animate smoothly for 3–5 seconds from 0 when entering the user&apos;s viewport.
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
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
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
          <p className="text-xs text-stone-400 font-mono">Loading statistics from Firestore...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Events Completed */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-400 flex items-center justify-center mb-4">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Stat 1
              </span>
              <h3 className="font-serif text-lg font-bold text-white mb-3">
                Events Completed
              </h3>
            </div>

            <div>
              <label className="text-[10px] font-mono text-stone-500 uppercase block mb-1">
                Target Number
              </label>
              <input
                type="number"
                min="0"
                value={stats.eventsCompleted}
                onChange={(e) => handleChange('eventsCompleted', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-lg font-bold focus:outline-none focus:border-amber-500"
              />
              <span className="text-[11px] text-stone-400 font-sans mt-1.5 block">
                Displayed as {stats.eventsCompleted}+
              </span>
            </div>
          </div>

          {/* 2. Happy Customers */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 flex items-center justify-center mb-4">
                <Smile className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Stat 2
              </span>
              <h3 className="font-serif text-lg font-bold text-white mb-3">
                Happy Customers
              </h3>
            </div>

            <div>
              <label className="text-[10px] font-mono text-stone-500 uppercase block mb-1">
                Target Number
              </label>
              <input
                type="number"
                min="0"
                value={stats.happyCustomers}
                onChange={(e) => handleChange('happyCustomers', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-lg font-bold focus:outline-none focus:border-amber-500"
              />
              <span className="text-[11px] text-stone-400 font-sans mt-1.5 block">
                Displayed as {stats.happyCustomers}+
              </span>
            </div>
          </div>

          {/* 3. Years of Experience */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-400 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Stat 3
              </span>
              <h3 className="font-serif text-lg font-bold text-white mb-3">
                Years of Experience
              </h3>
            </div>

            <div>
              <label className="text-[10px] font-mono text-stone-500 uppercase block mb-1">
                Target Number
              </label>
              <input
                type="number"
                min="0"
                value={stats.yearsOfExperience}
                onChange={(e) => handleChange('yearsOfExperience', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-lg font-bold focus:outline-none focus:border-amber-500"
              />
              <span className="text-[11px] text-stone-400 font-sans mt-1.5 block">
                Displayed as {stats.yearsOfExperience}+
              </span>
            </div>
          </div>

          {/* 4. Happy Clients */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-400 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Stat 4
              </span>
              <h3 className="font-serif text-lg font-bold text-white mb-3">
                Happy Clients
              </h3>
            </div>

            <div>
              <label className="text-[10px] font-mono text-stone-500 uppercase block mb-1">
                Target Number
              </label>
              <input
                type="number"
                min="0"
                value={stats.happyClients}
                onChange={(e) => handleChange('happyClients', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-lg font-bold focus:outline-none focus:border-amber-500"
              />
              <span className="text-[11px] text-stone-400 font-sans mt-1.5 block">
                Displayed as {stats.happyClients}+
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="pt-2 flex items-center justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-300 font-mono transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Initial Defaults</span>
        </button>
      </div>
    </div>
  );
};
