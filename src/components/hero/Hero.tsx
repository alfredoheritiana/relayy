import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-[calc(100svh-4rem)] md:min-h-[calc(100svh-5rem)] flex flex-col items-center justify-center text-center overflow-hidden pt-28 pb-20">
      {/* Background Media Container */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {/* Desktop Poster Image */}
        <img
          src="https://cdn.prod.website-files.com/6877b50802107221745ba52e/6a2a86a295b3f5ffc24d3895_mj-hero-desktop.jpg"
          alt="Luxury tropical villa in Mauritius"
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
        />

        {/* Mobile Poster Image */}
        <img
          src="https://cdn.prod.website-files.com/6877b50802107221745ba52e/6a2a86a2429d911bf538aa90_mj-hero-mobile.jpg"
          alt="Luxury tropical villa in Mauritius mobile view"
          className="block md:hidden absolute inset-0 w-full h-full object-cover"
        />

        {/* Desktop Vimeo Iframe */}
        <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none opacity-90 scale-105">
          <iframe
            src="https://player.vimeo.com/video/1199417388?background=1&autoplay=1&loop=1&muted=1&byline=0&title=0"
            className="w-full h-full object-cover border-0"
            allow="autoplay; fullscreen"
            title="MJ Holidays Desktop Hero"
          />
        </div>

        {/* Mobile Vimeo Iframe */}
        <div className="block md:hidden absolute inset-0 w-full h-full pointer-events-none opacity-90 scale-105">
          <iframe
            src="https://player.vimeo.com/video/1199418466?background=1&autoplay=1&loop=1&muted=1&byline=0&title=0"
            className="w-full h-full object-cover border-0"
            allow="autoplay; fullscreen"
            title="MJ Holidays Mobile Hero"
          />
        </div>

        {/* Top Scrim Overlay for Navigation Readability */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black/60 via-black/30 to-transparent pointer-events-none" />

        {/* Subtle Bottom Ambient Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Centered Editorial Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center my-auto">
        <h1 className="flex flex-col items-center text-white">
          <span className="font-display text-5xl sm:text-7xl lg:text-[5.625rem] leading-[0.85] tracking-tight drop-shadow-md">
            Mauritius
          </span>
          <span className="font-display text-2xl sm:text-3xl lg:text-[2.5rem] leading-tight font-normal mt-4 sm:mt-6 text-white/95 max-w-2xl text-balance drop-shadow-sm">
            Your dream vacation:<br />
            private pool villa<br className="sm:hidden" /> and hotel services
          </span>
        </h1>
      </div>

      {/* Bottom Right Handwritten Travel Journal Details */}
      <div className="hidden lg:flex flex-col items-end absolute right-8 sm:right-12 bottom-16 sm:bottom-20 z-10 text-right pointer-events-none select-none">
        <p className="font-handwriting text-[#f5f5f5] text-4xl lg:text-[4.5rem] leading-[0.6] tracking-tight drop-shadow-md transform -rotate-1">
          16:00 relaxing on the beach
        </p>
        <p className="font-handwriting text-[#f5f5f5] text-2xl lg:text-[2.625rem] leading-[0.6] tracking-tight mt-3 drop-shadow-sm">
          27°, sunny
        </p>
      </div>
    </section>
  );
};
