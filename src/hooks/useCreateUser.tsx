// src/hooks/useCreateUser.ts
import { useState } from 'react';
import { API_PATH } from '@/utils/constants';
import { User } from '@/interfaces/User'; // Import the User interface

// Define the input type for creating a user, excluding fields that are auto-generated like created_at and updated_at.
type CreateUserInput = Omit<User, 'user_id' | 'created_at' | 'updated_at'> & {
  password: string; // Include password separately since it’s used for creating users
};

const useCreateUser = () => {
  const [userId, setUserId] = useState<string | null>(null); // Only store the user ID
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);

  const createUser = async (userData: CreateUserInput) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_PATH}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setUserId(data.id); //can get rid of after pr approved, or can be left. same for the userID in the hook
      setSuccess('User added successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { userId, error, loading, success, createUser };
};

export default useCreateUser;
