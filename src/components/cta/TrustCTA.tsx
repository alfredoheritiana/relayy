import React from 'react';

export const TrustCTA: React.FC = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="max-w-[83rem] mx-auto px-4 sm:px-6">
        <div className="relative bg-[#ffa11d] text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-[1.875rem] p-6 sm:p-12 lg:p-14 overflow-hidden shadow-xl">
          {/* Background Motif graphic SVG */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 bg-no-repeat bg-left-bottom bg-[length:25rem]"
            style={{
              backgroundImage: `url('https://cdn.prod.website-files.com/6877b50802107221745ba52e/6878c52e1a99114ae09e40d2_Frame%202085666090.svg')`,
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Team Photo Container */}
            <div className="lg:col-span-6 overflow-hidden rounded-md shadow-md bg-black/10 aspect-[16/9] sm:aspect-[2.39/1]">
              <img
                src="https://cdn.prod.website-files.com/6877b50802107221745ba52e/6a4cb88f446b55f7ea13de4f_equipe-mj-holidays.webp"
                alt="The MJ Holidays local team in Mauritius"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Editorial Copy & CTA Action */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="relative mb-4">
                  <h2 className="font-display text-4xl sm:text-5xl text-white leading-none">
                    Trust
                  </h2>
                  <span className="font-handwriting text-white text-3xl sm:text-4xl absolute -bottom-3 left-28 transform -rotate-3">
                    &amp; local expertise
                  </span>
                </div>

                <div className="space-y-3 text-sm sm:text-base text-white/95 font-light leading-relaxed pt-2">
                  <p>
                    For nearly 10 years, our <strong className="font-semibold text-white">local team</strong> has been welcoming you <strong className="font-semibold text-white">with a smile</strong> with one goal in mind: to ensure you have an <strong className="font-semibold text-white">unforgettable stay</strong>.
                  </p>
                  <p>
                    Let yourself be guided by our <strong className="font-semibold text-white">recommendations</strong>, inspired by <strong className="font-semibold text-white">our own personal favorites</strong> on our beautiful island!
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#services"
                  className="mj-btn inline-flex items-center gap-3 px-6 h-12 bg-white text-[#050038] uppercase text-xs font-semibold tracking-wider rounded-br-lg hover:bg-[#050038] hover:text-[#dbf7f4] transition-colors shadow-md"
                >
                  <span>Explore our hotel services</span>
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
        </div>
      </div>
    </section>
  );
};
