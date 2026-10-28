import React, { useState, useEffect } from 'react';
import {
  X,
  Truck,
  LogOut,
  Radio,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  Key,
  Compass,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { DriverAccount, DeliveryTrackingSession, GPSCoordinate } from '../../types/tracking';
import { TrackingService } from '../../lib/trackingService';
import { useDriverLocation } from '../../hooks/useDriverLocation';
import { COMPANY_DETAILS } from '../../data/courierData';

interface DriverPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomerTracking?: (code: string) => void;
}

export const DriverPortalModal: React.FC<DriverPortalModalProps> = ({
  isOpen,
  onClose,
  onOpenCustomerTracking,
}) => {
  // 1-field 7-digit Driver ID state
  const [driverNumericId, setDriverNumericId] = useState('');
  const [activeDriver, setActiveDriver] = useState<DriverAccount | null>(null);
  const [activeDelivery, setActiveDelivery] = useState<DeliveryTrackingSession | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);

  // Auto-resume persistent driver session on mount
  useEffect(() => {
    if (isOpen) {
      const persisted = TrackingService.getActiveDriverSession();
      if (persisted) {
        setActiveDriver(persisted);
        setIsBroadcasting(persisted.isBroadcasting);
        loadDriverDelivery(persisted);
      }
    }
  }, [isOpen]);

  const loadDriverDelivery = (driver: DriverAccount) => {
    if (driver.currentDeliveryCode) {
      const { session } = TrackingService.getTrackingSession(driver.currentDeliveryCode);
      setActiveDelivery(session);
    } else {
      setActiveDelivery(null);
    }
  };

  // Real Hardware GPS Location Watcher hook
  const {
    isWatching,
    currentCoord,
    error: gpsError,
    permissionStatus,
    wakeLockActive,
    lastUpdatedSecondsAgo,
    isStale,
    requestBrowserPermission,
    startWatching,
    stopWatching,
  } = useDriverLocation({
    minIntervalMs: 1000,
    onLocationUpdate: (coord: GPSCoordinate) => {
      if (activeDriver && activeDelivery) {
        TrackingService.updateDriverLocation(activeDelivery.code, activeDriver.id, coord);
      }
    },
  });

  // Handle GPS broadcast toggle
  const toggleBroadcasting = () => {
    if (isBroadcasting) {
      stopWatching();
      setIsBroadcasting(false);
      if (activeDriver) {
        TrackingService.updateDriver(activeDriver.id, { isBroadcasting: false });
      }
    } else {
      startWatching();
      setIsBroadcasting(true);
      if (activeDriver) {
        TrackingService.updateDriver(activeDriver.id, { isBroadcasting: true });
      }
    }
  };

  // One-input 7-digit Login Form submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    const result = TrackingService.verifyDriverLogin(driverNumericId);
    setIsLoggingIn(false);

    if (result.success && result.driver) {
      setActiveDriver(result.driver);
      loadDriverDelivery(result.driver);
      setDriverNumericId('');
    } else {
      setLoginError(result.error || 'Authentication failed');
    }
  };

  // Manual Logout
  const handleLogout = () => {
    stopWatching();
    setIsBroadcasting(false);
    TrackingService.clearActiveDriverSession();
    setActiveDriver(null);
    setActiveDelivery(null);
  };

  // Quick delivery status progress
  const handleStatusUpdate = (status: 'In Transit' | 'Approaching' | 'Delivered') => {
    if (!activeDelivery) return;
    TrackingService.updateDeliveryStatus(activeDelivery.code, status, `Driver updated status to ${status}`);
    const { session } = TrackingService.getTrackingSession(activeDelivery.code);
    setActiveDelivery(session);
    if (status === 'Delivered') {
      stopWatching();
      setIsBroadcasting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#121316]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#FAF8F5] border border-[#E8E2D8] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-[#121316]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#121316] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#23252A] border border-[#84CC16] flex items-center justify-center text-white">
              <Truck className="w-4 h-4 text-[#84CC16]" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Driver Telemetry Console</span>
                {activeDriver && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#84CC16]/20 text-[#84CC16] font-bold">
                    Connected
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8A909E] font-mono">
                Real hardware GPS navigation &bull; MFT Dedicated Fleet
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#23252A] border border-[#3A3F4B] hover:bg-[#2D313A] flex items-center justify-center text-[#8A909E] hover:text-white transition-colors cursor-pointer"
            aria-label="Close Driver Portal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* STATE 1: Simple 7-Digit Numeric Login Screen */}
          {!activeDriver ? (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E2D8] text-xs text-[#525763] space-y-2">
                <div className="font-bold text-[#121316] flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#84CC16]" />
                  <span>Authorized Driver Sign-In</span>
                </div>
                <p>
                  Enter your assigned <strong>7-digit numeric Driver ID</strong>. Your session is securely bound to this device for persistent automatic login.
                </p>
              </div>

              {/* 1-Input Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="driverNumericId"
                    className="block text-xs font-mono font-bold uppercase tracking-wider text-[#121316]"
                  >
                    Driver ID (7 Digits)
                  </label>
                  <input
                    id="driverNumericId"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={7}
                    required
                    value={driverNumericId}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 7);
                      setDriverNumericId(val);
                    }}
                    placeholder="Enter 7-Digit ID"
                    className="w-full px-4 py-3.5 text-center text-2xl font-mono font-extrabold tracking-widest bg-white border-2 border-[#D5CEC2] rounded-2xl focus:border-[#84CC16] focus:ring-4 focus:ring-[#84CC16]/20 transition-all outline-none"
                    autoFocus
                  />
                  <div className="text-[11px] text-[#7B808B] font-mono text-center">
                    {driverNumericId.length}/7 digits entered
                  </div>
                </div>

                {loginError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={driverNumericId.length !== 7 || isLoggingIn}
                  className="w-full py-3.5 rounded-2xl bg-[#84CC16] hover:bg-[#65A30D] text-[#121316] font-mono font-bold text-sm tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoggingIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>Sign In To Driver Console</span>
                </button>
              </form>

              <div className="text-center text-[11px] text-[#7B808B]">
                Need ID assistance or device pairing reset? Telephone dispatch desk:{' '}
                <a href={`tel:${COMPANY_DETAILS.phoneInternational}`} className="underline font-bold text-[#121316]">
                  {COMPANY_DETAILS.phone}
                </a>
              </div>
            </div>
          ) : (
            /* STATE 2: Authenticated Driver Dashboard */
            <div className="space-y-6">
              {/* Driver Identity Card */}
              <div className="p-4 rounded-2xl bg-white border border-[#E8E2D8] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#121316] text-[#84CC16] flex items-center justify-center font-bold text-sm">
                    {activeDriver.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#121316] flex items-center gap-2">
                      <span>{activeDriver.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F4EFE6] text-[#121316] border border-[#E8E2D8]">
                        ID: {activeDriver.numericId}
                      </span>
                    </div>
                    <div className="text-xs text-[#7B808B]">{activeDriver.vehicleType}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#D5CEC2] hover:bg-red-50 hover:text-red-700 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>

              {/* Real Live GPS Broadcast Control */}
              <div className="p-5 rounded-2xl bg-[#121316] text-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2">
                      <Radio
                        className={`w-4 h-4 ${
                          isBroadcasting && !isStale
                            ? 'text-[#84CC16] animate-pulse'
                            : isStale
                            ? 'text-amber-400'
                            : 'text-[#7B808B]'
                        }`}
                      />
                      <span>Hardware GPS Broadcast</span>
                    </div>
                    <p className="text-[11px] text-[#8A909E]">
                      {isBroadcasting
                        ? isStale
                          ? 'Satellite signal degraded. Reacquiring fresh coordinates...'
                          : 'Broadcasting live coordinates directly to customer tracking map'
                        : 'Broadcasting paused. Tap below to activate transit GPS.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={toggleBroadcasting}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isBroadcasting
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-[#84CC16] hover:bg-[#65A30D] text-[#121316]'
                    }`}
                  >
                    {isBroadcasting ? 'Stop Broadcast' : 'Start Broadcast'}
                  </button>
                </div>

                {/* Telemetry Status Bar */}
                {isBroadcasting && (
                  <div className="p-3 rounded-xl bg-[#23252A] border border-[#333742] grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <div className="text-[10px] font-mono text-[#8A909E]">STATUS</div>
                      <div
                        className={`font-bold font-mono ${
                          isStale ? 'text-amber-400' : 'text-[#84CC16]'
                        }`}
                      >
                        {isStale ? 'STALE FIX' : 'LIVE'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-[#8A909E]">LAST UPDATE</div>
                      <div className="font-bold font-mono text-white">
                        {currentCoord ? `${lastUpdatedSecondsAgo}s ago` : 'Acquiring...'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-[#8A909E]">ACCURACY</div>
                      <div className="font-bold font-mono text-white">
                        {currentCoord?.accuracyMeters ? `±${currentCoord.accuracyMeters}m` : 'Measuring'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-[#8A909E]">SPEED</div>
                      <div className="font-bold font-mono text-[#84CC16]">
                        {currentCoord?.speedMph !== undefined ? `${currentCoord.speedMph} mph` : '0 mph'}
                      </div>
                    </div>
                  </div>
                )}

                {/* GPS Permission Prompt / Error Guidance */}
                {gpsError && (
                  <div className="p-3.5 rounded-xl bg-amber-950/70 border border-amber-700/80 text-amber-200 text-xs space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="font-bold text-amber-100">GPS Hardware Notice</div>
                        <div>{gpsError}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-amber-800/60">
                      <button
                        type="button"
                        onClick={requestBrowserPermission}
                        className="px-3 py-1.5 rounded-lg bg-amber-400 text-[#121316] font-mono font-bold text-[11px] hover:bg-amber-300 transition-colors cursor-pointer"
                      >
                        Prompt Browser Location Permission
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPermissionHelp(!showPermissionHelp)}
                        className="text-[11px] underline text-amber-300 hover:text-white"
                      >
                        {showPermissionHelp ? 'Hide Help' : 'How to enable on mobile'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Mobile Browser Permission Guide */}
                {showPermissionHelp && (
                  <div className="p-4 rounded-xl bg-[#1C1E24] border border-[#2E323D] text-[11px] space-y-2 text-[#A0A6B5]">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#84CC16]" />
                      <span>Enabling GPS on Mobile Handsets:</span>
                    </div>
                    <div className="space-y-1.5 pl-1">
                      <p>
                        <strong>Apple iOS Safari:</strong> Tap the <em>aA</em> icon in the URL bar &rarr; <em>Website Settings</em> &rarr; <em>Location</em> &rarr; select <strong>Allow</strong>. Ensure iOS Settings &rarr; Privacy & Security &rarr; Location Services is active.
                      </p>
                      <p>
                        <strong>Android Chrome:</strong> Tap the padlock/tune icon to the left of the URL &rarr; <em>Permissions</em> &rarr; <em>Location</em> &rarr; tap <strong>Allow</strong>.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Delivery Consignment Card */}
              {activeDelivery ? (
                <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-mono text-[#7B808B] uppercase tracking-wider">
                        Current Delivery Assignment
                      </div>
                      <div className="text-base font-extrabold text-[#121316] font-mono">
                        {activeDelivery.code}
                      </div>
                    </div>

                    <div
                      className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
                        activeDelivery.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-[#FAF8F5] border-[#E8E2D8] text-[#121316]'
                      }`}
                    >
                      {activeDelivery.status}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-[#121316]">Destination: </span>
                      <span className="text-[#525763]">
                        {activeDelivery.destinationAddress} ({activeDelivery.destinationPostcode})
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#121316]">Consignment: </span>
                      <span className="text-[#525763]">{activeDelivery.packageDescription}</span>
                    </div>
                  </div>

                  {/* Milestone Progress Buttons */}
                  {activeDelivery.status !== 'Delivered' ? (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7B808B]">
                        Update Delivery Milestone:
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate('In Transit')}
                          className={`py-2 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer ${
                            activeDelivery.status === 'In Transit'
                              ? 'bg-[#121316] text-[#84CC16] border-[#121316]'
                              : 'bg-white border-[#D5CEC2] text-[#121316] hover:bg-[#F4EFE6]'
                          }`}
                        >
                          In Transit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate('Approaching')}
                          className={`py-2 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer ${
                            activeDelivery.status === 'Approaching'
                              ? 'bg-[#121316] text-[#84CC16] border-[#121316]'
                              : 'bg-white border-[#D5CEC2] text-[#121316] hover:bg-[#F4EFE6]'
                          }`}
                        >
                          Approaching
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate('Delivered')}
                          className="py-2 rounded-xl text-xs font-mono font-bold border bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 transition-colors cursor-pointer"
                        >
                          Delivered &bull; Handover
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Consignment delivered & signed. GPS broadcast concluded.</span>
                    </div>
                  )}

                  {/* Customer Tracking link */}
                  <div className="pt-2 border-t border-[#E8E2D8] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#7B808B]">Customer map view:</span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenCustomerTracking?.(activeDelivery.code);
                      }}
                      className="text-xs font-mono font-bold text-[#65A30D] hover:underline cursor-pointer"
                    >
                      View Live Customer Map &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-center mx-auto text-[#7B808B]">
                    ✓
                  </div>
                  <div className="text-xs font-bold text-[#121316]">No Active Consignments Assigned</div>
                  <p className="text-[11px] text-[#7B808B]">
                    Dispatch will allocate your next road manifest.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
