import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Play, Pause, Compass, MapPin, ArrowRight, ShieldCheck, Zap, RotateCcw } from 'lucide-react';
import { Galaxy } from './Galaxy';

export interface UkCityNode {
  id: string;
  name: string;
  shortName: string;
  region: string;
  lat: number;
  lng: number;
  approxMiles: number;
  corridor: string;
  transitHours: string;
  subBranches: string[];
  isHub?: boolean;
}

export const UK_NETWORK_CITIES: UkCityNode[] = [
  {
    id: 'manchester',
    name: 'Manchester (OL8 Hub)',
    shortName: 'Manchester',
    region: 'Central Dispatch Hub · Greater Manchester',
    lat: 53.54,
    lng: -2.11,
    approxMiles: 0,
    corridor: 'M60 / M62 / M6 Central Junction Nexus',
    transitHours: 'Hub Origin',
    subBranches: ['Oldham OL8 HQ', 'Trafford Park Logistics', 'Manchester Airport Freight', 'Rochdale M62'],
    isHub: true,
  },
  {
    id: 'london',
    name: 'London & Home Counties',
    shortName: 'London',
    region: 'Greater London & Southern Trunk',
    lat: 51.51,
    lng: -0.12,
    approxMiles: 205,
    corridor: 'M1 / M6 Dedicated Arterial Trunk',
    transitHours: '3.5 - 4.0 hrs',
    subBranches: ['Heathrow Cargo Terminal', 'London Docklands', 'Dartford Crossing', 'Southampton Port', 'Cambridge Tech Arc'],
  },
  {
    id: 'birmingham',
    name: 'Birmingham & West Midlands',
    shortName: 'Birmingham',
    region: 'Midlands Industrial Corridor',
    lat: 52.48,
    lng: -1.89,
    approxMiles: 86,
    corridor: 'M6 Southbound Direct Highway',
    transitHours: '1.5 - 2.0 hrs',
    subBranches: ['Coventry Automotive', 'East Midlands Freight Hub', 'Wolverhampton Manufacturing', 'Stoke-on-Trent'],
  },
  {
    id: 'leeds',
    name: 'Leeds & West Yorkshire',
    shortName: 'Leeds',
    region: 'Trans-Pennine Express Corridor',
    lat: 53.80,
    lng: -1.55,
    approxMiles: 42,
    corridor: 'M62 Trans-Pennine Trunk',
    transitHours: '50 - 65 mins',
    subBranches: ['Bradford Arc', 'York Logistics Hub', 'Hull Maritime Port', 'Wakefield Europort'],
  },
  {
    id: 'liverpool',
    name: 'Liverpool & Merseyside',
    shortName: 'Liverpool',
    region: 'Western Maritime & Container Ports',
    lat: 53.40,
    lng: -2.99,
    approxMiles: 34,
    corridor: 'M62 Westward Highway Route',
    transitHours: '45 - 55 mins',
    subBranches: ['Liverpool Seaforth Docks', 'Warrington Freight Terminal', 'Chester Industrial Park', 'Birkenhead Gateway'],
  },
  {
    id: 'sheffield',
    name: 'Sheffield & South Yorkshire',
    shortName: 'Sheffield',
    region: 'Advanced Manufacturing Innovation Corridor',
    lat: 53.38,
    lng: -1.47,
    approxMiles: 38,
    corridor: 'A57 / M1 Trans-Pennine Link',
    transitHours: '55 - 70 mins',
    subBranches: ['Rotherham AMRC', 'Doncaster iPort', 'Barnsley Commercial Park'],
  },
  {
    id: 'newcastle',
    name: 'Newcastle & North East',
    shortName: 'Newcastle',
    region: 'North East Coastal Arteries',
    lat: 54.98,
    lng: -1.61,
    approxMiles: 135,
    corridor: 'M62 ➔ A1(M) Northward Trunk',
    transitHours: '2.5 - 3.0 hrs',
    subBranches: ['Sunderland Automotive Park', 'Teesside Chemical Complex', 'Durham Gateway', 'Port of Tyne'],
  },
  {
    id: 'bristol',
    name: 'Bristol & South West',
    shortName: 'Bristol',
    region: 'Severnside & South West Trunk',
    lat: 51.45,
    lng: -2.58,
    approxMiles: 170,
    corridor: 'M6 ➔ M5 Southbound Route',
    transitHours: '2.8 - 3.2 hrs',
    subBranches: ['Avonmouth Docks', 'Gloucester M5 Gateway', 'Swindon Commercial Corridor', 'Exeter Logistics Hub'],
  },
  {
    id: 'nottingham',
    name: 'Nottingham & East Midlands',
    shortName: 'Nottingham',
    region: 'East Midlands Logistics Spine',
    lat: 52.95,
    lng: -1.15,
    approxMiles: 72,
    corridor: 'A52 / M1 Express Artery',
    transitHours: '1.5 - 1.8 hrs',
    subBranches: ['Derby Rail & Aero Hub', 'Mansfield Logistics', 'Leicester Distribution Ring'],
  },
  {
    id: 'glasgow',
    name: 'Glasgow & Western Scotland',
    shortName: 'Glasgow',
    region: 'Scottish Gateway & Northern Arteries',
    lat: 55.86,
    lng: -4.25,
    approxMiles: 215,
    corridor: 'M6 ➔ A74(M) ➔ M74 Direct Trunk',
    transitHours: '3.5 - 4.0 hrs',
    subBranches: ['Grangemouth Logistics Port', 'Paisley Commercial Park', 'Clydebank Gateway', 'Ayrshire Transport Hub'],
  },
  {
    id: 'edinburgh',
    name: 'Edinburgh & East Scotland',
    shortName: 'Edinburgh',
    region: 'East Coast Scottish Tech & Commercial Hub',
    lat: 55.95,
    lng: -3.19,
    approxMiles: 220,
    corridor: 'M6 ➔ A702 / A1(M) North Express',
    transitHours: '3.6 - 4.2 hrs',
    subBranches: ['Livingston Freight Hub', 'Fife Industrial Arc', 'Dundee Waterfront', 'Aberdeen Energy Corridor'],
  },
  {
    id: 'cardiff',
    name: 'Cardiff & South Wales',
    shortName: 'Cardiff',
    region: 'Welsh Capital & Coastal Freight Spine',
    lat: 51.48,
    lng: -3.18,
    approxMiles: 185,
    corridor: 'M6 ➔ M5 ➔ M4 Direct Highway',
    transitHours: '3.2 - 3.6 hrs',
    subBranches: ['Newport Distribution Center', 'Swansea Enterprise Zone', 'Bridgend Industrial Hub'],
  },
  {
    id: 'belfast',
    name: 'Belfast & Northern Ireland',
    shortName: 'Belfast',
    region: 'Northern Irish Maritime Ferry Link',
    lat: 54.60,
    lng: -5.93,
    approxMiles: 230,
    corridor: 'M6 ➔ Cairnryan Ferry ➔ Direct Handover',
    transitHours: 'Same-Day Dedicated Handover',
    subBranches: ['Belfast Port Terminal', 'Lisburn Logistics', 'Derry / Londonderry Artery'],
  },
];

// Re-export for compatibility with CoverageSection.tsx
export const DESTINATIONS = UK_NETWORK_CITIES;

// Project latitude and longitude into SVG viewport (viewBox: 0 0 620 740)
function projectCoordinates(lat: number, lng: number): { x: number; y: number } {
  // Calibrated conformal projection for Great Britain & Northern Ireland
  // Bounds: Lat 49.8 to 58.9, Long -8.6 to 2.1
  const latMin = 49.8;
  const latMax = 58.9;
  const lngMin = -8.6;
  const lngMax = 2.1;

  // Aspect ratio scale for ~54.5° latitude
  const latRange = latMax - latMin; // 9.1
  const lngRange = lngMax - lngMin; // 10.7

  const y = ((latMax - lat) / latRange) * 630 + 55;
  const x = ((lng - lngMin) / lngRange) * 520 + 50;

  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

interface UkCourierNetworkMapProps {
  activeDestinationId?: string;
  onSelectDestination?: (dest: UkCityNode) => void;
  className?: string;
}

export const UkCourierNetworkMap: React.FC<UkCourierNetworkMapProps> = ({
  activeDestinationId = 'london',
  onSelectDestination,
  className = '',
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>(activeDestinationId);
  const [hoveredCityId, setHoveredCityId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Sync external prop changes
  useEffect(() => {
    if (activeDestinationId) {
      setSelectedCityId(activeDestinationId);
    }
  }, [activeDestinationId]);

  // Check reduced-motion preferences
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Hub City (Manchester)
  const manchesterCity = useMemo(() => UK_NETWORK_CITIES.find((c) => c.isHub)!, []);
  const hubPoint = useMemo(() => projectCoordinates(manchesterCity.lat, manchesterCity.lng), [manchesterCity]);

  // Destination Cities (all except Manchester)
  const destinationCities = useMemo(() => UK_NETWORK_CITIES.filter((c) => !c.isHub), []);

  // Selected city object
  const activeCity = useMemo(() => {
    const id = hoveredCityId || selectedCityId;
    return UK_NETWORK_CITIES.find((c) => c.id === id) || UK_NETWORK_CITIES[1];
  }, [hoveredCityId, selectedCityId]);

  const handleSelectCity = (city: UkCityNode) => {
    setSelectedCityId(city.id);
    onSelectDestination?.(city);
  };

  // Generate curved bezier routes from Manchester to each city
  const routes = useMemo(() => {
    return destinationCities.map((city, idx) => {
      const destPoint = projectCoordinates(city.lat, city.lng);
      const dx = destPoint.x - hubPoint.x;
      const dy = destPoint.y - hubPoint.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Organic curvature offset: curve arches gracefully away from the center
      // Distinguish north vs south curvature
      const curvatureDirection = destPoint.x < hubPoint.x ? -1 : 1;
      const arcFactor = Math.min(38, Math.max(16, dist * 0.14)) * curvatureDirection;

      // Normal vector
      const nx = -dy / dist;
      const ny = dx / dist;

      // Mid control point with arc displacement
      const midX = (hubPoint.x + destPoint.x) / 2 + nx * arcFactor;
      const midY = (hubPoint.y + destPoint.y) / 2 + ny * arcFactor;

      const pathData = `M ${hubPoint.x} ${hubPoint.y} Q ${midX} ${midY} ${destPoint.x} ${destPoint.y}`;

      // Animation duration based on distance
      const duration = (2.2 + (dist / 140) * 0.8).toFixed(2);
      const delay = ((idx * 0.28) % 1.6).toFixed(2);

      return {
        city,
        destPoint,
        pathData,
        duration,
        delay,
        midX,
        midY,
      };
    });
  }, [destinationCities, hubPoint]);

  return (
    <div
      className={`relative w-full h-[320px] sm:h-[350px] lg:h-[380px] bg-[#08090C] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#232730] shadow-2xl flex flex-col justify-between select-none ${className}`}
    >
      {/* 1. Galaxy Cosmic Particle Background (Smoothly animated stars + mouse repulsion) */}
      <Galaxy
        density={1}
        glowIntensity={0.35}
        starSpeed={0.5}
        mouseRepulsion={true}
        twinkleIntensity={0.3}
        lightMode={false}
        paused={isPaused || prefersReducedMotion}
        className="opacity-95"
      />

      {/* Subtle radial vignette to soften edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(6, 8, 11, 0.82) 100%)',
        }}
        aria-hidden="true"
      />

      {/* 2. Top Header HUD Bar */}
      <div className="relative z-20 px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-3 border-b border-[#1E232D]/70 bg-[#0B0E14]/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse shadow-[0_0_8px_#84CC16]" />
          <div>
            <div className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-white flex items-center gap-1.5">
              <span>MFT UK COURIER NETWORK</span>
              <span className="text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded bg-[#84CC16]/20 text-[#84CC16] font-mono border border-[#84CC16]/30">
                LIVE ARTERIES
              </span>
            </div>
            <div className="text-[9px] text-[#7A8291] font-mono hidden sm:block">
              Central Dispatch Hub: Manchester (OL8) &bull; Nationwide Coverage
            </div>
          </div>
        </div>

        {/* Animation Control (Pause/Resume) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="px-2 py-1 rounded-lg bg-[#141822] hover:bg-[#1C2230] border border-[#2B3242] text-white text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
            title={isPaused ? 'Resume live network motion' : 'Pause animation motion'}
            aria-label={isPaused ? 'Resume animation' : 'Pause animation'}
          >
            {isPaused ? (
              <>
                <Play className="w-2.5 h-2.5 text-[#84CC16] fill-[#84CC16]" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-2.5 h-2.5 text-[#84CC16]" />
                <span>Pause</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Center Interactive Vector UK Map Viewport */}
      <div className="relative z-10 flex-1 w-full min-h-0 flex items-center justify-center p-1 sm:p-2 overflow-hidden">
        <svg
          viewBox="0 0 620 740"
          className="w-full h-full max-h-[210px] sm:max-h-[230px] lg:max-h-[250px] object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Interactive animated UK logistics network map showing routes from Manchester to all major UK destinations"
        >
          <defs>
            {/* Filter for glowing green courier routes */}
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Filter for high-intensity active route */}
            <filter id="activeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5.5" result="blur1" />
              <feGaussianBlur stdDeviation="2" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Filter for Hub beacon glow */}
            <filter id="hubGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.517   0 0 0 0 0.8   0 0 0 0 0.086  0 0 0 1 0"
              />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Route line gradients: Manchester lime green towards cyan or white */}
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#84CC16" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#22D3EE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#A3E635" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="dimRouteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#84CC16" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0E7490" stopOpacity="0.2" />
            </linearGradient>

            {/* Particle pulse glow */}
            <radialGradient id="particleGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="40%" stopColor="#A3E635" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#84CC16" stopOpacity="0" />
            </radialGradient>

            {/* Cyan pulse glow */}
            <radialGradient id="cyanParticleGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="40%" stopColor="#67E8F9" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Precision UK Geographic Graticule Grid Lines (Lat/Long markers) */}
          <g className="opacity-15 font-mono text-[9px] text-[#717E94]" stroke="#334155" strokeWidth="0.6" strokeDasharray="3 4">
            {/* Latitude parallels */}
            <line x1="50" y1="120" x2="570" y2="120" />
            <text x="55" y="115" fill="#64748B" stroke="none">58°N</text>
            <line x1="50" y1="260" x2="570" y2="260" />
            <text x="55" y="255" fill="#64748B" stroke="none">56°N</text>
            <line x1="50" y1="400" x2="570" y2="400" />
            <text x="55" y="395" fill="#64748B" stroke="none">54°N</text>
            <line x1="50" y1="540" x2="570" y2="540" />
            <text x="55" y="535" fill="#64748B" stroke="none">52°N</text>

            {/* Longitude meridians */}
            <line x1="170" y1="60" x2="170" y2="680" />
            <text x="175" y="670" fill="#64748B" stroke="none">6°W</text>
            <line x1="270" y1="60" x2="270" y2="680" />
            <text x="275" y="670" fill="#64748B" stroke="none">4°W</text>
            <line x1="370" y1="60" x2="370" y2="680" />
            <text x="375" y="670" fill="#64748B" stroke="none">2°W</text>
            <line x1="470" y1="60" x2="470" y2="680" />
            <text x="475" y="670" fill="#64748B" stroke="none">0°</text>
          </g>

          {/* Accurate, Recognisable Outline of Great Britain and Northern Ireland */}
          <g className="transition-opacity duration-300">
            {/* Outer subtle shadow/ambient glow behind landmass */}
            <path
              d="
                M 305 60
                C 325 58, 355 65, 375 75
                C 388 88, 395 105, 385 125
                C 375 140, 360 148, 362 165
                C 372 175, 412 185, 418 200
                C 425 218, 400 235, 395 248
                C 390 260, 372 268, 370 280
                C 375 292, 405 305, 410 320
                C 415 340, 435 365, 442 388
                C 450 410, 482 430, 492 452
                C 500 472, 465 485, 458 495
                C 455 510, 480 522, 495 538
                C 512 555, 515 572, 498 585
                C 485 595, 465 590, 450 598
                C 438 605, 430 622, 412 625
                C 395 628, 380 615, 360 618
                C 340 622, 320 635, 295 640
                C 275 645, 245 650, 225 648
                C 215 642, 230 630, 242 622
                C 255 612, 275 615, 290 605
                C 305 595, 318 578, 325 565
                C 315 560, 295 568, 280 565
                C 260 560, 238 545, 242 530
                C 245 515, 265 508, 275 498
                C 285 488, 278 472, 285 460
                C 292 448, 315 442, 328 435
                C 340 425, 335 410, 342 395
                C 350 380, 345 360, 335 345
                C 325 330, 305 320, 295 300
                C 285 280, 278 260, 282 240
                C 288 220, 275 198, 278 178
                C 282 158, 290 140, 285 120
                C 280 100, 285 80, 305 60
                Z
              "
              fill="rgba(14, 18, 24, 0.7)"
              stroke="rgba(132, 204, 22, 0.38)"
              strokeWidth="1.8"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_15px_rgba(132,204,22,0.15)]"
            />

            {/* Coastline internal topographic grid / contour hatch */}
            <path
              d="
                M 305 60
                C 325 58, 355 65, 375 75
                C 388 88, 395 105, 385 125
                C 375 140, 360 148, 362 165
                C 372 175, 412 185, 418 200
                C 425 218, 400 235, 395 248
                C 390 260, 372 268, 370 280
                C 375 292, 405 305, 410 320
                C 415 340, 435 365, 442 388
                C 450 410, 482 430, 492 452
                C 500 472, 465 485, 458 495
                C 455 510, 480 522, 495 538
                C 512 555, 515 572, 498 585
                C 485 595, 465 590, 450 598
                C 438 605, 430 622, 412 625
                C 395 628, 380 615, 360 618
                C 340 622, 320 635, 295 640
                C 275 645, 245 650, 225 648
                C 215 642, 230 630, 242 622
                C 255 612, 275 615, 290 605
                C 305 595, 318 578, 325 565
                C 315 560, 295 568, 280 565
                C 260 560, 238 545, 242 530
                C 245 515, 265 508, 275 498
                C 285 488, 278 472, 285 460
                C 292 448, 315 442, 328 435
                C 340 425, 335 410, 342 395
                C 350 380, 345 360, 335 345
                C 325 330, 305 320, 295 300
                C 285 280, 278 260, 282 240
                C 288 220, 275 198, 278 178
                C 282 158, 290 140, 285 120
                C 280 100, 285 80, 305 60
                Z
              "
              fill="none"
              stroke="rgba(34, 211, 238, 0.15)"
              strokeWidth="0.75"
              strokeDasharray="4 6"
            />

            {/* Northern Ireland landmass outline */}
            <path
              d="
                M 160 280
                C 175 272, 195 275, 208 285
                C 218 295, 222 315, 220 330
                C 218 345, 205 360, 192 368
                C 178 375, 160 372, 150 360
                C 142 348, 140 330, 145 315
                C 148 300, 152 288, 160 280
                Z
              "
              fill="rgba(14, 18, 24, 0.7)"
              stroke="rgba(132, 204, 22, 0.38)"
              strokeWidth="1.8"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_12px_rgba(132,204,22,0.12)]"
            />

            {/* Northern Ireland inner contour */}
            <path
              d="
                M 160 280
                C 175 272, 195 275, 208 285
                C 218 295, 222 315, 220 330
                C 218 345, 205 360, 192 368
                C 178 375, 160 372, 150 360
                C 142 348, 140 330, 145 315
                C 148 300, 152 288, 160 280
                Z
              "
              fill="none"
              stroke="rgba(34, 211, 238, 0.15)"
              strokeWidth="0.75"
              strokeDasharray="3 5"
            />

            {/* Isle of Man */}
            <ellipse
              cx="292"
              cy="365"
              rx="8"
              ry="14"
              transform="rotate(-20 292 365)"
              fill="rgba(14, 18, 24, 0.7)"
              stroke="rgba(132, 204, 22, 0.3)"
              strokeWidth="1.2"
            />

            {/* Isle of Wight */}
            <ellipse
              cx="412"
              cy="638"
              rx="12"
              ry="6"
              fill="rgba(14, 18, 24, 0.7)"
              stroke="rgba(132, 204, 22, 0.3)"
              strokeWidth="1.2"
            />

            {/* Outer Hebrides & Scottish Island accents */}
            <path
              d="M 235 90 C 240 105, 245 130, 250 150"
              stroke="rgba(132, 204, 22, 0.3)"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* 4. Glowing Curved Logistics Corridors (Connections from Manchester) */}
          <g className="routes-layer">
            {routes.map(({ city, pathData, duration, delay }) => {
              const isSelected = activeCity.id === city.id;
              const isAnySelected = Boolean(selectedCityId || hoveredCityId);

              return (
                <g key={`route-${city.id}`} className="transition-all duration-300">
                  {/* Outer ambient blur line */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={isSelected ? '#84CC16' : '#22D3EE'}
                    strokeWidth={isSelected ? 6 : 2.5}
                    strokeOpacity={isSelected ? 0.35 : isAnySelected ? 0.08 : 0.18}
                    filter="url(#routeGlow)"
                  />

                  {/* Core sharp vector path */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={isSelected ? 'url(#routeGradient)' : 'url(#dimRouteGradient)'}
                    strokeWidth={isSelected ? 2.5 : 1.25}
                    strokeOpacity={isSelected ? 1 : isAnySelected ? 0.25 : 0.65}
                    strokeLinecap="round"
                    filter={isSelected ? 'url(#activeGlow)' : undefined}
                  />

                  {/* Moving Courier Light Particles along the connection */}
                  {!isPaused && !prefersReducedMotion && (
                    <>
                      {/* Primary Courier Light Particle */}
                      <circle r={isSelected ? 4.5 : 3.2} fill="url(#particleGlow)">
                        <animateMotion
                          dur={`${duration}s`}
                          repeatCount="indefinite"
                          path={pathData}
                          keyPoints="0;1"
                          keyTimes="0;1"
                        />
                      </circle>

                      {/* Secondary Staggered Particle with slight phase delay */}
                      <circle r={isSelected ? 3.2 : 2.2} fill="url(#cyanParticleGlow)">
                        <animateMotion
                          dur={`${(parseFloat(duration) * 1.15).toFixed(2)}s`}
                          begin={`-${delay}s`}
                          repeatCount="indefinite"
                          path={pathData}
                          keyPoints="0;1"
                          keyTimes="0;1"
                        />
                      </circle>
                    </>
                  )}
                </g>
              );
            })}
          </g>

          {/* 5. Destination City Markers and Interactive Nodes */}
          <g className="cities-layer">
            {destinationCities.map((city) => {
              const pt = projectCoordinates(city.lat, city.lng);
              const isSelected = activeCity.id === city.id;

              return (
                <g
                  key={`city-${city.id}`}
                  onClick={() => handleSelectCity(city)}
                  onMouseEnter={() => setHoveredCityId(city.id)}
                  onMouseLeave={() => setHoveredCityId(null)}
                  className="cursor-pointer group"
                >
                  {/* Hit target area */}
                  <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

                  {/* Pulsing destination ripple */}
                  {isSelected && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="12"
                      fill="none"
                      stroke="#84CC16"
                      strokeWidth="1.5"
                      className="animate-ping"
                      opacity="0.75"
                    />
                  )}

                  {/* Node outer aura */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 7 : 5}
                    fill={isSelected ? '#84CC16' : '#141A24'}
                    stroke={isSelected ? '#FFFFFF' : '#84CC16'}
                    strokeWidth={isSelected ? 2 : 1.25}
                    className="transition-all duration-200 group-hover:scale-125"
                  />

                  {/* Inner center dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 3 : 2}
                    fill={isSelected ? '#121316' : '#A3E635'}
                  />

                  {/* Crisp city label with halo for high contrast */}
                  <text
                    x={pt.x + (pt.x > 380 ? -10 : 10)}
                    y={pt.y + (pt.y > 540 ? -8 : 4)}
                    textAnchor={pt.x > 380 ? 'end' : 'start'}
                    fontSize={isSelected ? '12' : '10'}
                    fontWeight={isSelected ? '800' : '600'}
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                    fill={isSelected ? '#84CC16' : '#E2E8F0'}
                    stroke="#0A0D14"
                    strokeWidth="3.5"
                    paintOrder="stroke fill"
                    className="transition-all duration-150 pointer-events-none select-none tracking-wide"
                  >
                    {city.shortName}
                  </text>
                </g>
              );
            })}
          </g>

          {/* 6. MANCHESTER CENTRAL HUB (Special Featured Landmark) */}
          <g className="hub-layer cursor-pointer" onClick={() => handleSelectCity(manchesterCity)}>
            {/* Concentric expanding radar rings */}
            <circle
              cx={hubPoint.x}
              cy={hubPoint.y}
              r="24"
              fill="none"
              stroke="#84CC16"
              strokeWidth="1"
              strokeDasharray="2 3"
              opacity="0.4"
              className={!isPaused && !prefersReducedMotion ? 'animate-spin' : ''}
              style={{ animationDuration: '14s' }}
            />
            <circle
              cx={hubPoint.x}
              cy={hubPoint.y}
              r="16"
              fill="rgba(132, 204, 22, 0.15)"
              stroke="#84CC16"
              strokeWidth="1.5"
              className={!isPaused && !prefersReducedMotion ? 'animate-pulse' : ''}
            />

            {/* Glowing central core */}
            <circle
              cx={hubPoint.x}
              cy={hubPoint.y}
              r="7"
              fill="#84CC16"
              stroke="#FFFFFF"
              strokeWidth="2"
              filter="url(#hubGlow)"
            />
            <circle cx={hubPoint.x} cy={hubPoint.y} r="3" fill="#121316" />

            {/* Prominent Hub Badge */}
            <g transform={`translate(${hubPoint.x + 14}, ${hubPoint.y - 12})`}>
              <rect
                x="-4"
                y="-13"
                width="146"
                height="22"
                rx="6"
                fill="#12161F"
                stroke="#84CC16"
                strokeWidth="1.5"
                className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
              />
              <circle cx="5" cy="-2" r="3" fill="#84CC16" className="animate-pulse" />
              <text
                x="14"
                y="1"
                fill="#FFFFFF"
                fontSize="10"
                fontWeight="800"
                fontFamily="ui-monospace, SFMono-Regular, monospace"
                letterSpacing="0.05em"
              >
                MANCHESTER HUB (OL8)
              </text>
            </g>
          </g>

          {/* Compass Rose Accent in North-West Sea */}
          <g transform="translate(100, 100)" className="opacity-30 pointer-events-none">
            <circle cx="0" cy="0" r="22" fill="none" stroke="#64748B" strokeWidth="0.8" strokeDasharray="2 4" />
            <line x1="0" y1="-28" x2="0" y2="28" stroke="#84CC16" strokeWidth="1" />
            <line x1="-28" y1="0" x2="28" y2="0" stroke="#64748B" strokeWidth="1" />
            <polygon points="0,-28 -4,-16 0,-20 4,-16" fill="#84CC16" />
            <text x="0" y="-32" textAnchor="middle" fill="#84CC16" fontSize="9" fontWeight="bold" fontFamily="monospace">N</text>
            <text x="0" y="16" textAnchor="middle" fill="#717E94" fontSize="8" fontFamily="monospace">UK GRID</text>
          </g>
        </svg>
      </div>

      {/* 4. Bottom Interactive Route Telemetry Card (Active Corridor Details) */}
      <div className="relative z-20 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-t from-[#090C12] via-[#0E121A]/95 to-[#131822]/90 border-t border-[#232938] backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Active Corridor Summary */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[9px] font-mono">
              <span className="text-[#84CC16] uppercase tracking-wider font-bold flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-[#84CC16]" />
                <span>PRIMARY ARTERY</span>
              </span>
              <span className="text-white/20">&bull;</span>
              <span className="text-[#A0AEC0]">
                DIRECT TRANSIT
              </span>
            </div>

            <div className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5 tracking-tight leading-tight">
              <span>Manchester OL8</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#84CC16] shrink-0" />
              <span className="text-[#84CC16]">{activeCity.name}</span>
              {activeCity.approxMiles > 0 && (
                <span className="text-xs font-mono font-normal text-[#84CC16]/90 ml-1">
                  (~{activeCity.approxMiles} mi)
                </span>
              )}
            </div>

            <div className="text-[11px] font-mono text-[#94A3B8]">
              Artery: <strong className="text-white font-medium">{activeCity.corridor}</strong>
            </div>
          </div>

          {/* Quick Select Buttons for Key Trunks */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
            {['london', 'birmingham', 'leeds', 'glasgow', 'bristol'].map((id) => {
              const c = UK_NETWORK_CITIES.find((item) => item.id === id);
              if (!c) return null;
              const isCurr = activeCity.id === c.id;

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectCity(c)}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isCurr
                      ? 'bg-[#84CC16] text-[#121316] shadow-[0_0_10px_rgba(132,204,22,0.4)]'
                      : 'bg-[#181E29] hover:bg-[#222A38] text-[#94A3B8] hover:text-white border border-[#2B3444]'
                  }`}
                >
                  {c.shortName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Connected Sub-branches on desktop */}
        {activeCity.subBranches && activeCity.subBranches.length > 0 && (
          <div className="hidden md:flex items-center gap-1.5 text-[9px] font-mono text-[#94A3B8] truncate pt-1 border-t border-[#1F2636]/60 mt-1">
            <span className="text-[#64748B] shrink-0 uppercase tracking-wider font-semibold">
              Hubs:
            </span>
            <span className="truncate text-[#CBD5E1]">
              {activeCity.subBranches.join(' · ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
