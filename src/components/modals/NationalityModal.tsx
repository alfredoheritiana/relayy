import React from 'react';

interface NationalityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (isMauritian: boolean) => void;
}

export const NationalityModal: React.FC<NationalityModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-lg p-8 shadow-2xl text-center animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors p-1"
          aria-label="Close popup"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Modal Prompt */}
        <h3 className="font-display text-2xl text-[#050038] mb-3">Welcome to Mauritius</h3>
        <p className="text-gray-700 text-base mb-8">
          Are you Mauritian / a resident of Mauritius or a Premium Visa holder?
        </p>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onSelect(true)}
            className="w-full py-3 bg-[#ffa11d] text-white font-semibold uppercase text-sm tracking-wider rounded-br-lg hover:bg-[#ff8f00] transition-colors shadow-sm"
          >
            Yes (MUR)
          </button>
          <button
            onClick={() => onSelect(false)}
            className="w-full py-3 bg-[#050038] text-white font-semibold uppercase text-sm tracking-wider rounded-br-lg hover:bg-[#1c2448] transition-colors shadow-sm"
          >
            No (EUR)
          </button>
        </div>
      </div>
    </div>
  );
};
