import { useState, useEffect, useRef, useCallback } from 'react';
import { GPSCoordinate } from '../types/tracking';

interface UseDriverLocationOptions {
  onLocationUpdate?: (coord: GPSCoordinate) => void;
  minIntervalMs?: number; // Minimum interval between emissions (default 1000ms)
}

export type GPSPermissionStatus = 'granted' | 'prompt' | 'denied' | 'unsupported';

export function useDriverLocation(options: UseDriverLocationOptions = {}) {
  const { onLocationUpdate, minIntervalMs = 1000 } = options;
  const [isWatching, setIsWatching] = useState<boolean>(false);
  const [currentCoord, setCurrentCoord] = useState<GPSCoordinate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<GPSPermissionStatus>('prompt');
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);
  const [lastUpdatedSecondsAgo, setLastUpdatedSecondsAgo] = useState<number>(0);

  const watchIdRef = useRef<number | null>(null);
  const lastEmitTimeRef = useRef<number>(0);
  const wakeLockRef = useRef<any>(null);
  const callbackRef = useRef(onLocationUpdate);

  useEffect(() => {
    callbackRef.current = onLocationUpdate;
  }, [onLocationUpdate]);

  // Query browser permissions if supported
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'permissions' in navigator && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' as PermissionName })
        .then((result) => {
          setPermissionStatus(result.state as GPSPermissionStatus);
          result.onchange = () => {
            setPermissionStatus(result.state as GPSPermissionStatus);
          };
        })
        .catch(() => {
          // Permissions API query not supported for geolocation
        });
    } else if (typeof navigator !== 'undefined' && !('geolocation' in navigator)) {
      setPermissionStatus('unsupported');
    }
  }, []);

  // Timer to track stale GPS signal
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentCoord && currentCoord.updatedAt) {
        const diffSec = Math.floor((Date.now() - new Date(currentCoord.updatedAt).getTime()) / 1000);
        setLastUpdatedSecondsAgo(Math.max(0, diffSec));
      } else {
        setLastUpdatedSecondsAgo(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentCoord]);

  // Request screen wake-lock to prevent mobile browser sleeping while driving
  const requestWakeLock = useCallback(async () => {
    try {
      if (typeof navigator !== 'undefined' && 'wakeLock' in navigator && (navigator as any).wakeLock?.request) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        setWakeLockActive(true);
        wakeLockRef.current.addEventListener('release', () => {
          setWakeLockActive(false);
        });
      }
    } catch {
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

  const handlePosition = useCallback(
    (position: GeolocationPosition) => {
      const now = Date.now();
      // Only throttle if updates are closer than minIntervalMs (1s) to prevent spamming
      if (now - lastEmitTimeRef.current < minIntervalMs) {
        return;
      }
      lastEmitTimeRef.current = now;

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracyMeters = position.coords.accuracy ? Math.round(position.coords.accuracy) : 5;

      // Speed in mph (1 m/s = 2.23694 mph)
      const rawSpeed = position.coords.speed;
      const speedMph = rawSpeed !== null && rawSpeed > 0 ? Math.round(rawSpeed * 2.23694) : 0;
      const heading =
        position.coords.heading !== null && !isNaN(position.coords.heading)
          ? Math.round(position.coords.heading)
          : 0;

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
      setPermissionStatus('granted');
      callbackRef.current?.(coord);
    },
    [minIntervalMs]
  );

  const handleError = useCallback((err: GeolocationPositionError) => {
    let msg = 'Unable to acquire real GPS fix.';
    if (err.code === err.PERMISSION_DENIED) {
      setPermissionStatus('denied');
      msg = 'Location permission was denied. Please allow Location access in your browser or device settings to broadcast telemetry.';
    } else if (err.code === err.POSITION_UNAVAILABLE) {
      msg = 'GPS signal unavailable. Ensure device Location/GPS is switched on with clear sky visibility.';
    } else if (err.code === err.TIMEOUT) {
      msg = 'GPS fix timed out. Reacquiring satellite signal...';
    }
    setError(msg);
  }, []);

  // Explicitly trigger the browser's native location permission prompt
  const requestBrowserPermission = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation hardware is not supported on this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handlePosition(pos);
      },
      (err) => {
        handleError(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [handlePosition, handleError]);

  const startWatching = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by this browser.');
      setPermissionStatus('unsupported');
      return;
    }

    if (watchIdRef.current !== null) {
      return;
    }

    setError(null);
    setIsWatching(true);
    requestWakeLock();

    // High accuracy real hardware GPS tracking (maximumAge: 0 forces fresh GPS readings)
    watchIdRef.current = navigator.geolocation.watchPosition(handlePosition, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
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

  const isStale = lastUpdatedSecondsAgo > 120; // Stale if no update in 2 minutes

  return {
    isWatching,
    currentCoord,
    error,
    permissionStatus,
    wakeLockActive,
    lastUpdatedSecondsAgo,
    isStale,
    requestBrowserPermission,
    startWatching,
    stopWatching,
  };
}
