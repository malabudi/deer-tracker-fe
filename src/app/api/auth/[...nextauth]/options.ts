import { API_PATH } from '@/utils/constants';
import CredentialsProvider from 'next-auth/providers/credentials';

export const options = {
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
      async authorize(credentials): Promise<any> {
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
            throw new Error('Incorrect email address or password');
          }

          const user = await loginRes.json();

          // Check if their email is verified before creating a session
          if (!user.user['email_verified']) {
            throw new Error(
              'Please check your inbox and verify your email address before logging in'
            );
          }

          return user;
        } catch (error) {
          console.error('Error while authorizing: ', error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user['user']['user_id'];
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
};
