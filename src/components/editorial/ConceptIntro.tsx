import React from 'react';

export const ConceptIntro: React.FC = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="max-w-[91.5rem] mx-auto px-4 sm:px-6 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Column: Editorial Headings & Copy */}
          <div className="flex flex-col justify-center max-w-xl">
            <div className="relative mb-6">
              <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] text-[#050038] leading-none">
                Concept
              </h2>
              <span className="font-handwriting text-[#ffa11d] text-3xl sm:text-4xl absolute -bottom-4 left-36 sm:left-44 transform -rotate-6">
                MJ Holidays
              </span>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[#1c2448]/90 font-light leading-relaxed pt-3">
              <p>
                Choose the luxury of <strong className="font-semibold text-[#050038]">a private villa</strong> combined with the <strong className="font-semibold text-[#050038]">comfort of full hotel services</strong>.
              </p>
              <p>
                At the heart of the resort, our on-site Club House is home to <strong className="font-semibold text-[#050038]">a dedicated team available 7 days a week</strong>, offering reception desk, concierge services, housekeeping, maintenance and dining options throughout your stay. Our warm hospitality and responsiveness ensure a seamless and relaxing holiday.
              </p>
              <p>
                Personalised service, genuine care and an on-site team always ready to assist, the details that make all the difference.
              </p>
            </div>
          </div>

          {/* Right Column: Cultural Tropical Illustration */}
          <div className="flex justify-center items-center">
            <div className="w-full max-w-lg lg:max-w-none aspect-[822/526] rounded-sm overflow-hidden">
              <img
                src="https://cdn.prod.website-files.com/6877b50802107221745ba52e/6877d74790f3ea8ce956859d_Group%2040077.webp"
                alt="A colorful design representing the iconic emblems of Mauritius, illustrating the tropical and cultural spirit of MJ Holidays."
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
