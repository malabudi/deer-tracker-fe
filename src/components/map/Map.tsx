import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  minHeight: '90vh',
};

interface MapComponentProps {
  latitude: number | null;
  longitude: number | null;
  apiKey: string;
}

const Map: React.FC<MapComponentProps> = ({ latitude, longitude, apiKey }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  if (loadError) {
    return <div>Error loading Google Maps API: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: latitude || 0, lng: longitude || 0 }}
      zoom={18}
    ></GoogleMap>
  );
};
export default Map;
