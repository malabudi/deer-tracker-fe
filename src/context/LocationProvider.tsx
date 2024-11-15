'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { Location, LocationContextType } from '@/interfaces/Location';
import { fetchLocationCooldown } from '@/utils/constants';

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  const fetchLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Only update userLocation if it's different than the recently fetched location
          if (
            !userLocation ||
            userLocation.latitude !== latitude ||
            userLocation.longitude !== longitude
          ) {
            setUserLocation({ latitude, longitude });
            console.log('Fetched location from timer:', {
              latitude,
              longitude,
            });
          }
        },
        (error) => {
          console.error(
            'Error getting user location:',
            error.code,
            error.message
          );
          setUserLocation({ latitude: null, longitude: null });
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      console.log('Geolocation not supported on this device/browser.');
      setUserLocation({ latitude: null, longitude: null });
    }
  }, [userLocation]);

  useEffect(() => {
    fetchLocation();
    const interval = setInterval(fetchLocation, fetchLocationCooldown);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [fetchLocation]);

  return (
    <LocationContext.Provider value={{ userLocation, fetchLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error(
      'useLocationContext must be used within a LocationProvider'
    );
  }
  return context;
};
