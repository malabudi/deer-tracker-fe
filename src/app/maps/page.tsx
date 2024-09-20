'use client';

import React from 'react';
import Map from '@/components/map/Map';
import useLocation from '@/hooks/useLocation';
import BottomNav from '@/components/bottom-nav/BottomNav';

const Maps: React.FC = () => {
  const { userLocation, fetchLocation } = useLocation();
  fetchLocation();

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
};

export default Maps;
