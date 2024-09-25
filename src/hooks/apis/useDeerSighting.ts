import { API_PATH } from '@/utils/constants';
import { DeerSighting } from '@/interfaces/DeerSighting';

export const createDeerSighting = async (newSighting: DeerSighting) => {
  const response = await fetch(`${API_PATH}/deer_sightings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newSighting),
  });

  if (!response.ok) {
    console.log('error response:');
    console.log(response.json());
    throw new Error('Failed to create deer sighting');
  }

  return response.json();
};
