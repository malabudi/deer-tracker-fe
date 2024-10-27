'use client';

import React from 'react';
import Map from '@/components/map/Map';
import BottomNav from '@/components/bottom-nav/BottomNav';
import { useLocationContext } from '@/context/LocationProvider';
import styles from './page.module.css';

export default function Maps() {
  const { userLocation } = useLocationContext();

  const apiKey = ' '; // (grab form discord) a story has been created to find a better approach

  return (
    <div className={styles.pageWrapper}>
      {userLocation && (
        <Map
          latitude={userLocation?.latitude}
          longitude={userLocation?.longitude}
          apiKey={apiKey}
        />
      )}
      <BottomNav />
    </div>
  );
}
