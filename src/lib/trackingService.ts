import { DeliveryTrackingSession, DriverAccount, GPSCoordinate, DeliveryStatus } from '../types/tracking';

const STORAGE_KEYS = {
  DRIVERS: 'mft_courier_drivers_v2',
  SESSIONS: 'mft_courier_sessions_v2',
  ACTIVE_DRIVER_SESSION: 'mft_active_driver_session_v2',
  DEVICE_ID: 'mft_device_token_v2',
  ADMIN_PASSCODE: 'mft_admin_passcode_v2',
  ADMIN_SESSION: 'mft_admin_auth_v2',
};

// Cross-tab real-time sync broadcaster
const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window ? new BroadcastChannel('mft_tracking_bus_v2') : null;

// Clean up legacy v1 simulated data from localStorage on first run
if (typeof window !== 'undefined') {
  try {
    const legacyKeys = [
      'mft_courier_drivers_v1',
      'mft_courier_sessions_v1',
      'mft_active_driver_session_v1',
      'mft_device_token_v1',
      'mft_admin_auth_v1',
      'mft_admin_passcode',
    ];
    legacyKeys.forEach(k => localStorage.removeItem(k));
  } catch {
    // Ignore storage restrictions
  }
}

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
      return [];
    } catch {
      return [];
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

  static getDriverByNumericId(numericId: string): DriverAccount | null {
    const clean = numericId.trim();
    const drivers = this.getDrivers();
    return drivers.find(d => d.numericId === clean) || null;
  }

  // Pure 7-digit numeric login verification
  static verifyDriverLogin(numericId: string): { success: boolean; driver?: DriverAccount; error?: string } {
    const cleanId = numericId.trim();
    if (!/^\d{7}$/.test(cleanId)) {
      return { success: false, error: 'Driver ID must be exactly 7 numeric digits.' };
    }

    const drivers = this.getDrivers();
    const driver = drivers.find(d => d.numericId === cleanId);

    if (!driver) {
      return { success: false, error: 'Driver ID not recognised. Please verify with MFT Courier Dispatch.' };
    }

    if (driver.status !== 'active') {
      return { success: false, error: 'This Driver account has been deactivated by dispatch operations.' };
    }

    const currentDeviceId = this.getDeviceId();

    // Device binding check: if unpaired, bind to this device. If paired, ensure it matches.
    if (!driver.pairedDeviceId) {
      driver.pairedDeviceId = currentDeviceId;
      driver.lastActiveAt = new Date().toISOString();
      this.saveDrivers(drivers);
    } else if (driver.pairedDeviceId !== currentDeviceId) {
      return {
        success: false,
        error: 'Driver ID is paired with another device. Contact dispatch to reset hardware binding.',
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
  static createDriver(data: { name: string; phone: string; vehicleType: string; numericId?: string }): {
    success: boolean;
    driver?: DriverAccount;
    error?: string;
  } {
    const drivers = this.getDrivers();
    if (drivers.length >= 10) {
      return {
        success: false,
        error: 'Driver limit reached (Maximum 10 active drivers allowed). Deactivate or delete an existing driver first.',
      };
    }

    let numericId = data.numericId ? data.numericId.trim() : '';
    if (!numericId) {
      // Generate clean unique 7-digit ID
      do {
        numericId = Math.floor(1000000 + Math.random() * 9000000).toString();
      } while (drivers.some(d => d.numericId === numericId));
    } else if (!/^\d{7}$/.test(numericId)) {
      return { success: false, error: 'Custom Driver ID must be exactly 7 numeric digits' };
    } else if (drivers.some(d => d.numericId === numericId)) {
      return { success: false, error: 'A driver with this 7-digit ID is already registered' };
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

  /**
   * Driver Deletion:
   * Completely purges the driver, their device pairings, active session,
   * AND all associated consignments, GPS records, and telemetry sessions.
   * Enables the same 7-digit ID to be safely reused without data bleed.
   */
  static deleteDriver(driverId: string): boolean {
    const drivers = this.getDrivers();
    const targetDriver = drivers.find(d => d.id === driverId);
    if (!targetDriver) return false;

    const filteredDrivers = drivers.filter(d => d.id !== driverId);
    this.saveDrivers(filteredDrivers);

    // 1. Invalidate and clear active driver session on this device
    try {
      const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_DRIVER_SESSION);
      if (activeId === driverId) {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_DRIVER_SESSION);
      }
    } catch {
      // ignore
    }

    // 2. Remove all consignments, GPS logs, and tracking sessions associated with this driver
    try {
      const sessions = this.getSessions();
      let modified = false;
      for (const code of Object.keys(sessions)) {
        if (
          sessions[code].assignedDriverId === driverId ||
          sessions[code].driverNumericId === targetDriver.numericId
        ) {
          delete sessions[code];
          modified = true;
        }
      }
      if (modified) {
        this.saveSessions(sessions);
      }
    } catch {
      // ignore
    }

    return true;
  }

  // --- ADMIN PASSCODE VERIFICATION ---
  static isAdminPasscodeConfigured(): boolean {
    const current = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSCODE);
    return Boolean(current && current.trim().length >= 6);
  }

  static verifyAdminPasscode(passcode: string): boolean {
    const clean = passcode.trim();
    if (!clean) return false;
    const currentPasscode = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSCODE);
    // If not yet configured, first-time setup handles initialization
    if (!currentPasscode) {
      return false;
    }
    return clean === currentPasscode;
  }

  static setAdminPasscode(newPasscode: string): { success: boolean; error?: string } {
    const clean = newPasscode.trim();
    if (clean.length < 6) {
      return { success: false, error: 'Passcode must be at least 6 characters long' };
    }
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSCODE, clean);
    return { success: true };
  }

  static getAdminSession(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
  }

  static setAdminSession(authenticated: boolean) {
    if (authenticated) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    }
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
      return {};
    } catch {
      return {};
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

    const matchedKey = Object.keys(sessions).find(k => k.toUpperCase() === cleanCode);
    const session = matchedKey ? sessions[matchedKey] : null;

    if (!session) {
      return {
        session: null,
        isExpired: false,
        error: `Consignment reference "${cleanCode}" was not found or has concluded.`,
      };
    }

    // 5-day expiration enforcement
    const expiresAt = new Date(session.expiresAt).getTime();
    if (Date.now() > expiresAt) {
      // Purge expired session from store
      delete sessions[matchedKey!];
      this.saveSessions(sessions);
      return {
        session: null,
        isExpired: true,
        error: 'This tracking link has concluded after its 5-day security lifespan.',
      };
    }

    return { session, isExpired: false };
  }

  static createTrackingSession(params: {
    code: string;
    sender: string;
    recipient: string;
    originAddress: string;
    originPostcode: string;
    destinationAddress: string;
    destinationPostcode: string;
    originCoords: { lat: number; lng: number };
    destinationCoords: { lat: number; lng: number };
    assignedDriverId: string;
    packageDescription: string;
  }): { success: boolean; session?: DeliveryTrackingSession; error?: string } {
    const code = params.code.trim().toUpperCase();
    if (!code) return { success: false, error: 'Tracking reference code is required' };

    const sessions = this.getSessions();
    if (sessions[code]) {
      return { success: false, error: `Consignment code ${code} is already in use` };
    }

    const driver = this.getDriverById(params.assignedDriverId);
    if (!driver) {
      return { success: false, error: 'Assigned driver not found' };
    }

    if (!params.originCoords || !params.destinationCoords) {
      return { success: false, error: 'Pickup and delivery coordinates are required from valid postcodes.' };
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
      originCoords: params.originCoords,
      destinationCoords: params.destinationCoords,
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
          location: `${params.originAddress} (${params.originPostcode.toUpperCase()})`,
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

  // Real Driver GPS location update
  static updateDriverLocation(code: string, driverId: string, location: GPSCoordinate) {
    const sessions = this.getSessions();
    const session = sessions[code];
    if (session && session.assignedDriverId === driverId && session.status !== 'Delivered') {
      session.driverLocation = location;
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
        location: status === 'Delivered' ? `${session.destinationAddress} (${session.destinationPostcode})` : 'In Dedicated Transit',
        completed: true,
        notes: note,
      });
    }

    if (status === 'Delivered') {
      // Clear driver's active delivery assignment and cease location broadcast
      session.driverLocation = undefined;
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
