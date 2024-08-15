import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

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
  if (!apiKey) {
    return <div>Error: Google Maps API key is not defined</div>;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: latitude || 0, lng: longitude || 0 }}
        zoom={18}
      ></GoogleMap>
    </LoadScript>
  );
};

export default Map;
