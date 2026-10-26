import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { IntroductionSection } from './components/IntroductionSection';
import { DifferenceSection } from './components/DifferenceSection';
import { ServicesSection } from './components/ServicesSection';
import { DeliveryServicesSlider } from './components/DeliveryServicesSlider';
import { CoverageSection } from './components/CoverageSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { WhyMftSection } from './components/WhyMftSection';
import { ClientReviewsSection } from './components/ClientReviewsSection';
import { QuoteSection } from './components/QuoteSection';
import { Footer } from './components/Footer';
import { LegalModal } from './components/LegalModal';
import { NotFoundModal } from './components/NotFoundModal';

export default function App() {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms'>('privacy');
  const [notFoundOpen, setNotFoundOpen] = useState(false);

  const openPrivacy = () => {
    setLegalTab('privacy');
    setLegalModalOpen(true);
  };

  const openTerms = () => {
    setLegalTab('terms');
    setLegalModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121316] flex flex-col font-sans selection:bg-lime-400 selection:text-neutral-950">
      {/* Primary Top Navigation (Clean Unnumbered Menu + Facebook Link) */}
      <Navbar />

      <main className="flex-1">
        {/* 01 — HERO with Enhanced 3D Logistics Globe */}
        <Hero />

        {/* 02 — INTRODUCTION with GSAP Scroll Reveal & MFT Courier HQ Image */}
        <IntroductionSection />

        {/* 03 — THE MFT DIFFERENCE with Fleet Image */}
        <DifferenceSection />

        {/* 04 — SERVICES CAPABILITIES */}
        <ServicesSection />

        {/* 05 — MIDDLE SHOWCASE: INTERACTIVE SPEED TIERS & DISPATCH OPTIONS CAROUSEL (Same-Day, Next-Day, Urgent, Luton Tail-Lift, Final-Mile) */}
        <DeliveryServicesSlider />

        {/* 06 — UK COVERAGE & TRANSIT CORRIDORS */}
        <CoverageSection />

        {/* 06 — HOW IT WORKS with Authentic Handover Photo */}
        <HowItWorksSection />

        {/* 07 — WHY MFT with Driver in Hi-Vis & Cabin Navigation Photo */}
        <WhyMftSection />

        {/* Verified Client Reviews */}
        <ClientReviewsSection />

        {/* 08 — FINAL CTA (WHAT NEEDS MOVING? & WhatsApp Direct Quote Form) */}
        <QuoteSection onOpenPrivacy={openPrivacy} onOpenTerms={openTerms} />
      </main>

      {/* 09 — FOOTER with Facebook link & Legal Triggers */}
      <Footer onOpenPrivacy={openPrivacy} onOpenTerms={openTerms} />

      {/* Legal Documents Modal (Fully Fleshed-out Privacy Policy & Terms of Carriage) */}
      <LegalModal
        isOpen={legalModalOpen}
        initialTab={legalTab}
        onClose={() => setLegalModalOpen(false)}
      />

      {/* 404 Modal with Suspended Shipping Container */}
      <NotFoundModal
        isOpen={notFoundOpen}
        onClose={() => setNotFoundOpen(false)}
      />
    </div>
  );
}
