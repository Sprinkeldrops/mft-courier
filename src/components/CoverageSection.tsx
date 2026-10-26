import React, { useState } from 'react';
import { MapPin, Navigation, ArrowUpRight, Compass } from 'lucide-react';
import { DESTINATIONS } from './LogisticsGlobe3D';
import { AntiGravityCanvas } from './AntiGravityCanvas';
import { COMPANY_DETAILS } from '../data/courierData';

export const CoverageSection: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState(DESTINATIONS[1]); // London by default

  const routes = DESTINATIONS.filter((d) => d.id !== 'manchester');

  return (
    <section id="coverage" className="py-20 lg:py-28 bg-[#F4EFE6] border-b border-[#E8E2D8] relative overflow-hidden">
      {/* Floating Anti-Gravity Particles Background */}
      <AntiGravityCanvas className="absolute inset-0 pointer-events-none opacity-35" particleCount={40} variant="lime" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-3">
          <div className="text-xs font-mono text-[#65A30D] uppercase tracking-wider font-semibold">
            05 · UK Coverage & Routes
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#121316] tracking-tight">
            Nationwide Transit Corridors
          </h2>
          <p className="text-base text-[#4A4E57] leading-relaxed">
            Centered at our Greater Manchester base (OL8), MFT Courier operates direct dedicated transport routes spanning Great Britain.
          </p>
        </div>

        {/* 2-Column Route Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Corridors List */}
          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-mono text-[#7B808B] uppercase tracking-wider mb-2">
              SELECT KEY TRANSIT DESTINATION
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {routes.map((dest) => {
                const isSelected = selectedRoute.id === dest.id;
                return (
                  <button
                    key={dest.id}
                    onClick={() => setSelectedRoute(dest)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#121316] text-white border-[#121316] shadow-sm'
                        : 'bg-[#FAF8F5] text-[#121316] border-[#E8E2D8] hover:border-[#121316]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold">{dest.name}</span>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-[#84CC16]' : 'text-[#65A30D]'}`}>
                        ~{dest.approxMiles} mi
                      </span>
                    </div>
                    <div className={`text-xs ${isSelected ? 'text-neutral-400' : 'text-[#5C616D]'} truncate`}>
                      {dest.corridor}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E2D8] text-xs text-[#5C616D] font-mono">
              *All routes originating from OL8 Greater Manchester. Routes shown represent primary trunk corridors across the UK mainland.
            </div>
          </div>

          {/* Right: Selected Corridor Blueprint Card */}
          <div className="lg:col-span-6 bg-[#FAF8F5] rounded-3xl border border-[#E8E2D8] p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#84CC16]" />
                <span className="text-xs font-mono font-bold text-[#121316] uppercase">
                  ACTIVE ROUTE SPECIFICATION
                </span>
              </div>
              <span className="text-xs font-mono text-[#7A808C]">{selectedRoute.region}</span>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono text-[#7B808B] uppercase">ORIGIN ➔ DESTINATION</div>
              <div className="text-2xl font-extrabold text-[#121316] flex items-center gap-3">
                <span>Manchester (OL8)</span>
                <span className="text-[#84CC16]">➔</span>
                <span>{selectedRoute.name}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 bg-[#F4EFE6] rounded-xl border border-[#E8E2D8]">
                <div className="text-[10px] text-[#7B808B] uppercase">ESTIMATED ROAD DISTANCE</div>
                <div className="text-lg font-bold text-[#121316] tabular-nums mt-0.5">
                  ~{selectedRoute.approxMiles} miles
                </div>
              </div>
              <div className="p-3 bg-[#F4EFE6] rounded-xl border border-[#E8E2D8]">
                <div className="text-[10px] text-[#7B808B] uppercase">PRIMARY ROAD CORRIDOR</div>
                <div className="text-xs font-bold text-[#121316] mt-1 truncate">
                  {selectedRoute.corridor}
                </div>
              </div>
            </div>

            <p className="text-xs text-[#4A4E57] leading-relaxed">
              Consignments scheduled for {selectedRoute.name} depart directly from our Greater Manchester base. Dedicated vehicles ensure no intermediate depot delays along the {selectedRoute.corridor}.
            </p>

            <div className="pt-2">
              <a
                href={`${COMPANY_DETAILS.whatsappQuoteUrl}?text=${encodeURIComponent(
                  `Hello MFT Courier, I would like to enquire about transport from Manchester to ${selectedRoute.name}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#121316] hover:bg-[#23252A] rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Request Quote for {selectedRoute.name}</span>
                <ArrowUpRight className="w-4 h-4 text-[#84CC16]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
