import { DeerSighting } from '@/interfaces/DeerSighting';

export const createDeerSighting = async (newSighting: DeerSighting) => {
  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;
  const response = await fetch(`${API_PATH}/deer_sightings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newSighting),
  });

  if (!response.ok) {
    console.error(response.json());
    throw new Error('Failed to create deer sighting');
  }

  return response.json();
};
