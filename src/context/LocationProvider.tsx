'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { Location, LocationContextType } from '@/interfaces/Location';

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
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
          setUserLocation({ latitude: null, longitude: null });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.log('Geolocation not supported on this device/browser.');
      setUserLocation({ latitude: null, longitude: null });
    }
  }, []);

  // This probably were u wanna make location call more than once big dawg
  useEffect(() => {
    fetchLocation();
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
