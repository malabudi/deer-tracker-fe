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
  const bouncingClusterRef = useRef<Element | null>(null);
  const [bouncingMarker, setBouncingMarker] = useState<number | null>(null);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<number | null>(
    null
  );

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (latitude && longitude) {
      map.setCenter({ lat: latitude, lng: longitude });
      map.setZoom(16);
    }
  };

  const handleMapClick = () => {
    setSelectedSighting(null);
    setClusterSightings([]);
    setShowFullClusterInfo(false);
    setSelectedMarkerIndex(null);
    removeBounceEffect();
    setBouncingMarker(null); // Stop bouncing when map is clicked
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
        margin-top: 3px;
      }
      .bounce {
        animation: googleBounce 0.7s ease-in-out infinite;
      }
      @keyframes googleBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }
      .marker-icon {
        position: relative;
        width: 60px;
        height: 75px;
        cursor: pointer;
      }
      .marker-icon.bouncing {
        animation: googleBounce 0.7s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
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

  const handleMarkerClick = (sighting: DeerSighting, index: number) => {
    const position = new window.google.maps.LatLng(
      sighting.latitude,
      sighting.longitude
    );
    setClusterSightings([]);
    removeBounceEffect();

    if (mapRef.current) {
      if (selectedMarkerIndex !== index) {
        // First click: zoom in and center on the marker
        setSelectedMarkerIndex(index);
        mapRef.current.panTo(position);
        mapRef.current.setZoom(16); // Adjust zoom level as desired
      } else {
        // Second click: open info window and start bounce
        setSelectedSighting(sighting);
        setBouncingMarker(index);
        // Remove the setTimeout to keep the bounce active
      }
    }
  };

  const handleClusterClick = (cluster) => {
    const clusterCenter = cluster.getCenter();
    const targetZoom = 18; // Set target zoom level to ensure the cluster splits

    if (clusterCenter && mapRef.current) {
      setClusterSightings([]);
      removeBounceEffect();

      // Only zoom if the current zoom level is less than the target zoom
      const currentZoom = mapRef.current.getZoom();
      if (currentZoom < targetZoom) {
        const zoomSteps = Math.abs(targetZoom - currentZoom);
        const zoomInterval = 100;

        for (let i = 1; i <= zoomSteps; i++) {
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.setZoom(currentZoom + i);
              mapRef.current.panTo(clusterCenter);
            }
          }, zoomInterval * i);
        }

        // Populate cluster sightings after reaching target zoom
        setTimeout(() => {
          const clusterMarkers = cluster.getMarkers();
          const clusterSightings = (clusterMarkers || [])
            .map((marker) =>
              validSightings.find(
                (sighting) =>
                  sighting.latitude === marker.getPosition().lat() &&
                  sighting.longitude === marker.getPosition().lng()
              )
            )
            .filter(Boolean);

          setClusterSightings(clusterSightings || []);
          setShowFullClusterInfo(false);
          setSelectedSighting(null);
          addBounceEffect();
        }, zoomInterval * zoomSteps);
      } else {
        // If already zoomed in, directly populate the cluster sightings
        const clusterMarkers = cluster.getMarkers();
        const clusterSightings = (clusterMarkers || [])
          .map((marker) =>
            validSightings.find(
              (sighting) =>
                sighting.latitude === marker.getPosition().lat() &&
                sighting.longitude === marker.getPosition().lng()
            )
          )
          .filter(Boolean);

        setClusterSightings(clusterSightings || []);
        setShowFullClusterInfo(false);
        setSelectedSighting(null);
        addBounceEffect();
      }
    }
  };

  const removeBounceEffect = () => {
    if (bouncingClusterRef.current) {
      bouncingClusterRef.current.classList.remove('bounce');
      bouncingClusterRef.current = null;
    }
  };

  const addBounceEffect = () => {
    const clusterElement = document.querySelector('.custom-cluster-marker');
    if (clusterElement) {
      clusterElement.classList.add('bounce');
      bouncingClusterRef.current = clusterElement;
    }
  };

  const renderClusterInfoWindow = () => {
    const sightingsArray = Array.isArray(clusterSightings)
      ? clusterSightings
      : [];
    if (sightingsArray.length === 0) return null;

    const recentSighting = sightingsArray.reduce((latest, current) => {
      return new Date(current.timestamp) > new Date(latest.timestamp)
        ? current
        : latest;
    }, sightingsArray[0]);

    return (
      <InfoWindow
        position={{
          lat: recentSighting.latitude,
          lng: recentSighting.longitude,
        }}
        options={{
          disableAutoPan: true,
          pixelOffset: new window.google.maps.Size(0, -30),
        }}
        onCloseClick={() => {
          removeBounceEffect();
        }}
      >
        <div style={{ maxHeight: '150px', overflowY: 'auto', color: 'black' }}>
          {showFullClusterInfo ? (
            <>
              <h3>All Timestamps:</h3>
              <ul>
                {sightingsArray
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
        options={{ ...mapOptions, gestureHandling: 'greedy' }}
        onIdle={() => mapRef.current?.setOptions({ gestureHandling: 'auto' })}
        onClick={handleMapClick}
      >
        {latitude && longitude && mapRef.current && (
          <Marker
            position={{ lat: latitude, lng: longitude }}
            icon={CurrentLocationIcon}
          />
        )}

        <MarkerClusterer
          styles={clusterStyles}
          onClick={handleClusterClick}
          options={{
            gridSize: 100,
            maxZoom: 18,
            zoomOnClick: false,
            averageCenter: false,
            clusterClass: 'custom-cluster-marker', // Add this line
            styles: clusterStyles, // Move styles into options
          }}
        >
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
                  onClick={() => handleMarkerClick(sighting, index)}
                  animation={
                    bouncingMarker === index
                      ? window.google.maps.Animation.BOUNCE
                      : undefined
                  }
                  visible={true}
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
            options={{
              disableAutoPan: false,
              pixelOffset: new window.google.maps.Size(0, -70),
            }}
            onCloseClick={() => {
              setSelectedSighting(null);
              setBouncingMarker(null); // Stop bouncing when InfoWindow is closed
            }}
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
        <Image src={mylocation} alt="My Location" width={50} height={50} />
      </button>
    </>
  );
};

export default Map;
