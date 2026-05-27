import React, { useEffect, useState } from 'react';

const Logo = ({ className = 'w-10 h-10', title = 'Hesnok', mode = 'light' }) => {
  const isDarkMode = mode === 'dark';
  const darkSrc = '/hesnok_logo1.png';
  const lightSrc = '/hesnok_logo.png';
  const [src, setSrc] = useState(isDarkMode ? darkSrc : lightSrc);

  useEffect(() => {
    setSrc(isDarkMode ? darkSrc : lightSrc);
  }, [isDarkMode]);

  const isFallback = isDarkMode && src === lightSrc;

  return (
    <span className={`overflow-hidden ${className}`} role="img" aria-label={title}>
      <img
        src={src}
        alt={title}
        className="block w-full h-full object-contain transition-all duration-300"
        onError={(e) => {
          if (isDarkMode) {
            e.currentTarget.src = lightSrc;
            setSrc(lightSrc);
          }
        }}
        style={isFallback ? { filter: 'brightness(0) invert(1) contrast(1.15)' } : undefined}
      />
    </span>
  );
};

export default Logo;
