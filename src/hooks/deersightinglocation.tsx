// hooks/useCreateDeerSighting.ts

import API_PATH from '../utils/constants';

export interface DeerSighting {
  image?: null; // Optional, example image data
  longitude: number;
  latitude: number;
  timestamp: string;
}

export const createDeerSighting = async (newSighting: DeerSighting) => {
  const response = await fetch(`${API_PATH}/deer_sightings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newSighting),
  });

  if (!response.ok) {
    throw new Error('Failed to create deer sighting');
  }

  return response.json();
};
