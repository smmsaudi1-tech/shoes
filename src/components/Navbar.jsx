import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';

export default function Navbar({
  activeTab,
  onSelectTab,
  bagCount,
  wishlistCount,
  onOpenBag,
  onOpenWishlist,
  isZoomed,
}) {
  const navItems = ['Display', 'Story', 'Manufacture'];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 px-6 md:px-10 py-4 flex items-center justify-between transition-all duration-500 ${
        isZoomed ? 'bg-gradient-to-b from-black/60 to-transparent' : 'bg-transparent'
      }`}
    >
      {/* Left: ZEVON 3D Logo */}
      <button
        onClick={() => onSelectTab('Display')}
        className="logo-3d-wrap flex items-center gap-3 group cursor-pointer focus:outline-none"
        aria-label="ZEVON Home"
      >
        <img
          src="/zevon-mark.png"
          alt="ZEVON"
          className="logo-3d-icon h-8 md:h-9 w-auto object-contain"
        />

        <span className="font-nav-brand logo-3d-text text-base md:text-lg font-extrabold tracking-[0.26em]">
          ZEVON
        </span>
      </button>

      {/* Center: Navigation Links */}
      <nav className="hidden sm:flex items-center gap-9 font-nav">
        {navItems.map((item) => {
          const isActive = activeTab === item;
          return (
            <button
              key={item}
              onClick={() => onSelectTab(item)}
              className={`text-[12px] tracking-[0.18em] uppercase transition-colors duration-300 cursor-pointer relative py-1 ${
                isActive ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-100 font-medium'
              }`}
            >
              {item}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_#ff6a00]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right: Bag & Wishlist */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenWishlist}
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-zinc-200 hover:text-white transition-all cursor-pointer"
          aria-label="Wishlist"
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-orange-500 text-orange-500' : ''}`} />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-[10px] font-bold text-black flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenBag}
          className="flex items-center gap-2 px-3.5 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs font-medium tracking-wider text-white transition-all cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
          <span>Bag</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/15 text-[10px] font-semibold">
            {bagCount}
          </span>
        </button>
      </div>
    </header>
  );
}

