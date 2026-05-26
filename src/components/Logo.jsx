import React from 'react';

const Logo = ({ className = 'w-10 h-10', title = 'Hesnok' }) => {
  return (
    <span className={`overflow-hidden ${className}`} role="img" aria-label={title}>
      <img
        src="/hesnok_logo.png"
        alt={title}
        className="block w-full h-full object-contain"
      />
    </span>
  );
};

export default Logo;
