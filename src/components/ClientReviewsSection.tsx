import React, { useState, useEffect, useCallback } from 'react';
import { Star, CheckCircle, ArrowLeft, ArrowRight, Quote, MessageSquare } from 'lucide-react';
import { CLIENT_REVIEWS, COMPANY_DETAILS } from '../data/courierData';

export const ClientReviewsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const reviewsCount = CLIENT_REVIEWS.length;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? reviewsCount - 1 : prev - 1));
  }, [reviewsCount]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === reviewsCount - 1 ? 0 : prev + 1));
  }, [reviewsCount]);

  // Auto-play carousel every 6 seconds unless hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [handleNext, isPaused]);

  const currentReview = CLIENT_REVIEWS[currentIndex];

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-[#FAF8F5] border-b border-[#E8E2D8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-mono text-[#65A30D] uppercase tracking-wider font-semibold">
              Verified Client Feedback
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#121316] tracking-tight">
              Trusted by UK Facilities &amp; Businesses
            </h2>
            <p className="text-base text-[#4A4E57] leading-relaxed">
              Read how precision manufacturers, diagnostic labs, and retail suppliers depend on MFT Courier for direct, time-critical road transport.
            </p>
          </div>

          {/* Rating Summary + Carousel Controls (◁ / ▷) */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="p-3.5 bg-[#F4EFE6] rounded-2xl border border-[#E8E2D8] flex items-center gap-3">
              <div className="flex text-[#84CC16]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div className="text-xs font-mono">
                <span className="font-bold text-[#121316]">5.0 / 5.0</span>
                <span className="text-[#7A808C] block text-[10px]">Client Satisfaction</span>
              </div>
            </div>

            {/* Prev & Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-11 h-11 rounded-xl bg-[#F4EFE6] border border-[#E8E2D8] hover:bg-[#121316] hover:text-white transition-all flex items-center justify-center text-[#121316] shadow-sm cursor-pointer"
                aria-label="Previous review"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-11 h-11 rounded-xl bg-[#121316] hover:bg-[#23252A] text-white transition-all flex items-center justify-center shadow-sm cursor-pointer"
                aria-label="Next review"
              >
                <ArrowRight className="w-4 h-4 text-[#84CC16]" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Display Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="bg-[#F4EFE6] rounded-3xl border border-[#E8E2D8] p-8 sm:p-12 lg:p-14 shadow-md relative overflow-hidden transition-all duration-500">
            
            {/* Background Decorative Quote Mark */}
            <div className="absolute top-6 right-8 text-[#E8E2D8] pointer-events-none opacity-40">
              <Quote className="w-32 h-32" />
            </div>

            <div className="relative z-10 space-y-6 max-w-4xl">
              
              {/* Stars & Transit Corridor */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex text-[#84CC16]">
                    {[...Array(currentReview.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-[#5C616D] font-bold">
                    (5.0 Verified Score)
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-[#E8E2D8] text-xs font-mono text-[#65A30D] font-bold">
                  <span>Corridor: {currentReview.location}</span>
                </div>
              </div>

              {/* Review Comment Quote */}
              <blockquote className="text-lg sm:text-2xl font-medium text-[#121316] leading-relaxed italic font-sans">
                "{currentReview.comment}"
              </blockquote>

              {/* Author & Service Info */}
              <div className="pt-6 border-t border-[#E3DBD0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-base font-bold text-[#121316] font-display">
                    {currentReview.name}
                  </div>
                  <div className="text-xs text-[#5C616D] mt-0.5">
                    {currentReview.role} &bull; <strong className="text-[#121316]">{currentReview.company}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="p-2 bg-white rounded-lg border border-[#E8E2D8] text-[#5C616D]">
                    {currentReview.serviceUsed}
                  </div>
                  <div className="flex items-center gap-1.5 text-[#65A30D] font-bold bg-[#84CC16]/10 px-2.5 py-1.5 rounded-lg border border-[#84CC16]/30">
                    <CheckCircle className="w-3.5 h-3.5 text-[#84CC16]" />
                    <span>Verified Delivery</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex items-center justify-center gap-2.5 mt-8">
            {CLIENT_REVIEWS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'w-8 bg-[#121316]'
                    : 'w-2.5 bg-[#D3CCC0] hover:bg-[#84CC16]'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
