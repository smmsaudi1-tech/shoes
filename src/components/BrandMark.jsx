import React, { useId } from 'react';

export default function BrandMark({ size = 28, className = '' }) {
  const uid = useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Chamfered Octagon Outer Frame */}
      <path
        d="M12 2.5H28L37.5 12V28L28 37.5H12L2.5 28V12L12 2.5Z"
        stroke={`url(#frame-${uid})`}
        strokeWidth="1.4"
        fill={`url(#bg-${uid})`}
      />

      {/* Aerodynamic Left Wing Blade */}
      <path
        d="M9.5 10.5L16.2 10.5L20.4 19.2L16.5 22.8L9.5 10.5Z"
        fill={`url(#bladeL-${uid})`}
      />

      {/* Aerodynamic Right Wing Blade (overlapping highlight) */}
      <path
        d="M30.5 10.5L23.8 10.5L17.2 23.6L17.2 31L21.4 29.2L21.4 22.8L30.5 10.5Z"
        fill={`url(#bladeR-${uid})`}
      />

      {/* Glowing Amber Core Accent */}
      <path
        d="M17.2 23.6L21.4 22.8L21.4 29.2L17.2 31V23.6Z"
        fill={`url(#core-${uid})`}
      />

      <defs>
        <linearGradient id={`bg-${uid}`} x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#181A20" />
          <stop offset="1" stopColor="#090A0D" />
        </linearGradient>
        <linearGradient id={`frame-${uid}`} x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9E2C" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.25" />
          <stop offset="1" stopColor="#FF5500" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`bladeL-${uid}`} x1="9.5" y1="10.5" x2="20.4" y2="22.8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#A1A1AA" />
        </linearGradient>
        <linearGradient id={`bladeR-${uid}`} x1="30.5" y1="10.5" x2="17.2" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE2A8" />
          <stop offset="0.45" stopColor="#FF8C24" />
          <stop offset="1" stopColor="#D94800" />
        </linearGradient>
        <linearGradient id={`core-${uid}`} x1="17.2" y1="22.8" x2="21.4" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB347" />
          <stop offset="1" stopColor="#FF4D00" />
        </linearGradient>
      </defs>
    </svg>
  );
}

