import { API_PATH } from '@/utils/constants';
import { User } from '@/interfaces/User';

type CreateUserInput = Omit<User, 'user_id' | 'created_at' | 'updated_at'> & {
  password: string;
};

const useCreateUser = () => {
  const createUser = async (userData: CreateUserInput) => {
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
    return data;
  };

  return { createUser };
};

export default useCreateUser;
