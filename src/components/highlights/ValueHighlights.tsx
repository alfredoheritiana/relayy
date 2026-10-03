import React from 'react';
import { HIGHLIGHTS } from '../../data';

export const ValueHighlights: React.FC = () => {
  return (
    <section className="w-full py-12 md:py-20 bg-white border-t border-b border-gray-100/60">
      <div className="max-w-[91.5rem] mx-auto px-4 sm:px-6 lg:px-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-14">
          {HIGHLIGHTS.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center group">
              {/* Large Illustrative SVG Icon */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 mb-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <img src={item.iconSvg} alt={item.title} className="w-full h-full object-contain" loading="lazy" />
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-medium text-[#050038] mb-3 whitespace-pre-line leading-snug">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed max-w-xs">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
