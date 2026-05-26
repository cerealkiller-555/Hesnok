import React from 'react';

const Logo = ({ className = 'w-10 h-10', title = 'Hesnok', mode = 'light' }) => {
  const isDarkMode = mode === 'dark';

  return (
    <span className={`overflow-hidden ${className}`} role="img" aria-label={title}>
      <img
        src="/hesnok_logo.png"
        alt={title}
        className="block w-full h-full object-contain transition-all duration-300"
        style={isDarkMode ? { filter: 'brightness(0) invert(1) contrast(1.15)' } : undefined}
      />
    </span>
  );
};

export default Logo;
