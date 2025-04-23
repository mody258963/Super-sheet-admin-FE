// app/api/subscription/subscription/stats/route.ts

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

// Get subscription statistics
export async function GET(req: NextRequest) {
  console.log('GET request received for subscription stats');

  try {
    // Authenticate the request
    const auth = await authenticate();
    if (!auth.authenticated) {
      console.log('Authentication failed in GET /subscription/subscription/stats');
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    console.log('Fetching subscription stats from API');

    const res = await fetch('http://localhost:3001/api/subscriptions/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      }
    });

    if (!res.ok) {
      console.log('Failed to fetch subscription stats');
      throw new Error('Failed to fetch subscription statistics');
    }

    console.log('Subscription stats fetched successfully');

    const stats = await res.json();
    return NextResponse.json(stats);
  } catch (error: any) {
    console.log('Error occurred while fetching subscription stats', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
