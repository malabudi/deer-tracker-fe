import React from 'react';
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  MarkerClusterer,
} from '@react-google-maps/api';
import { DeerSighting } from '@/interfaces/DeerSighting';
import singlePin from '@/assets/singlePin-icon.png';

const containerStyle = {
  width: '100%',
  minHeight: '93vh',
};

interface MapComponentProps {
  latitude: number | null;
  longitude: number | null;
  apiKey: string;
  sightings: DeerSighting[];
}

const Map: React.FC<MapComponentProps> = ({
  latitude,
  longitude,
  apiKey,
  sightings,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  console.log('Sightings in Map component:', sightings);

  if (loadError) {
    return <div>Error loading Google Maps API: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  const customIcon = {
    url: singlePin.src,
    scaledSize: new window.google.maps.Size(70, 75),
  };

  const validSightings = sightings.filter(
    (sighting) =>
      typeof sighting.latitude === 'number' &&
      typeof sighting.longitude === 'number'
  );

  const mapOptions = {
    streetViewControl: false,
    styles: [
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'transit',
        stylers: [{ visibility: 'off' }],
      },
    ],
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: latitude || 0, lng: longitude || 0 }}
      zoom={14}
      options={mapOptions} // Apply the map styles to remove clutter
    >
      {/* Render user's current location marker */}
      {latitude && longitude && (
        <Marker
          position={{ lat: latitude, lng: longitude }}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#4285F4',
            fillOpacity: 3,
            strokeColor: '#ADD8E6',
            strokeWeight: 5,
          }}
          clickable={false}
        />
      )}

      <MarkerClusterer>
        {(clusterer) => (
          <>
            {validSightings.map((sighting, index) => (
              <Marker
                key={index}
                position={{
                  lat: sighting.latitude || 0,
                  lng: sighting.longitude || 0,
                }}
                clusterer={clusterer}
                icon={customIcon}
              />
            ))}
          </>
        )}
      </MarkerClusterer>
    </GoogleMap>
  );
};

export default Map;
