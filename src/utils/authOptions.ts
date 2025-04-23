import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const res = await fetch('http://localhost:3001/api/admins/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });
      
          // Check if the response is JSON
          const contentType = res.headers.get('content-type');
          if (!res.ok || !contentType?.includes('application/json')) {
            console.error('Non-JSON or failed response:', await res.text());
            return null;
          }
      
          const user = await res.json();
      
          // Return expected format
          return {
            id: user.admin_id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken: user.token,
          };
        } catch (error) {
          console.error('Authorize error:', error);
          return null;
        }
      }
      
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id ?? 0; // fallback to 0 or any default
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.role = token.role;
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 1 // Reduced to 1 day for better security
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 1 // Reduced to 1 day for better security
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login', // Redirect to login page on error
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
