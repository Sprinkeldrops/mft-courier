import React, { useEffect, useRef } from 'react';
import { MapPin, Phone, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/courierData';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const IntroductionSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const imgEl = imageRef.current;
    const contentEl = contentRef.current;

    if (!section || !imgEl || !contentEl) return;

    const ctx = gsap.context(() => {
      // Image reveal with subtle scale settle
      gsap.fromTo(
        imgEl,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Staggered text & info card elements reveal
      const items = contentEl.querySelectorAll('.gsap-reveal');
      gsap.fromTo(
        items,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.14,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="introduction"
      className="py-20 lg:py-28 bg-[#FAF8F5] border-b border-[#E8E2D8] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Authentic MFT Courier Photography */}
          <div ref={imageRef} className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#E3DBD0] bg-[#EFECE5] shadow-xl group">
              <img
                src="/assets/aistudio/imggggg_e7b46986.jpg"
                alt="MFT Courier UK headquarters, express courier vans, and motorway logistics"
                className="w-full h-80 sm:h-[440px] object-cover transition-transform duration-700 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121316]/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-md rounded-xl border border-[#E8E2D8] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-[#65A30D] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#84CC16]" />
                    <span>MFT COURIER HEADQUARTERS</span>
                  </div>
                  <div className="text-xs font-semibold text-[#121316] mt-0.5">
                    OL8, Greater Manchester, UK
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-[10px] text-[#7A808C]">DIRECT DISPATCH</div>
                  <a
                    href={`tel:${COMPANY_DETAILS.phoneInternational}`}
                    className="text-xs font-bold text-[#121316] hover:text-[#84CC16] transition-colors"
                  >
                    {COMPANY_DETAILS.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Text Content with GSAP Reveal */}
          <div ref={contentRef} className="lg:col-span-7 space-y-6">
            <div className="gsap-reveal text-xs font-mono text-[#65A30D] uppercase tracking-wider font-semibold">
              Editorial Overview
            </div>

            <h2 className="gsap-reveal text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#121316] tracking-tight leading-tight">
              Dedicated Courier Solutions from Greater Manchester to Across the UK
            </h2>

            <p className="gsap-reveal text-base text-[#4A4E57] leading-relaxed">
              Based in the OL8 area of Greater Manchester, <strong>MFT Courier</strong> provides dedicated road transport and courier solutions tailored directly to customer specifications. Whether moving urgent documents, commercial retail inventory, or multi-pallet freight, we prioritize direct point-to-point transit.
            </p>

            <p className="gsap-reveal text-base text-[#4A4E57] leading-relaxed">
              By operating direct dedicated routes rather than routing consignments through multi-layered hub-and-spoke sortation networks, your deliveries arrive without unnecessary handovers, delays, or risk of misplacement.
            </p>

            {/* Business Information Cards */}
            <div className="gsap-reveal grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#F4EFE6] rounded-xl border border-[#E5DFD4] space-y-1">
                <div className="text-[11px] font-mono text-[#7B808B] uppercase">BASE LOCATION</div>
                <div className="text-sm font-bold text-[#121316] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#84CC16]" />
                  <span>OL8, Greater Manchester</span>
                </div>
                <div className="text-xs text-[#5C616D]">Arterial access to M60, M62 & M6</div>
              </div>

              <div className="p-4 bg-[#F4EFE6] rounded-xl border border-[#E5DFD4] space-y-1">
                <div className="text-[11px] font-mono text-[#7B808B] uppercase">DIRECT TELEPHONE</div>
                <div className="text-sm font-bold text-[#121316] flex items-center gap-1.5 font-mono">
                  <Phone className="w-4 h-4 text-[#84CC16]" />
                  <span>{COMPANY_DETAILS.phone}</span>
                </div>
                <div className="text-xs text-[#5C616D]">Direct dispatcher line (24/7)</div>
              </div>
            </div>

            <div className="gsap-reveal pt-2 flex flex-wrap items-center gap-6">
              <a
                href="#difference"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#121316] hover:text-[#84CC16] transition-colors"
              >
                <span>Read about the MFT Difference</span>
                <ArrowRight className="w-4 h-4 text-[#84CC16]" />
              </a>
              <span className="text-[#D3CCC0] hidden sm:inline">&bull;</span>
              <a
                href={`${COMPANY_DETAILS.whatsappQuoteUrl}?text=${encodeURIComponent('Hello MFT Courier, I would like to request an immediate quote from Manchester OL8.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#65A30D] hover:underline"
              >
                <span>Speak with OL8 Dispatch &rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
