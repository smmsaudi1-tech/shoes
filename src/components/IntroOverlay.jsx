import React, { useEffect, useRef, useState } from 'react';

export default function IntroOverlay({ onComplete }) {
  const canvasRef = useRef(null);
  const [stage, setStage] = useState('assembling'); // 'assembling' -> 'locked' -> 'reveal' -> 'done'
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const stageRef = useRef('assembling');

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];
    let startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);

    // Sample real pixels of /shoes/1.png to build 3,000+ physical particles
    const img = new Image();
    img.src = '/shoes/1.png';
    img.onload = () => {
      const sampleW = 190;
      const sampleH = Math.round((img.height / img.width) * sampleW);
      const off = document.createElement('canvas');
      off.width = sampleW;
      off.height = sampleH;
      const octx = off.getContext('2d');
      octx.drawImage(img, 0, 0, sampleW, sampleH);
      const data = octx.getImageData(0, 0, sampleW, sampleH).data;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const displayW = Math.min(480, w * 0.72);
      const displayH = (sampleH / sampleW) * displayW;
      const offsetX = (w - displayW) / 2;
      const offsetY = (h - displayH) / 2 - 20;

      const list = [];
      const step = 2;
      for (let py = 0; py < sampleH; py += step) {
        for (let px = 0; px < sampleW; px += step) {
          const i = (py * sampleW + px) * 4;
          const a = data[i + 3];
          if (a > 120) {
            const tx = offsetX + (px / sampleW) * displayW;
            const ty = offsetY + (py / sampleH) * displayH;

            // Scatter in a wide 3D swirl around the room
            const angle = Math.random() * Math.PI * 2;
            const dist = 160 + Math.random() * Math.max(w, h) * 0.55;
            list.push({
              x: w / 2 + Math.cos(angle) * dist,
              y: h / 2 + Math.sin(angle) * dist,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.5) * 8,
              tx,
              ty,
              color: `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`,
              size: 1.6 + Math.random() * 1.4,
              delay: Math.random() * 0.35,
            });
          }
        }
      }
      particles = list;
      startTime = performance.now();
    };

    const render = (now) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const elapsed = (now - startTime) / 1000;

      // Subtle motion trail
      ctx.fillStyle = 'rgba(5, 6, 9, 0.32)';
      ctx.fillRect(0, 0, w, h);

      // Ambient warm floor/center glow growing as particles assemble
      const glowAlpha = Math.min(0.42, elapsed * 0.22);
      const rad = ctx.createRadialGradient(w / 2, h / 2 - 10, 10, w / 2, h / 2 - 10, 340);
      rad.addColorStop(0, `rgba(255, 120, 25, ${glowAlpha})`);
      rad.addColorStop(0.55, `rgba(255, 75, 0, ${glowAlpha * 0.35})`);
      rad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const curStage = stageRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (elapsed < p.delay) continue;

        if (curStage === 'reveal') {
          // Dissolve outward on final reveal
          p.vx += (p.x - w / 2) * 0.015;
          p.vy += (p.y - h / 2) * 0.015;
          p.x += p.vx;
          p.y += p.vy;
        } else {
          // Magnetic spring attraction to exact sneaker pixel
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          p.vx = p.vx * 0.78 + dx * 0.14;
          p.vy = p.vy * 0.78 + dy * 0.14;

          // Interactive mouse repulsion
          const mdx = p.x - mx;
          const mdy = p.y - my;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 95 && mdist > 0) {
            const force = ((95 - mdist) / 95) * 10;
            p.vx += (mdx / mdist) * force;
            p.vy += (mdy / mdist) * force;
          }

          p.x += p.vx;
          p.y += p.vy;
        }

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // Choreography timeline
    const tLock = setTimeout(() => setStage('locked'), 2100);
    const tReveal = setTimeout(() => setStage('reveal'), 3650);
    const tDone = setTimeout(() => {
      setStage('done');
      onComplete();
    }, 4450);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      clearTimeout(tLock);
      clearTimeout(tReveal);
      clearTimeout(tDone);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setStage('reveal');
    setTimeout(() => {
      setStage('done');
      onComplete();
    }, 650);
  };

  if (stage === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-[#050609] select-none transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        stage === 'reveal' ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Real-time Sneaker Particle Assembly Canvas (particles stay visible as the hero sneaker) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Neon Shelf & YOUSSEF Lockup (no real photo, pure particle sneaker above the shelf) */}
      <div
        className={`pointer-events-none relative z-10 w-full h-full transition-all duration-1000 ease-out ${
          stage === 'locked' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Ignited Amber Glass Shelf positioned directly beneath the assembled particle sneaker */}
        <div
          style={{ top: 'calc(50% + 96px)' }}
          className="absolute left-1/2 -translate-x-1/2 w-[62vw] max-w-[415px]"
        >
          <div className="w-full h-[7px] rounded-full bg-gradient-to-r from-orange-600 via-amber-200 to-orange-600 shadow-[0_0_26px_6px_rgba(255,115,20,0.95),0_16px_50px_10px_rgba(255,80,0,0.5)]" />
        </div>

        {/* Monumental ZEVON Logo Lockup below the shelf */}
        <div
          style={{ top: 'calc(50% + 126px)' }}
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center text-center whitespace-nowrap"
        >
          <img
            src="/zevon-logo.png"
            alt="ZEVON"
            className="w-40 sm:w-48 h-auto object-contain drop-shadow-[0_0_24px_rgba(255,140,40,0.45)]"
          />
          <p className="mt-2 font-display text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-orange-300/90">
            Form, lit from within.
          </p>
        </div>
      </div>

      {/* Top Subtle Status during Particle Assembly */}
      <div
        className={`pointer-events-none fixed top-7 left-8 z-20 flex items-center gap-2.5 text-[10px] tracking-[0.26em] uppercase text-zinc-400 transition-opacity duration-500 ${
          stage === 'assembling' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
        <span>MATERIALIZING // STUDIO 01</span>
      </div>

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="fixed bottom-8 right-8 z-30 px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.18] border border-white/15 text-[10px] font-semibold tracking-[0.22em] uppercase text-zinc-200 hover:text-white transition-all cursor-pointer backdrop-blur-md"
      >
        Skip Intro →
      </button>
    </div>
  );
}
