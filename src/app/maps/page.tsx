'use client';

import React from 'react';
import Map from '@/components/map/Map';
import BottomNav from '@/components/bottom-nav/BottomNav';
import { useQuery } from '@tanstack/react-query';
import getSightingsByLocation from '@/hooks/getSightingsByLocation';
import Loader from '@/components/loader/Loader';
import { useLocationContext } from '@/context/LocationProvider';
import styles from './page.module.css';

export default function Maps() {
  const { userLocation } = useLocationContext();

  const apiKey = '';

  const longitude = userLocation?.longitude;
  const latitude = userLocation?.latitude;
  const radius = 5; // Set desired radius for fetching sightings here

  const canFetch =
    typeof longitude === 'number' && typeof latitude === 'number';

  const {
    data: sightings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['sightings', longitude, latitude],
    queryFn: () => getSightingsByLocation(longitude!, latitude!, radius),
    enabled: canFetch,
  });

  // Console log to verify data fetching
  if (sightings) {
    console.log('Fetched sightings from hook:', sightings);
  }

  if (error) {
    console.error('Error fetching sightings from hook:', error);
  }

  return (
    <div className={styles.pageWrapper}>
      {isLoading && (
        <div>
          <Loader />
        </div>
      )}
      {userLocation && (
        <Map
          latitude={userLocation?.latitude}
          longitude={userLocation?.longitude}
          apiKey={apiKey}
          sightings={sightings || []}
        />
      )}
      <BottomNav />
    </div>
  );
}
