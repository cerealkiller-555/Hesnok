import React, { useEffect, useState } from 'react';

const Logo = ({ className = 'w-10 h-10', title = 'Hesnok', mode = 'dark' }) => {
  const isLightMode = mode === 'light';
  const darkSrc = '/hesnok_logo1.png';
  const lightSrc = '/hesnok_logo.png';
  const [src, setSrc] = useState(isLightMode ? lightSrc : darkSrc);

  useEffect(() => {
    setSrc(isLightMode ? lightSrc : darkSrc);
  }, [isLightMode]);

  const isFallback = isLightMode && src === darkSrc;

  return (
    <span className={`overflow-hidden ${className}`} role="img" aria-label={title}>
      <img
        src={src}
        alt={title}
        className="block w-full h-full object-contain transition-all duration-300"
        onError={(e) => {
          if (isLightMode) {
            e.currentTarget.src = darkSrc;
            setSrc(darkSrc);
          }
        }}
        style={isFallback ? { filter: 'brightness(0) invert(1) contrast(0.85)' } : undefined}
      />
    </span>
  );
};

export default Logo;
