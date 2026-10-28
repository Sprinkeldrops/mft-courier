/**
 * Authoritative UK Postcode Geocoding Service for MFT Courier
 * Uses official UK ONS/Ordnance Survey data via api.postcodes.io with Nominatim fallback.
 * Strictly avoids fabricated or hardcoded fallback coordinates.
 */

export interface GeocodeResult {
  success: boolean;
  coords?: { lat: number; lng: number };
  formattedPostcode?: string;
  adminDistrict?: string;
  error?: string;
}

// In-memory cache to prevent redundant network lookups
const postcodeCache = new Map<string, { coords: { lat: number; lng: number }; formattedPostcode: string; adminDistrict?: string }>();

// Standard UK postcode normalizer
export function normalizeUkPostcode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}

export async function geocodeUkPostcode(rawPostcode: string): Promise<GeocodeResult> {
  const clean = normalizeUkPostcode(rawPostcode);
  if (!clean || clean.length < 2) {
    return {
      success: false,
      error: 'Postcode cannot be empty. Please enter a valid UK postcode.',
    };
  }

  // Check cache first
  if (postcodeCache.has(clean)) {
    const cached = postcodeCache.get(clean)!;
    return {
      success: true,
      coords: cached.coords,
      formattedPostcode: cached.formattedPostcode,
      adminDistrict: cached.adminDistrict,
    };
  }

  // 1. Query api.postcodes.io (Authoritative UK Royal Mail & Ordnance Survey dataset)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(clean)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => null);

    if (res.ok && data?.status === 200 && data?.result) {
      const coords = {
        lat: Number(data.result.latitude),
        lng: Number(data.result.longitude),
      };
      const formattedPostcode = data.result.postcode || rawPostcode.toUpperCase();
      const adminDistrict = data.result.admin_district || data.result.region || '';

      if (coords.lat >= 49.5 && coords.lat <= 61.0 && coords.lng >= -8.5 && coords.lng <= 2.0) {
        postcodeCache.set(clean, { coords, formattedPostcode, adminDistrict });
        return { success: true, coords, formattedPostcode, adminDistrict };
      }
    } else if (data?.terminated?.latitude && data?.terminated?.longitude) {
      // Historical or re-zoned UK postcode supported directly by Ordnance Survey
      const coords = {
        lat: Number(data.terminated.latitude),
        lng: Number(data.terminated.longitude),
      };
      const formattedPostcode = data.terminated.postcode || rawPostcode.toUpperCase();
      postcodeCache.set(clean, { coords, formattedPostcode });
      return { success: true, coords, formattedPostcode };
    } else if (res.status === 404) {
      // 2. Try Outcode lookup (e.g. B24, OL8, SW1A)
      try {
        // Extract outcode (first 2-4 characters before final 3 chars or whole string)
        const outcodeCandidate = clean.length > 4 ? clean.slice(0, clean.length - 3) : clean;
        const outcodeRes = await fetch(`https://api.postcodes.io/outcodes/${encodeURIComponent(outcodeCandidate)}`);
        if (outcodeRes.ok) {
          const outcodeData = await outcodeRes.json();
          if (outcodeData.status === 200 && outcodeData.result) {
            const coords = {
              lat: Number(outcodeData.result.latitude),
              lng: Number(outcodeData.result.longitude),
            };
            const formattedPostcode = outcodeData.result.outcode || outcodeCandidate;
            const adminDistrict = outcodeData.result.admin_district?.[0] || '';
            postcodeCache.set(clean, { coords, formattedPostcode, adminDistrict });
            return { success: true, coords, formattedPostcode, adminDistrict };
          }
        }
      } catch {
        // Fall through to Nominatim
      }
    }
  } catch {
    // Network or abort, proceed to Nominatim fallback
  }

  // 3. Fallback: OpenStreetMap Nominatim UK Geocoding
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(
      clean
    )}&country=United+Kingdom&format=json&limit=1`;

    const nomRes = await fetch(nominatimUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (nomRes.ok) {
      const nomData = await nomRes.json();
      if (Array.isArray(nomData) && nomData.length > 0) {
        const item = nomData[0];
        const coords = {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        };
        const formattedPostcode = rawPostcode.toUpperCase();
        postcodeCache.set(clean, { coords, formattedPostcode });
        return { success: true, coords, formattedPostcode };
      }
    }
  } catch {
    // Both providers failed
  }

  // Strictly return error — never fabricate or default to Birmingham/Manchester
  return {
    success: false,
    error: `Unable to verify UK postcode "${rawPostcode}". Please verify that this is a valid UK postal code (e.g. OL8 1EZ, SW1A 1AA, B24 8HX, M1 1AE).`,
  };
}
