import React from 'react';

export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only fixed top-4 left-4 z-50 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg outline-none ring-2 ring-primary ring-offset-2 ring-offset-background transition-all"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
};
