import React from 'react';
import { X, Layers, Flame, Compass } from 'lucide-react';

export default function StoryModal({ tab, onClose }) {
  if (tab !== 'Story' && tab !== 'Manufacture') return null;

  const isStory = tab === 'Story';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-6 bg-black/70 backdrop-blur-xl animate-[fadeIn_0.35s_ease_forwards]">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#101216]/95 border border-white/12 p-8 md:p-10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.14] flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <p className="text-[11px] font-semibold tracking-[0.24em] text-orange-400 uppercase mb-3">
          {isStory ? 'THE YOUSSEF ETHOS' : 'PRECISION ENGINEERING'}
        </p>

        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
          {isStory ? 'Form, lit from within.' : 'Built in small numbered batches.'}
        </h2>

        <p className="text-sm text-zinc-300 leading-relaxed mb-8">
          {isStory
            ? 'YOUSSEF began as an architectural lighting study applied to technical footwear. Every silhouette is sculpted to catch warm peripheral light along its outsole—revealing material grain, seam geometry, and proportion without distraction.'
            : 'Each YOUSSEF edition is assembled in limited runs using Italian brushed suede, nitrogen-infused EVA compounds, and micro-perforated ripstop textiles. Every pair is individually inspected under studio amber calibration before boxing.'}
        </p>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/8">
            <Flame className="w-5 h-5 text-orange-400 mb-2.5" />
            <h3 className="text-xs font-bold tracking-wider uppercase text-white mb-1">
              {isStory ? 'Ambient Form' : 'Dual-Density'}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isStory
                ? 'Silhouettes designed around shadow, bevel, and surface tension.'
                : 'Nitrogen-charged midsole cores tuned for zero-lag rebound.'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/8">
            <Layers className="w-5 h-5 text-orange-400 mb-2.5" />
            <h3 className="text-xs font-bold tracking-wider uppercase text-white mb-1">
              {isStory ? 'Tactile Craft' : 'Italian Suede'}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isStory
                ? 'Natural calfskin, open mesh, and raw gum rubber in harmony.'
                : 'Vegetable-tanned panels paired with hydrophobic ripstop.'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/8">
            <Compass className="w-5 h-5 text-orange-400 mb-2.5" />
            <h3 className="text-xs font-bold tracking-wider uppercase text-white mb-1">
              {isStory ? '10 Editions' : 'Batch Serial'}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isStory
                ? 'Ten foundational silhouettes numbered 01 through 10.'
                : 'Numbered interior tongue tags on every studio release.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

