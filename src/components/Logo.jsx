import React from 'react';

const Logo = ({ className = 'w-10 h-10', title = 'حصنك' }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={title}
  >
    <defs>
      <linearGradient id="lg1" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#6d28d9" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0369a1" floodOpacity="0.12" />
      </filter>
    </defs>

    <rect x="6" y="6" width="88" height="88" rx="18" fill="url(#lg1)" filter="url(#soft)" />

    {/* Calligraphic H-like motif inspired by Arabic 'ح' but abstract and respectful */}
    <g transform="translate(20,20) scale(0.6)" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 40 C18 18, 52 14, 62 28 C72 42, 56 64, 30 64 C16 64, 8 54, 10 40 Z" opacity="0.95" fill="#ffffff10" stroke="none" />
      <path d="M20 48 C30 36, 46 34, 58 44" />
      <path d="M26 28 C34 18, 46 20, 54 28" strokeWidth="5" />
    </g>

    <text x="50" y="80" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight="700" fontSize="9" fill="#ffffff">حصنك</text>
  </svg>
);

export default Logo;
