import { useState, useEffect, useRef, useCallback } from 'react';
import { GPSCoordinate } from '../types/tracking';

interface UseDriverLocationOptions {
  onLocationUpdate?: (coord: GPSCoordinate) => void;
  throttleIntervalMs?: number; // Default 12,000ms (12s) to stay safe under Firebase Spark free limits
}

export function useDriverLocation(options: UseDriverLocationOptions = {}) {
  const { onLocationUpdate, throttleIntervalMs = 12000 } = options;
  const [isWatching, setIsWatching] = useState<boolean>(false);
  const [currentCoord, setCurrentCoord] = useState<GPSCoordinate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);

  const watchIdRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const wakeLockRef = useRef<any>(null);
  const callbackRef = useRef(onLocationUpdate);

  useEffect(() => {
    callbackRef.current = onLocationUpdate;
  }, [onLocationUpdate]);

  // Request screen wake-lock to prevent mobile browser sleeping while driving
  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator && (navigator as any).wakeLock?.request) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        setWakeLockActive(true);
        wakeLockRef.current.addEventListener('release', () => {
          setWakeLockActive(false);
        });
      }
    } catch {
      // Wake lock not permitted or unsupported, non-fatal
      setWakeLockActive(false);
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch {
        // Ignore
      }
      wakeLockRef.current = null;
      setWakeLockActive(false);
    }
  }, []);

  const handlePosition = useCallback((position: GeolocationPosition) => {
    const now = Date.now();
    // Enforce throttling to avoid quota exhaustion on Spark
    if (now - lastUpdateRef.current < throttleIntervalMs) {
      return;
    }
    lastUpdateRef.current = now;

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracyMeters = position.coords.accuracy ? Math.round(position.coords.accuracy) : 10;
    
    // Convert m/s to mph (1 m/s = 2.23694 mph)
    const rawSpeed = position.coords.speed;
    const speedMph = rawSpeed !== null && rawSpeed > 0 ? Math.round(rawSpeed * 2.23694) : 0;
    const heading = position.coords.heading !== null && !isNaN(position.coords.heading) ? Math.round(position.coords.heading) : 0;

    const coord: GPSCoordinate = {
      lat,
      lng,
      accuracyMeters,
      speedMph,
      heading,
      updatedAt: new Date().toISOString(),
    };

    setCurrentCoord(coord);
    setError(null);
    callbackRef.current?.(coord);
  }, [throttleIntervalMs]);

  const handleError = useCallback((err: GeolocationPositionError) => {
    let msg = 'Unable to retrieve GPS coordinates.';
    if (err.code === err.PERMISSION_DENIED) {
      msg = 'Location permission denied. Please enable Location in your device browser settings.';
    } else if (err.code === err.POSITION_UNAVAILABLE) {
      msg = 'GPS signal unavailable. Please ensure location services are enabled on your handset.';
    } else if (err.code === err.TIMEOUT) {
      msg = 'GPS connection timed out. Reconnecting...';
    }
    setError(msg);
  }, []);

  const startWatching = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    if (watchIdRef.current !== null) {
      return;
    }

    setError(null);
    setIsWatching(true);
    requestWakeLock();

    // High accuracy watchPosition
    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 5000,
      }
    );
  }, [handlePosition, handleError, requestWakeLock]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    releaseWakeLock();
    setIsWatching(false);
  }, [releaseWakeLock]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (wakeLockRef.current) {
        try {
          wakeLockRef.current.release();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  return {
    isWatching,
    currentCoord,
    error,
    wakeLockActive,
    startWatching,
    stopWatching,
  };
}
