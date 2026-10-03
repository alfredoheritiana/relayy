import React, { useState } from 'react';
import { FAQ_DATA, REVIEWS_SUMMARY, REVIEWS_LIST } from '../../data';

export const FAQSection: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_DATA[0].id);
  const [activePlatform, setActivePlatform] = useState<string>('All Reviews');
  const [reviewIdx, setReviewIdx] = useState<number>(0);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const nextReview = () => {
    setReviewIdx((prev) => (prev + 1) % REVIEWS_LIST.length);
  };

  const prevReview = () => {
    setReviewIdx((prev) => (prev - 1 + REVIEWS_LIST.length) % REVIEWS_LIST.length);
  };

  const currentReview = REVIEWS_LIST[reviewIdx];

  return (
    <section id="faq" className="w-full py-16 md:py-24 bg-white">
      <div className="max-w-[91.5rem] mx-auto px-4 sm:px-6 lg:px-14">
        <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] text-[#050038] mb-12">
          Need help?
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ----------------- LEFT: FAQ ACCORDIONS ----------------- */}
          <div className="lg:col-span-7 bg-[#f5f1e8] rounded-br-[3.125rem] p-6 sm:p-10 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-body text-xl sm:text-2xl font-normal text-[#050038] mb-6">
                Frequently asked questions:
              </h3>

              <div className="space-y-4">
                {FAQ_DATA.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div key={faq.id} className="border-b border-[#cfbdad] pb-4">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex items-center justify-between text-left py-2 font-medium text-sm sm:text-base text-[#050038] hover:text-[#ffa11d] transition-colors focus:outline-none"
                        aria-expanded={isOpen}
                      >
                        <span className="pr-4">{faq.question}</span>
                        <div
                          className={`w-6 h-6 flex items-center justify-center text-[#ffa11d] shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-45' : 'rotate-0'
                          }`}
                        >
                          <svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 25.2328V0.632812H13.2V25.2328H12ZM0 13.4728V12.3928H25.14V13.4728H0Z" fill="currentColor" />
                          </svg>
                        </div>
                      </button>

                      {isOpen && (
                        <div
                          className="pt-3 pb-2 text-xs sm:text-sm text-gray-700 font-light leading-relaxed space-y-3 animate-fadeIn"
                          dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-8">
              <a
                href="#contact"
                className="mj-btn inline-flex items-center gap-3 px-6 h-11 bg-[#ffa11d] text-white uppercase text-xs font-semibold tracking-wider rounded-br-lg hover:bg-[#ff8f00] transition-colors shadow-sm"
              >
                <span>See more</span>
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

          {/* ----------------- RIGHT: REVIEWS & SOCIAL PROOF ----------------- */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Platforms Bar */}
            <div className="flex flex-wrap items-center gap-2 border-b pb-3">
              {REVIEWS_SUMMARY.platforms.map((plat) => (
                <button
                  key={plat.name}
                  onClick={() => setActivePlatform(plat.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activePlatform === plat.name
                      ? 'bg-[#050038] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{plat.name}</span>
                  {plat.rating && <span className="ml-1 opacity-80">★ {plat.rating}</span>}
                </button>
              ))}
            </div>

            {/* Overall Rating Stats Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="font-bold text-3xl text-[#050038]">{REVIEWS_SUMMARY.averageRating}</span>
                <div>
                  <div className="flex text-[#ffa11d] text-sm tracking-tight">★★★★★</div>
                  <span className="text-xs text-gray-500 font-normal">({REVIEWS_SUMMARY.totalReviews} reviews)</span>
                </div>
              </div>
              <a
                href="#quote"
                className="px-4 py-2 bg-[#006dff] hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors"
              >
                Write a Review
              </a>
            </div>

            {/* AI Summary Card */}
            <div className="bg-[#fcfbf9] border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8d38ff] to-[#006dff] flex items-center justify-center text-white text-xs font-bold">
                  AI
                </div>
                <div>
                  <p className="text-xs font-bold text-[#050038]">AI-Generated Summary</p>
                  <p className="text-[11px] text-gray-400">Based on {REVIEWS_SUMMARY.totalReviews} guest reviews</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-700 font-light leading-relaxed">
                {REVIEWS_SUMMARY.aiSummaryPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Review Card with Slider Controls */}
            <div className="relative bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#050038]">{currentReview.author}</span>
                    <span className="text-xs text-gray-400">· {currentReview.date}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 font-medium text-gray-600">
                    {currentReview.source}
                  </span>
                </div>

                <div className="text-amber-500 text-xs mb-2">★★★★★</div>

                <p className="text-xs sm:text-sm text-gray-700 font-light italic leading-relaxed whitespace-pre-line mb-4">
                  "{currentReview.text}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-400">
                <span>
                  {reviewIdx + 1} of {REVIEWS_LIST.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={prevReview}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    aria-label="Previous review"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextReview}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    aria-label="Next review"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
