import React from 'react';
import { MessageSquare, Truck, Navigation, CheckCircle2 } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Request a Quote',
      desc: 'Send your collection postcode, delivery address, and load requirements directly via WhatsApp or phone call to 07501419198.',
      icon: MessageSquare,
    },
    {
      num: '02',
      title: 'Vehicle Allocation',
      desc: 'We allocate the appropriate dedicated vehicle—small van, sprinter, or 3.5t Luton box van with tail-lift—based in Greater Manchester.',
      icon: Truck,
    },
    {
      num: '03',
      title: 'Direct Drive Transit',
      desc: 'Your consignment is collected and transported directly to its destination. The vehicle carries only your goods with no depot stops.',
      icon: Navigation,
    },
    {
      num: '04',
      title: 'Proof of Handover',
      desc: 'Upon arrival at the destination address, goods are safely unloaded and signed for with direct confirmation provided back to you.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#FAF8F5] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <div className="text-xs font-mono text-[#65A30D] uppercase tracking-wider font-semibold">
            Clear Delivery Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#121316] tracking-tight">
            How MFT Courier Works
          </h2>
          <p className="text-base text-[#4A4E57] leading-relaxed">
            A straightforward four-step process engineered to eliminate unnecessary handoffs and deliver peace of mind.
          </p>
        </div>

        {/* 4 Steps Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="p-7 bg-[#F4EFE6] rounded-2xl border border-[#E8E2D8] flex flex-col justify-between space-y-6 hover:border-[#121316]/30 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#65A30D]">
                      STEP {st.num}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#E8E2D8] flex items-center justify-center text-[#121316] group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4 text-[#121316]" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#121316] group-hover:text-[#84CC16] transition-colors">
                    {st.title}
                  </h3>

                  <p className="text-xs text-[#5C616D] leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8E2D8]/70 flex items-center gap-1.5 text-[11px] font-mono text-[#7B808B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                  <span>Direct MFT Courier handover</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Handover Banner Feature */}
        <div className="relative rounded-3xl overflow-hidden border border-[#E8E2D8] bg-[#F4EFE6] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 p-8 sm:p-12 space-y-4">
              <span className="text-xs font-mono text-[#65A30D] uppercase font-bold tracking-wider">
                Direct Handover Guarantee
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#121316]">
                Signed Proof of Delivery Every Journey
              </h3>
              <p className="text-sm text-[#4A4E57] leading-relaxed">
                Our drivers in professional MFT Courier hi-vis attire verify goods on loading and obtain direct signatures upon delivery, transmitting confirmation immediately to you.
              </p>
              <div className="pt-2 font-mono text-xs text-[#121316] font-semibold">
                ✓ No unattended doorstep drop-offs &bull; Direct recipient verification
              </div>
            </div>
            <div className="lg:col-span-7 h-80 sm:h-96 lg:h-[440px] relative overflow-hidden">
              <img
                src="/assets/aistudio/img6_255497cd.webp"
                alt="MFT Courier driver in hi-vis vest handing delivery parcel directly to client from van"
                className="w-full h-full object-cover object-[center_top]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#F4EFE6] via-transparent to-transparent hidden lg:block pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
