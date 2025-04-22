// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      role?: string | null;
      accessToken: string;
    };
  }

  interface User {
    id: number;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    accessToken: string;
  }
}
