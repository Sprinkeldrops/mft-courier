import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Clock,
  MapPin,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Share2,
  RefreshCw,
  Radio,
} from 'lucide-react';
import { DeliveryTrackingSession } from '../../types/tracking';
import { TrackingService } from '../../lib/trackingService';
import { DeliveryMap } from './DeliveryMap';
import { COMPANY_DETAILS } from '../../data/courierData';

interface CustomerTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

export const CustomerTrackingModal: React.FC<CustomerTrackingModalProps> = ({
  isOpen,
  onClose,
  initialCode = '',
}) => {
  const [searchCode, setSearchCode] = useState(initialCode);
  const [currentSession, setCurrentSession] = useState<DeliveryTrackingSession | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load tracking session
  const performLookup = (code: string) => {
    if (!code || !code.trim()) {
      setErrorMessage('Please enter a valid consignment reference code.');
      setCurrentSession(null);
      return;
    }
    setIsSearching(true);
    setErrorMessage(null);

    const result = TrackingService.getTrackingSession(code);
    setIsSearching(false);

    if (result.error) {
      setCurrentSession(null);
      setIsExpired(result.isExpired);
      setErrorMessage(result.error);
    } else {
      setCurrentSession(result.session);
      setIsExpired(result.isExpired);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (initialCode) {
        setSearchCode(initialCode);
        performLookup(initialCode);
      } else if (searchCode) {
        performLookup(searchCode);
      }
    }
  }, [isOpen, initialCode]);

  // Subscribe to live cross-tab updates
  useEffect(() => {
    if (!isOpen || !currentSession) return;
    const unsubscribe = TrackingService.subscribe(() => {
      const result = TrackingService.getTrackingSession(currentSession.code);
      if (result.session) {
        setCurrentSession(result.session);
        setIsExpired(result.isExpired);
      } else if (result.error) {
        // If driver was deleted or session expired
        setCurrentSession(null);
        setIsExpired(result.isExpired);
        setErrorMessage(result.error);
      }
    });
    return unsubscribe;
  }, [isOpen, currentSession?.code]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(searchCode);
  };

  const handleCopyShareLink = () => {
    if (!currentSession) return;
    const url = `${window.location.origin}${window.location.pathname}?track=${currentSession.code}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Determine if telemetry is live or stale
  const isDelivered = currentSession?.status === 'Delivered';
  const hasDriverGps = Boolean(currentSession?.driverLocation && !isDelivered);
  const gpsAgeSec = currentSession?.driverLocation?.updatedAt
    ? Math.max(0, Math.floor((Date.now() - new Date(currentSession.driverLocation.updatedAt).getTime()) / 1000))
    : null;
  const isGpsStale = gpsAgeSec !== null && gpsAgeSec > 120;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#121316]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#E8E2D8] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-[#121316]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F4EFE6] border-b border-[#E8E2D8] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#121316] flex items-center justify-center text-white">
              <Truck className="w-4 h-4 text-[#84CC16]" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#121316] flex items-center gap-2">
                <span>Live Consignment Tracking</span>
                {currentSession && !isDelivered && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#84CC16]/20 text-[#65A30D] font-bold">
                    Active Telemetry
                  </span>
                )}
                {isDelivered && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Delivery Concluded
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#7B808B] font-mono">
                Real hardware GPS tracking &bull; Point-to-Point UK Transit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#E8E2D8] hover:bg-[#FAF8F5] flex items-center justify-center text-[#7B808B] hover:text-[#121316] transition-colors cursor-pointer"
            aria-label="Close Tracking Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Tracking Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B808B]" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                placeholder="Enter Consignment Reference (e.g. MFT-XXXX-XXXX)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D5CEC2] focus:border-[#84CC16] focus:ring-2 focus:ring-[#84CC16]/30 text-xs font-mono font-medium tracking-wide uppercase transition-all outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-5 py-2.5 rounded-xl bg-[#121316] hover:bg-[#23252A] text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSearching ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5 text-[#84CC16]" />
              )}
              <span>Track Delivery</span>
            </button>
          </form>

          {/* Error notice */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Tracking Notice:</strong> {errorMessage}
                <div className="mt-1 text-[11px] text-amber-700">
                  Please verify your consignment code or contact MFT dispatch on{' '}
                  <a href={`tel:${COMPANY_DETAILS.phoneInternational}`} className="underline font-bold">
                    {COMPANY_DETAILS.phone}
                  </a>.
                </div>
              </div>
            </div>
          )}

          {/* Expired Session Notice (5-day window) */}
          {isExpired && (
            <div className="p-5 rounded-2xl bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-neutral-900">
                <ShieldCheck className="w-4 h-4 text-neutral-600" />
                <span>Consignment Security Lifespan Elapsed (5-Day Privacy Window)</span>
              </div>
              <p className="text-neutral-600 leading-relaxed text-[11px]">
                In compliance with MFT Courier security protocols, public customer tracking links automatically expire 5 days after initial dispatch. Electronic proof of delivery (ePOD), signatures, and archived manifests remain accessible on demand from head office.
              </p>
              <div className="pt-1 flex items-center gap-3">
                <a
                  href={`tel:${COMPANY_DETAILS.phoneInternational}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121316] text-white text-xs font-mono font-semibold"
                >
                  <Phone className="w-3 h-3 text-[#84CC16]" />
                  <span>Call Dispatch: {COMPANY_DETAILS.phone}</span>
                </a>
              </div>
            </div>
          )}

          {/* Active Consignment Details & Live Map */}
          {currentSession && !isExpired && (
            <div className="space-y-6">
              {/* Header Status Strip */}
              <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E2D8] flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#7B808B] uppercase tracking-wider">
                      Consignment Ref
                    </span>
                    <span className="text-sm font-mono font-extrabold text-[#121316] bg-white px-2.5 py-0.5 rounded-md border border-[#E8E2D8]">
                      {currentSession.code}
                    </span>
                  </div>
                  <div className="text-xs text-[#525763] font-medium">
                    {currentSession.packageDescription}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Badge */}
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase ${
                      isDelivered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#121316] text-white'
                    }`}
                  >
                    {!isDelivered && (
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isGpsStale ? 'bg-amber-400' : 'bg-[#84CC16] animate-pulse'
                        }`}
                      />
                    )}
                    <span>{currentSession.status}</span>
                  </div>

                  {/* Share button */}
                  <button
                    onClick={handleCopyShareLink}
                    className="p-2 rounded-xl bg-white border border-[#D5CEC2] hover:bg-[#FAF8F5] text-xs font-mono flex items-center gap-1.5 text-[#121316] transition-colors cursor-pointer"
                    title="Copy direct tracking link"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#7B808B]" />
                    <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
                  </button>
                </div>
              </div>

              {/* Telemetry Status Strip */}
              {hasDriverGps && (
                <div className="px-4 py-2.5 rounded-xl bg-[#121316] text-white flex flex-wrap items-center justify-between text-xs font-mono gap-2">
                  <div className="flex items-center gap-2">
                    <Radio
                      className={`w-3.5 h-3.5 ${
                        isGpsStale ? 'text-amber-400' : 'text-[#84CC16] animate-pulse'
                      }`}
                    />
                    <span>
                      {isGpsStale
                        ? `STALE TELEMETRY (Last fix ${Math.floor(gpsAgeSec! / 60)}m ago)`
                        : 'LIVE HARDWARE GPS BROADCAST'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[#8A909E] text-[11px]">
                    {currentSession.driverLocation?.accuracyMeters && (
                      <span>Accuracy: ±{currentSession.driverLocation.accuracyMeters}m</span>
                    )}
                    {currentSession.driverLocation?.speedMph !== undefined && (
                      <span className="text-[#84CC16] font-bold">
                        {currentSession.driverLocation.speedMph} MPH
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Interactive Live Map (Cleans up moving marker on delivery or deletion) */}
              <DeliveryMap
                originCoords={currentSession.originCoords}
                destinationCoords={currentSession.destinationCoords}
                driverLocation={isDelivered ? undefined : currentSession.driverLocation}
                driverName={currentSession.driverName}
                vehicleType={currentSession.vehicleType}
                destinationAddress={`${currentSession.destinationAddress} (${currentSession.destinationPostcode})`}
                originAddress={`${currentSession.originAddress} (${currentSession.originPostcode})`}
              />

              {/* Transit Metrics Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* Metric 1: Driver & Vehicle */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#E8E2D8] space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#7B808B] flex items-center gap-1.5">
                    <Truck className="w-3 h-3 text-[#84CC16]" />
                    <span>Assigned Vehicle</span>
                  </div>
                  <div className="font-bold text-[#121316] text-xs">{currentSession.driverName}</div>
                  <div className="text-[11px] text-[#7B808B] truncate">{currentSession.vehicleType}</div>
                </div>

                {/* Metric 2: Estimated ETA */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#E8E2D8] space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#7B808B] flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#84CC16]" />
                    <span>Delivery Status</span>
                  </div>
                  <div className="font-bold text-[#121316] text-xs">
                    {isDelivered ? 'Handover Complete' : currentSession.eta}
                  </div>
                  <div className="text-[11px] text-[#84CC16] font-semibold">
                    {isDelivered ? 'ePOD Signed' : 'Direct Transit Road Corridor'}
                  </div>
                </div>

                {/* Metric 3: Origin Hub */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#E8E2D8] space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#7B808B] flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#7B808B]" />
                    <span>Collection Point</span>
                  </div>
                  <div className="font-bold text-[#121316] text-xs truncate">
                    {currentSession.originPostcode}
                  </div>
                  <div className="text-[11px] text-[#7B808B] truncate">
                    {currentSession.originAddress}
                  </div>
                </div>

                {/* Metric 4: Destination */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#E8E2D8] space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#7B808B] flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#84CC16]" />
                    <span>Destination Postcode</span>
                  </div>
                  <div className="font-bold text-[#121316] text-xs truncate">
                    {currentSession.destinationPostcode}
                  </div>
                  <div className="text-[11px] text-[#7B808B] truncate">
                    {currentSession.destinationAddress}
                  </div>
                </div>
              </div>

              {/* Checkpoint Milestones Timeline */}
              {currentSession.checkpoints && currentSession.checkpoints.length > 0 && (
                <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] space-y-4">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#121316] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#84CC16]" />
                    <span>Consignment Milestones &amp; Chain of Custody</span>
                  </div>

                  <div className="space-y-3">
                    {currentSession.checkpoints.map((cp, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 relative pb-2 border-b border-[#F4EFE6] last:border-none last:pb-0"
                      >
                        <div className="pt-0.5 shrink-0">
                          {cp.completed ? (
                            <span className="w-5 h-5 rounded-full bg-[#84CC16]/20 border border-[#84CC16] flex items-center justify-center text-[10px] font-bold text-[#65A30D]">
                              ✓
                            </span>
                          ) : (
                            <span className="w-5 h-5 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center text-[10px] text-neutral-400">
                              ○
                            </span>
                          )}
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className={`font-semibold ${cp.completed ? 'text-[#121316]' : 'text-[#7B808B]'}`}>
                              {cp.status}
                            </span>
                            <span className="font-mono text-[10px] text-[#7B808B]">{cp.time}</span>
                          </div>
                          <div className="text-[11px] text-[#7B808B] mt-0.5">{cp.location}</div>
                          {cp.notes && (
                            <div className="text-[11px] text-[#4A4E57] mt-1 bg-[#FAF8F5] px-2 py-1 rounded-md border border-[#E8E2D8]">
                              {cp.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Support Banner */}
              <div className="p-4 rounded-2xl bg-[#121316] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs space-y-0.5 text-center sm:text-left">
                  <div className="font-bold">Need to adjust delivery instructions or coordinate access?</div>
                  <div className="text-[11px] text-[#8A909E]">Contact the MFT Manchester Hub operations desk directly.</div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${COMPANY_DETAILS.phoneInternational}`}
                    className="px-4 py-2 rounded-xl bg-[#23252A] hover:bg-[#2D313A] border border-[#3A3F4B] text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#84CC16]" />
                    <span>{COMPANY_DETAILS.phone}</span>
                  </a>
                  <a
                    href={`${COMPANY_DETAILS.whatsappQuoteUrl}?text=${encodeURIComponent(
                      `Query regarding consignment ${currentSession.code}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-[#121316] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>WhatsApp Dispatch</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Clean instructions when no consignment is loaded */}
          {!currentSession && !errorMessage && !isExpired && (
            <div className="p-8 rounded-2xl bg-white border border-[#E8E2D8] text-center space-y-3">
              <Truck className="w-10 h-10 text-[#84CC16] mx-auto" />
              <div className="text-sm font-bold text-[#121316]">Real-Time Consignment Telemetry</div>
              <p className="text-xs text-[#7B808B] max-w-md mx-auto">
                Enter your unique <strong>MFT Consignment Reference</strong> (provided in your booking confirmation SMS or WhatsApp dispatch notice) to view the live GPS position of your dedicated vehicle.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
