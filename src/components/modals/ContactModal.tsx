import React, { useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    subject: 'Contact the reservation department',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    country: 'France',
    messageSubject: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/10 hover:bg-black/20 rounded-full text-black transition-colors"
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Left Side: Contact details & addresses */}
        <div className="w-full md:w-5/12 bg-[#f5f1e8] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <h2 className="font-display text-4xl text-[#050038] mb-4">Contact</h2>
            <div className="aspect-[4/3] rounded-lg overflow-hidden mb-6 shadow-sm">
              <img
                src="https://cdn.prod.website-files.com/6877b50802107221745ba52e/6894cf5ac95e9230dba7d141_Frame%20110%20(10).webp"
                alt="Exploring Mauritius seabed"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 text-xs text-[#050038]">
              <div>
                <p className="font-semibold uppercase tracking-wider text-gray-500 mb-0.5">Marguery Villas</p>
                <p>Coastal Road La Plantation, Black River 90601, Mauritius</p>
                <p className="text-gray-600 font-medium">+230 483 5020</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-wider text-gray-500 mb-0.5">Mythic Suites &amp; Villas</p>
                <p>Disa Lane, Grand-Gaube, Mauritius</p>
                <p className="text-gray-600 font-medium">+230 282 42 42</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-wider text-gray-500 mb-0.5">Eko Savannah</p>
                <p>Belouguet, Black Rock Road, Tamarin, Mauritius</p>
                <p className="text-gray-600 font-medium">+230 483 50 20</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-300">
            <a
              href="https://wa.me/+23052583453"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-[#050038] underline hover:text-[#ffa11d]"
            >
              <svg width="22" height="22" viewBox="0 0 30 30" fill="currentColor" className="text-emerald-600">
                <path d="M15.0001 3.28125C12.9484 3.28178 10.9329 3.82078 9.15486 4.84438C7.37682 5.86798 5.89859 7.34032 4.86789 9.11424C3.8372 10.8882 3.29015 12.9016 3.28142 14.9532C3.27269 17.0048 3.80258 19.0227 4.81814 20.8054L3.76294 24.4987C3.69405 24.7398 3.69091 24.995 3.75382 25.2378C3.81674 25.4805 3.94342 25.702 4.12075 25.8794C4.29808 26.0567 4.51961 26.1833 4.76237 26.2462C5.00513 26.3091 5.26029 26.306 5.50141 26.2371L9.19477 25.1819C10.7541 26.0709 12.4967 26.5899 14.2883 26.6988C16.0799 26.8076 17.8726 26.5035 19.5281 25.8099C21.1836 25.1163 22.6576 24.0517 23.8365 22.6983C25.0154 21.3448 25.8677 19.7386 26.3276 18.0036C26.7875 16.2686 26.8427 14.4512 26.489 12.6915C26.1353 10.9318 25.3822 9.2768 24.2877 7.85423C23.1931 6.43166 21.7865 5.27951 20.1762 4.48664C18.5659 3.69377 16.795 3.28137 15.0001 3.28125ZM15.0001 25.7813C13.0637 25.7826 11.1629 25.2617 9.4978 24.2734C9.44291 24.2407 9.38191 24.2196 9.31856 24.2114C9.2552 24.2031 9.19083 24.208 9.12942 24.2255L5.2438 25.3357C5.16342 25.3587 5.07837 25.3597 4.99745 25.3388C4.91653 25.3178 4.84269 25.2756 4.78359 25.2164C4.72449 25.1573 4.68227 25.0835 4.66131 25.0026C4.64035 24.9216 4.64141 24.8366 4.66439 24.7562L5.77447 20.8707C5.79201 20.8093 5.79681 20.7449 5.78859 20.6816C5.78036 20.6182 5.75928 20.5572 5.72663 20.5023C4.51229 18.4565 4.00867 16.0664 4.29425 13.7045C4.57982 11.3426 5.63854 9.14142 7.30548 7.44392C8.97242 5.74641 11.154 4.64789 13.5103 4.31946C15.8667 3.99103 18.2655 4.45115 20.333 5.62813C22.4006 6.80511 24.0209 8.63286 24.9415 10.8267C25.862 13.0205 26.0311 15.4571 25.4225 17.7571C24.8139 20.0571 23.4617 22.0911 21.5766 23.5425C19.6914 24.9938 17.3792 25.781 15.0001 25.7813Z" />
              </svg>
              <span>Contact us via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 overflow-y-auto">
          {isSubmitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-emerald-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl mb-4">
                ✓
              </div>
              <h4 className="font-display text-2xl text-[#050038] mb-2">Message Sent</h4>
              <p className="text-gray-600 text-sm max-w-sm">
                Thanks! Your message has been received. Our team will get back to you promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Subject*
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full border-b border-gray-400 py-1.5 text-sm bg-transparent focus:outline-none focus:border-[#ffa11d]"
                >
                  <option value="Contact the reservation department">Contact the reservation department</option>
                  <option value="Contact the revenue & sales department">Contact the revenue &amp; sales department</option>
                  <option value="Contact the administrative & HR department">Contact the administrative &amp; HR department</option>
                  <option value="Contact the marketing department">Contact the marketing department</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your first name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full border-b border-gray-400 py-1.5 text-sm bg-transparent focus:outline-none focus:border-[#ffa11d]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full border-b border-gray-400 py-1.5 text-sm bg-transparent focus:outline-none focus:border-[#ffa11d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+230 ... or +33 ..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border-b border-gray-400 py-1.5 text-sm bg-transparent focus:outline-none focus:border-[#ffa11d]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="yourname@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border-b border-gray-400 py-1.5 text-sm bg-transparent focus:outline-none focus:border-[#ffa11d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full border-b border-gray-400 py-1.5 text-sm bg-transparent focus:outline-none focus:border-[#ffa11d]"
                >
                  <option value="France">France</option>
                  <option value="Mauritius">Mauritius</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Belgium">Belgium</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Italy">Italy</option>
                  <option value="United States">United States</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Message*
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#ffa11d]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#ffa11d] text-white font-semibold uppercase text-xs tracking-wider rounded-br-lg hover:bg-[#ff8f00] transition-colors shadow-md"
              >
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
