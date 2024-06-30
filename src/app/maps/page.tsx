'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MapComponent from '@/components/MapComponent';

const Maps: React.FC = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const handleLocationUpdate = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  return (
    <>
      <h1>Maps</h1>
      <h1>Google Maps API Integration</h1>
      <MapComponent onLocationUpdate={handleLocationUpdate} />
      <div>
        <h2>Current Location from Parent Component:</h2>
        <p>Latitude: {latitude !== null ? latitude : 'Fetching...'}</p>
        <p>Longitude: {longitude !== null ? longitude : 'Fetching...'}</p>
      </div>
      <div>
        <Link href="/">Go Back</Link>
      </div>
    </>
  );
};

export default Maps;
