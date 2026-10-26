import React, { useState } from 'react';
import { ArrowUpRight, Check, MessageSquare, Clock, Calendar, Truck, ShieldCheck, MapPin, Box } from 'lucide-react';
import { VERIFIED_SERVICES, COMPANY_DETAILS, ServiceDefinition } from '../data/courierData';

export const ServicesSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceDefinition>(VERIFIED_SERVICES[0]);

  const getServiceWhatsAppUrl = (serviceTitle: string) => {
    return `${COMPANY_DETAILS.whatsappQuoteUrl}?text=${encodeURIComponent(
      `Hello MFT Courier, I would like to request a quote for your ${serviceTitle} service.`
    )}`;
  };

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#FAF8F5] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-3">
          <div className="text-xs font-mono text-[#65A30D] uppercase tracking-wider font-semibold">
            04 · Logistics Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#121316] tracking-tight">
            Courier & Freight Services
          </h2>
          <p className="text-base text-[#4A4E57] leading-relaxed">
            Tailored road transport options structured around your cargo volume and arrival deadlines.
          </p>
        </div>

        {/* Asymmetric Interactive Layout: Left Menu List + Right Spotlight Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Service Selectors */}
          <div className="lg:col-span-5 space-y-2">
            {VERIFIED_SERVICES.map((srv) => {
              const isSelected = selectedService.id === srv.id;
              return (
                <button
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#121316] text-white border-[#121316] shadow-md'
                      : 'bg-[#F4EFE6] text-[#121316] border-[#E8E2D8] hover:border-[#121316]/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold ${isSelected ? 'text-[#84CC16]' : 'text-[#65A30D]'}`}>
                        {srv.num}.
                      </span>
                      <span className="text-sm font-bold tracking-tight">{srv.title}</span>
                    </div>
                    <p className={`text-xs ${isSelected ? 'text-neutral-400' : 'text-[#5C616D]'} line-clamp-1`}>
                      {srv.summary}
                    </p>
                  </div>
                  <span className={`w-2 h-2 rounded-full transition-transform ${isSelected ? 'bg-[#84CC16] scale-125' : 'bg-transparent'}`} />
                </button>
              );
            })}
          </div>

          {/* Right: Selected Service Detailed Spotlight */}
          <div className="lg:col-span-7 bg-[#F4EFE6] rounded-3xl border border-[#E8E2D8] p-8 sm:p-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3DBD0]">
              <span className="text-xs font-mono font-bold text-[#65A30D] uppercase tracking-wider">
                SERVICE SPECIFICATION {selectedService.num}
              </span>
              <span className="text-xs font-mono text-[#7A808C]">MFT Courier UK</span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#121316] tracking-tight">
                {selectedService.title}
              </h3>
              <p className="text-sm sm:text-base font-medium text-[#4A4E57] mt-2">
                {selectedService.summary}
              </p>
            </div>

            <p className="text-sm text-[#4A4E57] leading-relaxed">
              {selectedService.description}
            </p>

            {/* Highlights bullet list */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono text-[#7B808B] uppercase tracking-wider">
                SERVICE HIGHLIGHTS
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedService.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-[#121316] font-medium bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E2D8]">
                    <Check className="w-4 h-4 text-[#84CC16] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Quote Button for this Service */}
            <div className="pt-4 border-t border-[#E3DBD0] flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-[#5C616D]">
                Speak to our OL8 dispatch team for rates on this service.
              </div>
              <a
                href={getServiceWhatsAppUrl(selectedService.title)}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#121316] hover:bg-[#23252A] rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#84CC16]" />
                <span>Quote for {selectedService.title}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#84CC16]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
