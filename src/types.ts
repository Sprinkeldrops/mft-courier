export interface FleetVehicle {
  id: string;
  name: string;
  category: string;
  image: string;
  fallbackImage: string;
  payloadKg: number;
  payloadLbs: number;
  palletCapacity: number;
  internalDimensions: {
    lengthM: number;
    widthM: number;
    heightM: number;
    volumeM3: number;
  };
  features: string[];
  bestFor: string;
  baseRatePerMile: number;
  minCharge: number;
}

export interface QuoteRequest {
  pickupPostcode: string;
  deliveryPostcode: string;
  vehicleId: string;
  urgency: 'same-day' | 'priority' | 'overnight';
  packageDescription: string;
  estimatedWeightKg: number;
  collectionDate: string;
  collectionTime: string;
}

export interface QuoteResult {
  distanceMiles: number;
  estimatedDriveTimeHours: number;
  baseCost: number;
  fuelSurcharge: number;
  subtotal: number;
  vat: number;
  total: number;
  pickupPostcode: string;
  deliveryPostcode: string;
  vehicle: FleetVehicle;
  urgency: string;
}

export interface TrackingCheckpoint {
  time: string;
  status: string;
  location: string;
  completed: boolean;
  notes?: string;
}

export interface Consignment {
  id: string;
  sender: string;
  recipient: string;
  origin: string;
  destination: string;
  vehicleType: string;
  driverName: string;
  driverPhone: string;
  currentStatus: 'Dispatched' | 'In Transit' | 'Out for Delivery' | 'Delivered';
  progressPercent: number;
  eta: string;
  speedMph: number;
  ambientTempC: number;
  goodsDescription: string;
  palletsCount: number;
  totalWeightKg: number;
  checkpoints: TrackingCheckpoint[];
}
