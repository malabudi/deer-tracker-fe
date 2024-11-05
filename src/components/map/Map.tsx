import React, { useRef, useState, useEffect } from 'react';
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  MarkerClusterer,
  InfoWindow,
} from '@react-google-maps/api';
import { DeerSighting } from '@/interfaces/DeerSighting';
import deericon from '@/assets/deericon.svg';
import mylocation from '@/assets/mylocation.svg';
import CurrentLocation from '@/assets/CurrentLocation.svg';
import styles from './page.module.css';
import Image from 'next/image';

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

  const mapRef = useRef<google.maps.Map | null>(null);
  const zoomTimeout = useRef<number | null>(null); // Track active timeout for zoom steps

  const [mapCenter, setMapCenter] = useState({
    lat: latitude || 0,
    lng: longitude || 0,
  });
  const [mapZoom, setMapZoom] = useState(14);

  const [selectedSighting, setSelectedSighting] = useState<DeerSighting | null>(
    null
  );
  const [clusterSightings, setClusterSightings] = useState<DeerSighting[]>([]);
  const [showFullClusterInfo, setShowFullClusterInfo] = useState(false);

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const handleMapClick = () => {
    setSelectedSighting(null);
    setClusterSightings([]);
    setShowFullClusterInfo(false);
  };

  const goToLocation = () => {
    if (latitude && longitude) {
      setMapCenter({ lat: latitude, lng: longitude });
      mapRef.current.setZoom(14);
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .gm-ui-hover-effect {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
      if (zoomTimeout.current) {
        clearTimeout(zoomTimeout.current);
      }
    };
  }, []);

  if (loadError) {
    return <div>Error loading Google Maps API: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  const CurrentLocationIcon = {
    url: CurrentLocation.src,
    scaledSize: new window.google.maps.Size(30, 35),
  };

  const customDeerIcon = {
    url: deericon.src,
    scaledSize: new window.google.maps.Size(55, 75),
  };

  const validSightings = sightings.filter(
    (sighting) =>
      typeof sighting.latitude === 'number' &&
      typeof sighting.longitude === 'number'
  );

  const clusterStyles = [
    {
      url: deericon.src,
      width: 60,
      height: 60,
      textColor: '#FFFFFF',
      textSize: 22,
    },
  ];

  const mapOptions = {
    streetViewControl: false,
    clickableIcons: false,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'poi.park',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'transit',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'administrative.neighborhood',
        stylers: [{ visibility: 'off' }],
      },
    ],
  };

  const handleSmoothZoomAndCenter = (
    position: google.maps.LatLng,
    targetZoom: number
  ) => {
    if (mapRef.current) {
      // Clear any existing zoom timeout to ensure smooth transition on each click
      if (zoomTimeout.current) {
        clearTimeout(zoomTimeout.current);
      }

      mapRef.current.panTo(position);
      let currentZoom = mapRef.current.getZoom() || 14;

      const zoomInSteps = () => {
        if (mapRef.current && currentZoom < targetZoom) {
          currentZoom += 1;
          mapRef.current.setZoom(currentZoom);
          zoomTimeout.current = window.setTimeout(zoomInSteps, 200);
        } else if (mapRef.current) {
          mapRef.current.panTo(position); // Center position after zoom
        }
      };

      zoomInSteps();
    }
  };

  const handleMarkerClick = (sighting: DeerSighting) => {
    const position = new window.google.maps.LatLng(
      sighting.latitude,
      sighting.longitude
    );
    setSelectedSighting(sighting);
    setClusterSightings([]);
    handleSmoothZoomAndCenter(position, 13);
  };

  const handleClusterClick = (cluster: any) => {
    const clusterCenter = cluster.getCenter();
    const clusterMarkers = cluster.getMarkers();
    const clusterSightings = clusterMarkers
      .map((marker: any) =>
        validSightings.find(
          (sighting) =>
            sighting.latitude === marker.getPosition().lat() &&
            sighting.longitude === marker.getPosition().lng()
        )
      )
      .filter(Boolean);

    setClusterSightings(clusterSightings);
    setShowFullClusterInfo(false);
    setSelectedSighting(null);
    if (clusterCenter) {
      handleSmoothZoomAndCenter(clusterCenter, 15);
    }
  };

  const renderClusterInfoWindow = () => {
    if (!clusterSightings.length) return null;
    const recentSighting = clusterSightings[0];
    return (
      <InfoWindow
        position={{
          lat: recentSighting.latitude,
          lng: recentSighting.longitude,
        }}
        options={{ disableAutoPan: true }}
      >
        <div>
          {showFullClusterInfo ? (
            <>
              <h3>All Timestamps:</h3>
              <ul>
                {clusterSightings.map((sighting, index) => (
                  <li key={index}>
                    {new Date(sighting.timestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h3>Most Recent:</h3>
              <p>{new Date(recentSighting.timestamp).toLocaleString()}</p>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullClusterInfo(true);
                }}
                style={{
                  cursor: 'pointer',
                  color: 'blue',
                  textDecoration: 'underline',
                }}
              >
                See More
              </span>
            </>
          )}
        </div>
      </InfoWindow>
    );
  };

  return (
    <>
      <GoogleMap
        onLoad={onLoad}
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={mapZoom}
        options={mapOptions}
        onClick={handleMapClick}
      >
        {latitude && longitude && (
          <Marker
            position={{ lat: latitude, lng: longitude }}
            icon={CurrentLocationIcon}
          />
        )}

        <MarkerClusterer styles={clusterStyles} onClick={handleClusterClick}>
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
                  icon={customDeerIcon}
                  onClick={() => handleMarkerClick(sighting)}
                />
              ))}
            </>
          )}
        </MarkerClusterer>

        {selectedSighting && (
          <InfoWindow
            position={{
              lat: selectedSighting.latitude,
              lng: selectedSighting.longitude,
            }}
            options={{ disableAutoPan: true }}
          >
            <div>
              <h2>
                Timestamp:{' '}
                {new Date(selectedSighting.timestamp).toLocaleString()}
              </h2>
            </div>
          </InfoWindow>
        )}

        {renderClusterInfoWindow()}
      </GoogleMap>

      <button onClick={goToLocation} className={styles.mapButton}>
        <Image src={mylocation} alt="My Location" />
      </button>
    </>
  );
};

export default Map;
