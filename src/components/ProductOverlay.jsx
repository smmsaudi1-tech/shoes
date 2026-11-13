import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Heart, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductOverlay({
  shoe,
  onClose,
  onAddToBag,
  isWishlisted,
  onToggleWishlist,
  onPrev,
  onNext,
}) {
  const [selectedSize, setSelectedSize] = useState('EU 42');
  const [sizeOpen, setSizeOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSizeOpen(false);
    setSelectedSize('EU 42');
  }, [shoe?.id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSizeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!shoe) return null;

  return (
    <div className="fixed inset-0 z-30 pointer-events-none flex items-center justify-between px-6 sm:px-10 md:px-16">
      {/* Left Info Panel */}
      <div className="pointer-events-auto relative z-10 max-w-[290px] md:max-w-[330px] animate-[fadeSlideLeft_0.55s_cubic-bezier(0.22,1,0.36,1)_forwards]">
        <div className="flex items-center gap-2.5 mb-7">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-900/85 hover:bg-white/15 border border-white/15 flex items-center justify-center text-zinc-200 hover:text-white transition-colors cursor-pointer"
            aria-label="Back to wall"
            title="Back to wall (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={onPrev}
              className="w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-white/15 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Previous shoe"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNext}
              className="w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-white/15 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Next shoe"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-[11px] font-medium tracking-[0.24em] text-orange-400/90 uppercase mb-2">
          {shoe.collection}
        </p>

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-none mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          {shoe.name}
        </h1>

        <p className="text-sm font-medium text-zinc-200 mb-2 leading-snug">
          {shoe.tagline}
        </p>
        <p className="text-xs text-zinc-400 leading-relaxed hidden sm:block">
          {shoe.description}
        </p>
      </div>

      {/* Right Purchase Panel (lifted slightly higher for cleaner framing & dropdown space) */}
      <div className="pointer-events-auto relative z-10 flex flex-col items-end gap-4 -translate-y-10 md:-translate-y-16 animate-[fadeSlideRight_0.55s_cubic-bezier(0.22,1,0.36,1)_forwards]">
        <div className="text-right">
          <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 block mb-0.5">
            Retail Price
          </span>
          <span className="font-display text-2xl md:text-3xl font-bold text-white">
            ${shoe.price}
          </span>
        </div>

        {/* Custom Size Dropdown (matching video 00:08 & 00:15) */}
        <div className="relative w-44" ref={dropdownRef}>
          <button
            onClick={() => setSizeOpen((prev) => !prev)}
            className="w-full px-4 py-2.5 rounded-lg bg-zinc-950/90 hover:bg-zinc-900 border border-white/15 flex items-center justify-between text-xs font-medium text-white transition-colors cursor-pointer"
          >
            <span className="text-zinc-400 mr-2">Size</span>
            <span className="font-semibold flex-1 text-left">{selectedSize}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-300 ${
                sizeOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {sizeOpen && (
            <div className="absolute right-0 mt-1.5 w-full max-h-56 overflow-y-auto custom-scroll rounded-lg bg-zinc-950/95 border border-white/15 backdrop-blur-2xl shadow-2xl py-1 z-50">
              {shoe.sizes.map((size) => {
                const active = size === selectedSize;
                return (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      active
                        ? 'bg-orange-500/20 text-orange-300 font-semibold'
                        : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{size}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Add to Bag + Wishlist */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onToggleWishlist(shoe.id)}
            className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              isWishlisted
                ? 'bg-orange-500/20 border-orange-500/60 text-orange-400'
                : 'bg-zinc-950/85 border-white/15 text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
            aria-label="Toggle Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-orange-400' : ''}`} />
          </button>

          <button
            onClick={() => onAddToBag(shoe, selectedSize)}
            className="h-11 px-6 rounded-full bg-white hover:bg-orange-400 text-zinc-950 text-xs font-bold tracking-[0.16em] uppercase flex items-center gap-2 transition-all duration-300 cursor-pointer shadow-[0_0_24px_rgba(255,255,255,0.18)] hover:shadow-[0_0_28px_rgba(255,140,40,0.45)]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>ADD TO BAG</span>
          </button>
        </div>
      </div>
    </div>
  );
}

