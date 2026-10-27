export interface GPSCoordinate {
  lat: number;
  lng: number;
  accuracyMeters?: number;
  speedMph?: number;
  heading?: number;
  updatedAt?: string;
}

export type DeliveryStatus = 'Dispatched' | 'In Transit' | 'Approaching' | 'Delivered';

export interface TrackingCheckpointEntry {
  time: string;
  status: string;
  location: string;
  completed: boolean;
  notes?: string;
}

export interface DeliveryTrackingSession {
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
  driverNumericId: string;
  driverName: string;
  vehicleType: string;
  status: DeliveryStatus;
  driverLocation?: GPSCoordinate;
  packageDescription: string;
  eta: string;
  createdAt: string;
  expiresAt: string; // 5 days from createdAt ISO
  checkpoints?: TrackingCheckpointEntry[];
}

export interface DriverAccount {
  id: string;
  numericId: string; // Strictly 7 digits, e.g. "4829104"
  name: string;
  phone: string;
  vehicleType: string;
  status: 'active' | 'inactive';
  pairedDeviceId: string | null;
  isBroadcasting: boolean;
  lastActiveAt: string;
  createdAt: string;
  currentDeliveryCode?: string | null;
}

export interface TrackingStoreState {
  drivers: DriverAccount[];
  sessions: Record<string, DeliveryTrackingSession>;
}
