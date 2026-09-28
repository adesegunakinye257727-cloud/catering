import React from 'react';
import { X, Sparkles, Clock, ArrowRight, Heart } from 'lucide-react';
import { AppCake } from '../data/appData';
import { AppTab } from './AppBottomNav';

interface CakeDetailsModalProps {
  cake: AppCake | null;
  onClose: () => void;
  onPlanWithCake: (cake: AppCake) => void;
}

export const CakeDetailsModal: React.FC<CakeDetailsModalProps> = ({
  cake,
  onClose,
  onPlanWithCake,
}) => {
  if (!cake) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 shadow-2xl text-stone-900 border border-stone-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-stone-100">
            <img
              src={cake.imageUrl}
              alt={cake.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-amber-300 font-mono text-[10px] font-semibold uppercase">
                {cake.categoryLabel}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-950">
              {cake.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 font-light mt-1">
              {cake.description}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{cake.tierInfo}</span>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase text-stone-400 font-semibold block">
              Signature Flavors:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {cake.flavorHighlights.map((flavor, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs"
                >
                  {flavor}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-stone-500 pt-2 border-t border-stone-100">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>{cake.leadTime}</span>
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={() => onPlanWithCake(cake)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
            >
              <span>Add to Celebration Planner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
