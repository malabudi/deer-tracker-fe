'use client';

import React, { useEffect } from 'react';
import Map from '@/components/map/Map';
import useLocation from '@/hooks/useLocation';
import BottomNav from '@/components/bottom-nav/BottomNav';

export default function Maps() {
  const { userLocation, fetchLocation } = useLocation();
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

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
