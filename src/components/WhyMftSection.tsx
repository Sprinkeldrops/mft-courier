import React from 'react';
import { Phone, Truck, MapPin } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/courierData';

export const WhyMftSection: React.FC = () => {
  return (
    <section id="why-mft" className="py-20 lg:py-28 bg-[#F4EFE6] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Strengths & Facts */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-mono text-[#65A30D] uppercase tracking-wider font-semibold">
              Verified Capabilities
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#121316] tracking-tight">
              Why Businesses Rely on MFT Courier
            </h2>

            <p className="text-base text-[#4A4E57] leading-relaxed">
              When standard postal networks and multi-depot pallet networks carry too much uncertainty, MFT Courier provides a dedicated alternative.
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E2D8] flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#F4EFE6] flex items-center justify-center text-[#121316] shrink-0 mt-0.5">
                  <Phone className="w-5 h-5 text-[#84CC16]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#121316]">Direct Line of Contact</h3>
                  <p className="text-xs text-[#5C616D] mt-1">
                    Call <strong>07501419198</strong> to discuss your consignment directly with an active logistics dispatcher.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E2D8] flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#F4EFE6] flex items-center justify-center text-[#121316] shrink-0 mt-0.5">
                  <Truck className="w-5 h-5 text-[#84CC16]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#121316]">Single-Consignment Dedicated Transport</h3>
                  <p className="text-xs text-[#5C616D] mt-1">
                    Vehicles are dispatched solely with your items on board. No co-loading with third-party cargo.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E2D8] flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#F4EFE6] flex items-center justify-center text-[#121316] shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-[#84CC16]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#121316]">Greater Manchester Gateway (OL8)</h3>
                  <p className="text-xs text-[#5C616D] mt-1">
                    Direct access to the M60, M62, and M6 corridors connects us rapidly to major commercial hubs across England, Scotland, and Wales.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Photography of MFT Courier Driver & In-Cabin Navigation */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-[#E3DBD0] bg-[#FAF8F5] shadow-lg group">
              <img
                src="/assets/aistudio/img_2_6835a0f1.webp"
                alt="MFT Courier driver in hi-vis vest coordinating dispatch alongside delivery van"
                className="w-full h-80 sm:h-96 object-cover object-[center_top] transition-transform duration-700 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121316]/75 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/95 backdrop-blur-md rounded-xl border border-[#E8E2D8]">
                <div className="text-xs font-bold text-[#121316]">MFT Courier Dedicated Driver</div>
                <div className="text-[11px] text-[#5C616D] font-mono">
                  Personal point of contact from collection to recipient drop-off
                </div>
              </div>
            </div>

            {/* In-Cabin POV thumbnail */}
            <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8] flex items-center gap-4">
              <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-[#E3DBD0]">
                <img
                  src="/assets/aistudio/img_3_4f352be2.webp"
                  alt="MFT Courier in-cabin direct dispatch navigation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-0.5 text-xs">
                <div className="font-bold text-[#121316]">Direct Route Navigation</div>
                <div className="text-[11px] text-[#5C616D]">
                  Non-stop route planning straight from Manchester to destination address.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
