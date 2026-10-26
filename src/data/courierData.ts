import { FleetVehicle } from '../types';

export const COMPANY_DETAILS = {
  name: 'MFT Courier',
  phone: '07501419198',
  phoneInternational: '+447501419198',
  email: 'info@mftcourier.co.uk',
  location: 'OL8, Greater Manchester, United Kingdom',
  area: 'OL8 / Greater Manchester',
  whatsappQuoteUrl: 'https://wa.me/447501419198',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61595253852923',
};

export interface ClientReview {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  comment: string;
  serviceUsed: string;
  rating: number;
  date: string;
}

export const CLIENT_REVIEWS: ClientReview[] = [
  {
    id: 'rev-1',
    name: 'Mark Thornton',
    role: 'Operations Director',
    company: 'Northern Precision Tooling Ltd',
    location: 'Oldham (OL8) ➔ Birmingham',
    comment:
      'We had an urgent manufacturing breakdown with a CNC spindle needed on-site in Birmingham that morning. MFT Courier had a dedicated van at our loading bay within 40 minutes. Having a direct line to the dispatcher on 07501419198 rather than a call centre makes all the difference.',
    serviceUsed: 'Same-Day Dedicated Courier',
    rating: 5,
    date: 'February 2026',
  },
  {
    id: 'rev-2',
    name: 'Sarah Jenkins',
    role: 'Supply Chain Coordinator',
    company: 'Apex Diagnostics & Medical',
    location: 'Manchester ➔ Leeds',
    comment:
      'Transporting clinical diagnostic kits requires non-stop dedicated transit with no depot consolidation. MFT handled our Manchester to Leeds transfers seamlessly. Immediate proof of delivery provided to our team upon handover.',
    serviceUsed: 'Medical & Priority Logistics',
    rating: 5,
    date: 'March 2026',
  },
  {
    id: 'rev-3',
    name: 'David Campbell',
    role: 'Logistics & Events Manager',
    company: 'Meridian Retail Displays',
    location: 'Manchester ➔ London Docklands',
    comment:
      'Booked a 3.5t Luton with hydraulic tail-lift for high-value display fixtures. The driver arrived on schedule, helped secure the cargo with internal load-lock straps, and delivered straight to the London venue. Transparent quotation via WhatsApp within 5 minutes.',
    serviceUsed: 'Pallet & Heavy Freight (Tail-Lift)',
    rating: 5,
    date: 'January 2026',
  },
  {
    id: 'rev-4',
    name: 'Tariq Al-Mansoor',
    role: 'Commercial Lead',
    company: 'Pennine Industrial Fabrications',
    location: 'Greater Manchester ➔ Glasgow',
    comment:
      'Reliable, no-nonsense courier service. When you need direct transport without the risk of parcels sitting in overnight transhipment hubs, MFT Courier is our first call. Great communication throughout.',
    serviceUsed: 'Long-Distance Dedicated Transport',
    rating: 5,
    date: 'April 2026',
  },
];

export const FLEET_VEHICLES: FleetVehicle[] = [
  {
    id: 'small-van',
    name: 'Small Express Courier Van',
    category: 'Rapid Urban & Document Transit',
    image: '/assets/aistudio/img_1_fb94b13d.webp',
    fallbackImage: '/assets/aistudio/imggggg_e7b46986.jpg',
    payloadKg: 400,
    payloadLbs: 880,
    palletCapacity: 1,
    internalDimensions: {
      lengthM: 1.6,
      widthM: 1.2,
      heightM: 1.1,
      volumeM3: 2.1,
    },
    features: [
      'Agile navigation for town & city collections',
      'Lockable partition bulkhead for cargo protection',
      'Accommodates 1 standard Euro pallet or urgent boxed consignments',
      'Direct point-to-point transit from collection point',
    ],
    bestFor: 'Urgent legal documents, replacement tech parts, medical supplies, and compact parcels.',
    baseRatePerMile: 1.45,
    minCharge: 45,
  },
  {
    id: 'medium-sprinter',
    name: 'Medium High-Roof Sprinter Van',
    category: 'Commercial Cargo & Palletised Stock',
    image: '/assets/aistudio/img_2_6835a0f1.webp',
    fallbackImage: '/assets/aistudio/imggggg_e7b46986.jpg',
    payloadKg: 900,
    payloadLbs: 1984,
    palletCapacity: 3,
    internalDimensions: {
      lengthM: 3.3,
      widthM: 1.7,
      heightM: 1.8,
      volumeM3: 10.1,
    },
    features: [
      'Long-wheelbase commercial sprinter chassis',
      'Side sliding door and 270-degree rear barn doors',
      'Integrated cargo lash points and tie-down rails',
      'Direct highway transit for intercity routes',
    ],
    bestFor: '2 to 3 standard UK pallets, commercial stock, retail replenishment, and event equipment.',
    baseRatePerMile: 1.85,
    minCharge: 75,
  },
  {
    id: 'luton-taillift',
    name: '3.5 Tonne Luton Box Van with Tail-Lift',
    category: 'Heavy Freight & Industrial Logistics',
    image: '/assets/aistudio/imggggg_e7b46986.jpg',
    fallbackImage: '/assets/aistudio/img_1_fb94b13d.webp',
    payloadKg: 1100,
    payloadLbs: 2425,
    palletCapacity: 6,
    internalDimensions: {
      lengthM: 4.1,
      widthM: 2.0,
      heightM: 2.2,
      volumeM3: 18.0,
    },
    features: [
      '500kg commercial hydraulic cantilever tail-lift',
      'Smooth internal walls with vertical load-lock tracking',
      'Safe ground-level loading where forklifts are unavailable',
      'Substantial cubic capacity for high-volume commercial runs',
    ],
    bestFor: 'Up to 6 pallets, heavy industrial goods, machinery, and larger commercial transfers.',
    baseRatePerMile: 2.25,
    minCharge: 110,
  },
];

export interface ServiceDefinition {
  num: string;
  id: string;
  title: string;
  summary: string;
  description: string;
  highlights: string[];
}

export const VERIFIED_SERVICES: ServiceDefinition[] = [
  {
    num: '01',
    id: 'same-day',
    title: 'Same-Day Courier',
    summary: 'Direct point-to-point transit from Manchester to any UK destination',
    description:
      'Urgent dedicated transit where your goods travel directly from collection to delivery without intermediate depot consolidation or co-loading.',
    highlights: ['Direct dedicated vehicle', 'Point-to-point journey', 'Handover confirmation'],
  },
  {
    num: '02',
    id: 'next-day',
    title: 'Next-Day UK Delivery',
    summary: 'Reliable scheduled transport for non-emergency intercity runs',
    description:
      'Scheduled courier transport ensuring your parcels, crates, or pallets arrive securely at the destination the following working day.',
    highlights: ['Scheduled collection', 'Mainland UK coverage', 'Clear transit milestones'],
  },
  {
    num: '03',
    id: 'final-mile',
    title: 'Final-Mile Delivery',
    summary: 'Precision regional distribution across Greater Manchester & North West',
    description:
      'Specialised last-mile courier solutions handling time-sensitive drops to commercial addresses, retail outlets, and distribution centers.',
    highlights: ['Local North West expertise', 'Commercial reception delivery', 'Direct signature upon arrival'],
  },
  {
    num: '04',
    id: 'scheduled-delivery',
    title: 'Scheduled Contract Runs',
    summary: 'Recurring inter-branch and B2B shuttle operations',
    description:
      'Regular planned courier transport for businesses requiring consistent weekly or monthly transport between branches, factories, and clients.',
    highlights: ['Fixed schedules', 'Consistent operational routine', 'Direct driver communication'],
  },
  {
    num: '05',
    id: 'overnight-delivery',
    title: 'Overnight Delivery',
    summary: 'Secure priority night-time trunking for early-morning arrival',
    description:
      'Overnight road transport ensuring urgent cargo leaves in the evening and arrives at its destination early the next business morning.',
    highlights: ['Secure overnight movement', 'Direct route transit', 'Early morning drop-off'],
  },
  {
    num: '06',
    id: 'pallet-freight',
    title: 'Pallet & Heavy Freight',
    summary: 'Luton box vans with 500kg hydraulic tail-lifts for industrial cargo',
    description:
      'Heavy freight transport equipped with tail-lifts to handle palletised cargo, industrial equipment, and large commercial consignments.',
    highlights: ['Up to 6 pallets capacity', '500kg hydraulic tail-lift', 'Load-lock cargo securing'],
  },
];
