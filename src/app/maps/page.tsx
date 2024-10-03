'use client';

import React, { useEffect } from 'react';
import Map from '@/components/map/Map';
import getLocation from '@/hooks/useLocation';
import BottomNav from '@/components/bottom-nav/BottomNav';
import useGetSightingsByLocation from '@/hooks/useGetSightingsByLocation';

const Maps: React.FC = () => {
  const {
    latitude: currentLatitude,
    longitude: currentLongitude,
    //callCount,
  } = getLocation({ onLocationUpdate: () => {} });

  const apiKey = ' '; // (grab form discord) a story has been created to find a better approach

  // Hook for fetching deer sightings
  const { getSightingsByLocation } = useGetSightingsByLocation();

  // Testing fetching sightings with given coordinates (longitude, latitude, radius)
  useEffect(() => {
    // For testing purposes, calling the function with fixed coordinates.
    getSightingsByLocation(-73.985428, 40.748817, 1); //Sould CONSOLE.LOG two locations, same response as this POSTMAN URL: http://localhost:5000/api/get_sightings_by_locationAndRadius?longitude=-73.985428&latitude=40.748817&radius=1
  }, [getSightingsByLocation]);

  return (
    <>
      <Map
        latitude={currentLatitude}
        longitude={currentLongitude}
        apiKey={apiKey}
      />
      {/* DEBUG
      <div>
        <h2>Current Location:</h2>
        <p>
          Latitude: {currentLatitude !== null ? currentLatitude : 'Fetching...'}
        </p>
        <p>
          Longitude:{' '}
          {currentLongitude !== null ? currentLongitude : 'Fetching...'}
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div>
            <h2>API Call Count: {callCount}</h2>
          </div>
        )}
      </div>
      */}
      <BottomNav />
    </>
  );
};

export default Maps;
