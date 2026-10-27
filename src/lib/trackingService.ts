import { DeliveryTrackingSession, DriverAccount, GPSCoordinate, DeliveryStatus } from '../types/tracking';

const STORAGE_KEYS = {
  DRIVERS: 'mft_courier_drivers_v1',
  SESSIONS: 'mft_courier_sessions_v1',
  ACTIVE_DRIVER_SESSION: 'mft_active_driver_session_v1',
  DEVICE_ID: 'mft_device_token_v1',
};

// Default seed drivers (Manchester Hub)
const SEED_DRIVERS: DriverAccount[] = [
  {
    id: 'drv_7492015',
    numericId: '7492015',
    name: 'David K.',
    phone: '07501 419198',
    vehicleType: 'Mercedes Sprinter LWB (High Roof)',
    status: 'active',
    pairedDeviceId: null,
    isBroadcasting: true,
    lastActiveAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    currentDeliveryCode: 'MFT-84920',
  },
  {
    id: 'drv_8301942',
    numericId: '8301942',
    name: 'Marcus T.',
    phone: '07501 419198',
    vehicleType: 'Luton Box Van with 500kg Tail-Lift',
    status: 'active',
    pairedDeviceId: null,
    isBroadcasting: false,
    lastActiveAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    currentDeliveryCode: null,
  },
];

// Default seed active consignment (Manchester to Birmingham transit corridor)
const now = new Date();
const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

const SEED_SESSIONS: Record<string, DeliveryTrackingSession> = {
  'MFT-84920': {
    code: 'MFT-84920',
    sender: 'Precision Engineering Ltd (Oldham)',
    recipient: 'Advanced Aero Components (Birmingham)',
    originAddress: 'MFT Central Hub, Vulcan Street, Oldham',
    originPostcode: 'OL8 1EZ',
    destinationAddress: 'Fort Dunlop Industrial Park, Birmingham',
    destinationPostcode: 'B24 8HX',
    originCoords: { lat: 53.5409, lng: -2.1114 },
    destinationCoords: { lat: 52.5113, lng: -1.8227 },
    assignedDriverId: 'drv_7492015',
    driverNumericId: '7492015',
    driverName: 'David K.',
    vehicleType: 'Mercedes Sprinter LWB',
    status: 'In Transit',
    driverLocation: {
      lat: 52.8845,
      lng: -2.1382, // Near Stafford on M6
      speedMph: 56,
      heading: 172,
      accuracyMeters: 8,
      updatedAt: new Date().toISOString(),
    },
    packageDescription: 'Dedicated High-Value Aerospace Tooling (2 Pallets, 480kg)',
    eta: '45 mins (Direct Dedicated Road Transit)',
    createdAt: now.toISOString(),
    expiresAt: fiveDaysFromNow.toISOString(),
    checkpoints: [
      {
        time: '08:15',
        status: 'Collected & Secured',
        location: 'Oldham Commercial Facility (OL8 1EZ)',
        completed: true,
        notes: 'Secured with heavy load ratchet straps and weather sealing.',
      },
      {
        time: '08:45',
        status: 'Departed Greater Manchester',
        location: 'M60 J22 -> M6 Southbound',
        completed: true,
        notes: 'Transit uninterrupted, live telemetry active.',
      },
      {
        time: '09:30',
        status: 'In Transit (Stafford Corridor)',
        location: 'M6 Junction 14',
        completed: true,
        notes: 'Average speed 56 mph, traffic smooth.',
      },
      {
        time: '10:45',
        status: 'Approaching Destination',
        location: 'Fort Dunlop Logistics Gate, Birmingham',
        completed: false,
        notes: 'Recipient notified for immediate ground ramp reception.',
      },
      {
        time: '11:00',
        status: 'Delivered & Signed',
        location: 'B24 8HX Goods In',
        completed: false,
        notes: 'Electronic proof of delivery (ePOD) handover.',
      },
    ],
  },
};

// Cross-tab real-time sync broadcaster
const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window ? new BroadcastChannel('mft_tracking_bus') : null;

export class TrackingService {
  private static getDeviceId(): string {
    let id = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEYS.DEVICE_ID, id);
    }
    return id;
  }

  // --- DRIVER REPOSITORY ---
  static getDrivers(): DriverAccount[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DRIVERS);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(SEED_DRIVERS));
      return SEED_DRIVERS;
    } catch {
      return SEED_DRIVERS;
    }
  }

  private static saveDrivers(drivers: DriverAccount[]) {
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
    channel?.postMessage({ type: 'DRIVERS_UPDATED' });
  }

  static getDriverById(id: string): DriverAccount | null {
    const drivers = this.getDrivers();
    return drivers.find(d => d.id === id) || null;
  }

  // Pure 7-digit numeric login verification
  static verifyDriverLogin(numericId: string): { success: boolean; driver?: DriverAccount; error?: string } {
    const cleanId = numericId.trim();
    if (!/^\d{7}$/.test(cleanId)) {
      return { success: false, error: 'Driver ID must be exactly 7 numeric digits (e.g. 7492015)' };
    }

    const drivers = this.getDrivers();
    const driver = drivers.find(d => d.numericId === cleanId);

    if (!driver) {
      return { success: false, error: 'Driver ID not recognised. Please verify with MFT Courier Dispatch (07501 419198)' };
    }

    if (driver.status !== 'active') {
      return { success: false, error: 'This Driver account has been set to inactive by dispatch.' };
    }

    const currentDeviceId = this.getDeviceId();

    // Device binding check: if unpaired, bind to this device. If paired, ensure it matches.
    if (!driver.pairedDeviceId) {
      driver.pairedDeviceId = currentDeviceId;
      driver.lastActiveAt = new Date().toISOString();
      this.saveDrivers(drivers);
    } else if (driver.pairedDeviceId !== currentDeviceId) {
      // Re-pairing option or block
      return {
        success: false,
        error: `Driver ID is bound to another device. If you changed your smartphone or cleared cookies, contact dispatch to reset device pairing.`,
      };
    }

    // Persist active driver session locally for seamless revisit auto-login
    this.setActiveDriverSession(driver.id);

    return { success: true, driver };
  }

  static resetDevicePairing(driverId: string): boolean {
    const drivers = this.getDrivers();
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return false;
    driver.pairedDeviceId = null;
    this.saveDrivers(drivers);
    return true;
  }

  static getActiveDriverSession(): DriverAccount | null {
    try {
      const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_DRIVER_SESSION);
      if (!activeId) return null;
      const driver = this.getDriverById(activeId);
      if (driver && driver.status === 'active') {
        return driver;
      }
      return null;
    } catch {
      return null;
    }
  }

  static setActiveDriverSession(driverId: string) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_DRIVER_SESSION, driverId);
  }

  static clearActiveDriverSession() {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_DRIVER_SESSION);
  }

  // Maximum 10 drivers enforcement
  static createDriver(data: { name: string; phone: string; vehicleType: string; numericId?: string }): { success: boolean; driver?: DriverAccount; error?: string } {
    const drivers = this.getDrivers();
    if (drivers.length >= 10) {
      return {
        success: false,
        error: 'Driver limit reached (Maximum 10 authorized drivers allowed on this operational tier). Remove or deactivate an existing driver first.',
      };
    }

    let numericId = data.numericId ? data.numericId.trim() : '';
    if (!numericId) {
      // Auto-generate random 7-digit ID that doesn't collide
      do {
        numericId = Math.floor(1000000 + Math.random() * 9000000).toString();
      } while (drivers.some(d => d.numericId === numericId));
    } else if (!/^\d{7}$/.test(numericId)) {
      return { success: false, error: 'Custom Driver ID must be exactly 7 numeric digits' };
    } else if (drivers.some(d => d.numericId === numericId)) {
      return { success: false, error: 'A driver with this 7-digit ID already exists' };
    }

    const newDriver: DriverAccount = {
      id: 'drv_' + numericId,
      numericId,
      name: data.name.trim(),
      phone: data.phone.trim(),
      vehicleType: data.vehicleType.trim(),
      status: 'active',
      pairedDeviceId: null,
      isBroadcasting: false,
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      currentDeliveryCode: null,
    };

    drivers.push(newDriver);
    this.saveDrivers(drivers);
    return { success: true, driver: newDriver };
  }

  static updateDriver(driverId: string, updates: Partial<DriverAccount>): boolean {
    const drivers = this.getDrivers();
    const index = drivers.findIndex(d => d.id === driverId);
    if (index === -1) return false;

    drivers[index] = {
      ...drivers[index],
      ...updates,
      lastActiveAt: new Date().toISOString(),
    };
    this.saveDrivers(drivers);
    return true;
  }

  static deleteDriver(driverId: string): boolean {
    const drivers = this.getDrivers();
    const filtered = drivers.filter(d => d.id !== driverId);
    if (filtered.length === drivers.length) return false;
    this.saveDrivers(filtered);

    // If deleted driver was active on this device, clear the active session
    try {
      const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_DRIVER_SESSION);
      if (activeId === driverId) {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_DRIVER_SESSION);
      }
    } catch {
      // ignore
    }

    // Clean up or unassign any consignments assigned to this driver
    try {
      const sessions = this.getSessions();
      let hasUpdates = false;
      for (const code of Object.keys(sessions)) {
        if (sessions[code].assignedDriverId === driverId) {
          sessions[code].assignedDriverId = '';
          sessions[code].driverNumericId = '';
          sessions[code].driverName = 'Unassigned';
          hasUpdates = true;
        }
      }
      if (hasUpdates) {
        this.saveSessions(sessions);
      }
    } catch {
      // ignore
    }

    return true;
  }

  // --- ADMIN PASSCODE VERIFICATION ---
  static verifyAdminPasscode(passcode: string): boolean {
    const clean = passcode.trim();
    if (!clean) return false;
    const currentPasscode = localStorage.getItem('mft_admin_passcode') || 'MFT2026';
    return clean === currentPasscode;
  }

  static setAdminPasscode(newPasscode: string): { success: boolean; error?: string } {
    const clean = newPasscode.trim();
    if (clean.length < 6) {
      return { success: false, error: 'Passcode must be at least 6 characters long' };
    }
    localStorage.setItem('mft_admin_passcode', clean);
    return { success: true };
  }

  // --- TRACKING SESSIONS (CONSIGNMENTS) ---
  static generateTrackingCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let suffix = '';
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const num = Math.floor(1000 + Math.random() * 9000);
    return `MFT-${num}-${suffix}`;
  }

  static getSessions(): Record<string, DeliveryTrackingSession> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(SEED_SESSIONS));
      return SEED_SESSIONS;
    } catch {
      return SEED_SESSIONS;
    }
  }

  private static saveSessions(sessions: Record<string, DeliveryTrackingSession>) {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    channel?.postMessage({ type: 'SESSIONS_UPDATED' });
  }

  static getTrackingSession(code: string): { session: DeliveryTrackingSession | null; isExpired: boolean; error?: string } {
    if (!code) return { session: null, isExpired: false };
    const cleanCode = code.trim().toUpperCase();
    const sessions = this.getSessions();
    
    // Look up exact or case-insensitive match
    const matchedKey = Object.keys(sessions).find(k => k.toUpperCase() === cleanCode);
    const session = matchedKey ? sessions[matchedKey] : null;

    if (!session) {
      return { session: null, isExpired: false, error: `Consignment reference "${cleanCode}" was not found.` };
    }

    const expiresAt = new Date(session.expiresAt).getTime();
    const isExpired = Date.now() > expiresAt;

    return { session, isExpired };
  }

  static createTrackingSession(params: {
    code: string;
    sender: string;
    recipient: string;
    originAddress: string;
    originPostcode: string;
    destinationAddress: string;
    destinationPostcode: string;
    assignedDriverId: string;
    packageDescription: string;
    originCoords?: { lat: number; lng: number };
    destinationCoords?: { lat: number; lng: number };
  }): { success: boolean; session?: DeliveryTrackingSession; error?: string } {
    const code = params.code.trim().toUpperCase();
    if (!code) return { success: false, error: 'Tracking code is required' };

    const sessions = this.getSessions();
    if (sessions[code]) {
      return { success: false, error: `Consignment code ${code} is already in use` };
    }

    const driver = this.getDriverById(params.assignedDriverId);
    if (!driver) {
      return { success: false, error: 'Assigned driver not found' };
    }

    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(); // 5-day security expiry

    const newSession: DeliveryTrackingSession = {
      code,
      sender: params.sender,
      recipient: params.recipient,
      originAddress: params.originAddress,
      originPostcode: params.originPostcode.toUpperCase(),
      destinationAddress: params.destinationAddress,
      destinationPostcode: params.destinationPostcode.toUpperCase(),
      originCoords: params.originCoords || { lat: 53.5409, lng: -2.1114 }, // Default Manchester Hub
      destinationCoords: params.destinationCoords || { lat: 52.4862, lng: -1.8904 },
      assignedDriverId: driver.id,
      driverNumericId: driver.numericId,
      driverName: driver.name,
      vehicleType: driver.vehicleType,
      status: 'Dispatched',
      packageDescription: params.packageDescription,
      eta: 'Calculation in progress...',
      createdAt,
      expiresAt,
      checkpoints: [
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Dispatched from Hub',
          location: `${params.originAddress} (${params.originPostcode})`,
          completed: true,
          notes: 'Consignment allocated to dedicated driver.',
        },
      ],
    };

    sessions[code] = newSession;
    this.saveSessions(sessions);

    // Update driver's current delivery
    this.updateDriver(driver.id, { currentDeliveryCode: code });

    return { success: true, session: newSession };
  }

  // Driver GPS location update (throttled broadcast)
  static updateDriverLocation(code: string, driverId: string, location: GPSCoordinate) {
    const sessions = this.getSessions();
    const session = sessions[code];
    if (session && session.assignedDriverId === driverId) {
      session.driverLocation = location;
      // Calculate dynamic progress status if approaching
      if (session.status === 'Dispatched') {
        session.status = 'In Transit';
      }
      this.saveSessions(sessions);
    }

    // Also update driver's active timestamp & broadcasting flag
    this.updateDriver(driverId, {
      isBroadcasting: true,
      lastActiveAt: new Date().toISOString(),
    });
  }

  static updateDeliveryStatus(code: string, status: DeliveryStatus, note?: string) {
    const sessions = this.getSessions();
    const session = sessions[code];
    if (!session) return;

    session.status = status;
    if (note && session.checkpoints) {
      session.checkpoints.push({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status,
        location: status === 'Delivered' ? `${session.destinationAddress}` : 'In Transit Route',
        completed: true,
        notes: note,
      });
    }

    if (status === 'Delivered') {
      // Clear driver's active delivery assignment
      const driver = this.getDriverById(session.assignedDriverId);
      if (driver) {
        this.updateDriver(driver.id, { currentDeliveryCode: null, isBroadcasting: false });
      }
    }

    this.saveSessions(sessions);
  }

  // Cross-component subscription helper
  static subscribe(callback: () => void): () => void {
    const handler = () => callback();
    window.addEventListener('storage', handler);
    channel?.addEventListener('message', handler);

    return () => {
      window.removeEventListener('storage', handler);
      channel?.removeEventListener('message', handler);
    };
  }
}
