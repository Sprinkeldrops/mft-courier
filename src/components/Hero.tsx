import React, { useState } from 'react';
import { ArrowDown, MessageSquare, ArrowRight, MapPin, Compass } from 'lucide-react';
import { UkCourierNetworkMap } from './UkCourierNetworkMap';
import { AntiGravityCanvas } from './AntiGravityCanvas';
import { COMPANY_DETAILS } from '../data/courierData';

export const Hero: React.FC = () => {
  const [selectedDestination, setSelectedDestination] = useState<string>('london');

  const getQuoteWhatsAppUrl = `${COMPANY_DETAILS.whatsappQuoteUrl}?text=${encodeURIComponent(
    'Hello MFT Courier, I would like to get a quote for a delivery requirement.'
  )}`;

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden bg-[#FAF8F5] border-b border-[#E8E2D8]">
      {/* Floating Anti-Gravity Droplet Particles Background */}
      <AntiGravityCanvas className="absolute inset-0 pointer-events-none opacity-45" particleCount={48} variant="lime" />

      {/* Subtle architectural grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#121316 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8 z-10">
            {/* Location Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#F2EDE2] border border-[#E3DBD0] text-[11px] font-mono tracking-wider uppercase text-[#4A4E57]">
              <span className="w-2 h-2 rounded-full bg-[#84CC16]" />
              <span>BASED IN GREATER MANCHESTER · UK COURIER SERVICES</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] font-extrabold text-[#121316] tracking-tight leading-[1.05] text-balance">
              MOVE IT FAST.<br />
              <span className="text-[#3A3E47]">MOVE IT RIGHT.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#4A4E57] max-w-xl font-normal leading-relaxed text-balance">
              Courier and logistics solutions built around your delivery needs. From Manchester to destinations across the UK.
            </p>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={getQuoteWhatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="px-7 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#121316] hover:bg-[#23252A] rounded-xl transition-all shadow-md shadow-neutral-900/10 flex items-center gap-3 group cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#84CC16]" />
                <span>GET A QUOTE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href="#services"
                className="px-6 py-4 text-xs sm:text-sm font-mono uppercase tracking-wider text-[#121316] bg-[#F2EDE2] hover:bg-[#EAE4D7] border border-[#E3DBD0] rounded-xl transition-colors flex items-center gap-2 cursor-pointer font-semibold"
              >
                <span>EXPLORE SERVICES</span>
                <ArrowRight className="w-4 h-4 text-[#7A808C]" />
              </a>
            </div>

            {/* Hub Details Strip */}
            <div className="pt-6 border-t border-[#E8E2D8] flex flex-wrap items-center gap-6 text-xs font-mono text-[#5C616D]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>Hub Origin: OL8, Greater Manchester</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>Mainland Direct Dedicated Transit</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Animated UK Courier Network Map */}
          <div className="lg:col-span-6 relative">
            <UkCourierNetworkMap
              activeDestinationId={selectedDestination}
              onSelectDestination={(dest) => setSelectedDestination(dest.id)}
            />
          </div>
        </div>
      </div>

      {/* Restrained Animated Scroll Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full flex items-center justify-between border-t border-[#E8E2D8] text-[11px] font-mono text-[#7B808B]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#84CC16]" />
          <span>MANCHESTER HUB ➔ NATIONWIDE DEDICATED LOGISTICS</span>
        </div>
        <a
          href="#introduction"
          className="flex items-center gap-2 hover:text-[#121316] transition-colors"
          aria-label="Scroll to introduction"
        >
          <span>SCROLL TO EXPLORE</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
