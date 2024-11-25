import { VerificationToken } from '@/interfaces/VerificationToken';

export const getVerificationTokenByEmail = async (email: String) => {
  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;
  const response = await fetch(
    `${API_PATH}/verification_token/email?email=${email}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    console.error(`Get Error ${response.status}: ${await response.text()}`);
    throw new Error('Token not found');
  }

  return response.json();
};

export const getVerificationTokenByToken = async (token: String) => {
  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;
  const response = await fetch(
    `${API_PATH}/verification_token/token?token=${token}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    console.error(`Get Error ${response.status}: ${await response.text()}`);
    throw new Error('Unable to authenticate your request');
  }

  return response.json();
};

export const deleteVerificationToken = async (email: String) => {
  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;
  const response = await fetch(
    `${API_PATH}/verification_token?email=${email}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    console.error(`Delete Error ${response.status}: ${await response.text()}`);
    throw new Error('Token not found');
  }

  return response.json();
};

export const createVerificationToken = async (
  verificationToken: VerificationToken
) => {
  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;
  const response = await fetch(`${API_PATH}/verification_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(verificationToken),
  });

  if (!response.ok) {
    console.error(`Post Error ${response.status}: ${await response.text()}`);
    throw new Error('Unable to create token');
  }

  return response.json();
};
