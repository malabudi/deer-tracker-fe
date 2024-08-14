'use client';

import React from 'react';
import MapComponent from '@/components/MapComponent';
import getLocation from '@/hooks/useLocation';
import BottomNav from '@/components/bottom-nav/BottomNav';

const Maps: React.FC = () => {
  const {
    latitude: currentLatitude,
    longitude: currentLongitude,
    callCount,
  } = getLocation({ onLocationUpdate: () => {} });

  const apiKey = ' '; // (grab form discord) a story has been created to find a better approach

  return (
    <>
      <h1>Maps</h1>
      <h1>Google Maps API Integration</h1>
      <MapComponent
        latitude={currentLatitude}
        longitude={currentLongitude}
        apiKey={apiKey}
      />
      <div>
        <h2>Current Location from Custom Hook:</h2>
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
      <BottomNav />
    </>
  );
};

export default Maps;
