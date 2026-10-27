import React, { useState, useRef, useEffect } from 'react';
import { Phone, ArrowUpRight, Menu, X, ChevronDown, Truck, Clock, ShieldCheck, Box, MapPin, Calendar, Zap, MessageSquare, Radio, Navigation, ShieldAlert, Key } from 'lucide-react';
import { COMPANY_DETAILS, VERIFIED_SERVICES, FLEET_VEHICLES } from '../data/courierData';

export interface NavbarProps {
  onOpenTrack?: () => void;
  onOpenDriver?: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTrack,
  onOpenDriver,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [fleetDropdownOpen, setFleetDropdownOpen] = useState(false);
  const [coverageDropdownOpen, setCoverageDropdownOpen] = useState(false);
  const [trackingDropdownOpen, setTrackingDropdownOpen] = useState(false);

  // Mobile accordion toggles
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileFleetOpen, setMobileFleetOpen] = useState(false);
  const [mobileCoverageOpen, setMobileCoverageOpen] = useState(false);
  const [mobileTrackingOpen, setMobileTrackingOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setServicesDropdownOpen(false);
        setFleetDropdownOpen(false);
        setCoverageDropdownOpen(false);
        setTrackingDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getQuoteWhatsAppUrl = `${COMPANY_DETAILS.whatsappQuoteUrl}?text=${encodeURIComponent(
    'Hello MFT Courier, I would like to request an immediate quotation for UK road delivery.'
  )}`;

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D8]" ref={navRef}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 h-20">
        
        {/* Zone 1: Brand Wordmark with subtle lime node */}
        <a
          href="/"
          className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#121316] whitespace-nowrap shrink-0 flex items-center gap-2.5 group"
          aria-label="MFT Courier Homepage"
        >
          <span className="w-3 h-3 rounded-full bg-[#84CC16] inline-block shadow-sm transition-transform group-hover:scale-125" />
          <div className="flex flex-col">
            <span className="font-display leading-none">MFT COURIER</span>
            <span className="text-[9px] font-mono text-[#7B808B] font-semibold tracking-widest uppercase mt-0.5">
              Manchester Hub &bull; All UK
            </span>
          </div>
        </a>

        {/* Zone 2: Professional Dropdown Menus */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono font-medium text-[#4A4E57] tracking-wider uppercase">
          
          {/* Services Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setServicesDropdownOpen(!servicesDropdownOpen);
                setFleetDropdownOpen(false);
                setCoverageDropdownOpen(false);
              }}
              onMouseEnter={() => setServicesDropdownOpen(true)}
              className="flex items-center gap-1.5 py-2 hover:text-[#121316] transition-colors cursor-pointer"
              aria-expanded={servicesDropdownOpen}
            >
              <span>Services</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-[#84CC16]' : ''}`} />
            </button>

            {/* Services Dropdown Mega Menu */}
            {servicesDropdownOpen && (
              <div
                onMouseLeave={() => setServicesDropdownOpen(false)}
                className="absolute top-full left-0 w-80 p-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl shadow-xl space-y-1 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-[#84CC16] uppercase font-mono tracking-wider border-b border-[#E8E2D8]">
                  Transit Speeds &amp; Capabilities
                </div>
                
                <a
                  href="#speed-tiers"
                  onClick={() => setServicesDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4EFE6] transition-colors group"
                >
                  <Clock className="w-4 h-4 text-[#84CC16] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#121316] group-hover:text-[#65A30D]">
                      Same-Day Dedicated Courier
                    </div>
                    <div className="text-[11px] text-[#7A808C] font-sans">
                      Non-stop point-to-point transit from OL8 hub
                    </div>
                  </div>
                </a>

                <a
                  href="#speed-tiers"
                  onClick={() => setServicesDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4EFE6] transition-colors group"
                >
                  <Calendar className="w-4 h-4 text-[#84CC16] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#121316] group-hover:text-[#65A30D]">
                      Next-Day UK Delivery
                    </div>
                    <div className="text-[11px] text-[#7A808C] font-sans">
                      Guaranteed scheduled commercial delivery
                    </div>
                  </div>
                </a>

                <a
                  href="#speed-tiers"
                  onClick={() => setServicesDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4EFE6] transition-colors group"
                >
                  <Zap className="w-4 h-4 text-[#84CC16] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#121316] group-hover:text-[#65A30D]">
                      Urgent &amp; Critical Freight
                    </div>
                    <div className="text-[11px] text-[#7A808C] font-sans">
                      Emergency production parts and medical items
                    </div>
                  </div>
                </a>

                <a
                  href="#services"
                  onClick={() => setServicesDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4EFE6] transition-colors group"
                >
                  <Box className="w-4 h-4 text-[#84CC16] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#121316] group-hover:text-[#65A30D]">
                      Pallet &amp; Heavy Freight (Tail-Lift)
                    </div>
                    <div className="text-[11px] text-[#7A808C] font-sans">
                      Luton box vans with 500kg cantilever lift
                    </div>
                  </div>
                </a>

                <a
                  href="#services"
                  onClick={() => setServicesDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4EFE6] transition-colors group"
                >
                  <Truck className="w-4 h-4 text-[#84CC16] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#121316] group-hover:text-[#65A30D]">
                      Scheduled Contract Runs
                    </div>
                    <div className="text-[11px] text-[#7A808C] font-sans">
                      Recurring inter-branch and B2B shuttles
                    </div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* Fleet Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setFleetDropdownOpen(!fleetDropdownOpen);
                setServicesDropdownOpen(false);
                setCoverageDropdownOpen(false);
              }}
              onMouseEnter={() => setFleetDropdownOpen(true)}
              className="flex items-center gap-1.5 py-2 hover:text-[#121316] transition-colors cursor-pointer"
              aria-expanded={fleetDropdownOpen}
            >
              <span>Fleet Specs</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${fleetDropdownOpen ? 'rotate-180 text-[#84CC16]' : ''}`} />
            </button>

            {fleetDropdownOpen && (
              <div
                onMouseLeave={() => setFleetDropdownOpen(false)}
                className="absolute top-full left-0 w-80 p-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl shadow-xl space-y-1 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-[#84CC16] uppercase font-mono tracking-wider border-b border-[#E8E2D8]">
                  Commercial Fleet Classifications
                </div>

                {FLEET_VEHICLES.map((v) => (
                  <a
                    key={v.id}
                    href="#difference"
                    onClick={() => setFleetDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4EFE6] transition-colors group"
                  >
                    <Truck className="w-4 h-4 text-[#84CC16] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[#121316] group-hover:text-[#65A30D]">
                        {v.name}
                      </div>
                      <div className="text-[11px] text-[#7A808C] font-sans">
                        Payload: {v.payloadKg}kg &bull; {v.palletCapacity} pallet(s)
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* UK Coverage Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setCoverageDropdownOpen(!coverageDropdownOpen);
                setServicesDropdownOpen(false);
                setFleetDropdownOpen(false);
              }}
              onMouseEnter={() => setCoverageDropdownOpen(true)}
              className="flex items-center gap-1.5 py-2 hover:text-[#121316] transition-colors cursor-pointer"
              aria-expanded={coverageDropdownOpen}
            >
              <span>UK Coverage</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${coverageDropdownOpen ? 'rotate-180 text-[#84CC16]' : ''}`} />
            </button>

            {coverageDropdownOpen && (
              <div
                onMouseLeave={() => setCoverageDropdownOpen(false)}
                className="absolute top-full left-0 w-80 p-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl shadow-xl space-y-1 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-[#84CC16] uppercase font-mono tracking-wider border-b border-[#E8E2D8]">
                  Key Motorway Trunk Corridors
                </div>

                <a
                  href="#coverage"
                  onClick={() => setCoverageDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4EFE6] transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-[#84CC16] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#121316]">Greater Manchester (OL8 Central Hub)</div>
                    <div className="text-[11px] text-[#7A808C] font-sans">M60, M62 &amp; M6 Immediate Junctions</div>
                  </div>
                </a>

                <a
                  href="#coverage"
                  onClick={() => setCoverageDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4EFE6] transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-[#84CC16] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#121316]">London &amp; South East</div>
                    <div className="text-[11px] text-[#7A808C] font-sans">Direct M1 / M6 Dedicated Trunk Route</div>
                  </div>
                </a>

                <a
                  href="#coverage"
                  onClick={() => setCoverageDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4EFE6] transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-[#84CC16] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#121316]">Midlands &amp; Yorkshire</div>
                    <div className="text-[11px] text-[#7A808C] font-sans">Birmingham M6 &bull; Leeds M62 Trans-Pennine</div>
                  </div>
                </a>

                <a
                  href="#coverage"
                  onClick={() => setCoverageDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4EFE6] transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-[#84CC16] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#121316]">Scotland &amp; Northern Gateway</div>
                    <div className="text-[11px] text-[#7A808C] font-sans">Glasgow &amp; Edinburgh via M6 / M74</div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* Live GPS Tracking Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setTrackingDropdownOpen(!trackingDropdownOpen);
                setServicesDropdownOpen(false);
                setFleetDropdownOpen(false);
                setCoverageDropdownOpen(false);
              }}
              onMouseEnter={() => setTrackingDropdownOpen(true)}
              className="flex items-center gap-1.5 py-2 hover:text-[#121316] transition-colors cursor-pointer text-[#121316] font-bold"
              aria-expanded={trackingDropdownOpen}
            >
              <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse" />
              <span>Live Tracking</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${trackingDropdownOpen ? 'rotate-180 text-[#84CC16]' : ''}`} />
            </button>

            {trackingDropdownOpen && (
              <div
                onMouseLeave={() => setTrackingDropdownOpen(false)}
                className="absolute top-full left-0 w-80 p-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl shadow-xl space-y-1 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-[#84CC16] uppercase font-mono tracking-wider border-b border-[#E8E2D8]">
                  Telemetry &amp; Fleet Operations
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTrackingDropdownOpen(false);
                    onOpenTrack?.();
                  }}
                  className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4EFE6] transition-colors group cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-[#84CC16] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#121316] group-hover:text-[#65A30D] flex items-center gap-1.5">
                      <span>Track Consignment</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#84CC16]/20 text-[#65A30D] font-mono">Live</span>
                    </div>
                    <div className="text-[11px] text-[#7A808C] font-sans">
                      Public customer map &bull; Real-time GPS &bull; 5-day lifespan
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTrackingDropdownOpen(false);
                    onOpenDriver?.();
                  }}
                  className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4EFE6] transition-colors group cursor-pointer"
                >
                  <Key className="w-4 h-4 text-[#84CC16] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#121316] group-hover:text-[#65A30D]">
                      Driver Portal
                    </div>
                    <div className="text-[11px] text-[#7A808C] font-sans">
                      Secure mobile console &bull; Persistent auto-broadcast
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTrackingDropdownOpen(false);
                    onOpenAdmin?.();
                  }}
                  className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4EFE6] transition-colors group cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-[#84CC16] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#121316] group-hover:text-[#65A30D]">
                      Dispatch Operations
                    </div>
                    <div className="text-[11px] text-[#7A808C] font-sans">
                      Driver management &bull; Create tracking links
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <a href="#difference" className="hover:text-[#121316] transition-colors whitespace-nowrap shrink-0 py-2">
            The Difference
          </a>
          <a href="#how-it-works" className="hover:text-[#121316] transition-colors whitespace-nowrap shrink-0 py-2">
            How It Works
          </a>
          <a href="#reviews" className="hover:text-[#121316] transition-colors whitespace-nowrap shrink-0 py-2">
            Reviews
          </a>
        </nav>

        {/* Zone 3: Direct Phone & Primary WhatsApp CTA (No Facebook) */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <a
            href={`tel:${COMPANY_DETAILS.phoneInternational}`}
            className="hidden xl:inline-flex items-center gap-2 text-xs font-mono font-bold text-[#121316] hover:text-[#65A30D] transition-colors bg-[#F4EFE6] px-3.5 py-2.5 rounded-xl border border-[#E3DBD0]"
            title="Call MFT Courier 24/7 Dispatch"
          >
            <Phone className="w-3.5 h-3.5 text-[#84CC16]" />
            <span>{COMPANY_DETAILS.phone}</span>
          </a>

          <a
            href={getQuoteWhatsAppUrl}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#121316] rounded-xl hover:bg-[#23252A] transition-all whitespace-nowrap shrink-0 flex items-center gap-2 group shadow-sm cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#84CC16]" />
            <span>GET A QUOTE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] group-hover:scale-125 transition-transform" />
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-2">
          <a
            href={getQuoteWhatsAppUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 text-xs font-bold text-white bg-[#121316] rounded-md flex items-center gap-1 font-mono"
          >
            <span>QUOTE</span>
            <ArrowUpRight className="w-3 h-3 text-[#84CC16]" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#4A4E57] hover:text-[#121316] focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer with Accordion Sub-Menus */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E8E2D8] bg-[#FAF8F5] px-6 py-6 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-4 duration-200">
          
          {/* Services Mobile Accordion */}
          <div className="border-b border-[#E8E2D8] pb-3">
            <button
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className="w-full flex items-center justify-between text-sm font-bold text-[#121316] py-1"
            >
              <span>Services</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180 text-[#84CC16]' : ''}`} />
            </button>
            {mobileServicesOpen && (
              <div className="pl-3 pt-2 space-y-2 text-xs font-mono text-[#5C616D]">
                <a
                  href="#speed-tiers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#121316]"
                >
                  &bull; Same-Day Dedicated Courier
                </a>
                <a
                  href="#speed-tiers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#121316]"
                >
                  &bull; Next-Day UK Delivery
                </a>
                <a
                  href="#speed-tiers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#121316]"
                >
                  &bull; Urgent &amp; Critical Freight
                </a>
                <a
                  href="#services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#121316]"
                >
                  &bull; 3.5t Luton with Tail-Lift
                </a>
                <a
                  href="#services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#121316]"
                >
                  &bull; Scheduled Contract Runs
                </a>
              </div>
            )}
          </div>

          {/* Fleet Mobile Accordion */}
          <div className="border-b border-[#E8E2D8] pb-3">
            <button
              onClick={() => setMobileFleetOpen(!mobileFleetOpen)}
              className="w-full flex items-center justify-between text-sm font-bold text-[#121316] py-1"
            >
              <span>Fleet Specifications</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileFleetOpen ? 'rotate-180 text-[#84CC16]' : ''}`} />
            </button>
            {mobileFleetOpen && (
              <div className="pl-3 pt-2 space-y-2 text-xs font-mono text-[#5C616D]">
                <a
                  href="#difference"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#121316]"
                >
                  &bull; Small Express Van (400kg)
                </a>
                <a
                  href="#difference"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#121316]"
                >
                  &bull; Medium Sprinter (900kg / 3 Pallets)
                </a>
                <a
                  href="#difference"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#121316]"
                >
                  &bull; 3.5t Luton Box with Tail-Lift (1,100kg / 6 Pallets)
                </a>
              </div>
            )}
          </div>

          {/* Coverage Mobile Accordion */}
          <div className="border-b border-[#E8E2D8] pb-3">
            <button
              onClick={() => setMobileCoverageOpen(!mobileCoverageOpen)}
              className="w-full flex items-center justify-between text-sm font-bold text-[#121316] py-1"
            >
              <span>UK Coverage &amp; Hubs</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileCoverageOpen ? 'rotate-180 text-[#84CC16]' : ''}`} />
            </button>
            {mobileCoverageOpen && (
              <div className="pl-3 pt-2 space-y-2 text-xs font-mono text-[#5C616D]">
                <a
                  href="#coverage"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#121316]"
                >
                  &bull; Greater Manchester (OL8 Hub)
                </a>
                <a
                  href="#coverage"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#121316]"
                >
                  &bull; London &amp; Southern Trunk
                </a>
                <a
                  href="#coverage"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#121316]"
                >
                  &bull; Midlands &amp; Yorkshire Corridors
                </a>
                <a
                  href="#coverage"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#121316]"
                >
                  &bull; Scotland Gateway (M6 / M74)
                </a>
              </div>
            )}
          </div>

          {/* Live Tracking Mobile Accordion */}
          <div className="border-b border-[#E8E2D8] pb-3">
            <button
              onClick={() => setMobileTrackingOpen(!mobileTrackingOpen)}
              className="w-full flex items-center justify-between text-sm font-bold text-[#121316] py-1"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse" />
                <span>Live GPS Tracking &amp; Portals</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileTrackingOpen ? 'rotate-180 text-[#84CC16]' : ''}`} />
            </button>
            {mobileTrackingOpen && (
              <div className="pl-3 pt-2 space-y-2 text-xs font-mono text-[#5C616D]">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTrack?.();
                  }}
                  className="w-full text-left py-1 text-[#121316] font-bold hover:text-[#65A30D] flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#84CC16]" />
                  <span>Track Consignment (Public Map)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDriver?.();
                  }}
                  className="w-full text-left py-1 hover:text-[#121316] flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5 text-[#84CC16]" />
                  <span>Driver Portal</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin?.();
                  }}
                  className="w-full text-left py-1 hover:text-[#121316] flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-[#84CC16]" />
                  <span>Dispatch Operations</span>
                </button>
              </div>
            )}
          </div>

          <a
            href="#difference"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-[#121316] hover:text-[#84CC16] py-1 border-b border-[#E8E2D8]"
          >
            The MFT Difference
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-[#121316] hover:text-[#84CC16] py-1 border-b border-[#E8E2D8]"
          >
            How It Works
          </a>
          <a
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-[#121316] hover:text-[#84CC16] py-1 border-b border-[#E8E2D8]"
          >
            Client Reviews
          </a>

          {/* Action CTAs */}
          <div className="pt-4 space-y-3 font-mono text-xs">
            <a
              href={`tel:${COMPANY_DETAILS.phoneInternational}`}
              className="flex items-center gap-2.5 text-sm font-bold text-[#121316] p-3 rounded-xl bg-[#F4EFE6] border border-[#E8E2D8]"
            >
              <Phone className="w-4 h-4 text-[#84CC16]" />
              <span>Call Dispatch: {COMPANY_DETAILS.phone}</span>
            </a>

            <a
              href={getQuoteWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#121316] rounded-xl flex items-center justify-center gap-2 shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-[#84CC16]" />
              <span>Get Quote on WhatsApp</span>
            </a>
          </div>

        </div>
      )}
    </header>
  );
};
