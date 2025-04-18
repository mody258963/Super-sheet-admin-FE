// next
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// project imports
import axios from 'utils/axios';

const users = [
  {
    id: 1,
    name: 'Jone Doe',
    email: 'info@codedthemes.com',
    password: '123456'
  }
];

declare module 'next-auth' {
  interface User {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET_KEY,
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'login',
      credentials: {
        email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          // Ensure the correct endpoint is used
          const response = await axios.post('http://localhost:3001/api/admins/login', {
            email: credentials?.email,
            password: credentials?.password,
          });

          // Validate the response and return the user object
          if (response.data?.user) {
            return {
              id: response.data.user.id,
              name: response.data.user.name,
              email: response.data.user.email,
              accessToken: response.data.token,
            };
          }

          // Return null if no user is found
          return null;
        } catch (error: any) {
          // Log the error for debugging
          console.error('Error in authorize:', error?.response?.data || error.message);
          throw new Error('Invalid credentials');
        }
      }
    }),
    CredentialsProvider({
      id: 'register',
      name: 'Register',
      credentials: {
        firstname: { name: 'firstname', label: 'Firstname', type: 'text', placeholder: 'Enter Firstname' },
        lastname: { name: 'lastname', label: 'Lastname', type: 'text', placeholder: 'Enter Lastname' },
        email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
        company: { name: 'company', label: 'Company', type: 'text', placeholder: 'Enter Company' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          const response = await axios.post('/api/admins/register', {
            name: `${credentials?.firstname} ${credentials?.lastname}`,
            email: credentials?.email,
            password: credentials?.password,
            role: "user",
            status: "active"
          });

          if (response.data.user) {
            return {
              id: response.data.user.id,
              name: response.data.user.name,
              email: response.data.user.email,
              accessToken: response.data.token,
            };
          }
          return null;
        } catch (e: any) {
          const errorMessage = e?.message || e?.response?.data?.message || 'Something went wrong!';
          throw new Error(errorMessage);
        }
      }
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect users to the home page or a custom page after login
      return baseUrl;
    },
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.provider = token.provider;
        session.token = token;
      }
      return session;
    },
    async signIn(params) {
      // Prevent JWT token issuance on registration
      if (params.account?.provider === 'register') {
        return `${process.env.NEXTAUTH_URL}login`;
      }
      return true;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: Number(process.env.NEXT_APP_JWT_TIMEOUT!)
  },
  jwt: {
    secret: process.env.NEXT_APP_JWT_SECRET
  },
  pages: {
    signIn: '/login',
    newUser: '/register'
  }
};
