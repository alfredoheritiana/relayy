import React, { useState, useRef } from 'react';
import { ACCOMMODATIONS } from '../../data';

interface AccommodationSliderProps {
  onSelectAccommodation?: (id: string) => void;
}

export const AccommodationSlider: React.FC<AccommodationSliderProps> = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % ACCOMMODATIONS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + ACCOMMODATIONS.length) % ACCOMMODATIONS.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section id="villas" className="w-full py-16 md:py-24 bg-[#fbf9f6] overflow-hidden">
      <div className="max-w-[91.5rem] mx-auto px-4 sm:px-6 lg:px-14">
        {/* Section Title */}
        <div className="text-center mb-12 relative max-w-xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] text-[#050038] leading-none">
            Our villas
          </h2>
          <span className="font-handwriting text-[#ffa11d] text-3xl sm:text-4xl absolute -bottom-4 right-12 sm:right-20 transform -rotate-3">
            Feeling at home
          </span>
        </div>

        {/* Carousel Container */}
        <div
          className="relative w-full cursor-grab active:cursor-grabbing select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Slide Track */}
          <div className="relative overflow-hidden rounded-md shadow-2xl bg-black aspect-[16/10] sm:aspect-[1102/620] max-w-5xl mx-auto">
            {ACCOMMODATIONS.map((villa, idx) => {
              const isActive = idx === currentIndex;
              return (
                <div
                  key={villa.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {/* Background Image */}
                  <img
                    src={villa.desktopImage}
                    alt={villa.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                  {/* Overlay Content */}
                  <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end text-white">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div className="space-y-2 max-w-2xl">
                        {/* Resort Category Tag */}
                        <span className="inline-block bg-[#dbf7f4] text-[#1f9ebb] text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-br-md">
                          {villa.resortName}
                        </span>

                        {/* Title */}
                        <h3 className="font-display text-2xl sm:text-4xl lg:text-5xl leading-tight">
                          {villa.name}
                        </h3>

                        {/* Specs Grid */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-200 pt-1">
                          <span>
                            <strong className="font-semibold text-white">{villa.capacity}</strong> persons
                          </span>
                          <span>·</span>
                          <span>
                            <strong className="font-semibold text-white">{villa.surface}</strong> m² of living surface
                          </span>
                          <span>·</span>
                          <span>
                            <strong className="font-semibold text-white">{villa.bedrooms}</strong>
                          </span>
                          <span>·</span>
                          <span>{villa.pool}</span>
                          <span>·</span>
                          <span>
                            <strong className="font-semibold text-white">{villa.parking}</strong> parking
                          </span>
                        </div>
                      </div>

                      {/* Handwritten Highlight Tag */}
                      <div className="flex flex-col items-start md:items-end shrink-0">
                        <span className="font-handwriting text-[#ffa11d] text-2xl sm:text-3xl lg:text-4xl transform -rotate-3 leading-none drop-shadow">
                          {villa.manuscriptNote}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Slider Controls Arrow Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors shadow-lg"
              aria-label="Previous slide"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors shadow-lg"
              aria-label="Next slide"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {ACCOMMODATIONS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-[#ffa11d]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All Villas Button */}
        <div className="flex justify-center mt-10">
          <a
            href="#quote"
            className="mj-btn inline-flex items-center gap-4 px-8 h-12 bg-[#ffa11d] text-white uppercase text-xs tracking-wider font-semibold rounded-br-lg hover:bg-[#ff8f00] transition-colors shadow-sm"
          >
            <span>See all villas</span>
            <svg
              width="17"
              height="11"
              viewBox="0 0 17 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mj-btn-arrow"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.909 4.76777H3.76461C3.16603 4.76777 1.43935 4.50482 0.65174 4.7349C0.179176 4.83351 -0.167371 5.39228 0.0846628 5.98391C0.368201 6.70703 2.38448 6.47695 3.61314 6.47695C6.88959 6.47695 5.16055 6.5 8.5 6.5L14.098 6.54268C13.4679 7.7917 10.6325 9.82956 11.9242 10.7828C12.7118 11.4073 13.1529 10.5198 13.4364 10.1911C14.5706 8.8435 15.4842 7.66022 16.5238 6.24686C17.784 4.50482 16.3978 4.66916 14.0665 2.49982C13.6255 2.07253 11.8927 0.19901 11.6722 0.100404C11.0421 -0.228284 10.412 0.297616 10.475 0.987861C10.538 1.84245 13.7515 4.43908 13.909 4.76777Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
