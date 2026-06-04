import React from 'react';

export const Backdrop: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background">
      {/* Radial Gradient */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at 0% 0%, hsl(142, 76%, 41%, 0.15) 0%, transparent 50%)',
        }}
      />
      {/* SVG Grain Noise Texture */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.015] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
};
