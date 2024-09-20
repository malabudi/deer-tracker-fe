import { useCallback, useState } from 'react';

const useLocation = () => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  } | null>(null);

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
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.log('Geolocation not supported on this browser.');
      setUserLocation({ latitude: null, longitude: null });
    }
  }, []);

  return { userLocation, fetchLocation };
};

export default useLocation;
