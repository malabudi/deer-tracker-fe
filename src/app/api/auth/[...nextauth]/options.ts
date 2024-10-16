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
        const action = req.body?.action;

        try {
          if (action === 'signup') {
            const signupRes = await fetch(`${API_PATH}/users`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            });

            if (!signupRes.ok) {
              const errorMessage = await signupRes.text();
              console.error('Signup API error:', errorMessage);
              throw new Error('Failed to sign up');
            }

            const newUser = await signupRes.json();

            if (!newUser) {
              throw new Error('User data is missing');
            }

            return newUser;
          } else if (action === 'login') {
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
            return user;
          }

          // neither action specified
          return null;
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
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
};
