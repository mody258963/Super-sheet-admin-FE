// app/api/subscription/subscription/expiring-soon/route.ts

import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from "app/api/auth/[...nextauth]/route";

// Helper function to handle authentication
async function authenticate() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { authenticated: false, error: "Unauthorized", status: 401 };
  }
  
  return { authenticated: true, token: session.user.accessToken };
}

// Get subscriptions that are expiring soon
export async function GET(req: NextRequest) {
  console.log('GET request received for expiring-soon subscriptions');

  try {
    // Authenticate the request
    const auth = await authenticate();
    if (!auth.authenticated) {
      console.log('Authentication failed in GET /subscription/subscription/expiring-soon');
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Get days parameter from URL if provided (default to 30 days)
    const url = new URL(req.url);
    const days = url.searchParams.get('days') || '30';

    console.log(`Fetching subscriptions expiring in the next ${days} days`);

    const res = await fetch(`http://localhost:3001/api/subscriptions/expiring-soon?days=${days}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      }
    });

    if (!res.ok) {
      console.log('Failed to fetch expiring-soon subscriptions');
      throw new Error('Failed to fetch expiring subscriptions');
    }

    console.log('Expiring subscriptions fetched successfully');

    const expiringSubscriptions = await res.json();
    return NextResponse.json(expiringSubscriptions);
  } catch (error: any) {
    console.log('Error occurred while fetching expiring-soon subscriptions', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
