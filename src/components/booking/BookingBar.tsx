import React, { useState, useRef, useEffect } from 'react';

interface BookingBarProps {
  onOpenBookingModal: (details: {
    destination: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    kids: number;
    nationality: string;
    promoCode: string;
  }) => void;
}

export const BookingBar: React.FC<BookingBarProps> = ({ onOpenBookingModal }) => {
  const [destination, setDestination] = useState('Our destinations');
  const [isDestOpen, setIsDestOpen] = useState(false);

  // Dates state
  const [checkIn, setCheckIn] = useState('03/10/2026');
  const [checkOut, setCheckOut] = useState('10/10/2026');
  const [isDatesOpen, setIsDatesOpen] = useState(false);

  // Guests state
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  // Nationality state
  const [nationality, setNationality] = useState<'Mauritian' | 'Non-Mauritian'>('Non-Mauritian');
  const [isNationalityOpen, setIsNationalityOpen] = useState(false);

  // Promo code
  const [promoCode, setPromoCode] = useState('');

  // Click outside listener
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        setIsDestOpen(false);
        setIsDatesOpen(false);
        setIsGuestsOpen(false);
        setIsNationalityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBookClick = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenBookingModal({
      destination: destination === 'Our destinations' ? 'Marguery Villas' : destination,
      checkIn,
      checkOut,
      adults,
      kids,
      nationality,
      promoCode,
    });
  };

  return (
    <div className="relative z-30 max-w-[83rem] mx-auto px-4 sm:px-6 w-full -mt-9 md:-mt-9 mb-12">
      <div
        ref={barRef}
        className="bg-[#f5f5f5] rounded-tl-md rounded-bl-md rounded-tr-md rounded-br-[1.875rem] shadow-xl border border-gray-200/60"
      >
        <form onSubmit={handleBookClick} className="grid grid-cols-1 md:grid-cols-12 items-stretch min-h-[4.5rem]">
          {/* 1. Destination Dropdown */}
          <div className="relative md:col-span-3 border-b md:border-b-0 md:border-r border-[#dfd7d0]">
            <button
              type="button"
              onClick={() => {
                setIsDestOpen(!isDestOpen);
                setIsDatesOpen(false);
                setIsGuestsOpen(false);
                setIsNationalityOpen(false);
              }}
              className="w-full h-full min-h-[4rem] md:min-h-[4.5rem] px-4 flex items-center justify-between text-left hover:bg-gray-100/60 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Destination</span>
                <span className="text-sm font-normal text-[#050038] truncate">{destination}</span>
              </div>
              <svg
                width="12"
                height="8"
                viewBox="0 0 13 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`text-black transition-transform duration-200 shrink-0 ${isDestOpen ? 'rotate-180' : ''}`}
              >
                <path d="M0.387695 0.65686L6.03694 6.3061L11.6938 0.649246" stroke="currentColor" />
              </svg>
            </button>

            {/* Destination Menu */}
            {isDestOpen && (
              <div className="absolute top-full left-0 w-full bg-[#f5f5f5] shadow-xl rounded-b-md border border-gray-200 py-2 z-50 animate-fadeIn">
                {['Marguery Villas', 'Mythic Suites', 'Eko Savannah'].map((resort) => (
                  <button
                    key={resort}
                    type="button"
                    onClick={() => {
                      setDestination(resort);
                      setIsDestOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2.5 text-sm text-[#050038] hover:bg-[#ffc400] transition-colors"
                  >
                    {resort}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Dates Range Picker */}
          <div className="relative md:col-span-3 border-b md:border-b-0 md:border-r border-[#dfd7d0]">
            <button
              type="button"
              onClick={() => {
                setIsDatesOpen(!isDatesOpen);
                setIsDestOpen(false);
                setIsGuestsOpen(false);
                setIsNationalityOpen(false);
              }}
              className="w-full h-full min-h-[4rem] md:min-h-[4.5rem] px-4 flex items-center justify-between text-left hover:bg-gray-100/60 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Dates</span>
                <span className="text-sm font-normal text-[#050038]">
                  {checkIn} - {checkOut}
                </span>
              </div>
              <svg
                width="12"
                height="8"
                viewBox="0 0 13 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`text-black transition-transform duration-200 shrink-0 ${isDatesOpen ? 'rotate-180' : ''}`}
              >
                <path d="M0.387695 0.65686L6.03694 6.3061L11.6938 0.649246" stroke="currentColor" />
              </svg>
            </button>

            {/* Quick Interactive Calendar Picker Popup */}
            {isDatesOpen && (
              <div className="absolute top-full left-0 md:-left-8 w-[19rem] sm:w-[28rem] bg-white shadow-2xl rounded-lg border border-gray-200 p-4 z-50 animate-fadeIn">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <span className="text-xs font-semibold uppercase text-gray-700">Select Stay Duration</span>
                  <button
                    type="button"
                    onClick={() => setIsDatesOpen(false)}
                    className="text-xs text-gray-400 hover:text-gray-700"
                  >
                    Done
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Check-in</label>
                    <input
                      type="text"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full border rounded px-2 py-1 text-xs text-[#050038] bg-gray-50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Check-out</label>
                    <input
                      type="text"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full border rounded px-2 py-1 text-xs text-[#050038] bg-gray-50 focus:outline-none"
                    />
                  </div>
                </div>
                {/* Popular stay presets */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t text-[11px]">
                  <span className="text-gray-400 mr-1 self-center">Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckIn('03/10/2026');
                      setCheckOut('10/10/2026');
                    }}
                    className="px-2 py-1 bg-gray-100 hover:bg-[#ffc400] rounded text-gray-700"
                  >
                    7 nights
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckIn('03/10/2026');
                      setCheckOut('17/10/2026');
                    }}
                    className="px-2 py-1 bg-gray-100 hover:bg-[#ffc400] rounded text-gray-700"
                  >
                    14 nights
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckIn('01/11/2026');
                      setCheckOut('15/11/2026');
                    }}
                    className="px-2 py-1 bg-gray-100 hover:bg-[#ffc400] rounded text-gray-700"
                  >
                    November stay
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Number of People */}
          <div className="relative md:col-span-2 border-b md:border-b-0 md:border-r border-[#dfd7d0]">
            <button
              type="button"
              onClick={() => {
                setIsGuestsOpen(!isGuestsOpen);
                setIsDestOpen(false);
                setIsDatesOpen(false);
                setIsNationalityOpen(false);
              }}
              className="w-full h-full min-h-[4rem] md:min-h-[4.5rem] px-4 flex items-center justify-between text-left hover:bg-gray-100/60 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Guests</span>
                <span className="text-sm font-normal text-[#050038]">
                  {adults} ad. {kids > 0 ? `, ${kids} kid` : ''}
                </span>
              </div>
              <svg
                width="12"
                height="8"
                viewBox="0 0 13 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`text-black transition-transform duration-200 shrink-0 ${isGuestsOpen ? 'rotate-180' : ''}`}
              >
                <path d="M0.387695 0.65686L6.03694 6.3061L11.6938 0.649246" stroke="currentColor" />
              </svg>
            </button>

            {/* Guests Counter Menu */}
            {isGuestsOpen && (
              <div className="absolute top-full left-0 w-full min-w-[15rem] bg-[#f5f5f5] shadow-xl rounded-b-md border border-gray-200 p-4 z-50 animate-fadeIn space-y-4">
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#050038]">Adults</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={adults <= 1}
                      onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                      className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-sm font-bold text-gray-700 disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-sm font-semibold">{adults}</span>
                    <button
                      type="button"
                      disabled={adults >= 10}
                      onClick={() => setAdults((prev) => Math.min(10, prev + 1))}
                      className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-sm font-bold text-gray-700 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Kids */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#050038]">Kids (-12)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={kids <= 0}
                      onClick={() => setKids((prev) => Math.max(0, prev - 1))}
                      className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-sm font-bold text-gray-700 disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-sm font-semibold">{kids}</span>
                    <button
                      type="button"
                      disabled={kids >= 8}
                      onClick={() => setKids((prev) => Math.min(8, prev + 1))}
                      className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-sm font-bold text-gray-700 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Nationality Selector */}
          <div className="relative md:col-span-2 border-b md:border-b-0 md:border-r border-[#dfd7d0]">
            <button
              type="button"
              onClick={() => {
                setIsNationalityOpen(!isNationalityOpen);
                setIsDestOpen(false);
                setIsDatesOpen(false);
                setIsGuestsOpen(false);
              }}
              className="w-full h-full min-h-[4rem] md:min-h-[4.5rem] px-4 flex items-center justify-between text-left hover:bg-gray-100/60 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Nationality</span>
                <span className="text-sm font-normal text-[#050038] truncate">{nationality}</span>
              </div>
              <svg
                width="12"
                height="8"
                viewBox="0 0 13 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`text-black transition-transform duration-200 shrink-0 ${isNationalityOpen ? 'rotate-180' : ''}`}
              >
                <path d="M0.387695 0.65686L6.03694 6.3061L11.6938 0.649246" stroke="currentColor" />
              </svg>
            </button>

            {/* Nationality Options */}
            {isNationalityOpen && (
              <div className="absolute top-full left-0 w-full min-w-[13rem] bg-[#f5f5f5] shadow-xl rounded-b-md border border-gray-200 p-3 z-50 animate-fadeIn space-y-2">
                <label className="flex items-center gap-2 text-xs text-[#050038] cursor-pointer">
                  <input
                    type="radio"
                    name="bar_nationality"
                    checked={nationality === 'Non-Mauritian'}
                    onChange={() => {
                      setNationality('Non-Mauritian');
                      setIsNationalityOpen(false);
                    }}
                    className="text-[#ffa11d] focus:ring-[#ffa11d]"
                  />
                  <span>Non-mauritian</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[#050038] cursor-pointer">
                  <input
                    type="radio"
                    name="bar_nationality"
                    checked={nationality === 'Mauritian'}
                    onChange={() => {
                      setNationality('Mauritian');
                      setIsNationalityOpen(false);
                    }}
                    className="text-[#ffa11d] focus:ring-[#ffa11d]"
                  />
                  <span>Mauritian / Resident</span>
                </label>
              </div>
            )}
          </div>

          {/* 5. Promo Code Input */}
          <div className="relative md:col-span-1 border-b md:border-b-0 border-[#dfd7d0] flex items-center">
            <input
              type="text"
              placeholder="Promo"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full h-full min-h-[3rem] px-3 bg-transparent text-sm text-[#050038] placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          {/* 6. BOOK Button with Reassurance Manuscript Note */}
          <div className="md:col-span-1 flex items-stretch">
            <button
              type="submit"
              className="w-full min-h-[4rem] md:min-h-[4.5rem] bg-[#ffa11d] hover:bg-[#ff8f00] text-white flex flex-col items-center justify-center rounded-br-[1.875rem] transition-colors relative group px-2 shadow-sm"
            >
              <span className="font-semibold text-sm tracking-wider uppercase">BOOK</span>
              <span className="font-handwriting text-[#7a3900] text-sm tracking-tight leading-none mt-0.5 whitespace-nowrap">
                best rate guaranteed
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
