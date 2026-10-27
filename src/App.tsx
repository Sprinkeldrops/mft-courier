import React, { useState, useEffect } from 'react';
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
import { CustomerTrackingModal } from './components/tracking/CustomerTrackingModal';
import { DriverPortalModal } from './components/tracking/DriverPortalModal';
import { AdminPortalModal } from './components/tracking/AdminPortalModal';

export default function App() {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms'>('privacy');
  const [notFoundOpen, setNotFoundOpen] = useState(false);

  // Live GPS Tracking & Driver Portals
  const [customerTrackOpen, setCustomerTrackOpen] = useState(false);
  const [driverPortalOpen, setDriverPortalOpen] = useState(false);
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);
  const [activeTrackingCode, setActiveTrackingCode] = useState<string>('MFT-84920');

  // Check URL query parameters on load (e.g. ?track=MFT-84920, ?driver=1, ?admin=1)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const trackParam = params.get('track') || params.get('tracking');
      const driverParam = params.get('driver');
      const adminParam = params.get('admin') || params.get('dispatch');

      if (trackParam) {
        setActiveTrackingCode(trackParam.toUpperCase());
        setCustomerTrackOpen(true);
      } else if (driverParam) {
        setDriverPortalOpen(true);
      } else if (adminParam) {
        setAdminPortalOpen(true);
      }
    }
  }, []);

  const openPrivacy = () => {
    setLegalTab('privacy');
    setLegalModalOpen(true);
  };

  const openTerms = () => {
    setLegalTab('terms');
    setLegalModalOpen(true);
  };

  const handleOpenCustomerTracking = (code?: string) => {
    if (code) {
      setActiveTrackingCode(code);
    }
    setCustomerTrackOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121316] flex flex-col font-sans selection:bg-lime-400 selection:text-neutral-950">
      {/* Primary Top Navigation with Live Tracking Menus */}
      <Navbar
        onOpenTrack={() => handleOpenCustomerTracking()}
        onOpenDriver={() => setDriverPortalOpen(true)}
        onOpenAdmin={() => setAdminPortalOpen(true)}
      />

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

      {/* 09 — FOOTER with Facebook link, Legal Triggers & Live Tracking shortcuts */}
      <Footer
        onOpenPrivacy={openPrivacy}
        onOpenTerms={openTerms}
        onOpenTrack={() => handleOpenCustomerTracking()}
        onOpenDriver={() => setDriverPortalOpen(true)}
        onOpenAdmin={() => setAdminPortalOpen(true)}
      />

      {/* Live Customer Consignment Tracking Modal (Leaflet Map + 5-day expiry) */}
      <CustomerTrackingModal
        isOpen={customerTrackOpen}
        initialCode={activeTrackingCode}
        onClose={() => setCustomerTrackOpen(false)}
      />

      {/* Driver Telemetry Portal Modal (7-digit ID login + persistent session + live GPS) */}
      <DriverPortalModal
        isOpen={driverPortalOpen}
        onClose={() => setDriverPortalOpen(false)}
        onOpenCustomerTracking={handleOpenCustomerTracking}
      />

      {/* Admin Dispatch Portal Modal (Driver management max 10 + 5-day consignment links) */}
      <AdminPortalModal
        isOpen={adminPortalOpen}
        onClose={() => setAdminPortalOpen(false)}
        onOpenCustomerTracking={handleOpenCustomerTracking}
      />

      {/* Legal Documents Modal */}
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
