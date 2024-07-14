import { useState, useEffect, useRef, useCallback } from 'react';

interface UseLocationProps {
  onLocationUpdate: (latitude: number, longitude: number) => void;
}

const useLocation = ({ onLocationUpdate }: UseLocationProps) => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [callCount, setCallCount] = useState<number>(0);

  // eslint-disable-next-line no-undef
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isDevelopment = process.env.NODE_ENV === 'development';

  const fetchLocation = useCallback(() => {
    if (
      navigator.geolocation &&
      (!isDevelopment || (isDevelopment && callCount < 10))
    ) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          onLocationUpdate(latitude, longitude);
          if (isDevelopment) {
            setCallCount((prevCount) => prevCount + 1);
          }
        },
        (error) => {
          console.error('Error fetching geolocation:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }

    if (isDevelopment && callCount >= 10 && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [callCount, isDevelopment, onLocationUpdate]);

  useEffect(() => {
    intervalRef.current = setInterval(fetchLocation, 10000); // Fetch location every 10 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchLocation]);

  return { latitude, longitude, callCount };
};

export default useLocation;
