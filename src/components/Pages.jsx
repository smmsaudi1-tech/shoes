import React from 'react';
import { Flame, Layers, Compass, ArrowLeft, ArrowRight, Sparkles, ShieldCheck, Cpu } from 'lucide-react';

export function StoryPage({ onGoToDisplay, onGoToManufacture }) {
  return (
    <section className="relative w-screen h-screen shrink-0 overflow-hidden gallery-wall-bg flex items-center justify-center px-6 sm:px-12 md:px-20 pt-16">
      <div className="pointer-events-none absolute inset-0 bg-black/45" />
      <div className="pointer-events-none absolute -top-24 left-1/3 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,115,20,0.16)_0%,transparent_70%)] blur-3xl" />

      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-12 gap-10 items-center">
        {/* Left Editorial Story */}
        <div className="md:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-semibold tracking-[0.26em] uppercase text-orange-400">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#ff6a00]" />
            <span>01 // THE YOUSSEF ETHOS</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05]">
            Form, lit from within.
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
            YOUSSEF began as an architectural lighting study applied to technical footwear. Every
            silhouette is sculpted to catch warm peripheral light along its outsole—revealing
            material grain, seam geometry, and proportion without distraction.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-2 max-w-lg">
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <Flame className="w-4 h-4 text-orange-400 mb-2" />
              <p className="font-display text-xl font-bold text-white">10</p>
              <p className="text-[11px] text-zinc-400 tracking-wide">Editions</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <Layers className="w-4 h-4 text-orange-400 mb-2" />
              <p className="font-display text-xl font-bold text-white">01</p>
              <p className="text-[11px] text-zinc-400 tracking-wide">Studio Wall</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <Compass className="w-4 h-4 text-orange-400 mb-2" />
              <p className="font-display text-xl font-bold text-white">100%</p>
              <p className="text-[11px] text-zinc-400 tracking-wide">Craft Focus</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onGoToDisplay}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-orange-400 text-zinc-950 text-xs font-bold tracking-[0.16em] uppercase flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Explore Wall</span>
            </button>
            <button
              onClick={onGoToManufacture}
              className="px-5 py-2.5 rounded-full bg-white/[0.07] hover:bg-white/[0.14] border border-white/15 text-xs font-semibold tracking-[0.16em] uppercase text-white flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Manufacture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Floating Sneaker Showcase */}
        <div className="md:col-span-5 hidden md:flex flex-col items-center justify-center relative">
          <div className="absolute w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(255,120,25,0.28)_0%,transparent_70%)] blur-2xl" />
          <img
            src="/shoes/3.png"
            alt="YOUSSEF Story Edition"
            className="relative z-10 w-full max-w-[390px] object-contain drop-shadow-[0_26px_38px_rgba(0,0,0,0.9)] -rotate-3 hover:rotate-0 transition-transform duration-700"
          />
          <div className="w-[80%] h-[7px] -mt-1 rounded-full bg-gradient-to-r from-orange-600 via-amber-200 to-orange-600 shadow-[0_0_24px_6px_rgba(255,115,20,0.9),0_16px_45px_10px_rgba(255,80,0,0.45)]" />
          <p className="mt-4 text-[10px] tracking-[0.26em] uppercase text-zinc-400">
            ARCHIVE // STRIDE 03
          </p>
        </div>
      </div>
    </section>
  );
}

export function ManufacturePage({ onGoToStory, onGoToDisplay }) {
  const specs = [
    {
      icon: Sparkles,
      code: '01 // UPPER',
      title: 'Italian Suede & Ripstop',
      desc: 'Hydrophobic micro-perforated ripstop paired with vegetable-tanned suede panels cut to 0.2mm tolerance.',
    },
    {
      icon: Cpu,
      code: '02 // CHASSIS',
      title: 'Nitrogen-Infused Core',
      desc: 'Dual-density EVA midsole architecture engineered for high-return energy transfer and zero-lag rebound.',
    },
    {
      icon: ShieldCheck,
      code: '03 // INSPECTION',
      title: 'Amber Studio Calibration',
      desc: 'Every numbered pair is hand-inspected under 2700K directional gallery lighting before individual boxing.',
    },
  ];

  return (
    <section className="relative w-screen h-screen shrink-0 overflow-hidden gallery-wall-bg flex items-center justify-center px-6 sm:px-12 md:px-20 pt-16">
      <div className="pointer-events-none absolute inset-0 bg-black/50" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-[540px] h-[540px] rounded-full bg-[radial-gradient(circle,rgba(255,110,20,0.16)_0%,transparent_70%)] blur-3xl" />

      <div className="relative z-10 w-full max-w-6xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-semibold tracking-[0.26em] uppercase text-orange-400 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#ff6a00]" />
              <span>02 // PRECISION ENGINEERING</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Built in small numbered batches.
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToStory}
              className="px-4 py-2.5 rounded-full bg-white/[0.07] hover:bg-white/[0.14] border border-white/15 text-xs font-semibold tracking-[0.16em] uppercase text-white flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Story</span>
            </button>
            <button
              onClick={onGoToDisplay}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-orange-400 text-zinc-950 text-xs font-bold tracking-[0.16em] uppercase flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Back to Display</span>
            </button>
          </div>
        </div>

        {/* 3 Engineering Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {specs.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.code}
                className="group p-6 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-orange-500/40 backdrop-blur-xl transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-semibold tracking-[0.22em] text-orange-400">
                    {item.code}
                  </span>
                  <Icon className="w-4 h-4 text-zinc-400 group-hover:text-orange-400 transition-colors" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom Blueprint Sneaker Strip */}
        <div className="hidden sm:flex items-center justify-between px-6 py-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-5">
            <img src="/shoes/2.png" alt="Vector 02 Engineering" className="w-28 h-14 object-contain" />
            <div>
              <p className="text-[10px] tracking-[0.22em] uppercase text-orange-400">
                STUDIO SPECIFICATION
              </p>
              <p className="text-sm font-semibold text-white">
                Batch 01–10 // Individually Serialized & Light-Calibrated
              </p>
            </div>
          </div>
          <span className="text-xs tracking-[0.2em] uppercase text-zinc-500">
            SCROLL TO NAVIGATE
          </span>
        </div>
      </div>
    </section>
  );
}

