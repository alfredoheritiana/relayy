import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/hero/Hero';
import { BookingBar } from '@/components/booking/BookingBar';
import { ConceptIntro } from '@/components/editorial/ConceptIntro';
import { ValueHighlights } from '@/components/highlights/ValueHighlights';
import { PropertyExplorer } from '@/components/properties/PropertyExplorer';
import { AccommodationSlider } from '@/components/slider/AccommodationSlider';
import { FAQSection } from '@/components/faq/FAQSection';
import { TrustCTA } from '@/components/cta/TrustCTA';
import { Footer } from '@/components/layout/Footer';
import { QuoteModal } from '@/components/modals/QuoteModal';
import { ContactModal } from '@/components/modals/ContactModal';
import { NationalityModal } from '@/components/modals/NationalityModal';

export function MJHolidaysPage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isNationalityOpen, setIsNationalityOpen] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState<{
    destination: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    kids: number;
    nationality: string;
    promoCode: string;
  } | null>(null);

  const handleOpenBooking = () => {
    setIsNationalityOpen(true);
  };

  const handleBookingBarSubmit = (data: {
    destination: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    kids: number;
    nationality: string;
    promoCode: string;
  }) => {
    setPendingBookingData(data);
    setIsNationalityOpen(true);
  };

  const handleNationalitySelected = (isMauritian: boolean) => {
    setIsNationalityOpen(false);

    let targetUrl = 'https://booking.profitroom.com/en/mjholidayseur/locations?no-cache=&currency=EUR';
    if (isMauritian) {
      targetUrl = 'https://booking.profitroom.com/en/mjholidaysmur/locations?no-cache=&currency=MUR';
    }

    if (pendingBookingData) {
      const dest = pendingBookingData.destination;
      if (dest === 'Marguery Villas') {
        targetUrl = isMauritian
          ? 'https://booking.marguery-villas-resort.com/premium/index2.html?id_stile=18333&lingua_int=eng&id_albergo=19957&dc=1769&currency=MUR'
          : 'https://booking.marguery-villas-resort.com/premium/index2.html?id_stile=18333&lingua_int=eng&id_albergo=19957&dc=1769&currency=EUR';
      } else if (dest === 'Mythic Suites') {
        targetUrl = isMauritian
          ? 'https://booking.mythic-resort.com/premium/index2.html?id_stile=18334&lingua_int=eng&id_albergo=21781&dc=9972&currency=MUR'
          : 'https://booking.mythic-resort.com/premium/index2.html?id_stile=18334&lingua_int=eng&id_albergo=21781&dc=9972&currency=EUR';
      } else if (dest === 'Eko Savannah') {
        targetUrl = isMauritian
          ? 'https://booking.mjholidays.com/premium/index2.html?id_stile=22444&lingua_int=eng&id_albergo=29785&dc=1820&currency=MUR'
          : 'https://booking.mjholidays.com/premium/index2.html?id_stile=22444&lingua_int=eng&id_albergo=29785&dc=1820&currency=EUR';
      }
    }

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="page-wrapper min-h-screen bg-white text-[#050038] flex flex-col selection:bg-[#ffa11d] selection:text-white">
      {/* 01. Global Navigation */}
      <Navbar
        onOpenQuote={() => setIsQuoteOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenBooking={handleOpenBooking}
      />

      {/* Main Page Layout */}
      <main className="flex-1 w-full">
        {/* 02. Full-Viewport Hero with Background Video & Editorial Composition */}
        <Hero />

        {/* 03. Overlapping Booking Bar */}
        <BookingBar onOpenBookingModal={handleBookingBarSubmit} />

        {/* 04. Editorial Intro / Concept Section */}
        <ConceptIntro />

        {/* 05. Four Value-Proposition Highlights */}
        <ValueHighlights />

        {/* 06. Resort / Location Exploration Section (Sticky Scroll Synced) */}
        <PropertyExplorer />

        {/* 07. Large Villa Carousel / Accommodation Slider */}
        <AccommodationSlider />

        {/* 08. FAQ Section + Multi-platform Reviews */}
        <FAQSection />

        {/* 09. Trust / Local Expertise CTA with Asymmetrical Brand Motif */}
        <TrustCTA />
      </main>

      {/* 10. Large Multi-Column Footer */}
      <Footer
        onOpenQuote={() => setIsQuoteOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Modals */}
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <NationalityModal
        isOpen={isNationalityOpen}
        onClose={() => setIsNationalityOpen(false)}
        onSelect={handleNationalitySelected}
      />
    </div>
  );
}
