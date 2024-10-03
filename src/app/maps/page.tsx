'use client';

import React from 'react';
import Map from '@/components/map/Map';
import BottomNav from '@/components/bottom-nav/BottomNav';
import { useLocationContext } from '@/context/LocationContext';

export default function Maps() {
  const { userLocation } = useLocationContext();

  const apiKey = ' '; // (grab form discord) a story has been created to find a better approach

  return (
    <>
      {userLocation && (
        <Map
          latitude={userLocation?.latitude}
          longitude={userLocation?.longitude}
          apiKey={apiKey}
        />
      )}
      <BottomNav />
    </>
  );
}
