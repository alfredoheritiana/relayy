import React, { useState, useEffect } from 'react';
import { NAVIGATION_DROPDOWNS } from '../../data';

interface NavbarProps {
  onOpenQuote: () => void;
  onOpenContact: () => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuote, onOpenContact, onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenuDropdowns, setOpenMenuDropdowns] = useState<{ [key: string]: boolean }>({});
  const [currentLang, setCurrentLang] = useState<'en' | 'fr'>('en');
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // ~10rem threshold (approx 160px)
      if (window.scrollY > 140) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenuDropdown = (id: string) => {
    setOpenMenuDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* ----------------- TOP NAVBAR OVERLAY / SCROLLED NAVBAR ----------------- */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white text-[#050038] shadow-md'
            : 'bg-transparent text-white'
        }`}
      >
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
          {/* Left: Dropdowns & Hamburger */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center justify-center w-8 h-8 focus:outline-none"
              aria-label="Open navigation menu"
            >
              <svg width="32" height="14" viewBox="0 0 32 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="2" fill="currentColor" />
                <rect y="12" width="32" height="2" fill="currentColor" />
              </svg>
            </button>

            {/* Desktop Left Links with Dropdowns */}
            <div className="hidden lg:flex items-center gap-7">
              {NAVIGATION_DROPDOWNS.slice(0, 3).map((dropdown) => (
                <div
                  key={dropdown.id}
                  className="relative group py-2"
                  onMouseEnter={() => setActiveDropdown(dropdown.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-2 text-xs uppercase tracking-wider font-normal transition-opacity hover:opacity-75 ${
                      isScrolled ? 'text-[#050038]' : 'text-white'
                    }`}
                  >
                    <span>{dropdown.label}</span>
                    <svg
                      width="11"
                      height="7"
                      viewBox="0 0 11 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transition-transform duration-200 ${
                        activeDropdown === dropdown.id ? 'rotate-180' : ''
                      }`}
                    >
                      <path d="M1 0.698623L5.5 5.31342L10 0.698624" stroke="currentColor" />
                    </svg>
                  </button>

                  {/* Dropdown Menu Box */}
                  {activeDropdown === dropdown.id && (
                    <div className="absolute top-full left-0 bg-white text-[#050038] shadow-lg rounded-b-md border border-gray-100 py-1 min-w-[15rem] z-50 animate-fadeIn">
                      <a
                        href={dropdown.viewAllLink.href}
                        className="block px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b border-gray-100 hover:bg-[#ffc400] hover:text-[#050038] transition-colors"
                      >
                        {dropdown.viewAllLink.label}
                      </a>
                      {dropdown.items.map((item, idx) => (
                        <a
                          key={idx}
                          href={item.href}
                          className="block px-4 py-2 text-xs font-normal border-b border-gray-100 last:border-0 hover:bg-[#ffc400] hover:text-[#050038] transition-colors"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile WhatsApp Link */}
            <a
              href="https://wa.me/+23052583453"
              target="_blank"
              rel="noopener noreferrer"
              className="lg:hidden flex items-center justify-center text-current hover:opacity-80"
              aria-label="WhatsApp"
            >
              <svg width="24" height="24" viewBox="0 0 30 30" fill="currentColor">
                <path d="M15.0001 3.28125C12.9484 3.28178 10.9329 3.82078 9.15486 4.84438C7.37682 5.86798 5.89859 7.34032 4.86789 9.11424C3.8372 10.8882 3.29015 12.9016 3.28142 14.9532C3.27269 17.0048 3.80258 19.0227 4.81814 20.8054L3.76294 24.4987C3.69405 24.7398 3.69091 24.995 3.75382 25.2378C3.81674 25.4805 3.94342 25.702 4.12075 25.8794C4.29808 26.0567 4.51961 26.1833 4.76237 26.2462C5.00513 26.3091 5.26029 26.306 5.50141 26.2371L9.19477 25.1819C10.7541 26.0709 12.4967 26.5899 14.2883 26.6988C16.0799 26.8076 17.8726 26.5035 19.5281 25.8099C21.1836 25.1163 22.6576 24.0517 23.8365 22.6983C25.0154 21.3448 25.8677 19.7386 26.3276 18.0036C26.7875 16.2686 26.8427 14.4512 26.489 12.6915C26.1353 10.9318 25.3822 9.2768 24.2877 7.85423C23.1931 6.43166 21.7865 5.27951 20.1762 4.48664C18.5659 3.69377 16.795 3.28137 15.0001 3.28125ZM15.0001 25.7813C13.0637 25.7826 11.1629 25.2617 9.4978 24.2734C9.44291 24.2407 9.38191 24.2196 9.31856 24.2114C9.2552 24.2031 9.19083 24.208 9.12942 24.2255L5.2438 25.3357C5.16342 25.3587 5.07837 25.3597 4.99745 25.3388C4.91653 25.3178 4.84269 25.2756 4.78359 25.2164C4.72449 25.1573 4.68227 25.0835 4.66131 25.0026C4.64035 24.9216 4.64141 24.8366 4.66439 24.7562L5.77447 20.8707C5.79201 20.8093 5.79681 20.7449 5.78859 20.6816C5.78036 20.6182 5.75928 20.5572 5.72663 20.5023C4.51229 18.4565 4.00867 16.0664 4.29425 13.7045C4.57982 11.3426 5.63854 9.14142 7.30548 7.44392C8.97242 5.74641 11.154 4.64789 13.5103 4.31946C15.8667 3.99103 18.2655 4.45115 20.333 5.62813C22.4006 6.80511 24.0209 8.63286 24.9415 10.8267C25.862 13.0205 26.0311 15.4571 25.4225 17.7571C24.8139 20.0571 23.4617 22.0911 21.5766 23.5425C19.6914 24.9938 17.3792 25.781 15.0001 25.7813Z" />
              </svg>
            </a>
          </div>

          {/* Center: Brand Logo */}
          <a
            href="/"
            className="flex items-center justify-center hover:opacity-90 transition-opacity"
            aria-label="MJ Holidays Home"
          >
            <div className="w-20 md:w-24 h-auto">
              <svg viewBox="0 0 110 92" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                <path d="M16.2115 59.2422V67.6248C16.2115 70.7024 16.7977 72.6954 17.5598 73.692H11.6099C12.3719 72.6954 12.9581 70.7024 12.9581 67.6248V61.8801H4.98587V67.6248C4.98587 70.7024 5.57206 72.6954 6.33412 73.692H0.354919C1.11697 72.6954 1.70317 70.7024 1.70317 67.6248V59.2422C1.70317 56.1647 1.11697 54.1716 0.354919 53.1751H6.33412C5.57206 54.1716 4.98587 56.1647 4.98587 59.2422V61.5284H12.9581V59.2422C12.9581 56.1647 12.3719 54.1716 11.6099 53.1751H17.5598C16.7977 54.1716 16.2115 56.1647 16.2115 59.2422Z" fill="currentColor" />
                <path d="M19.6531 66.2766C19.6531 62.0853 23.0238 58.8026 27.0978 58.8026C31.2012 58.8026 34.6304 62.2025 34.6304 66.4231C34.6304 70.6144 31.2891 73.9264 27.2151 73.9264C23.0824 73.9264 19.6531 70.5265 19.6531 66.2766ZM22.4962 63.668C22.4962 67.5369 25.4565 73.223 28.7099 73.3402C30.7615 73.3695 31.8167 71.3765 31.8167 69.0024C31.8167 65.1335 28.8271 59.3888 25.5444 59.3888C23.522 59.3888 22.4962 61.3818 22.4962 63.668Z" fill="currentColor" />
                <path d="M36.6881 55.4613V55.344L41.1139 53.1751V68.5627C41.1139 71.3765 41.7587 73.0764 42.4914 73.692H37.8605L38.0363 59.8577C38.0656 57.3078 37.3622 55.9888 36.6881 55.4613Z" fill="currentColor" />
                <path d="M44.9202 55.4319C44.9202 54.2889 45.8582 53.3216 47.0306 53.3216C48.2323 53.3216 49.0822 54.2889 49.0822 55.4319C49.0822 56.6043 48.2323 57.5129 47.0306 57.5129C45.8582 57.5129 44.9202 56.6043 44.9202 55.4319ZM44.422 61.0887V60.9715L48.8478 58.8026V68.5627C48.8478 71.3765 49.4926 73.0764 50.2253 73.692H45.5944L45.7702 65.4852C45.8289 62.9353 45.0961 61.6163 44.422 61.0887Z" fill="currentColor" />
                <path d="M52.2145 66.5111C52.2145 61.3232 55.5558 58.8026 58.4282 58.8026C60.7436 58.8026 62.2384 60.3267 62.8246 61.0301V59.8577C62.854 57.3078 62.1505 55.9888 61.4764 55.4613V55.344L65.9022 53.1751V68.5627C65.9022 71.3765 66.547 73.0764 67.2797 73.692H62.6488L62.6781 72.0506C62.004 72.754 60.7143 73.9264 58.4282 73.9264C55.4093 73.9264 52.2145 71.7282 52.2145 66.5111ZM55.5851 66.2766C55.6144 70.9661 57.6075 72.9006 59.835 72.9006C61.0367 72.9006 62.1212 72.1092 62.6781 71.4937L62.8246 61.6749C62.2384 60.737 61.0074 59.7112 59.5126 59.7112C57.4609 59.7112 55.5558 61.8801 55.5851 66.2766Z" fill="currentColor" />
                <path d="M69.2208 68.8558C69.2208 65.5438 71.4484 63.0232 74.9069 61.5284C73.9397 62.3198 72.2984 64.2542 72.2984 67.0386C72.2984 69.7937 73.6759 71.9334 76.2845 71.9334C77.1931 71.9334 78.1603 71.611 78.8344 70.8782C77.4862 66.9214 75.7276 61.7336 74.9069 60.6198C74.2328 59.6232 73.0311 59.4767 72.0346 59.7112L72.0053 59.6526C72.8259 59.125 73.9104 58.8026 74.9362 58.8026C76.2845 58.8026 77.9258 59.3595 78.7758 61.4698C79.5672 63.4335 81.6775 69.2369 82.293 70.8782C82.8499 72.3437 83.3775 73.2523 83.8757 73.692H79.8017L78.981 71.2299C78.0138 72.9885 76.6655 73.9264 74.4673 73.9264C71.4191 73.9264 69.2208 71.8161 69.2208 68.8558Z" fill="currentColor" />
                <path d="M82.0468 81.3418V77.4436C85.0364 77.0333 87.264 76.0954 88.7295 73.8678L84.3916 63.3163C83.2192 60.4732 82.4279 59.3595 82.0175 59.1543V59.0371H87.0881V59.1543C87.0002 59.2129 86.8536 59.506 86.8536 60.0629C86.8536 60.5612 86.9709 61.2353 87.3519 62.1732L90.6053 70.2041L93.0087 64.7818C93.4777 63.7559 93.6535 62.7301 93.6535 61.8508C93.6535 60.5905 93.3018 59.5646 93.038 59.1543V59.0371H96.6138V59.1543C95.9104 59.887 95.0018 61.2939 93.507 64.6059L89.9312 72.2265C87.8209 77.0919 86.1209 79.6418 82.0468 81.3418Z" fill="currentColor" />
                <path d="M109.668 69.6179C109.726 72.4316 107.03 73.9264 104.069 73.9264C101.607 73.9264 99.673 73.4868 98.4713 73.0764L98.1782 68.0645H98.2368C100.025 71.7575 102.311 73.4575 104.245 73.5161C106.18 73.5454 107.411 72.6954 107.323 71.1713C107.264 69.7058 105.447 68.9438 103.425 67.9472C100.494 66.4817 98.3834 65.368 98.2955 62.8473C98.2368 60.0336 100.757 58.7146 104.128 58.8026C106.033 58.8319 107.499 59.3008 108.495 59.7698L108.73 64.2542H108.671C107.557 61.3818 105.74 59.3888 103.366 59.2129C101.783 59.0957 100.523 59.887 100.582 61.1767C100.64 62.6715 102.076 63.4921 104.714 64.6938C107.557 66.0421 109.58 67.2438 109.668 69.6179Z" fill="currentColor" />
                <path d="M86.8152 29.9837C87.0985 28.8558 95.3924 23.916 96.5298 23.3895C97.9064 22.7516 103.559 20.8012 104.79 21.1004C105.526 21.2818 106.049 22.3802 105.717 22.8048C104.336 24.5684 100.762 25.5395 98.8009 26.554C97.3855 27.2844 87.5125 31.6816 86.8189 29.9816L86.8152 29.9837Z" fill="currentColor" />
                <path d="M88.3234 32.7089C88.8656 31.9738 96.2483 30.7481 97.2122 30.6877C98.3841 30.6159 102.982 30.8054 103.767 31.3715C104.235 31.7099 104.275 32.6547 103.91 32.8685C102.396 33.7559 99.5646 33.4443 97.8657 33.6227C96.6405 33.7507 88.3036 34.1348 88.3234 32.7089Z" fill="currentColor" />
                <path d="M85.5071 27.7095C85.2185 26.8753 88.5828 20.4486 89.1069 19.666C89.7409 18.7139 92.6237 15.2463 93.559 14.9554C94.1175 14.7819 94.9186 15.2818 94.8801 15.6844C94.7171 17.3582 92.7799 19.3843 91.9198 20.8054C91.299 21.8296 86.6746 28.5254 85.5071 27.7095Z" fill="currentColor" />
                <path d="M24.6153 30.0628C24.332 28.9349 16.0382 23.9951 14.9007 23.4686C13.5242 22.8306 7.87197 20.8803 6.64054 21.1795C5.90405 21.3609 5.38112 22.4592 5.71319 22.8839C7.09412 24.6475 10.6689 25.6185 12.6297 26.6331C14.0451 27.3634 23.918 31.7607 24.6116 30.0607L24.6153 30.0628Z" fill="currentColor" />
                <path d="M23.1059 32.7886C22.5637 32.0535 15.1809 30.8278 14.2171 30.7673C13.0452 30.6956 8.44741 30.8851 7.66273 31.4512C7.19466 31.7895 7.15447 32.7344 7.51974 32.9482C9.03345 33.8356 11.8646 33.524 13.5636 33.7024C14.7887 33.8304 23.1257 34.2144 23.1059 32.7886Z" fill="currentColor" />
                <path d="M25.9221 27.7892C26.2108 26.9549 22.8465 20.5282 22.3223 19.7457C21.6884 18.7936 18.8056 15.326 17.8702 15.035C17.3118 14.8616 16.5107 15.3615 16.5492 15.7641C16.7121 17.4379 18.6494 19.4639 19.5094 20.8851C20.1303 21.9093 24.7547 28.6051 25.9221 27.7892Z" fill="currentColor" />
                <path d="M63.1598 5.04088C63.1598 5.04088 62.773 25.4679 63.1047 26.3752C63.2854 26.8672 65.143 27.2715 65.2912 26.7699C65.7965 25.0293 66.2144 0.378201 65.2912 0.391907C64.6377 0.39876 63.5183 1.00455 62.9269 1.4541C59.782 3.85671 51.7207 19.2441 51.1081 20.3173C49.0839 19.6868 41.0339 4.68727 38.9477 1.67202C38.3577 0.818154 36.9249 -0.719625 36.2305 0.385054C35.536 1.48973 34.9855 20.8545 36.2305 26.2957C36.3406 26.7836 38.0288 26.6863 38.3577 26.2957C38.7374 25.8393 38.3577 6.36348 38.3577 6.36348C38.3577 6.36348 48.9329 24.4057 50.7566 24.3084C52.1639 24.2357 63.1598 5.03677 63.1598 5.03677V5.04088Z" fill="currentColor" />
                <path d="M77.5314 8.97154C77.5049 8.27194 77.4029 6.57481 77.2438 4.99472C76.9129 1.72016 76.5862 1.38366 76.4103 1.20277L76.3056 1.09504L76.159 1.05381C75.965 0.999275 75.2934 0.84366 74.8397 1.14026C74.6219 1.28257 74.4879 1.50203 74.4613 1.76139C74.3245 3.06084 74.5256 5.14501 74.7043 6.98446C74.7936 7.90352 74.8774 8.77071 74.9095 9.44105C75.2348 16.1405 75.2236 22.4462 74.8746 28.1813C74.4809 31.122 73.4855 32.073 71.0744 31.8097C70.9697 31.7977 70.7742 31.7219 70.6011 31.6541C70.1083 31.4599 69.2846 31.1367 68.8113 31.8216C68.204 32.7021 68.6186 33.3153 68.8253 33.5387C69.4102 34.1705 70.7463 34.4006 71.9763 34.4006C72.9563 34.4006 73.8694 34.2543 74.2799 34.0495C76.2107 33.0865 77.3387 31.1008 77.5412 28.3064C77.9684 22.4143 77.7408 14.4513 77.5328 8.97287L77.5314 8.97154Z" fill="currentColor" />
                <path d="M64.6928 30.7643C63.4084 30.0647 59.7212 29.3917 57.8295 30.2429C57.3199 30.4717 56.4683 31.0183 55.7744 31.3043C54.7706 31.7179 53.6314 32.1781 52.9459 32.2007C51.628 32.2459 49.7558 32.0065 48.9195 31.6727C48.4086 31.4692 48.0218 31.267 47.6812 31.0901C47.2707 30.876 46.8826 30.6738 46.3954 30.5289C44.2342 29.8851 42.8856 30.2549 41.5788 30.6113C40.8626 30.8068 40.1227 31.0103 39.2166 31.0542C39.0309 31.0635 38.6358 31.009 38.2519 30.9571C36.934 30.7776 35.9581 30.6845 35.408 31.1234C35.1874 31.3003 35.0646 31.5423 35.0548 31.823C35.0436 32.1448 35.1693 32.4428 35.4206 32.6848C36.2708 33.5055 38.5213 33.5254 39.1901 33.5121C40.2665 33.4909 41.1446 33.2488 41.9195 33.036C43.1787 32.6888 44.2677 32.3896 46.0101 33.032C46.2125 33.1065 46.4079 33.1796 46.5964 33.2501C48.6766 34.0242 50.0825 34.5469 52.6346 34.5469C52.7561 34.5469 52.8803 34.5469 53.0074 34.5429C54.504 34.515 55.7465 34.0202 56.95 33.5427C58.1618 33.0612 59.3247 32.3537 60.7181 32.343C60.9191 32.3404 61.6562 32.4853 62.1365 32.5439C64.1664 32.7859 64.4624 32.9655 64.7668 32.5957C64.9957 32.3178 65.106 31.6128 65.032 31.2537C64.9734 30.9704 64.8142 30.8294 64.6886 30.7616L64.6928 30.7643Z" fill="currentColor" />
              </svg>
            </div>
          </a>

          {/* Right: Group dropdown, Language selector, WhatsApp, Quote, Book */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* "Our group" Dropdown */}
            <div
              className="hidden lg:block relative group py-2"
              onMouseEnter={() => setActiveDropdown('group')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-2 text-xs uppercase tracking-wider font-normal transition-opacity hover:opacity-75 ${
                  isScrolled ? 'text-[#050038]' : 'text-white'
                }`}
              >
                <span>Our group</span>
                <svg
                  width="11"
                  height="7"
                  viewBox="0 0 11 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-transform duration-200 ${
                    activeDropdown === 'group' ? 'rotate-180' : ''
                  }`}
                >
                  <path d="M1 0.698623L5.5 5.31342L10 0.698624" stroke="currentColor" />
                </svg>
              </button>
              {activeDropdown === 'group' && (
                <div className="absolute top-full right-0 bg-white text-[#050038] shadow-lg rounded-b-md border border-gray-100 py-1 min-w-[14rem] z-50 animate-fadeIn">
                  {NAVIGATION_DROPDOWNS.find((d) => d.id === 'group')?.items.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.href}
                      className="block px-4 py-2 text-xs font-normal border-b border-gray-100 last:border-0 hover:bg-[#ffc400] hover:text-[#050038] transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`flex items-center gap-1.5 text-xs uppercase font-medium tracking-wider px-1 py-1 rounded transition-colors ${
                  isScrolled ? 'text-[#050038] hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}
              >
                <span>{currentLang}</span>
                <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 0.692611L5.5 5.3074L10 0.692612" stroke="currentColor" />
                </svg>
              </button>
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white text-[#050038] shadow-md rounded border border-gray-100 py-1 min-w-[4.5rem] z-50">
                  <button
                    onClick={() => {
                      setCurrentLang('en');
                      setIsLangOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-1 text-xs uppercase ${
                      currentLang === 'en' ? 'bg-[#ffa11d] text-white font-semibold' : 'hover:bg-gray-100'
                    }`}
                  >
                    en
                  </button>
                  <button
                    onClick={() => {
                      setCurrentLang('fr');
                      setIsLangOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-1 text-xs uppercase ${
                      currentLang === 'fr' ? 'bg-[#ffa11d] text-white font-semibold' : 'hover:bg-gray-100'
                    }`}
                  >
                    fr
                  </button>
                </div>
              )}
            </div>

            {/* Desktop WhatsApp Icon */}
            <a
              href="https://wa.me/+23052583453"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden lg:flex items-center justify-center transition-opacity hover:opacity-75 ${
                isScrolled ? 'text-[#050038]' : 'text-white'
              }`}
              aria-label="WhatsApp Contact"
            >
              <svg width="24" height="24" viewBox="0 0 30 30" fill="currentColor">
                <path d="M15.0001 3.28125C12.9484 3.28178 10.9329 3.82078 9.15486 4.84438C7.37682 5.86798 5.89859 7.34032 4.86789 9.11424C3.8372 10.8882 3.29015 12.9016 3.28142 14.9532C3.27269 17.0048 3.80258 19.0227 4.81814 20.8054L3.76294 24.4987C3.69405 24.7398 3.69091 24.995 3.75382 25.2378C3.81674 25.4805 3.94342 25.702 4.12075 25.8794C4.29808 26.0567 4.51961 26.1833 4.76237 26.2462C5.00513 26.3091 5.26029 26.306 5.50141 26.2371L9.19477 25.1819C10.7541 26.0709 12.4967 26.5899 14.2883 26.6988C16.0799 26.8076 17.8726 26.5035 19.5281 25.8099C21.1836 25.1163 22.6576 24.0517 23.8365 22.6983C25.0154 21.3448 25.8677 19.7386 26.3276 18.0036C26.7875 16.2686 26.8427 14.4512 26.489 12.6915C26.1353 10.9318 25.3822 9.2768 24.2877 7.85423C23.1931 6.43166 21.7865 5.27951 20.1762 4.48664C18.5659 3.69377 16.795 3.28137 15.0001 3.28125ZM15.0001 25.7813C13.0637 25.7826 11.1629 25.2617 9.4978 24.2734C9.44291 24.2407 9.38191 24.2196 9.31856 24.2114C9.2552 24.2031 9.19083 24.208 9.12942 24.2255L5.2438 25.3357C5.16342 25.3587 5.07837 25.3597 4.99745 25.3388C4.91653 25.3178 4.84269 25.2756 4.78359 25.2164C4.72449 25.1573 4.68227 25.0835 4.66131 25.0026C4.64035 24.9216 4.64141 24.8366 4.66439 24.7562L5.77447 20.8707C5.79201 20.8093 5.79681 20.7449 5.78859 20.6816C5.78036 20.6182 5.75928 20.5572 5.72663 20.5023C4.51229 18.4565 4.00867 16.0664 4.29425 13.7045C4.57982 11.3426 5.63854 9.14142 7.30548 7.44392C8.97242 5.74641 11.154 4.64789 13.5103 4.31946C15.8667 3.99103 18.2655 4.45115 20.333 5.62813C22.4006 6.80511 24.0209 8.63286 24.9415 10.8267C25.862 13.0205 26.0311 15.4571 25.4225 17.7571C24.8139 20.0571 23.4617 22.0911 21.5766 23.5425C19.6914 24.9938 17.3792 25.781 15.0001 25.7813Z" />
              </svg>
            </a>

            {/* Quote Button */}
            <button
              onClick={onOpenQuote}
              className={`mj-btn flex items-center justify-center text-xs uppercase tracking-wider font-medium px-4 h-9 border rounded-sm transition-all ${
                isScrolled
                  ? 'border-[#050038] text-[#050038] hover:bg-[#ffa11d] hover:border-[#ffa11d] hover:text-white'
                  : 'border-white text-white hover:bg-[#ffa11d] hover:border-[#ffa11d]'
              }`}
            >
              <span>Quote</span>
            </button>

            {/* Book Button */}
            <button
              onClick={onOpenBooking}
              className="hidden sm:flex mj-btn items-center justify-center text-xs uppercase tracking-wider font-semibold px-5 h-9 bg-[#ffa11d] text-white rounded-br-lg hover:bg-[#ff8f00] transition-colors shadow-sm"
            >
              <span>Book</span>
            </button>
          </div>
        </div>
      </div>

      {/* ----------------- MOBILE OFF-CANVAS MENU DRAWER ----------------- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Off-canvas panel */}
          <div className="relative w-full max-w-sm bg-white text-[#050038] h-full shadow-2xl z-10 flex flex-col justify-between p-6 sm:p-8 overflow-y-auto">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-5 mb-6">
                <a href="/" className="w-16">
                  <svg viewBox="0 0 110 92" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full text-[#050038]">
                    <path d="M16.2115 59.2422V67.6248C16.2115 70.7024 16.7977 72.6954 17.5598 73.692H11.6099C12.3719 72.6954 12.9581 70.7024 12.9581 67.6248V61.8801H4.98587V67.6248C4.98587 70.7024 5.57206 72.6954 6.33412 73.692H0.354919C1.11697 72.6954 1.70317 70.7024 1.70317 67.6248V59.2422C1.70317 56.1647 1.11697 54.1716 0.354919 53.1751H6.33412C5.57206 54.1716 4.98587 56.1647 4.98587 59.2422V61.5284H12.9581V59.2422C12.9581 56.1647 12.3719 54.1716 11.6099 53.1751H17.5598C16.7977 54.1716 16.2115 56.1647 16.2115 59.2422Z" fill="currentColor" />
                    <path d="M86.8152 29.9837C87.0985 28.8558 95.3924 23.916 96.5298 23.3895C97.9064 22.7516 103.559 20.8012 104.79 21.1004C105.526 21.2818 106.049 22.3802 105.717 22.8048C104.336 24.5684 100.762 25.5395 98.8009 26.554C97.3855 27.2844 87.5125 31.6816 86.8189 29.9816L86.8152 29.9837Z" fill="currentColor" />
                  </svg>
                </a>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[#050038] hover:opacity-60 transition-opacity"
                  aria-label="Close menu"
                >
                  <svg width="24" height="24" viewBox="0 0 24 25" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <line x1="1" y1="23" x2="23" y2="1" />
                  </svg>
                </button>
              </div>

              {/* Navigation Items in Drawer */}
              <div className="space-y-4">
                {NAVIGATION_DROPDOWNS.map((d) => (
                  <div key={d.id} className="border-b border-gray-100 pb-3">
                    <button
                      onClick={() => toggleMenuDropdown(d.id)}
                      className="w-full flex items-center justify-between text-base font-normal text-[#050038] py-1 text-left"
                    >
                      <span>{d.label}</span>
                      <svg
                        width="11"
                        height="7"
                        viewBox="0 0 11 7"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-transform ${openMenuDropdowns[d.id] ? 'rotate-180' : ''}`}
                      >
                        <path d="M1 0.698623L5.5 5.31342L10 0.698624" stroke="currentColor" />
                      </svg>
                    </button>
                    {openMenuDropdowns[d.id] && (
                      <div className="pl-3 pt-2 space-y-2">
                        <a
                          href={d.viewAllLink.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-xs font-semibold text-[#ffa11d] uppercase tracking-wider"
                        >
                          {d.viewAllLink.label}
                        </a>
                        {d.items.map((item, idx) => (
                          <a
                            key={idx}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-xs text-gray-700 hover:text-[#ffa11d]"
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <a
                  href="#services"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base text-[#050038] py-2 border-b border-gray-100"
                >
                  Our hotel services
                </a>
                <a
                  href="#restaurant"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base text-[#050038] py-2 border-b border-gray-100"
                >
                  Our restaurant
                </a>
              </div>
            </div>

            {/* Footer inside drawer */}
            <div className="pt-6 border-t border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase font-medium text-gray-500">Language:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentLang('en')}
                      className={`text-xs uppercase px-2 py-0.5 rounded ${
                        currentLang === 'en' ? 'bg-[#ffa11d] text-white font-bold' : 'text-gray-700 bg-gray-100'
                      }`}
                    >
                      en
                    </button>
                    <button
                      onClick={() => setCurrentLang('fr')}
                      className={`text-xs uppercase px-2 py-0.5 rounded ${
                        currentLang === 'fr' ? 'bg-[#ffa11d] text-white font-bold' : 'text-gray-700 bg-gray-100'
                      }`}
                    >
                      fr
                    </button>
                  </div>
                </div>

                <a
                  href="https://wa.me/+23052583453"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 flex items-center gap-1 text-xs font-medium"
                >
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenQuote();
                  }}
                  className="w-full py-2.5 text-center text-xs uppercase font-semibold border border-[#050038] text-[#050038] rounded-sm hover:bg-gray-50"
                >
                  Quote
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full py-2.5 text-center text-xs uppercase font-semibold bg-[#ffa11d] text-white rounded-br-md hover:bg-[#ff8f00]"
                >
                  Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
