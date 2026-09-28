import React from 'react';
import {
  Save,
  RotateCcw,
  Loader2,
  Check,
  AlertCircle,
  Menu,
} from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle: string;
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onToggleMobileMenu?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  isDirty,
  isSaving,
  onSave,
  onDiscard,
  onToggleMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0a0907]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Title & Subtitle */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-stone-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
              {title}
              {isDirty && (
                <span className="text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Unsaved Edits
                </span>
              )}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Right: Save / Discard Actions */}
        <div className="flex items-center gap-3">
          {/* Discard Changes Button */}
          <button
            type="button"
            onClick={onDiscard}
            disabled={!isDirty || isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none transition-colors border border-transparent hover:border-white/10 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Discard Changes
          </button>

          {/* Prominent Save Changes Button */}
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg cursor-pointer ${
              isDirty
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20 scale-[1.02]'
                : 'bg-white/10 hover:bg-white/15 text-stone-200 shadow-transparent'
            } disabled:opacity-50 disabled:pointer-events-none`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving to Firestore...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
