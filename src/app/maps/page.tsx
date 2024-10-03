'use client';

import React, { useEffect } from 'react';
import Map from '@/components/map/Map';
import getLocation from '@/hooks/useLocation';
import BottomNav from '@/components/bottom-nav/BottomNav';
import getSightingsByLocation from '@/hooks/getSightingsByLocation';

const Maps: React.FC = () => {
  const {
    latitude: currentLatitude,
    longitude: currentLongitude,
    // callCount,
  } = getLocation({ onLocationUpdate: () => {} });

  const apiKey = ' '; // (grab from discord) a story has been created to find a better approach

  // Fetch sightings using useEffect for testing purposes
  useEffect(() => {
    const fetchSightings = async () => {
      try {
        const sightings = await getSightingsByLocation(
          -73.985428,
          40.748817,
          1
        );
        console.log('Fetched sightings:', sightings);
      } catch (error) {
        console.error('Error fetching sightings:', error);
      }
    };

    fetchSightings();
  }, []);

  return (
    <>
      <Map
        latitude={currentLatitude}
        longitude={currentLongitude}
        apiKey={apiKey}
      />
      <BottomNav />
    </>
  );
};

export default Maps;
