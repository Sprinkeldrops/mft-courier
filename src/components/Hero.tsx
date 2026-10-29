import React, { useState } from 'react';
import { ArrowDown, MessageSquare, ArrowRight, MapPin, Compass, Zap } from 'lucide-react';
import { HeroUkTerrainMap } from './HeroUkTerrainMap';
import { UK_NETWORK_CITIES, UkCityNode } from './UkCourierNetworkMap';
import { COMPANY_DETAILS } from '../data/courierData';

/**
 * HERO MAP CONFIGURATION SETTINGS
 * Easily adjust size, position, opacity, and visual intensity here or via CSS variables:
 * --hero-map-scale, --hero-map-offset-x, --hero-map-offset-y, --hero-map-opacity
 */
export const HERO_MAP_CONFIG = {
  scale: 1.12,             // Map scale/size (default 1.12, desktop fills background nicely)
  offsetX: 16,             // Horizontal position offset % (moves map to the right side on desktop)
  offsetY: -1,             // Vertical position offset %
  opacity: 0.95,           // Map visual presence/opacity
  terrainIntensity: 1.0,   // Topographic relief & contour contrast
  glowIntensity: 1.05,     // Glow intensity of courier route arteries
  interactive: true,       // Interactive city selection & hover
};

export const Hero: React.FC = () => {
  const [selectedDestination, setSelectedDestination] = useState<string>('london');

  // WhatsApp Quote Direct URL
  const getQuoteWhatsAppUrl =
    'https://wa.me/447501419198?text=Hello%20MFT%20Courier%2C%20I%20would%20like%20to%20get%20a%20quote%20for%20a%20delivery%20requirement.';

  // Explore Services URL
  const exploreServicesUrl = 'https://mftcourier.co.uk/#services';

  const activeCity = UK_NETWORK_CITIES.find((c) => c.id === selectedDestination) || UK_NETWORK_CITIES[1];

  const quickCities = ['london', 'birmingham', 'leeds', 'glasgow', 'bristol', 'belfast', 'cardiff'];

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden bg-[#07090E] border-b border-[#1A2230] text-white">
      {/* 1. Large 3D UK Terrain Network Map with Galaxy Particle Backdrop */}
      <HeroUkTerrainMap
        activeDestinationId={selectedDestination}
        onSelectDestination={(dest: UkCityNode) => setSelectedDestination(dest.id)}
        scale={HERO_MAP_CONFIG.scale}
        offsetX={HERO_MAP_CONFIG.offsetX}
        offsetY={HERO_MAP_CONFIG.offsetY}
        opacity={HERO_MAP_CONFIG.opacity}
        terrainIntensity={HERO_MAP_CONFIG.terrainIntensity}
        glowIntensity={HERO_MAP_CONFIG.glowIntensity}
        interactive={HERO_MAP_CONFIG.interactive}
        className="animate-fade-in-slow"
      />

      {/* 2. Architectural Coordinate Grid Accent (Subtle tech overlay) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] z-10"
        style={{
          backgroundImage: `radial-gradient(#84CC16 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
        aria-hidden="true"
      />

      {/* 3. Foreground Hero Content Stage */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20 w-full flex-1 flex flex-col justify-center">
        <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl space-y-5 sm:space-y-6">
          {/* Location Indicator Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F1624]/85 border border-[#223145] text-[11px] font-mono tracking-wider uppercase text-neutral-300 shadow-md backdrop-blur-md animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse shadow-[0_0_8px_#84CC16]" />
            <span>BASED IN GREATER MANCHESTER · UK COURIER SERVICES</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] font-black tracking-tight leading-[1.02] text-white text-balance drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] animate-fade-in-up [animation-delay:150ms]">
            MOVE IT FAST.<br />
            <span className="text-[#84CC16] drop-shadow-[0_0_24px_rgba(132,204,22,0.4)]">
              MOVE IT RIGHT.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg lg:text-xl text-neutral-300 max-w-xl font-normal leading-relaxed text-balance drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] animate-fade-in-up [animation-delay:300ms]">
            Courier and logistics solutions built around your delivery needs. From Manchester to destinations across the UK.
          </p>

          {/* CTA Group with Premium Hover Lift & Refined Glow */}
          <div className="flex flex-wrap items-center gap-4 pt-2 animate-fade-in-up [animation-delay:450ms]">
            {/* Primary CTA: GET A QUOTE */}
            <a
              href={getQuoteWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="px-7 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0A0D12] bg-[#84CC16] hover:bg-[#9BE329] rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(132,204,22,0.38)] hover:shadow-[0_0_35px_rgba(132,204,22,0.65)] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-3 group cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#0A0D12] fill-[#0A0D12]" />
              <span>GET A QUOTE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A0D12] group-hover:scale-125 transition-transform" />
            </a>

            {/* Secondary CTA: EXPLORE SERVICES */}
            <a
              href={exploreServicesUrl}
              className="px-6 py-4 text-xs sm:text-sm font-mono uppercase tracking-wider text-white bg-[#121927]/90 hover:bg-[#1A2336] border border-[#2B3950] hover:border-[#84CC16]/60 rounded-xl transition-all duration-300 shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 cursor-pointer font-semibold backdrop-blur-md group"
            >
              <span>EXPLORE SERVICES</span>
              <ArrowRight className="w-4 h-4 text-[#84CC16] group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Hub Details Strip */}
          <div className="pt-6 border-t border-[#1C2638] flex flex-wrap items-center gap-5 sm:gap-7 text-xs font-mono text-neutral-300 animate-fade-in-up [animation-delay:600ms]">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#84CC16]" />
              <span>Hub Origin: OL8, Greater Manchester</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#84CC16]" />
              <span>Mainland Direct Dedicated Transit</span>
            </div>
          </div>

          {/* Interactive Route Quick Pills (Tap/click to illuminate artery) */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono animate-fade-in-up [animation-delay:700ms]">
            <span className="text-neutral-400 text-[11px] uppercase tracking-wider flex items-center gap-1 mr-1">
              <Zap className="w-3 h-3 text-[#84CC16]" />
              Direct Arteries:
            </span>
            {quickCities.map((id) => {
              const city = UK_NETWORK_CITIES.find((c) => c.id === id);
              if (!city) return null;
              const isSelected = selectedDestination === city.id;

              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => setSelectedDestination(city.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#84CC16] text-[#0A0D12] font-bold shadow-[0_0_12px_rgba(132,204,22,0.45)]'
                      : 'bg-[#101724]/80 hover:bg-[#182336] text-neutral-300 hover:text-white border border-[#223145]'
                  }`}
                >
                  {city.shortName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Sleek Bottom Corridor Indicator Bar */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 w-full flex items-center justify-between border-t border-[#17202E] text-[11px] font-mono text-neutral-400 bg-[#07090E]/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse" />
          <span className="hidden sm:inline">CENTRAL HUB: MANCHESTER (OL8) ➔</span>
          <span className="text-[#84CC16] font-semibold">
            NATIONWIDE DEDICATED TRANSIT
          </span>
          {activeCity && (
            <span className="hidden md:inline text-neutral-400">
              · Selected: <strong className="text-white">{activeCity.name}</strong> (~{activeCity.approxMiles} mi)
            </span>
          )}
        </div>

        <a
          href="#introduction"
          className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Scroll to introduction"
        >
          <span>SCROLL TO EXPLORE</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#84CC16] animate-bounce" />
        </a>
      </div>
    </section>
  );
};
