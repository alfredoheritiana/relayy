import React, { useState, useEffect, useRef } from 'react';
import { PROPERTIES, Property } from '../../data';

interface PropertyExplorerProps {
  onSelectProperty?: (property: Property) => void;
}

export const PropertyExplorer: React.FC<PropertyExplorerProps> = () => {
  const [activeResortId, setActiveResortId] = useState<string>(PROPERTIES[0]?.id ?? "");
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    PROPERTIES.forEach((prop) => {
      const el = cardRefs.current[prop.id];
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveResortId(prop.id);
            }
          });
        },
        {
          rootMargin: '-30% 0px -30% 0px',
          threshold: 0.2,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const activeProperty = PROPERTIES.find((p) => p.id === activeResortId) || PROPERTIES[0];

  return (
    <section id="resorts" className="w-full py-16 md:py-24 bg-white relative">
      <div className="max-w-[91.5rem] mx-auto px-4 sm:px-6 lg:px-14">
        {/* Desktop 2-column Grid: Sticky Left & Scrolling Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* ----------------- LEFT STICKY PANEL (DESKTOP) ----------------- */}
          <div className="hidden lg:flex lg:col-span-4 flex-col sticky top-28 h-[calc(100vh-9rem)] justify-between pb-8">
            <div>
              {/* Heading */}
              <div className="relative mb-8">
                <h2 className="font-display text-4xl lg:text-[3.25rem] text-[#050038] leading-tight">
                  Our Villas Estates
                </h2>
                <span className="font-handwriting text-[#ffa11d] text-3xl absolute -bottom-4 right-8 transform -rotate-3">
                  An experience by location
                </span>
              </div>

              {/* Location Selectors List */}
              <div className="space-y-3 mb-6">
                {PROPERTIES.map((prop) => {
                  const isActive = prop.id === activeResortId;
                  return (
                    <button
                      key={prop.id}
                      onClick={() => {
                        setActiveResortId(prop.id);
                        cardRefs.current[prop.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className={`w-full text-left p-3.5 rounded-lg border transition-all duration-300 flex items-center justify-between ${
                        isActive
                          ? 'border-[#ffa11d] bg-[#ffa11d]/10 text-[#050038] font-medium shadow-sm'
                          : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-[#050038]'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold">{prop.name}</p>
                        <p className="text-xs text-gray-500">{prop.subtitle}</p>
                      </div>
                      <span className="font-handwriting text-lg text-[#ffa11d]">{prop.mapNumber}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Map Illustration for Active Property */}
            <div className="relative w-full max-w-xs mx-auto aspect-[335/350] flex items-center justify-center p-2">
              {PROPERTIES.map((prop) => (
                <div
                  key={prop.id}
                  className={`absolute inset-0 transition-opacity duration-500 flex flex-col items-center justify-center ${
                    prop.id === activeResortId ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <img src={prop.mapSvg} alt={prop.name} className="max-h-64 object-contain" />
                  <p className="font-display text-base text-[#050038] text-center mt-3 font-medium">
                    {prop.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ----------------- MOBILE MAP OVERVIEW ----------------- */}
          <div className="block lg:hidden mb-8">
            <div className="relative mb-6">
              <h2 className="font-display text-3xl sm:text-4xl text-[#050038] leading-tight">
                Our Villas Estates
              </h2>
              <span className="font-handwriting text-[#ffa11d] text-2xl absolute -bottom-3 left-32 transform -rotate-3">
                An experience by location
              </span>
            </div>
            <div className="w-full max-w-sm mx-auto aspect-[335/350] p-4 flex items-center justify-center">
              <img
                src="https://cdn.prod.website-files.com/6877b50802107221745ba52e/68c80c967dfcb52d24efc014_Group%2040080%20(1).png"
                alt="Illustrated map of Mauritius showcasing its main tourist regions"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </div>

          {/* ----------------- RIGHT COLUMN: PROPERTIES CARDS ----------------- */}
          <div className="lg:col-span-8 space-y-20 lg:space-y-28">
            {PROPERTIES.map((property) => (
              <div
                key={property.id}
                id={property.id}
                ref={(el) => {
                  cardRefs.current[property.id] = el;
                }}
                className="flex flex-col group scroll-mt-28"
              >
                {/* Main Cinematic Property Image with Logo Badge */}
                <div className="relative w-full aspect-[1102/620] rounded-sm overflow-hidden shadow-lg bg-gray-100 mb-6">
                  <img
                    src={property.desktopImage}
                    alt={property.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Property Logo Mark Overlay */}
                  <div className="absolute top-4 right-4 z-10 w-24 sm:w-28 h-24 sm:h-28 flex items-center justify-center p-2">
                    <img
                      src={property.logoSvg}
                      alt={`${property.name} logo`}
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  </div>
                </div>

                {/* Property Card Info & Actions */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3">
                    <h3 className="font-display text-3xl sm:text-4xl text-[#050038]">
                      {property.name}
                    </h3>
                    {/* Amenity tags */}
                    <div className="flex flex-wrap items-center gap-2">
                      {property.highlights.map((tag, idx) => (
                        <span
                          key={idx}
                          style={{ borderColor: property.accentColor, color: property.accentColor }}
                          className="text-[11px] px-2.5 py-0.5 rounded-full border bg-white/80 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description & Tags */}
                  <p className="text-sm text-gray-600 font-light leading-relaxed">
                    {property.tags}
                  </p>

                  {/* Discover CTA Button */}
                  <div className="pt-2">
                    <a
                      href={property.discoverHref}
                      className="mj-btn inline-flex items-center gap-4 px-6 h-12 bg-[#ffa11d] text-white uppercase text-xs tracking-wider font-semibold rounded-br-lg hover:bg-[#ff8f00] transition-colors shadow-sm"
                    >
                      <span>Discover</span>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
