import { useState, useEffect, useRef } from 'react';
import { OrientationData } from '@gunlink/shared';
import { socketClient } from '../../shared/socket/socketClient';

export function useDeviceOrientation() {
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [currentOrientation, setCurrentOrientation] = useState<OrientationData>({
    alpha: 0,
    beta: 0,
    gamma: 0,
    timestamp: Date.now()
  });

  // Exponential smoothing state
  const prevData = useRef<OrientationData | null>(null);
  const smoothingFactor = 0.35; // Lower = smoother, Higher = more responsive

  const requestPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;

    // iOS 13+ Permission API
    if (
      typeof (DeviceOrientationEvent as any) !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          return true;
        } else {
          setPermissionGranted(false);
          return false;
        }
      } catch (e) {
        console.error('DeviceOrientation permission error:', e);
        setPermissionGranted(false);
        return false;
      }
    } else {
      // Android / Non-iOS Chrome
      setPermissionGranted(true);
      return true;
    }
  };

  useEffect(() => {
    if (!('DeviceOrientationEvent' in window)) {
      setIsSupported(false);
      return;
    }

    let lastEmitTime = 0;
    const emitIntervalMs = 16; // ~60 Hz update rate

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const alpha = event.alpha || 0;
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;

      // Apply Exponential Smoothing Filter to prevent sensor jitter
      let smoothedAlpha = alpha;
      let smoothedBeta = beta;
      let smoothedGamma = gamma;

      if (prevData.current) {
        smoothedAlpha = prevData.current.alpha + smoothingFactor * (alpha - prevData.current.alpha);
        smoothedBeta = prevData.current.beta + smoothingFactor * (beta - prevData.current.beta);
        smoothedGamma = prevData.current.gamma + smoothingFactor * (gamma - prevData.current.gamma);
      }

      const orientationData: OrientationData = {
        alpha: Math.round(smoothedAlpha * 100) / 100,
        beta: Math.round(smoothedBeta * 100) / 100,
        gamma: Math.round(smoothedGamma * 100) / 100,
        timestamp: Date.now()
      };

      prevData.current = orientationData;
      setCurrentOrientation(orientationData);

      // Stream data to Display via Socket.IO
      const now = Date.now();
      if (now - lastEmitTime >= emitIntervalMs) {
        lastEmitTime = now;
        socketClient.sendOrientation(orientationData);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  return {
    currentOrientation,
    isSupported,
    permissionGranted,
    requestPermission
  };
}
