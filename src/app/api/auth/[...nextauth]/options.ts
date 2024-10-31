import { API_PATH } from '@/utils/constants';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials, req): Promise<any> {
        const { email, password } = credentials;

        try {
          const loginRes = await fetch(`${API_PATH}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!loginRes.ok) {
            const errorMessage = await loginRes.text();
            console.error('Signup API error:', errorMessage);
            throw new Error('Failed to log in');
          }

          const user = await loginRes.json();

          // Check if their email is verified before creating a session
          if (!user.user['email_verified']) {
            throw new Error('Please verify your email before logging in');
          }

          return user;
        } catch (error) {
          console.error('Error while authorizing: ', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    newUser: '/signup',
    verifyRequest: '/verify',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
};
