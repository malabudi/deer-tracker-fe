import { API_PATH } from '@/utils/constants';

export const getUserByEmail = async (email: String) => {
  const response = await fetch(`${API_PATH}/users/?email=${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error(`Get Error ${response.status}: ${await response.text()}`);
    throw new Error('User not found');
  }

  return response.json();
};

export const updateUserEmailVerified = async (
  email: String,
  emailVerified: Date
) => {
  const response = await fetch(
    `${API_PATH}/users?email=${email}&email_verified=${emailVerified}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    console.error(`Get Error ${response.status}: ${await response.text()}`);
    throw new Error('User not found');
  }

  return response.json();
};

export const createUser = async (email: string, password: string) => {
  const response = await fetch(`${API_PATH}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errMsg = await response.text();
    console.error(`Get Error ${response.status}: ${errMsg}`);
    throw new Error(errMsg);
  }

  return response.json();
};

export const updateUserEmail = async (
  currentEmail: string,
  newEmail: string
) => {
  const response = await fetch(`${API_PATH}/users/updateEmail`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      current_email: currentEmail,
      new_email: newEmail,
    }),
  });

  if (!response.ok) {
    const errMsg = await response.text();
    console.error(`Update Error ${response.status}: ${errMsg}`);
    throw new Error(errMsg);
  }

  return response.json();
};

export const updateUserPassword = async (
  email: string,
  currentPasswordHash: string,
  newPassword: string
) => {
  const response = await fetch(`${API_PATH}/users/updatePassword`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      current_password: currentPasswordHash,
      new_password: newPassword,
    }),
  });

  if (!response.ok) {
    const errMsg = await response.text();
    console.error(`Update Password Error ${response.status}: ${errMsg}`);
    throw new Error(errMsg);
  }

  return response.json();
};
