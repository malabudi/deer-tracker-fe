import { API_PATH } from '@/utils/constants';
import { DeerSighting } from '@/interfaces/DeerSighting';

const getSightingsByLocation = async (
  longitude: number,
  latitude: number,
  radius: number
): Promise<DeerSighting[]> => {
  try {
    const response = await fetch(
      `${API_PATH}/get_sightings_by_locationAndRadius?longitude=${longitude}&latitude=${latitude}&radius=${radius}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    console.log('Sightings fetched successfully:', data);
    return data;
  } catch (err: any) {
    console.error('Error fetching sightings:', err.message);
    throw err;
  }
};

export default getSightingsByLocation;
