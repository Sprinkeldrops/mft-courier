import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Plus, Users, Truck, Check, Power, RefreshCw, Key, Trash2, ExternalLink, Share2, AlertCircle } from 'lucide-react';
import { DriverAccount, DeliveryTrackingSession } from '../../types/tracking';
import { TrackingService } from '../../lib/trackingService';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomerTracking?: (code: string) => void;
}

const ADMIN_STORAGE_KEY = 'mft_admin_auth_v1';

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  onOpenCustomerTracking,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'drivers' | 'consignments' | 'new-consignment'>('drivers');
  const [drivers, setDrivers] = useState<DriverAccount[]>([]);
  const [sessions, setSessions] = useState<Record<string, DeliveryTrackingSession>>({});

  // Driver delete confirmation & feedback states
  const [driverToDeleteId, setDriverToDeleteId] = useState<string | null>(null);
  const [copiedSessionCode, setCopiedSessionCode] = useState<string | null>(null);

  // Security Passcode management
  const [showChangePasscode, setShowChangePasscode] = useState(false);
  const [newAdminPasscode, setNewAdminPasscode] = useState('');
  const [passcodeSuccess, setPasscodeSuccess] = useState<string | null>(null);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  // Driver creation form state
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('07501 419198');
  const [newDriverVehicle, setNewDriverVehicle] = useState('Mercedes Sprinter LWB');
  const [customNumericId, setCustomNumericId] = useState('');
  const [driverCreateError, setDriverCreateError] = useState<string | null>(null);

  // New Consignment form state
  const [newCode, setNewCode] = useState('');
  const [newSender, setNewSender] = useState('');
  const [newRecipient, setNewRecipient] = useState('');
  const [newOriginAddress, setNewOriginAddress] = useState('MFT Central Hub, Vulcan Street, Oldham');
  const [newOriginPostcode, setNewOriginPostcode] = useState('OL8 1EZ');
  const [newDestAddress, setNewDestAddress] = useState('');
  const [newDestPostcode, setNewDestPostcode] = useState('');
  const [newAssignedDriverId, setNewAssignedDriverId] = useState('');
  const [newPackageDesc, setNewPackageDesc] = useState('Palletized Commercial Cargo (Direct Road Transit)');
  const [consignmentCreateError, setConsignmentCreateError] = useState<string | null>(null);
  const [createdSessionCode, setCreatedSessionCode] = useState<string | null>(null);

  // Load state
  const refreshData = () => {
    setDrivers(TrackingService.getDrivers());
    setSessions(TrackingService.getSessions());
  };

  useEffect(() => {
    if (isOpen) {
      const persistedAdmin = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (persistedAdmin === 'true') {
        setIsAuthenticated(true);
        refreshData();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;
    const unsubscribe = TrackingService.subscribe(() => {
      refreshData();
    });
    return unsubscribe;
  }, [isOpen, isAuthenticated]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (TrackingService.verifyAdminPasscode(pinInput)) {
      setIsAuthenticated(true);
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      setPinError(null);
      refreshData();
    } else {
      setPinError('Incorrect Dispatch Passcode. Authorized operations personnel only.');
    }
  };

  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError(null);
    setPasscodeSuccess(null);
    const res = TrackingService.setAdminPasscode(newAdminPasscode);
    if (res.success) {
      setPasscodeSuccess('Passcode updated successfully.');
      setNewAdminPasscode('');
      setTimeout(() => {
        setPasscodeSuccess(null);
        setShowChangePasscode(false);
      }, 2000);
    } else {
      setPasscodeError(res.error || 'Failed to update passcode');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setIsAuthenticated(false);
    setPinInput('');
  };

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    setDriverCreateError(null);

    const result = TrackingService.createDriver({
      name: newDriverName,
      phone: newDriverPhone,
      vehicleType: newDriverVehicle,
      numericId: customNumericId || undefined,
    });

    if (result.success) {
      refreshData();
      setShowAddDriver(false);
      setNewDriverName('');
      setCustomNumericId('');
    } else {
      setDriverCreateError(result.error || 'Failed to register driver.');
    }
  };

  const handleToggleDriverStatus = (driver: DriverAccount) => {
    const nextStatus = driver.status === 'active' ? 'inactive' : 'active';
    TrackingService.updateDriver(driver.id, { status: nextStatus });
    refreshData();
  };

  const handleResetPairing = (driverId: string) => {
    TrackingService.resetDevicePairing(driverId);
    refreshData();
  };

  const handleConfirmDeleteDriver = (driverId: string) => {
    TrackingService.deleteDriver(driverId);
    setDriverToDeleteId(null);
    refreshData();
  };

  const handleCreateConsignment = (e: React.FormEvent) => {
    e.preventDefault();
    setConsignmentCreateError(null);

    if (!newAssignedDriverId) {
      setConsignmentCreateError('Please assign an authorized driver.');
      return;
    }

    const code = newCode.trim() || TrackingService.generateTrackingCode();

    const result = TrackingService.createTrackingSession({
      code,
      sender: newSender || 'Manchester Commercial Client',
      recipient: newRecipient || 'UK Receiving Depot',
      originAddress: newOriginAddress,
      originPostcode: newOriginPostcode,
      destinationAddress: newDestAddress,
      destinationPostcode: newDestPostcode,
      assignedDriverId: newAssignedDriverId,
      packageDescription: newPackageDesc,
    });

    if (result.success && result.session) {
      setCreatedSessionCode(result.session.code);
      refreshData();
      setActiveTab('consignments');
    } else {
      setConsignmentCreateError(result.error || 'Failed to dispatch consignment.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#121316]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#E8E2D8] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-[#121316]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#121316] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#84CC16] text-[#121316] flex items-center justify-center font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>MFT Dispatch Desk &amp; Driver Management</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#84CC16]/20 text-[#84CC16] font-bold">
                  Admin Authority
                </span>
              </div>
              <p className="text-[11px] text-[#8A909E] font-mono">
                Fleet operations &bull; Manchester Hub (OL8)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#23252A] border border-[#3A3F4B] hover:bg-[#2D313A] flex items-center justify-center text-[#8A909E] hover:text-white transition-colors cursor-pointer"
            aria-label="Close Admin Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Admin Passcode Gate */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto py-8 space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#F4EFE6] border border-[#E8E2D8] flex items-center justify-center mx-auto text-[#121316]">
                  <Key className="w-6 h-6 text-[#84CC16]" />
                </div>
                <h3 className="text-base font-bold text-[#121316]">Dispatch Access Verification</h3>
                <p className="text-xs text-[#7B808B]">
                  Restricted to MFT Courier operations management and dispatch coordinators.
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#121316]">
                    Operations Passcode
                  </label>
                  <input
                    type="password"
                    required
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Enter Dispatch Passcode"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#D5CEC2] focus:border-[#84CC16] focus:ring-2 focus:ring-[#84CC16]/20 text-sm font-mono tracking-wider outline-none"
                    autoFocus
                  />
                  <div className="text-[11px] text-[#7B808B] font-mono">
                    Authorized dispatch desk personnel only. Contact head office for authorization credentials.
                  </div>
                </div>

                {pinError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                    {pinError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#121316] hover:bg-[#23252A] text-white text-xs font-mono font-bold uppercase tracking-wider shadow transition-colors cursor-pointer"
                >
                  Verify Dispatch Session
                </button>
              </form>
            </div>
          ) : (
            
            /* Admin Authenticated View */
            <div className="space-y-6">
              
              {/* Top Navigation Tabs & Admin Logout */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E2D8] pb-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('drivers')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'drivers'
                        ? 'bg-[#121316] text-[#84CC16]'
                        : 'bg-white border border-[#E8E2D8] text-[#7B808B] hover:text-[#121316]'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Drivers ({drivers.length}/10)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('consignments')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'consignments'
                        ? 'bg-[#121316] text-[#84CC16]'
                        : 'bg-white border border-[#E8E2D8] text-[#7B808B] hover:text-[#121316]'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Active Consignments ({Object.keys(sessions).length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('new-consignment')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'new-consignment'
                        ? 'bg-[#84CC16] text-[#121316]'
                        : 'bg-white border border-[#E8E2D8] text-[#7B808B] hover:text-[#121316]'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Dispatch Consignment</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowChangePasscode(!showChangePasscode)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E2D8] hover:bg-[#FAF8F5] text-xs font-mono text-[#121316] transition-colors flex items-center gap-1.5"
                    title="Change Dispatch Passcode"
                  >
                    <Key className="w-3.5 h-3.5 text-[#84CC16]" />
                    <span>Passcode</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    className="px-3 py-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-xs font-mono text-neutral-800 transition-colors"
                  >
                    Exit Dispatch
                  </button>
                </div>
              </div>

              {/* Passcode Update Drawer */}
              {showChangePasscode && (
                <form onSubmit={handleChangePasscode} className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E2D8] space-y-3">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#121316] flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-[#84CC16]" />
                    <span>Change Dispatch Operations Passcode</span>
                  </div>
                  <p className="text-[11px] text-[#7B808B]">
                    Update the security key used to access this private operations portal. Minimum 6 characters.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      required
                      value={newAdminPasscode}
                      onChange={(e) => setNewAdminPasscode(e.target.value)}
                      placeholder="Enter new secure passcode"
                      className="px-3.5 py-2 rounded-xl bg-white border border-[#D5CEC2] text-xs font-mono outline-none flex-1"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#121316] hover:bg-[#23252A] text-white text-xs font-mono font-bold uppercase transition-colors shrink-0"
                    >
                      Save Passcode
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowChangePasscode(false)}
                      className="px-3 py-2 rounded-xl bg-neutral-200 text-neutral-700 text-xs font-mono transition-colors shrink-0"
                    >
                      Cancel
                    </button>
                  </div>
                  {passcodeError && (
                    <div className="text-xs text-red-600 font-mono">{passcodeError}</div>
                  )}
                  {passcodeSuccess && (
                    <div className="text-xs text-lime-700 font-mono font-bold">{passcodeSuccess}</div>
                  )}
                </form>
              )}

              {/* TAB 1: DRIVER MANAGEMENT (Max 10 Drivers strictly enforced) */}
              {activeTab === 'drivers' && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#121316] flex items-center gap-2">
                        <span>Authorized Drivers</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E8E2D8] font-bold text-[#84CC16]">
                          {drivers.length} / 10 Cap
                        </span>
                      </h4>
                      <p className="text-xs text-[#7B808B]">
                        Each driver logs in using their simple 7-digit ID. Sessions are cryptographically bound to their phone.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={drivers.length >= 10}
                      onClick={() => setShowAddDriver(!showAddDriver)}
                      className="px-4 py-2 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-[#121316] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Register New Driver</span>
                    </button>
                  </div>

                  {/* Add Driver Drawer */}
                  {showAddDriver && (
                    <form onSubmit={handleAddDriver} className="p-5 rounded-2xl bg-[#F4EFE6] border border-[#E8E2D8] space-y-4">
                      <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#121316]">
                        New Authorized Driver Profile
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="font-semibold text-[#121316]">Driver Name</label>
                          <input
                            type="text"
                            required
                            value={newDriverName}
                            onChange={(e) => setNewDriverName(e.target.value)}
                            placeholder="e.g. Sam R."
                            className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5CEC2] outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-[#121316]">Handset Phone Number</label>
                          <input
                            type="tel"
                            required
                            value={newDriverPhone}
                            onChange={(e) => setNewDriverPhone(e.target.value)}
                            placeholder="e.g. 07501 419198"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5CEC2] outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-[#121316]">Assigned Vehicle Model</label>
                          <select
                            value={newDriverVehicle}
                            onChange={(e) => setNewDriverVehicle(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5CEC2] outline-none"
                          >
                            <option value="Mercedes Sprinter LWB (High Roof)">Mercedes Sprinter LWB (High Roof)</option>
                            <option value="Luton Box Van with 500kg Tail-Lift">Luton Box Van with 500kg Tail-Lift</option>
                            <option value="Ford Transit XLWB Curtain-Side">Ford Transit XLWB Curtain-Side</option>
                            <option value="Dedicated Rapid SWB Van">Dedicated Rapid SWB Van</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-[#121316]">Custom 7-Digit Driver ID (Optional)</label>
                          <input
                            type="text"
                            maxLength={7}
                            value={customNumericId}
                            onChange={(e) => setCustomNumericId(e.target.value.replace(/\D/g, ''))}
                            placeholder="Leave blank to auto-generate"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5CEC2] outline-none font-mono"
                          />
                        </div>
                      </div>

                      {driverCreateError && (
                        <div className="p-3 rounded-xl bg-red-100 text-red-900 text-xs">
                          {driverCreateError}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-[#121316] text-white text-xs font-mono font-bold uppercase transition-colors"
                        >
                          Confirm &amp; Issue 7-Digit ID
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddDriver(false)}
                          className="px-4 py-2 rounded-xl bg-white border border-[#D5CEC2] text-xs font-mono transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Driver Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {drivers.map((drv) => (
                      <div key={drv.id} className="p-4 rounded-2xl bg-white border border-[#E8E2D8] space-y-3 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-bold text-[#121316] text-sm flex items-center gap-2">
                              <span>{drv.name}</span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                                drv.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'
                              }`}>
                                {drv.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-xs text-[#7B808B]">{drv.vehicleType}</div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-mono text-[#7B808B] block uppercase">Driver ID</span>
                            <span className="text-sm font-mono font-extrabold text-[#121316] bg-[#F4EFE6] px-2 py-0.5 rounded border border-[#E8E2D8]">
                              {drv.numericId}
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-[11px] font-mono space-y-1">
                          <div className="flex justify-between">
                            <span className="text-[#7B808B]">Paired Device:</span>
                            <span className="text-[#121316] font-semibold truncate max-w-[150px]">
                              {drv.pairedDeviceId ? 'Handset Bound' : 'Unpaired (Ready for Setup)'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#7B808B]">GPS Broadcast:</span>
                            <span className={`font-semibold ${drv.isBroadcasting ? 'text-[#84CC16]' : 'text-neutral-500'}`}>
                              {drv.isBroadcasting ? 'Active Transmitting' : 'Stationary / Inactive'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#7B808B]">Current Delivery:</span>
                            <span className="text-[#121316] font-semibold">
                              {drv.currentDeliveryCode || 'None Assigned'}
                            </span>
                          </div>
                        </div>

                        {/* Driver Actions */}
                        <div className="pt-2 border-t border-[#F4EFE6] flex items-center justify-between text-xs font-mono">
                          <button
                            type="button"
                            onClick={() => handleToggleDriverStatus(drv)}
                            className="text-[#121316] hover:underline flex items-center gap-1"
                          >
                            <Power className="w-3.5 h-3.5 text-[#7B808B]" />
                            <span>{drv.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                          </button>

                          {drv.pairedDeviceId && (
                            <button
                              type="button"
                              onClick={() => handleResetPairing(drv.id)}
                              className="text-amber-800 hover:underline flex items-center gap-1"
                              title="Allow driver to log in from a new handset"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Reset Device</span>
                            </button>
                          )}

                          {driverToDeleteId === drv.id ? (
                            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2 py-1 rounded-xl">
                              <span className="text-[11px] font-bold text-red-700">Delete driver?</span>
                              <button
                                type="button"
                                onClick={() => handleConfirmDeleteDriver(drv.id)}
                                className="px-2 py-0.5 rounded-lg bg-red-600 text-white text-[11px] font-bold hover:bg-red-700 transition-colors cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setDriverToDeleteId(null)}
                                className="px-2 py-0.5 rounded-lg bg-neutral-200 text-neutral-700 text-[11px] hover:bg-neutral-300 transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDriverToDeleteId(drv.id)}
                              className="text-red-700 hover:text-red-900 transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 cursor-pointer"
                              title="Remove Driver Profile"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="text-xs">Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: ACTIVE CONSIGNMENTS */}
              {activeTab === 'consignments' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#121316]">Active Deliveries &amp; Customer Links</h4>
                      <p className="text-xs text-[#7B808B]">
                        Each consignment has an automated 5-day security lifespan.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('new-consignment')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#84CC16] text-[#121316] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#65A30D] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Delivery</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {Object.values(sessions).map((sess) => (
                      <div key={sess.code} className="p-4 rounded-2xl bg-white border border-[#E8E2D8] flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-sm text-[#121316] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8E2D8]">
                              {sess.code}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#121316] text-white font-mono text-[10px] font-bold">
                              {sess.status}
                            </span>
                          </div>
                          <div className="text-xs text-[#525763]">
                            <strong>To:</strong> {sess.destinationAddress} ({sess.destinationPostcode})
                          </div>
                          <div className="text-[11px] text-[#7B808B]">
                            Driver: {sess.driverName} &bull; Expires: {new Date(sess.expiresAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenCustomerTracking?.(sess.code);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#F4EFE6] border border-[#E8E2D8] text-xs font-mono font-semibold text-[#121316] hover:bg-white flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[#84CC16]" />
                            <span>View Live Map</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const url = `${window.location.origin}${window.location.pathname}?track=${sess.code}`;
                              navigator.clipboard.writeText(url);
                              setCopiedSessionCode(sess.code);
                              setTimeout(() => setCopiedSessionCode(null), 2500);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#121316] text-white text-xs font-mono flex items-center gap-1.5 hover:bg-[#23252A] transition-colors cursor-pointer"
                          >
                            {copiedSessionCode === sess.code ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#84CC16]" />
                                <span className="text-[#84CC16] font-bold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3.5 h-3.5 text-[#84CC16]" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: DISPATCH NEW CONSIGNMENT */}
              {activeTab === 'new-consignment' && (
                <form onSubmit={handleCreateConsignment} className="p-5 rounded-2xl bg-white border border-[#E8E2D8] space-y-4">
                  <div className="text-sm font-bold text-[#121316]">
                    Dispatch New Point-to-Point Consignment
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-[#121316]">Consignment Code</label>
                      <input
                        type="text"
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                        placeholder="e.g. MFT-92810 (Leave blank to auto-generate)"
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5CEC2] font-mono outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#121316]">Assign Authorized Driver</label>
                      <select
                        required
                        value={newAssignedDriverId}
                        onChange={(e) => setNewAssignedDriverId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5CEC2] outline-none"
                      >
                        <option value="">-- Select Active Driver --</option>
                        {drivers.filter(d => d.status === 'active').map((drv) => (
                          <option key={drv.id} value={drv.id}>
                            {drv.name} (ID: {drv.numericId}) — {drv.vehicleType}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#121316]">Collection Postcode (Origin)</label>
                      <input
                        type="text"
                        required
                        value={newOriginPostcode}
                        onChange={(e) => setNewOriginPostcode(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5CEC2] font-mono outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#121316]">Delivery Postcode (Destination)</label>
                      <input
                        type="text"
                        required
                        value={newDestPostcode}
                        onChange={(e) => setNewDestPostcode(e.target.value.toUpperCase())}
                        placeholder="e.g. B24 8HX or M1 1AA"
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5CEC2] font-mono outline-none"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold text-[#121316]">Destination Facility / Address</label>
                      <input
                        type="text"
                        required
                        value={newDestAddress}
                        onChange={(e) => setNewDestAddress(e.target.value)}
                        placeholder="e.g. Unit 4, Trafford Park Commercial Estate, Manchester"
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5CEC2] outline-none"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold text-[#121316]">Package / Cargo Description</label>
                      <input
                        type="text"
                        required
                        value={newPackageDesc}
                        onChange={(e) => setNewPackageDesc(e.target.value)}
                        placeholder="e.g. High-Priority Medical Supplies / Aerospace Tooling (2 Pallets)"
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5CEC2] outline-none"
                      />
                    </div>
                  </div>

                  {consignmentCreateError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                      {consignmentCreateError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-[#121316] text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Activate Consignment &amp; Generate 5-Day Tracking Link
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
