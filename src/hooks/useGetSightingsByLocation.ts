import { useState } from 'react';
import { API_PATH } from '@/utils/constants';
import { DeerSighting } from '@/interfaces/DeerSighting';

const useGetSightingsByLocation = () => {
  const [sightings, setSightings] = useState<DeerSighting[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getSightingsByLocation = async (
    longitude: number,
    latitude: number,
    radius: number
  ) => {
    setLoading(true);
    setError(null);

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

      setSightings(data);
      console.log('Sightings fetched successfully:', data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching sightings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return { sightings, error, loading, getSightingsByLocation };
};

export default useGetSightingsByLocation;
