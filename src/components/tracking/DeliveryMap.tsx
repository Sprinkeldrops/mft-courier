import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GPSCoordinate } from '../../types/tracking';
import { Navigation, Compass, Layers } from 'lucide-react';

interface DeliveryMapProps {
  originCoords: { lat: number; lng: number };
  destinationCoords: { lat: number; lng: number };
  driverLocation?: GPSCoordinate;
  driverName?: string;
  vehicleType?: string;
  destinationAddress?: string;
  originAddress?: string;
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({
  originCoords,
  destinationCoords,
  driverLocation,
  driverName = 'MFT Courier Driver',
  vehicleType = 'Dedicated Van',
  destinationAddress = 'Delivery Destination',
  originAddress = 'Manchester Hub (OL8)',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Leaflet map instance
    const initialCenter: [number, number] = driverLocation
      ? [driverLocation.lat, driverLocation.lng]
      : [(originCoords.lat + destinationCoords.lat) / 2, (originCoords.lng + destinationCoords.lng) / 2];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 9,
      zoomControl: false,
    });
    mapInstanceRef.current = map;

    // Add zoom control top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // High quality OpenStreetMap tiles with dark/clean styling
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Custom Origin Marker (Warehouse / Hub)
    const originIcon = L.divIcon({
      className: 'custom-hub-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-[#121316] border-2 border-[#84CC16] shadow-lg flex items-center justify-center text-white text-[11px] font-mono font-bold">
            HUB
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const originMarker = L.marker([originCoords.lat, originCoords.lng], { icon: originIcon }).addTo(map);
    originMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
        <strong style="color: #121316;">Collection / Hub Point</strong><br/>
        <span style="color: #666;">${originAddress}</span>
      </div>
    `);

    // Custom Destination Marker
    const destIcon = L.divIcon({
      className: 'custom-dest-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-[#84CC16] border-2 border-white shadow-lg flex items-center justify-center text-[#121316] font-bold text-xs">
            🏁
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const destMarker = L.marker([destinationCoords.lat, destinationCoords.lng], { icon: destIcon }).addTo(map);
    destMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
        <strong style="color: #121316;">Delivery Destination</strong><br/>
        <span style="color: #666;">${destinationAddress}</span>
      </div>
    `);

    // Polyline connecting points
    const points: [number, number][] = [
      [originCoords.lat, originCoords.lng],
      ...(driverLocation ? [[driverLocation.lat, driverLocation.lng] as [number, number]] : []),
      [destinationCoords.lat, destinationCoords.lng],
    ];

    const polyline = L.polyline(points, {
      color: '#84CC16',
      weight: 4,
      opacity: 0.85,
      dashArray: '8, 8',
    }).addTo(map);
    routeLineRef.current = polyline;

    // Fit initial bounds to include all markers
    try {
      map.fitBounds(polyline.getBounds(), { padding: [50, 50], maxZoom: 13 });
    } catch {
      // Ignore
    }

    // Force tile recalculation after layout settles
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [originCoords.lat, originCoords.lng, destinationCoords.lat, destinationCoords.lng]);

  // Update, create or remove live driver marker when driverLocation changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!driverLocation) {
      if (driverMarkerRef.current) {
        driverMarkerRef.current.remove();
        driverMarkerRef.current = null;
      }
      if (routeLineRef.current) {
        routeLineRef.current.setLatLngs([
          [originCoords.lat, originCoords.lng],
          [destinationCoords.lat, destinationCoords.lng],
        ]);
      }
      return;
    }

    const latLng: [number, number] = [driverLocation.lat, driverLocation.lng];

    const driverIcon = L.divIcon({
      className: 'custom-driver-vehicle-icon',
      html: `
        <div class="relative flex items-center justify-center group cursor-pointer" style="width: 44px; height: 44px;">
          <!-- Radar pulse beacon -->
          <div class="absolute inset-0 rounded-full bg-[#84CC16]/30 animate-ping"></div>
          <div class="absolute w-10 h-10 rounded-full bg-[#84CC16]/20 border border-[#84CC16]/50"></div>
          <!-- Vehicle Badge -->
          <div class="relative w-8 h-8 rounded-full bg-[#121316] border-2 border-[#84CC16] shadow-xl flex items-center justify-center text-white" style="transform: rotate(${driverLocation.heading || 0}deg); transition: transform 0.5s ease;">
            <svg class="w-4 h-4 text-[#84CC16]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    if (!driverMarkerRef.current) {
      const marker = L.marker(latLng, { icon: driverIcon, zIndexOffset: 1000 }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
          <div style="font-weight: 700; color: #121316;">${driverName}</div>
          <div style="color: #65A30D; font-size: 11px; font-weight: 600;">Live In-Transit Telemetry</div>
          <div style="color: #666; font-size: 11px; margin-top: 4px;">Vehicle: ${vehicleType}</div>
          <div style="color: #666; font-size: 11px;">Speed: ${driverLocation.speedMph || 0} mph</div>
        </div>
      `);
      driverMarkerRef.current = marker;
    } else {
      driverMarkerRef.current.setLatLng(latLng);
      driverMarkerRef.current.setIcon(driverIcon);
    }

    // Update polyline with new location
    if (routeLineRef.current) {
      routeLineRef.current.setLatLngs([
        [originCoords.lat, originCoords.lng],
        latLng,
        [destinationCoords.lat, destinationCoords.lng],
      ]);
    }
  }, [driverLocation, driverName, vehicleType, originCoords, destinationCoords]);

  const handleCenterOnDriver = () => {
    if (mapInstanceRef.current && driverLocation) {
      mapInstanceRef.current.setView([driverLocation.lat, driverLocation.lng], 13, { animate: true });
    }
  };

  const handleFitRoute = () => {
    if (mapInstanceRef.current && routeLineRef.current) {
      mapInstanceRef.current.fitBounds(routeLineRef.current.getBounds(), { padding: [40, 40] });
    }
  };

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-[#E8E2D8] shadow-inner bg-[#EFECE6]">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Controls & Status Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <div className="px-3 py-1.5 rounded-xl bg-[#121316]/90 backdrop-blur-md border border-[#2D313A] text-white flex items-center gap-2 shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-[#84CC16] animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase">Live Telemetry</span>
          {driverLocation?.speedMph !== undefined && (
            <span className="text-[11px] font-mono text-[#84CC16] border-l border-[#333] pl-2 ml-1">
              {driverLocation.speedMph} MPH
            </span>
          )}
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
        {driverLocation && (
          <button
            type="button"
            onClick={handleCenterOnDriver}
            className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5CEC2] text-[#121316] hover:bg-[#F4EFE6] text-xs font-mono font-semibold shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Re-center on Courier Van"
          >
            <Navigation className="w-3.5 h-3.5 text-[#84CC16]" />
            <span>Center Van</span>
          </button>
        )}
        <button
          type="button"
          onClick={handleFitRoute}
          className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5CEC2] text-[#121316] hover:bg-[#F4EFE6] text-xs font-mono font-semibold shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Fit full corridor"
        >
          <Layers className="w-3.5 h-3.5 text-[#7B808B]" />
          <span>Full Route</span>
        </button>
      </div>
    </div>
  );
};
