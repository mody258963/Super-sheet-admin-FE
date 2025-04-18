'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from 'components/Loader';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated' || !session?.user) {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <Loader />;
  }

  return <>{children}</>;
}
