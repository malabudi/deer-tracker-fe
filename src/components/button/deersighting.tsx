// components/CreateSightingButton.tsx
// yarn
import React from 'react';
import useLocation from '@/hooks/useLocation';
import { createDeerSighting, DeerSighting } from '@/hooks/deersightinglocation';

const CreateSightingButton: React.FC = () => {
  const { latitude, longitude } = useLocation({
    onLocationUpdate: (latitude, longitude) => {
      console.log(
        `Location updated: Latitude: ${latitude}, Longitude: ${longitude}`
      );
    },
  });
  const currentTimestamp = new Date().toISOString();
  const handleCreateSighting = async () => {
    if (latitude !== null && longitude !== null) {
      // Use the DeerSighting interface here for type safety
      const sightingData: DeerSighting = {
        longitude,
        latitude,
        timestamp: currentTimestamp,
        image: null, // Replace with actual image data or remove if not needed
      };

      try {
        const response = await createDeerSighting(sightingData);
        console.log('Deer sighting created:', response);
      } catch (error) {
        console.error('Error creating deer sighting:', error);
      }
    } else {
      console.error('Location data is missing');
    }
  };

  return <button onClick={handleCreateSighting}>Create Deer Sighting</button>;
};

export default CreateSightingButton;
