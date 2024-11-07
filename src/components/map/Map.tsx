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
import Loader from '@/components/loader/Loader';

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
  const [mapCenter, setMapCenter] = useState({
    lat: latitude || 0,
    lng: longitude || 0,
  });

  const [selectedSighting, setSelectedSighting] = useState<DeerSighting | null>(
    null
  );
  const [clusterSightings, setClusterSightings] = useState<DeerSighting[]>([]);
  const [showFullClusterInfo, setShowFullClusterInfo] = useState(false);

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (latitude && longitude) {
      map.setCenter({ lat: latitude, lng: longitude });
      map.setZoom(14);
    }
  };

  const handleMapClick = () => {
    setSelectedSighting(null);
    setClusterSightings([]);
    setShowFullClusterInfo(false);
  };

  const goToLocation = () => {
    if (latitude && longitude && mapRef.current) {
      setMapCenter({ lat: latitude, lng: longitude });
      mapRef.current.setCenter({ lat: latitude, lng: longitude });
      mapRef.current.setZoom(16);
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .gm-ui-hover-effect {
        display: none !important;
      }
      .custom-cluster-marker div {
        position: relative;
        margin-top: 3px;  /* Adjust this value to move the text down */
      }
    `;
    document.head.appendChild(style);

    const interval = setInterval(() => {
      // Find cluster text elements and modify their position
      const clusterTextElements =
        document.querySelectorAll('.gm-style-iw span');
      clusterTextElements.forEach((element) => {
        (element as HTMLElement).style.transform = 'translateY(5px)'; // Adjust this value to move the text
      });
    }, 100);

    return () => {
      document.head.removeChild(style);
      clearInterval(interval);
    };
  }, []);

  if (loadError) {
    return <div>Error loading Google Maps API: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <Loader />;
  }
  const CurrentLocationIcon = {
    url: CurrentLocation.src,
    scaledSize: new window.google.maps.Size(55, 35),
  };

  const customDeerIcon = {
    url: deericon.src,
    scaledSize: new window.google.maps.Size(60, 75),
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
      className: 'custom-cluster-marker',
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

  const handleMarkerClick = (sighting: DeerSighting) => {
    const position = new window.google.maps.LatLng(
      sighting.latitude,
      sighting.longitude
    );
    setClusterSightings([]);

    if (mapRef.current) {
      mapRef.current.panTo(position);
      setSelectedSighting(sighting);

      // Smooth zoom effect
      const targetZoom = 15;
      const currentZoom = mapRef.current.getZoom();
      const zoomSteps = Math.abs(targetZoom - currentZoom);
      const zoomInterval = 100;

      for (let i = 1; i <= zoomSteps; i++) {
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.setZoom(currentZoom + i);
          }
        }, zoomInterval * i);
      }
    }
  };

  const handleClusterClick = (cluster) => {
    const clusterCenter = cluster.getCenter();
    const targetZoom = 15; // Desired zoom level for clusters
    const clusterMarkers = cluster.getMarkers();
    const clusterSightings = clusterMarkers
      .map((marker) =>
        validSightings.find(
          (sighting) =>
            sighting.latitude === marker.getPosition().lat() &&
            sighting.longitude === marker.getPosition().lng()
        )
      )
      .filter(Boolean);

    if (clusterCenter && mapRef.current) {
      mapRef.current.panTo(clusterCenter);
      mapRef.current.setZoom(targetZoom);
      setTimeout(() => {
        setClusterSightings(clusterSightings);
        setShowFullClusterInfo(false);
        setSelectedSighting(null);
      }, 300);
    }
  };

  const renderClusterInfoWindow = () => {
    if (!clusterSightings.length) return null;
    const recentSighting = clusterSightings.reduce((latest, current) => {
      return new Date(current.timestamp) > new Date(latest.timestamp)
        ? current
        : latest;
    }, clusterSightings[0]);
    return (
      <InfoWindow
        position={{
          lat: recentSighting.latitude,
          lng: recentSighting.longitude,
        }}
        options={{ disableAutoPan: true }}
      >
        <div style={{ maxHeight: '150px', overflowY: 'auto', color: 'black' }}>
          {showFullClusterInfo ? (
            <>
              <h3>All Timestamps:</h3>
              <ul>
                {clusterSightings
                  .sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime()
                  )
                  .map((sighting, index) => (
                    <li
                      key={index}
                      style={{ marginLeft: '-12px', marginRight: '12px' }}
                    >
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
                  setShowFullClusterInfo(true);
                  e.stopPropagation();
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
        options={mapOptions}
        onClick={handleMapClick}
      >
        {latitude && longitude && mapRef.current && (
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
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              <h3>Most Recent:</h3>
              <p>{new Date(selectedSighting.timestamp).toLocaleString()}</p>
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
