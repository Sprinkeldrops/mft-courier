import React from 'react';
import { Shield, Zap, Truck, Layers } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/courierData';

export const DifferenceSection: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: 'Dedicated Direct Transit',
      description:
        'When your consignment is loaded, the vehicle heads straight to the delivery destination. No intermediate cross-docking, no parcel sortation hubs, and zero risk of mixed consignments.',
      icon: Zap,
    },
    {
      num: '02',
      title: 'Direct Line to Dispatch',
      description:
        'Speak directly with the team managing your movement on 07501419198. No automated call queues, bot scripts, or offshore routing.',
      icon: Shield,
    },
    {
      num: '03',
      title: 'Tailored Fleet Sizing',
      description:
        'From nimble small vans for city centers to 3.5t Luton box vans with 500kg hydraulic tail-lifts for heavy machinery and pallets, we deploy the right vehicle for the cargo.',
      icon: Truck,
    },
    {
      num: '04',
      title: 'Strategic Northern Positioning',
      description:
        'Based in OL8, Greater Manchester, right on the M60/M62 interchange, enabling fast direct departures to Yorkshire, the Midlands, London, and Scotland.',
      icon: Layers,
    },
  ];

  return (
    <section id="difference" className="py-20 lg:py-28 bg-[#F4EFE6] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs font-mono text-[#65A30D] uppercase tracking-wider font-semibold">
            The MFT Difference
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#121316] tracking-tight leading-[1.08] text-balance">
            WHEN TIME MATTERS,<br />
            DISTANCE SHOULDN'T.
          </h2>
          <p className="text-base sm:text-lg text-[#4A4E57] max-w-2xl leading-relaxed">
            Standard freight networks move parcels through multiple sorting depots and overnight hubs. MFT Courier provides dedicated vehicles that move your cargo straight from collection to destination.
          </p>
        </div>

        {/* 2-Column Split: Image Feature + 4 Value Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Commercial Fleet Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#E3DBD0] bg-[#FAF8F5] shadow-lg group">
              <img
                src="/assets/aistudio/img_1_fb94b13d.webp"
                alt="MFT Courier commercial logistics fleet and drivers in hi-vis vests at terminal"
                className="w-full h-80 sm:h-[440px] object-cover object-[center_top] transition-transform duration-700 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121316]/75 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-md rounded-xl border border-[#E8E2D8]">
                <div className="text-xs font-bold text-[#121316]">MFT Courier Commercial Fleet</div>
                <div className="text-[11px] text-[#5C616D] font-mono mt-0.5">
                  Small vans, medium sprinters & Luton box vans ready for dispatch
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.num}
                  className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8] space-y-3 hover:border-[#121316]/30 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#65A30D]">{p.num}.</span>
                    <div className="w-8 h-8 rounded-lg bg-[#F4EFE6] flex items-center justify-center text-[#121316] group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-[#121316] group-hover:text-[#84CC16] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#5C616D] leading-relaxed">
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
