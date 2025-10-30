import React from 'react';

const ContentWrapper = ({ children, isMenuOpen }) => {
  return (
    <div className={`transition-all duration-300 ease-in-out min-h-screen ${
      isMenuOpen ? 'content-squeezed' : 'content-normal'
    }`}>
      {children}
    </div>
  );
};

export default ContentWrapper;
