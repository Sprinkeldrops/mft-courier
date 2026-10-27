import React from 'react';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { COMPANY_DETAILS, VERIFIED_SERVICES } from '../data/courierData';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenTrack?: () => void;
  onOpenDriver?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenTrack,
  onOpenDriver,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-[#121316] text-[#A6ABB7] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-12">
          {/* Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#84CC16] inline-block" />
              <span>MFT COURIER</span>
            </div>
            <p className="text-xs text-[#8A909E] leading-relaxed max-w-sm">
              Dedicated courier and road freight logistics solutions engineered around your delivery deadlines. Operating from Greater Manchester (OL8) to commercial destinations across Great Britain.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={COMPANY_DETAILS.whatsappQuoteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1F2228] border border-[#2D313A] text-white hover:border-[#84CC16] transition-colors text-xs font-mono"
              >
                <span className="w-2 h-2 rounded-full bg-[#84CC16]" />
                <span>24/7 WhatsApp Dispatch Desk</span>
              </a>
            </div>
          </div>

          {/* Logistics Services */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs font-mono uppercase tracking-wider">
              Services
            </div>
            <ul className="space-y-2 text-xs">
              {VERIFIED_SERVICES.map((s) => (
                <li key={s.id}>
                  <a href="#services" className="hover:text-white transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs font-mono uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#introduction" className="hover:text-white transition-colors">
                  Introduction
                </a>
              </li>
              <li>
                <a href="#difference" className="hover:text-white transition-colors">
                  The MFT Difference
                </a>
              </li>
              <li>
                <a href="#coverage" className="hover:text-white transition-colors">
                  UK Transit Corridors
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">
                  Client Reviews
                </a>
              </li>
              <li>
                <a href="#quote" className="hover:text-white transition-colors">
                  Get a Quote
                </a>
              </li>
              <li className="pt-2 border-t border-[#23252A]">
                <button
                  type="button"
                  onClick={onOpenTrack}
                  className="hover:text-white text-[#84CC16] font-mono text-left transition-colors cursor-pointer"
                >
                  &bull; Track Consignment (Live Map)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenDriver}
                  className="hover:text-white text-left transition-colors cursor-pointer"
                >
                  &bull; Driver Portal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="hover:text-white text-left transition-colors cursor-pointer"
                >
                  &bull; Dispatch Desk (Admin)
                </button>
              </li>
            </ul>
          </div>

          {/* Operational Contact */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs font-mono uppercase tracking-wider">
              Manchester Hub
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-white font-mono">
                <MapPin className="w-3.5 h-3.5 text-[#84CC16] shrink-0" />
                <span>{COMPANY_DETAILS.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#84CC16] shrink-0" />
                <a
                  href={`tel:${COMPANY_DETAILS.phoneInternational}`}
                  className="font-mono text-white hover:text-[#84CC16] transition-colors"
                >
                  {COMPANY_DETAILS.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#84CC16] shrink-0" />
                <a
                  href={`mailto:${COMPANY_DETAILS.email}`}
                  className="font-mono text-[#D1D5DE] hover:text-white transition-colors"
                >
                  {COMPANY_DETAILS.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with legal and copyright */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#7B808B]">
          <div>
            © {new Date().getFullYear()} {COMPANY_DETAILS.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenTerms}
              className="hover:text-white underline transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span aria-hidden="true">&bull;</span>
            <button
              onClick={onOpenPrivacy}
              className="hover:text-white underline transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true">&bull;</span>
            <a
              href={COMPANY_DETAILS.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#1877F2] transition-colors flex items-center gap-1"
            >
              <span>Facebook</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
