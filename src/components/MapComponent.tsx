import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

interface MapComponentProps {
  onLocationUpdate: (latitude: number, longitude: number) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationUpdate }) => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [callCount, setCallCount] = useState<number>(0);

  // eslint-disable-next-line no-undef
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Control flag to limit API calls in development
  const isDevelopment = process.env.NODE_ENV === 'development';

  //const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; // this was my inital approch but its not working as expected
  const apiKey = ''; //Comment when developing
  //const apiKey = "AIzaSyCAwTonwIQ7T8AqFXgxk7ksCxol38ChLS8"; // uncomment when in developemnt

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

  if (!apiKey) {
    return <div>Error: Google Maps API key is not defined</div>;
  }

  return (
    <div>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: latitude || 0, lng: longitude || 0 }}
          zoom={18}
        ></GoogleMap>
      </LoadScript>
      {isDevelopment && (
        <div>
          <h2>API Call Count: {callCount}</h2>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
