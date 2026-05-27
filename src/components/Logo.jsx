import React from 'react';

const Logo = ({ className = 'w-10 h-10', title = 'Hesnok', mode = 'light' }) => {
  const isDarkMode = mode === 'dark';
  const src = isDarkMode ? '/hesnok_logo1.png' : '/hesnok_logo.png';

  return (
    <span className={`overflow-hidden ${className}`} role="img" aria-label={title}>
      <img
        src={src}
        alt={title}
        className="block w-full h-full object-contain transition-all duration-300"
      />
    </span>
  );
};

export default Logo;
