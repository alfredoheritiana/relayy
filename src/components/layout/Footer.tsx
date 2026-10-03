import React, { useState } from 'react';

interface FooterProps {
  onOpenQuote: () => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQuote, onOpenContact }) => {
  const [newsEmail, setNewsEmail] = useState('');
  const [newsName, setNewsName] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail && newsName) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setNewsEmail('');
        setNewsName('');
      }, 4000);
    }
  };

  return (
    <footer className="w-full bg-[#050038] text-white pt-20 pb-12">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-14">
        {/* ----------------- TOP: 6 MULTI-COLUMNS ----------------- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
          {/* Col 1 */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4">
              Our resorts
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-light text-white/90 p-0 list-none">
              <li>
                <a href="#mythic-suites-villas" className="hover:text-[#ffa11d] transition-colors">
                  Mythic Suites &amp; Villas
                </a>
              </li>
              <li>
                <a href="#eko-savannah" className="hover:text-[#ffa11d] transition-colors">
                  Eko Savannah
                </a>
              </li>
              <li>
                <a href="#marguery-villas" className="hover:text-[#ffa11d] transition-colors">
                  Marguery Villas
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#ffa11d] transition-colors">
                  Our Hotel Services
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4">
              Our experiences
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-light text-white/90 p-0 list-none">
              <li>
                <a href="#experiences" className="hover:text-[#ffa11d] transition-colors">
                  Golf getaway
                </a>
              </li>
              <li>
                <a href="#experiences" className="hover:text-[#ffa11d] transition-colors">
                  Tailor-made travel
                </a>
              </li>
              <li>
                <a href="#experiences" className="hover:text-[#ffa11d] transition-colors">
                  Long stay
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4">
              Our destination
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-light text-white/90 p-0 list-none">
              <li>
                <a href="#mythic-suites-villas" className="hover:text-[#ffa11d] transition-colors">
                  Grand Gaube
                </a>
              </li>
              <li>
                <a href="#marguery-villas" className="hover:text-[#ffa11d] transition-colors">
                  Black River
                </a>
              </li>
              <li>
                <a href="#eko-savannah" className="hover:text-[#ffa11d] transition-colors">
                  Tamarin
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4">
              Our restaurant
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-light text-white/90 p-0 list-none">
              <li>
                <a href="#restaurant" className="hover:text-[#ffa11d] transition-colors">
                  BOMA Restaurant
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5 */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4">
              The group
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-light text-white/90 p-0 list-none">
              <li>
                <a href="#csr" className="hover:text-[#ffa11d] transition-colors">
                  Our CSR commitments
                </a>
              </li>
              <li>
                <a href="#owner" className="hover:text-[#ffa11d] transition-colors">
                  Become an owner
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#ffa11d] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#press" className="hover:text-[#ffa11d] transition-colors">
                  Press
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-[#ffa11d] transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Col 6 */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4">
              Vacation rentals
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-light text-white/90 p-0 list-none">
              <li>
                <a href="#rentals" className="hover:text-[#ffa11d] transition-colors">
                  Our rentals in Mauritius
                </a>
              </li>
              <li>
                <a href="#rentals" className="hover:text-[#ffa11d] transition-colors">
                  Our rentals in Grand-Baie
                </a>
              </li>
              <li>
                <a href="#rentals" className="hover:text-[#ffa11d] transition-colors">
                  Our rentals in Trou-aux-Biches
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ----------------- MIDDLE: LOGO, NEWSLETTER & ACTION BUTTONS ----------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-t border-white/10 py-10">
          {/* Logo Brand SVG */}
          <div className="lg:col-span-3 flex items-center justify-start">
            <a href="/" className="w-28 hover:opacity-80 transition-opacity">
              <img
                src="https://cdn.prod.website-files.com/6877b50802107221745ba52e/6877fbc00f50c28112c8e984_Vector%20(16).svg"
                alt="MJ Holidays logo"
                className="w-full h-auto"
                loading="lazy"
              />
            </a>
          </div>

          {/* Newsletter Form */}
          <div className="lg:col-span-6 w-full">
            <p className="text-xs text-white/70 font-medium uppercase tracking-wider mb-2">
              Newsletter subscription
            </p>
            {subscribed ? (
              <p className="text-xs text-emerald-400 font-medium py-2">
                ✓ Thank you for subscribing to the MJ Holidays newsletter!
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch">
                <input
                  type="email"
                  required
                  placeholder="Enter your email *"
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  className="bg-transparent border-b border-white/40 text-white placeholder:text-white/50 px-2 py-1.5 text-xs focus:outline-none focus:border-[#ffa11d] flex-1"
                />
                <input
                  type="text"
                  required
                  placeholder="Your name *"
                  value={newsName}
                  onChange={(e) => setNewsName(e.target.value)}
                  className="bg-transparent border-b border-white/40 text-white placeholder:text-white/50 px-2 py-1.5 text-xs focus:outline-none focus:border-[#ffa11d] flex-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ffa11d] hover:bg-[#ff8f00] text-white text-xs uppercase font-semibold tracking-wider rounded-br transition-colors shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Quote & Contact CTA buttons */}
          <div className="lg:col-span-3 flex items-center justify-start lg:justify-end gap-3">
            <button
              onClick={onOpenContact}
              className="px-4 py-2 border border-white/40 hover:border-white text-white text-xs uppercase tracking-wider rounded transition-colors"
            >
              Contact
            </button>
            <button
              onClick={onOpenQuote}
              className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-[#050038] text-xs uppercase tracking-wider font-medium rounded transition-colors"
            >
              Quote
            </button>
          </div>
        </div>

        {/* ----------------- BOTTOM: LEGAL & SOCIALS ----------------- */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/60">
          <div className="flex flex-wrap items-center gap-4 text-center md:text-left">
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span>·</span>
            <a href="#legal" className="hover:text-white transition-colors">
              Legal Notice
            </a>
            <span>·</span>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms and Conditions
            </a>
            <span>·</span>
            <span>
              Officially licensed tourist residences in Mauritius: Marguery Villas #12776 | Mythic Suites &amp; Villas #14267
            </span>
          </div>

          {/* Social Icons SVGs */}
          <div className="flex items-center gap-4 text-white">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/mjholidays.mauritius/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/mjholidays.mauritius/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@mjholidays"
              target="_blank"
              rel="noopener noreferrer"
              className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="TikTok"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@Mjholidays-mauritius"
              target="_blank"
              rel="noopener noreferrer"
              className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/mj-holidays/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
