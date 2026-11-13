import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Check, X } from 'lucide-react';
import { SHOES } from './data/shoes';
import Navbar from './components/Navbar';
import ProductOverlay from './components/ProductOverlay';
import BagDrawer from './components/BagDrawer';
import IntroOverlay from './components/IntroOverlay';
import { StoryPage, ManufacturePage } from './components/Pages';

const TABS = ['Display', 'Story', 'Manufacture'];

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [activeTab, setActiveTab] = useState('Display');
  const [selectedShoe, setSelectedShoe] = useState(null);
  const [cameraTransform, setCameraTransform] = useState('translate3d(0px, 0px, 0) scale(1)');
  const [bagItems, setBagItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const stageRef = useRef(null);
  const shelfRefs = useRef({});
  const toastTimerRef = useRef(null);
  const wheelLockRef = useRef(0);

  const showToast = useCallback((message) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const computeZoomForShoe = useCallback((shoe) => {
    const stage = stageRef.current;
    const el = shelfRefs.current[shoe.id];
    if (!stage || !el) return;

    // Walk offsetLeft/offsetTop up to stageRef to get un-transformed coordinates
    let offsetX = 0;
    let offsetY = 0;
    let node = el;
    while (node && node !== stage) {
      offsetX += node.offsetLeft;
      offsetY += node.offsetTop;
      node = node.offsetParent;
    }

    // On desktop (>=768px) the card uses -translate-x-1/2 around its left% anchor, so offsetX is already the center
    const elCenterX = window.innerWidth >= 768 ? offsetX : offsetX + el.offsetWidth / 2;
    const elCenterY = offsetY + el.offsetHeight / 2;
    const stageCenterX = stage.offsetWidth / 2;
    const stageCenterY = stage.offsetHeight / 2;

    const ox = elCenterX - stageCenterX;
    const oy = elCenterY - stageCenterY;
    const scale = window.innerWidth < 768 ? 2.85 : 4.25;
    const yBias = window.innerWidth < 768 ? 18 : 44;

    // translate3d before scale moves the shoe in a straight, lag-free line (no parabolic curve on edge shoes)
    const tx = -ox * scale;
    const ty = -oy * scale + yBias;

    setCameraTransform(`translate3d(${tx}px, ${ty}px, 0) scale(${scale})`);
  }, []);

  const handleSelectShoe = useCallback(
    (shoe) => {
      setSelectedShoe(shoe);
      computeZoomForShoe(shoe);
    },
    [computeZoomForShoe]
  );

  const handleCloseShoe = useCallback(() => {
    setSelectedShoe(null);
    setCameraTransform('translate3d(0px, 0px, 0) scale(1)');
  }, []);

  // Recompute zoom on window resize if a shoe is open
  useEffect(() => {
    const onResize = () => {
      if (selectedShoe) {
        computeZoomForShoe(selectedShoe);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [selectedShoe, computeZoomForShoe]);

  // Keyboard shortcuts: Escape to close, Left/Right arrows to browse
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isBagOpen) setIsBagOpen(false);
        else if (isWishlistOpen) setIsWishlistOpen(false);
        else if (activeTab !== 'Display') setActiveTab('Display');
        else if (selectedShoe) handleCloseShoe();
      } else if (selectedShoe && !isBagOpen && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        const idx = SHOES.findIndex((s) => s.id === selectedShoe.id);
        const nextIdx =
          e.key === 'ArrowRight'
            ? (idx + 1) % SHOES.length
            : (idx - 1 + SHOES.length) % SHOES.length;
        handleSelectShoe(SHOES[nextIdx]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedShoe, isBagOpen, isWishlistOpen, activeTab, handleCloseShoe, handleSelectShoe]);

  // Smooth Wheel Scroll: pans between shoes when zoomed in, or between Display / Story / Manufacture pages
  useEffect(() => {
    const onWheel = (e) => {
      if (!introDone || isBagOpen || isWishlistOpen) return;
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 18) return;

      const now = Date.now();
      if (now - wheelLockRef.current < 580) return;
      wheelLockRef.current = now;

      const dir = delta > 0 ? 1 : -1;

      if (selectedShoe) {
        const idx = SHOES.findIndex((s) => s.id === selectedShoe.id);
        const nextIdx = (idx + dir + SHOES.length) % SHOES.length;
        handleSelectShoe(SHOES[nextIdx]);
      } else {
        const tabIdx = TABS.indexOf(activeTab);
        const nextTabIdx = Math.max(0, Math.min(TABS.length - 1, tabIdx + dir));
        if (nextTabIdx !== tabIdx) {
          setActiveTab(TABS[nextTabIdx]);
        }
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [introDone, isBagOpen, isWishlistOpen, selectedShoe, activeTab, handleSelectShoe]);

  const handleAddToBag = (shoe, size) => {
    setBagItems((prev) => {
      const existing = prev.find((item) => item.id === shoe.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.id === shoe.id && item.size === size ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...shoe, size, qty: 1 }];
    });
    showToast(`${shoe.name} (${size}) added to bag`);
  };

  const handleUpdateQty = (id, size, delta) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item.id === id && item.size === size ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const handleRemoveFromBag = (id, size) => {
    setBagItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const handleToggleWishlist = (id) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      const shoe = SHOES.find((s) => s.id === id);
      if (exists) {
        showToast(`${shoe?.name} removed from wishlist`);
        return prev.filter((item) => item !== id);
      } else {
        showToast(`${shoe?.name} saved to wishlist`);
        return [...prev, id];
      }
    });
  };

  const bagCount = bagItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="relative w-screen h-screen overflow-hidden gallery-wall-bg">
      {/* Cinematic Opening Intro */}
      {!introDone && <IntroOverlay onComplete={() => setIntroDone(true)} />}

      {/* Subtle architectural vignette */}
      <div className="pointer-events-none fixed inset-0 gallery-vignette z-10" />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'Display' && selectedShoe) {
            handleCloseShoe();
          }
        }}
        bagCount={bagCount}
        wishlistCount={wishlist.length}
        onOpenBag={() => setIsBagOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        isZoomed={Boolean(selectedShoe)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 z-50 px-4 py-2 rounded-full bg-zinc-900/95 border border-orange-500/40 text-xs font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl flex items-center gap-2 animate-[toastPop_0.35s_cubic-bezier(0.22,1,0.36,1)_forwards]">
          <span className="w-4 h-4 rounded-full bg-orange-500 text-black flex items-center justify-center">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </span>
          <span>{toast}</span>
        </div>
      )}

      {/* 3-Page Horizontal Camera Track (Display | Story | Manufacture) */}
      <div
        style={{ transform: `translateX(-${TABS.indexOf(activeTab) * 100}vw)` }}
        className="flex w-[300vw] h-full transition-transform duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        {/* PAGE 1: DISPLAY (Illuminated Sneaker Wall + Zoom Stage) */}
        <div className="relative w-screen h-screen shrink-0 overflow-hidden">
          <main
            ref={stageRef}
            style={{ transform: cameraTransform }}
            className={`camera-stage gallery-wall-bg relative w-full h-full flex flex-col justify-center items-center px-3 md:px-6 lg:px-8 pt-10 ${isBagOpen ? 'blur-[6px] scale-[0.99]' : ''
              }`}
          >
        <div className="relative z-10 w-full h-full flex flex-col justify-center">
          {/* Headline above the shelves (fades out when zoomed) */}
          <div
            className={`mb-6 md:mb-8 pl-6 md:pl-[7%] transition-all duration-500 ${selectedShoe ? 'opacity-0 -translate-y-3 pointer-events-none' : 'opacity-100'
              }`}
          >
            <h2 className="font-display text-lg md:text-2xl font-normal tracking-tight text-zinc-200">
              Form, lit from within.
            </h2>
          </div>

          {/* Mobile/Tablet fallback grid (< md) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-10 px-4 md:hidden">
            {SHOES.map((shoe) => {
              const isSelected = selectedShoe?.id === shoe.id;
              const isDimmed = Boolean(selectedShoe && !isSelected);

              return (
                <div
                  key={`m-${shoe.id}`}
                  onClick={() => handleSelectShoe(shoe)}
                  className={`shelf-card group relative w-full max-w-[200px] mx-auto flex flex-col items-center cursor-pointer transition-opacity duration-500 ${isSelected ? 'is-active z-20' : ''
                    } ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
                >
                  <div className="relative w-[84%] h-16 sm:h-20 flex items-end justify-center pb-1.5 z-10">
                    <div className="shelf-up-glow absolute bottom-0 left-0 right-0 h-12 z-0" />
                    <div className="shoe-sole-glow relative z-10 w-full h-full flex items-end justify-center">
                      <img
                        src={shoe.image}
                        alt={shoe.name}
                        draggable={false}
                        style={{
                          width: '300%',
                          maxWidth: 'none',
                          height: '300%',
                          transform: 'scale(0.3333)',
                          transformOrigin: 'bottom center',
                          willChange: 'transform',
                        }}
                        className="object-contain object-bottom select-none"
                      />
                    </div>
                  </div>
                  <div className="relative w-[84%] mt-0.5">
                    <div className="shelf-bar w-full" />
                    <div className="shelf-glow-wash absolute -top-1 left-0 right-0 h-20" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop 2x5 Wall: pixel-aligned to the exact 5 spotlight peaks in wall-bg.jpg */}
          <div className="hidden md:flex flex-col gap-y-14 lg:gap-y-16 w-full">
            {[0, 1].map((rowIdx) => {
              const spotlightX = ['13.18%', '35.94%', '54.20%', '71.88%', '89.06%'];
              const rowShoes = SHOES.slice(rowIdx * 5, rowIdx * 5 + 5);
              return (
                <div key={rowIdx} className="relative w-full h-[108px] lg:h-[116px]">
                  {rowShoes.map((shoe, colIdx) => {
                    const isSelected = selectedShoe?.id === shoe.id;
                    const isDimmed = Boolean(selectedShoe && !isSelected);

                    return (
                      <div
                        key={shoe.id}
                        ref={(el) => {
                          shelfRefs.current[shoe.id] = el;
                        }}
                        style={{ left: spotlightX[colIdx] }}
                        onClick={() => handleSelectShoe(shoe)}
                        className={`shelf-card group absolute top-0 -translate-x-1/2 w-[15%] max-w-[215px] flex flex-col items-center cursor-pointer transition-opacity duration-500 ${isSelected ? 'is-active z-20' : ''
                          } ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
                      >
                        {/* Shoe Image Container (4x pre-rasterized so 4.25x zoom has zero blur flash) */}
                        <div className="relative w-[86%] h-20 lg:h-[88px] flex items-end justify-center pb-1.5 z-10">
                          <div className="shelf-up-glow absolute bottom-0 left-0 right-0 h-12 z-0" />
                          <div className="shoe-sole-glow relative z-10 w-full h-full flex items-end justify-center">
                            <img
                              src={shoe.image}
                              alt={shoe.name}
                              draggable={false}
                              style={{
                                width: '400%',
                                maxWidth: 'none',
                                height: '400%',
                                transform: 'scale(0.25)',
                                transformOrigin: 'bottom center',
                                willChange: 'transform',
                              }}
                              className="object-contain object-bottom select-none"
                            />
                          </div>
                        </div>

                        {/* Illuminated Shelf Bar (exact shoe width) */}
                        <div className="relative w-[86%] mt-0.5">
                          <div className="shelf-bar w-full" />
                          {/* Warm wall wash beneath the shelf */}
                          <div className="shelf-glow-wash absolute -top-1 left-0 right-0 h-20" />
                        </div>

                        {/* Subtle Label on Hover */}
                        <div
                          className={`mt-2.5 flex items-center gap-2 transition-all duration-300 ${selectedShoe
                              ? 'opacity-0'
                              : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'
                            }`}
                        >
                          <span className="font-display text-[11px] font-semibold tracking-[0.18em] text-zinc-200 uppercase">
                            {shoe.name}
                          </span>
                          <span className="text-[10px] text-orange-400 font-medium">${shoe.price}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
          </main>
        </div>

        {/* PAGE 2: STORY */}
        <StoryPage
          onGoToDisplay={() => setActiveTab('Display')}
          onGoToManufacture={() => setActiveTab('Manufacture')}
        />

        {/* PAGE 3: MANUFACTURE */}
        <ManufacturePage
          onGoToStory={() => setActiveTab('Story')}
          onGoToDisplay={() => setActiveTab('Display')}
        />
      </div>

      {/* Product Detail Overlay (appears when zoomed into a shoe on Display) */}
      {selectedShoe && activeTab === 'Display' && (
        <ProductOverlay
          shoe={selectedShoe}
          onClose={handleCloseShoe}
          onAddToBag={handleAddToBag}
          isWishlisted={wishlist.includes(selectedShoe.id)}
          onToggleWishlist={handleToggleWishlist}
          onPrev={() => {
            const idx = SHOES.findIndex((s) => s.id === selectedShoe.id);
            handleSelectShoe(SHOES[(idx - 1 + SHOES.length) % SHOES.length]);
          }}
          onNext={() => {
            const idx = SHOES.findIndex((s) => s.id === selectedShoe.id);
            handleSelectShoe(SHOES[(idx + 1) % SHOES.length]);
          }}
        />
      )}

      {/* Slide-out Shopping Bag Drawer */}
      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        items={bagItems}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveFromBag}
        onClearBag={() => setBagItems([])}
      />

      {/* Wishlist Quick Modal */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/65 backdrop-blur-xl animate-[fadeIn_0.25s_ease_forwards]">
          <div className="relative w-full max-w-md rounded-2xl bg-[#111318] border border-white/12 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-sm font-bold tracking-[0.18em] uppercase text-white">
                SAVED SILHOUETTES ({wishlist.length})
              </h2>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.14] flex items-center justify-center text-zinc-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {wishlist.length === 0 ? (
              <p className="text-xs text-zinc-400 py-8 text-center">
                No saved silhouettes yet. Tap the heart icon on any sneaker to save it here.
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto custom-scroll">
                {wishlist.map((id) => {
                  const s = SHOES.find((item) => item.id === id);
                  if (!s) return null;
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        setIsWishlistOpen(false);
                        handleSelectShoe(s);
                      }}
                      className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/8 cursor-pointer transition-colors"
                    >
                      <img src={s.image} alt={s.name} className="w-16 h-11 object-contain" />
                      <div className="flex-1">
                        <p className="font-display text-xs font-bold text-white">{s.name}</p>
                        <p className="text-[11px] text-zinc-400">${s.price}</p>
                      </div>
                      <span className="text-[10px] tracking-wider uppercase text-orange-400">
                        View
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Center Studio Credit Pill (Home / Display wall only, hidden when product is open) */}
      <footer
        className={`pointer-events-none fixed bottom-4 left-1/2 -translate-x-1/2 z-30 transition-all duration-400 ${
          !selectedShoe && activeTab === 'Display'
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-3'
        }`}
      >
        <div className="px-4 py-1.5 rounded-full bg-zinc-900/75 border border-white/10 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.65)] flex items-center gap-2 text-[11px] tracking-[0.14em] text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#ff6a00]" />
          <span>
            Developed by <strong className="font-semibold text-white">Youssef</strong>
          </span>
        </div>
      </footer>
    </div>
  );
}

