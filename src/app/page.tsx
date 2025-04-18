// material-ui
import Divider from '@mui/material/Divider';

// project-imports
import Hero from 'sections/landing/Hero';
import Technologies from 'sections/landing/Technologies';
import Combo from 'sections/landing/Combo';
import FigmaBlock from 'sections/landing/FigmaBlock';
import Apps from 'sections/landing/Apps';
import Free from 'sections/landing/Free';
import Testimonial from 'sections/landing/Testimonial';
import Partner from 'sections/landing/Partner';
import Subscribe from 'sections/landing/Subscribe';
import SimpleLayout from 'layout/SimpleLayout';

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ==============================|| REDIRECT TO LOGIN PAGE ||============================== //

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return null; // No UI rendered as we're redirecting
}
