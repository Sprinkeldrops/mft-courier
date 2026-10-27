import React, { useState, useEffect } from 'react';
import { X, Search, Clock, MapPin, Truck, ShieldCheck, CheckCircle2, AlertCircle, Phone, ArrowRight, Share2, RefreshCw } from 'lucide-react';
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
  const [searchCode, setSearchCode] = useState(initialCode || 'MFT-84920');
  const [currentSession, setCurrentSession] = useState<DeliveryTrackingSession | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load tracking session
  const performLookup = (code: string) => {
    if (!code.trim()) return;
    setIsSearching(true);
    setErrorMessage(null);

    const result = TrackingService.getTrackingSession(code);
    setIsSearching(false);

    if (result.error) {
      setCurrentSession(null);
      setIsExpired(false);
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
      } else {
        performLookup(searchCode || 'MFT-84920');
      }
    }
  }, [isOpen, initialCode]);

  // Subscribe to live updates
  useEffect(() => {
    if (!isOpen || !currentSession) return;
    const unsubscribe = TrackingService.subscribe(() => {
      const result = TrackingService.getTrackingSession(currentSession.code);
      if (result.session) {
        setCurrentSession(result.session);
        setIsExpired(result.isExpired);
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
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#84CC16]/20 text-[#65A30D] font-bold">
                  Active GPS
                </span>
              </div>
              <p className="text-[11px] text-[#7B808B] font-mono">
                Real-time dedicated vehicle telemetry &bull; Point-to-Point UK Transit
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
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Enter Consignment Reference (e.g. MFT-84920)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D5CEC2] focus:border-[#84CC16] focus:ring-2 focus:ring-[#84CC16]/30 text-xs font-mono font-medium tracking-wide uppercase transition-all outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-5 py-2.5 rounded-xl bg-[#121316] hover:bg-[#23252A] text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5 text-[#84CC16]" />}
              <span>Track Delivery</span>
            </button>
          </form>

          {/* Error notice */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Consignment Not Located:</strong> {errorMessage}
                <div className="mt-1 text-[11px] text-amber-700">
                  Please verify the reference format or telephone MFT dispatch desk directly on{' '}
                  <a href={`tel:${COMPANY_DETAILS.phoneInternational}`} className="underline font-bold">
                    {COMPANY_DETAILS.phone}
                  </a>.
                </div>
              </div>
            </div>
          )}

          {/* Expired Session Notice (5-day window) */}
          {currentSession && isExpired && (
            <div className="p-5 rounded-2xl bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-neutral-900">
                <ShieldCheck className="w-4 h-4 text-neutral-600" />
                <span>Consignment Security Expiration Elapsed (5 Days)</span>
              </div>
              <p className="text-neutral-600 leading-relaxed text-[11px]">
                In compliance with MFT Courier security protocols, public customer tracking links automatically expire 5 days after initial booking dispatch. Electronic proof of delivery (ePOD), signature records, and archived transit manifests remain accessible on demand.
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
                    <span className="text-xs font-mono text-[#7B808B] uppercase tracking-wider">Consignment Ref</span>
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
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121316] text-white text-xs font-mono font-bold tracking-wider uppercase">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#84CC16] animate-pulse" />
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

              {/* Interactive Live Map */}
              <DeliveryMap
                originCoords={currentSession.originCoords}
                destinationCoords={currentSession.destinationCoords}
                driverLocation={currentSession.driverLocation}
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
                    <span>Estimated Arrival</span>
                  </div>
                  <div className="font-bold text-[#121316] text-xs">{currentSession.eta}</div>
                  <div className="text-[11px] text-[#84CC16] font-semibold">Direct Transit Road Corridor</div>
                </div>

                {/* Metric 3: Origin Hub */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#E8E2D8] space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#7B808B] flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#7B808B]" />
                    <span>Collection Point</span>
                  </div>
                  <div className="font-bold text-[#121316] text-xs truncate">{currentSession.originPostcode}</div>
                  <div className="text-[11px] text-[#7B808B] truncate">{currentSession.originAddress}</div>
                </div>

                {/* Metric 4: Destination */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#E8E2D8] space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#7B808B] flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#84CC16]" />
                    <span>Destination Postcode</span>
                  </div>
                  <div className="font-bold text-[#121316] text-xs truncate">{currentSession.destinationPostcode}</div>
                  <div className="text-[11px] text-[#7B808B] truncate">{currentSession.destinationAddress}</div>
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
                      <div key={idx} className="flex items-start gap-3 relative pb-2 border-b border-[#F4EFE6] last:border-none last:pb-0">
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
                    href={`${COMPANY_DETAILS.whatsappQuoteUrl}?text=${encodeURIComponent(`Query regarding consignment ${currentSession.code}`)}`}
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

          {/* Quick Demo Preloads if nothing active */}
          {!currentSession && !errorMessage && (
            <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] text-center space-y-3">
              <Truck className="w-8 h-8 text-[#84CC16] mx-auto" />
              <div className="text-xs font-bold text-[#121316]">Active Sample Consignment Ready</div>
              <p className="text-[11px] text-[#7B808B] max-w-sm mx-auto">
                Test the live GPS tracking system with the pre-loaded active Manchester to Birmingham transit consignment:
              </p>
              <button
                type="button"
                onClick={() => performLookup('MFT-84920')}
                className="px-4 py-2 rounded-xl bg-[#84CC16]/20 border border-[#84CC16] text-[#65A30D] hover:bg-[#84CC16]/30 text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                Load Sample: MFT-84920
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
