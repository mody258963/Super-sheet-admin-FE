// app/api/subscription/subscription/route.ts

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

// Get all subscriptions
export async function GET(req: NextRequest) {
  console.log('GET request received in /subscription/subscription');

  try {
    // Authenticate the request
    const auth = await authenticate();
    if (!auth.authenticated) {
      console.log('Authentication failed in /subscription/subscription');
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    console.log('Fetching subscriptions from API');

    const res = await fetch('http://localhost:3001/api/subscriptions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      }
    });

    if (!res.ok) {
      console.log('Failed to fetch subscriptions from API');
      throw new Error('Failed to fetch subscriptions');
    }

    console.log('Subscriptions fetched successfully');

    const subscriptions = await res.json();
    return NextResponse.json(subscriptions);
  } catch (error: any) {
    console.log('Error occurred in /subscription/subscription', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Create a new subscription
export async function POST(req: NextRequest) {
  try {
    // Authenticate the request
    const auth = await authenticate();
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();

    const { coach_id, plan_id, start_date, end_date, payment_method, payment_reference, payment_notes } = body;

    if (!coach_id || !plan_id || !start_date || !end_date) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const res = await fetch('http://localhost:3001/api/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        coach_id,
        plan_id,
        start_date,
        end_date,
        payment_method: payment_method || '',
        payment_reference: payment_reference || '',
        payment_notes: payment_notes || ''
      })
    });

    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || 'Failed to create subscription');
    }

    const createdSubscription = await res.json();
    return NextResponse.json(createdSubscription, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}