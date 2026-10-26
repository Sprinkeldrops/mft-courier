import React, { useState } from 'react';
import { MessageSquare, Phone, MapPin, ArrowUpRight, Check } from 'lucide-react';
import { AntiGravityCanvas } from './AntiGravityCanvas';
import { COMPANY_DETAILS } from '../data/courierData';

interface QuoteSectionProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ onOpenPrivacy, onOpenTerms }) => {
  const [collection, setCollection] = useState('OL8');
  const [destination, setDestination] = useState('');
  const [cargoType, setCargoType] = useState('Commercial Boxes / Palletised Stock');
  const [vehicle, setVehicle] = useState('Medium Sprinter Van');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [urgency, setUrgency] = useState('Same-Day');

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedMessage = `Hello MFT Courier, I would like to request a delivery quotation:

• Collection: ${collection || 'Greater Manchester (OL8)'}
• Destination: ${destination || 'UK Destination'}
• Vehicle Required: ${vehicle}
• Service Urgency: ${urgency}
• Cargo Description: ${cargoType || 'Commercial consignment'}
• Name: ${name || 'Customer'}
• Contact Phone: ${phone || 'Provided via WhatsApp'}

Please let me know availability and pricing.`;

    const url = `https://wa.me/447501419198?text=${encodeURIComponent(formattedMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="quote" className="py-20 lg:py-28 bg-[#FAF8F5] border-b border-[#E8E2D8] relative overflow-hidden">
      {/* Floating Anti-Gravity Particles Background */}
      <AntiGravityCanvas className="absolute inset-0 pointer-events-none opacity-40" particleCount={35} variant="lime" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct CTA Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono text-[#65A30D] uppercase tracking-wider font-semibold">
              Fast Quotation &amp; Booking
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#121316] tracking-tight leading-[1.08] text-balance">
              WHAT NEEDS MOVING?
            </h2>

            <p className="text-base text-[#4A4E57] leading-relaxed">
              Tell us about your delivery. Let's discuss the right solution. Direct vehicle deployment from Greater Manchester.
            </p>

            <div className="p-6 bg-[#F4EFE6] rounded-2xl border border-[#E8E2D8] space-y-4">
              <div className="text-xs font-mono font-bold text-[#121316] uppercase tracking-wider">
                Direct Contact Details
              </div>

              <div className="space-y-3 text-xs font-mono">
                <a
                  href={`tel:${COMPANY_DETAILS.phoneInternational}`}
                  className="flex items-center gap-3 text-[#121316] hover:text-[#84CC16] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#84CC16] shrink-0" />
                  <span>Call Dispatch: {COMPANY_DETAILS.phone}</span>
                </a>

                <div className="flex items-center gap-3 text-[#4A4E57]">
                  <MapPin className="w-4 h-4 text-[#84CC16] shrink-0" />
                  <span>Location: {COMPANY_DETAILS.location}</span>
                </div>

                <a
                  href={`mailto:${COMPANY_DETAILS.email}`}
                  className="flex items-center gap-3 text-[#4A4E57] hover:text-[#121316] transition-colors"
                >
                  <span className="w-4 h-4 text-center font-bold text-[#84CC16] shrink-0">@</span>
                  <span>Email: {COMPANY_DETAILS.email}</span>
                </a>

                <div className="flex items-center gap-3 text-[#65A30D] font-bold">
                  <MessageSquare className="w-4 h-4 text-[#84CC16] shrink-0" />
                  <span>WhatsApp: Immediate Vehicle Assignment</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#5C616D]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#84CC16] shrink-0" />
                <span>Immediate direct quote response via WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#84CC16] shrink-0" />
                <span>Dedicated vehicles departing from OL8 Greater Manchester</span>
              </div>
            </div>
          </div>

          {/* Right Column: WhatsApp Quote Form */}
          <div className="lg:col-span-7 bg-[#F4EFE6] p-8 sm:p-10 rounded-3xl border border-[#E8E2D8]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3DBD0] mb-6">
              <span className="text-xs font-mono font-bold text-[#121316] uppercase tracking-wider">
                DISPATCH REQUEST / QUOTE ENQUIRY
              </span>
              <span className="text-[11px] font-mono text-[#65A30D] flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#84CC16]" />
                WhatsApp Direct Link
              </span>
            </div>

            <form onSubmit={handleWhatsAppSubmit} className="space-y-5">
              {/* Collection & Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#4A4E57] mb-1.5 uppercase">
                    Collection Area / Postcode *
                  </label>
                  <input
                    type="text"
                    required
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    placeholder="e.g. OL8, M1, Manchester"
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl text-sm text-[#121316] focus:outline-none focus:border-[#121316] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#4A4E57] mb-1.5 uppercase">
                    Delivery Destination Postcode *
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. London EC1, Leeds LS1, B24"
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl text-sm text-[#121316] focus:outline-none focus:border-[#121316] font-mono"
                  />
                </div>
              </div>

              {/* Vehicle Selection & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#4A4E57] mb-1.5 uppercase">
                    Vehicle Type Required
                  </label>
                  <select
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl text-sm text-[#121316] focus:outline-none focus:border-[#121316]"
                  >
                    <option value="Small Courier Van (Up to 400kg)">Small Express Van (Up to 400kg)</option>
                    <option value="Medium High-Roof Sprinter (Up to 900kg)">Medium Sprinter (Up to 900kg / 3 Pallets)</option>
                    <option value="3.5t Luton Box Van with Tail-Lift (Up to 1100kg)">3.5t Luton with Tail-Lift (Up to 1100kg / 6 Pallets)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#4A4E57] mb-1.5 uppercase">
                    Transit Urgency
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl text-sm text-[#121316] focus:outline-none focus:border-[#121316]"
                  >
                    <option value="Same-Day Dedicated">Same-Day Urgent Dedicated</option>
                    <option value="Next-Day Scheduled">Next-Day Scheduled</option>
                    <option value="Overnight Delivery">Overnight Delivery</option>
                    <option value="Scheduled Contract Run">Scheduled Contract Run</option>
                  </select>
                </div>
              </div>

              {/* Cargo Description */}
              <div>
                <label className="block text-xs font-mono text-[#4A4E57] mb-1.5 uppercase">
                  Cargo Description & Approximate Weight
                </label>
                <input
                  type="text"
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value)}
                  placeholder="e.g. 2 pallets, machinery spares, urgent cartons"
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl text-sm text-[#121316] focus:outline-none focus:border-[#121316]"
                />
              </div>

              {/* Customer Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#4A4E57] mb-1.5 uppercase">
                    Your Name / Company
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe / Apex Ltd"
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl text-sm text-[#121316] focus:outline-none focus:border-[#121316]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#4A4E57] mb-1.5 uppercase">
                    Your Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 07123 456789"
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl text-sm text-[#121316] font-mono focus:outline-none focus:border-[#121316]"
                  />
                </div>
              </div>

              {/* WhatsApp Submit Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#121316] hover:bg-[#23252A] rounded-xl flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer group"
                >
                  <MessageSquare className="w-5 h-5 text-[#84CC16]" />
                  <span>Send Quote Request on WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4 text-[#84CC16] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#5C616D] font-mono gap-2 pt-1">
                <span>Direct delivery dispatch &bull; 07501419198</span>
                <div className="flex items-center gap-2">
                  {onOpenTerms && (
                    <button
                      type="button"
                      onClick={onOpenTerms}
                      className="text-[#121316] underline hover:text-[#84CC16] cursor-pointer"
                    >
                      Terms of Carriage
                    </button>
                  )}
                  <span>&bull;</span>
                  {onOpenPrivacy && (
                    <button
                      type="button"
                      onClick={onOpenPrivacy}
                      className="text-[#121316] underline hover:text-[#84CC16] cursor-pointer"
                    >
                      Privacy Policy
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
