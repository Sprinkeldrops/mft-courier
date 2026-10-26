import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, MessageSquare, Check, ShieldCheck, Clock, Zap } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/courierData';

export interface ServiceSlide {
  id: string;
  name: string;
  category: string;
  tagline: string;
  des: string;
  bgImage: string;
  speed: string;
  capacity: string;
  whatsappText: string;
}

const INITIAL_SLIDES: ServiceSlide[] = [
  {
    id: 'same-day',
    name: 'Same-Day Dedicated Courier',
    category: 'Urgent Point-to-Point UK Express',
    tagline: 'Direct Dispatch from Greater Manchester OL8 Hub',
    des: 'When tomorrow is too late. Our dedicated vehicle is allocated solely for your load, collecting in under 45 minutes and driving non-stop to your recipient with zero depot sortation.',
    bgImage: '/assets/aistudio/img_1_fb94b13d.webp',
    speed: 'Direct Immediate Transit',
    capacity: 'Small Van to 3.5t Luton',
    whatsappText: 'Hello MFT Courier, I require an immediate quotation for Same-Day Dedicated Courier service from Manchester OL8.',
  },
  {
    id: 'next-day',
    name: 'Next-Day UK Delivery',
    category: 'Scheduled Commercial Road Freight',
    tagline: 'Guaranteed Arrival Across Mainland Britain',
    des: 'Cost-effective, reliable planned courier transport for businesses requiring guaranteed next-working-day arrival for pallets, equipment, and boxed retail merchandise.',
    bgImage: '/assets/aistudio/imggggg_e7b46986.jpg',
    speed: 'Next-Day AM/PM Slots',
    capacity: 'All Vehicle Classifications',
    whatsappText: 'Hello MFT Courier, I would like to book a Next-Day UK Scheduled Delivery run.',
  },
  {
    id: 'urgent-freight',
    name: 'Urgent & Critical Transport',
    category: 'Time-Critical Emergency Logistics',
    tagline: 'Aircraft On Ground, Medical & Assembly Line Support',
    des: 'High-priority transport for manufacturing lines, engineering parts, and critical medical items where a missing component halts an entire facility.',
    bgImage: '/assets/aistudio/img_2_6835a0f1.webp',
    speed: '45-Min Collection Window',
    capacity: 'Dedicated Driver with GPS Tracking',
    whatsappText: 'Hello MFT Courier, I have an Urgent & Critical shipment requiring immediate vehicle dispatch.',
  },
  {
    id: 'luton-taillift',
    name: 'Luton Van with Tail-Lift',
    category: 'Heavy Freight & Pallet Distribution',
    tagline: 'Hydraulic 500kg Cantilever Loading',
    des: 'Substantial cubic volume for high-capacity freight. Equipped with 500kg hydraulic cantilever tail-lifts for safe ground-level loading where forklifts are unavailable.',
    bgImage: '/assets/aistudio/img6_255497cd.webp',
    speed: 'Direct Same-Day or Scheduled',
    capacity: 'Up to 6 Euro/UK Pallets (1,100kg)',
    whatsappText: 'Hello MFT Courier, I would like to request a quotation for a 3.5t Luton Box Van with Tail-Lift.',
  },
  {
    id: 'final-mile',
    name: 'Final-Mile Logistics',
    category: 'Regional Distribution & Contract Runs',
    tagline: 'Precision Gateway Across the North West',
    des: 'Specialised regional delivery drops to commercial addresses, retail parks, and manufacturing facilities across Greater Manchester, Lancashire, and Yorkshire.',
    bgImage: '/assets/aistudio/img5_1d70229f.webp',
    speed: 'Daily Scheduled Runs',
    capacity: 'Multi-Drop & Inter-Branch',
    whatsappText: 'Hello MFT Courier, I would like to discuss Final-Mile regional distribution or scheduled contract runs.',
  },
];

export const DeliveryServicesSlider: React.FC = () => {
  const [slides, setSlides] = useState<ServiceSlide[]>(INITIAL_SLIDES);
  const [isAnimating, setIsAnimating] = useState(false);

  // Cycle Next: Move first item to back
  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlides((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  // Cycle Prev: Move last item to front
  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlides((prev) => {
      const last = prev[prev.length - 1];
      const rest = prev.slice(0, prev.length - 1);
      return [last, ...rest];
    });
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const activeSlide = slides[1] || slides[0];

  return (
    <section id="speed-tiers" className="py-20 lg:py-28 bg-[#FAF8F5] border-b border-[#E8E2D8] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-mono text-[#65A30D] uppercase tracking-wider font-semibold flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#84CC16]" />
              <span>DISPATCH SPEED TIERS &amp; VEHICLE FLEET</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#121316] tracking-tight">
              Express Delivery Options
            </h2>
            <p className="text-base text-[#4A4E57] leading-relaxed">
              Explore our core nationwide transit options. Browse through same-day, next-day, and heavy tail-lift freight solutions built around your timeline.
            </p>
          </div>

          {/* Navigation Controls (◁ / ▷) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handlePrev}
              disabled={isAnimating}
              className="w-12 h-12 rounded-xl bg-[#F4EFE6] border border-[#E8E2D8] hover:bg-[#121316] hover:text-white transition-all flex items-center justify-center text-[#121316] shadow-sm cursor-pointer disabled:opacity-50"
              aria-label="Previous service"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={isAnimating}
              className="w-12 h-12 rounded-xl bg-[#121316] hover:bg-[#23252A] text-white transition-all flex items-center justify-center shadow-sm cursor-pointer disabled:opacity-50"
              aria-label="Next service"
            >
              <ArrowRight className="w-5 h-5 text-[#84CC16]" />
            </button>
          </div>
        </div>

        {/* Interactive Expandable Card-Stack Slider Container */}
        <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[620px] rounded-3xl overflow-hidden shadow-2xl bg-[#121316] border border-[#E3DBD0]">
          
          {slides.map((item, index) => {
            const isHero = index === 0 || index === 1;
            const isSecond = index === 1;

            return (
              <div
                key={item.id}
                className="absolute transition-all duration-700 ease-out rounded-2xl overflow-hidden"
                style={{
                  top: isHero ? 0 : '50%',
                  left: isHero
                    ? 0
                    : index === 2
                    ? '56%'
                    : index === 3
                    ? 'calc(56% + 190px)'
                    : index === 4
                    ? 'calc(56% + 380px)'
                    : 'calc(56% + 570px)',
                  transform: isHero ? 'translate(0, 0)' : 'translate(0, -50%)',
                  width: isHero ? '100%' : '170px',
                  height: isHero ? '100%' : '240px',
                  borderRadius: isHero ? '0px' : '18px',
                  zIndex: isHero ? (isSecond ? 2 : 1) : 10 + (slides.length - index),
                  opacity: index >= 5 ? 0 : 1,
                  pointerEvents: isHero ? (isSecond ? 'auto' : 'none') : 'auto',
                  boxShadow: isHero ? 'none' : '0 25px 45px rgba(0,0,0,0.45)',
                }}
                onClick={() => {
                  if (!isHero) {
                    handleNext();
                  }
                }}
              >
                {/* Background Image with Proper Top-Weighted Framing to prevent head cuts */}
                <div
                  className="absolute inset-0 bg-cover bg-[center_top] transition-transform duration-1000 scale-100 hover:scale-105"
                  style={{
                    backgroundImage: `url(${item.bgImage})`,
                  }}
                />

                {/* Overlays */}
                {isHero ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0C1117]/95 via-[#121822]/85 to-transparent/40" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent cursor-pointer group hover:border-2 hover:border-[#84CC16] rounded-2xl transition-all">
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-mono text-[#84CC16] block uppercase tracking-wider">
                        TIER 0{index}
                      </span>
                      <h4 className="text-xs font-bold font-display line-clamp-1">{item.name}</h4>
                    </div>
                  </div>
                )}

                {/* Animated Expanded Content (for active item) */}
                {isSecond && (
                  <div className="absolute top-1/2 left-6 sm:left-14 lg:left-20 transform -translate-y-1/2 max-w-xl text-left text-white z-20 space-y-5 animate-in fade-in duration-500">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-[#84CC16]/40 backdrop-blur-md text-xs font-mono text-[#84CC16] font-bold tracking-wider uppercase">
                      <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse" />
                      <span>{item.category}</span>
                    </div>

                    <h3 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
                      {item.name}
                    </h3>

                    <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed line-clamp-3 sm:line-clamp-4">
                      {item.des}
                    </p>

                    {/* Factual Specification Pills */}
                    <div className="grid grid-cols-2 gap-3 pt-1 font-mono text-xs">
                      <div className="p-3 bg-black/50 backdrop-blur-md rounded-xl border border-white/10">
                        <span className="block text-[10px] text-gray-400 uppercase">TRANSIT PROTOCOL</span>
                        <span className="text-white font-bold">{item.speed}</span>
                      </div>
                      <div className="p-3 bg-black/50 backdrop-blur-md rounded-xl border border-white/10">
                        <span className="block text-[10px] text-gray-400 uppercase">VEHICLE CAPABILITY</span>
                        <span className="text-white font-bold">{item.capacity}</span>
                      </div>
                    </div>

                    {/* Action Button: Opens direct WhatsApp quote */}
                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <a
                        href={`https://wa.me/447501419198?text=${encodeURIComponent(item.whatsappText)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-7 py-4 text-xs font-bold uppercase tracking-wider text-[#121316] bg-[#84CC16] hover:bg-[#A3E635] rounded-xl flex items-center gap-2.5 transition-all shadow-lg shadow-[#84CC16]/20 font-mono cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 text-[#121316]" />
                        <span>Book / Quote for this Tier</span>
                      </a>

                      <a
                        href="#quote"
                        className="px-5 py-4 text-xs font-mono uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all"
                      >
                        Calculate Rates
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Bottom Controls Indicator */}
          <div className="absolute bottom-6 left-6 sm:left-14 lg:left-20 z-30 flex items-center gap-4 font-mono text-xs text-gray-400">
            <span className="text-white font-bold">{activeSlide.name}</span>
            <span>&bull;</span>
            <span className="text-[#84CC16]">Direct from Manchester OL8 Hub</span>
          </div>

        </div>

      </div>
    </section>
  );
};
