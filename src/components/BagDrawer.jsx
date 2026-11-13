import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';

export default function BagDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemove,
  onClearBag,
}) {
  const [checkedOut, setCheckedOut] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = () => {
    setCheckedOut(true);
    setTimeout(() => {
      onClearBag();
      setCheckedOut(false);
      onClose();
    }, 2200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-500 ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Blurred dark backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/55 backdrop-blur-md transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Sleek Dark Mode Slide-out Drawer */}
      <aside
        className={`absolute top-0 right-0 h-full w-full max-w-[400px] bg-[#0d0f13]/95 backdrop-blur-2xl border-l border-white/10 text-white shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-sm font-bold tracking-[0.16em] uppercase text-white">
              YOUR BAG
            </h2>
            <span className="text-xs font-medium text-zinc-400">({totalCount})</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.14] flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close bag"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scroll px-6 py-5">
          {checkedOut ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-1">
                Order Confirmed
              </h3>
              <p className="text-sm text-zinc-400 max-w-[240px]">
                Thank you for choosing YOUSSEF. Your pair is being prepared in our studio.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <p className="text-sm font-medium text-zinc-300 mb-1">Your bag is empty.</p>
              <p className="text-xs text-zinc-500">
                Select any silhouette from the illuminated wall to add it.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-4 p-3.5 rounded-xl bg-white/[0.04] border border-white/10 shadow-sm"
                >
                  <div className="w-24 h-20 rounded-lg bg-black/60 border border-white/5 flex items-center justify-center p-2 shrink-0 relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-1.5 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-orange-500 via-amber-300 to-orange-500 opacity-90 shadow-[0_0_8px_#ff6a00]" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-semibold tracking-[0.14em] text-orange-400/90 uppercase">
                          {item.collection}
                        </p>
                        <h3 className="font-display text-sm font-bold text-white truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5">Size: {item.size}</p>
                      </div>
                      <button
                        onClick={() => onRemove(item.id, item.size)}
                        className="text-zinc-500 hover:text-red-400 transition-colors cursor-pointer p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-white/15 rounded-full bg-white/[0.05]">
                        <button
                          onClick={() => onUpdateQty(item.id, item.size, -1)}
                          className="w-7 h-7 flex items-center justify-center text-zinc-300 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-white">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.id, item.size, 1)}
                          className="w-7 h-7 flex items-center justify-center text-zinc-300 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-white">
                        ${item.price * item.qty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && !checkedOut && (
          <div className="p-6 border-t border-white/10 bg-black/40">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
              <span>Shipping</span>
              <span>Complimentary Express</span>
            </div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-semibold text-zinc-200">Subtotal</span>
              <span className="font-display text-lg font-bold text-white">${subtotal}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 px-5 rounded-full bg-white hover:bg-orange-400 text-zinc-950 text-xs font-bold tracking-[0.18em] uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_24px_rgba(255,255,255,0.16)] hover:shadow-[0_0_28px_rgba(255,140,40,0.45)]"
            >
              <span>CHECKOUT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

