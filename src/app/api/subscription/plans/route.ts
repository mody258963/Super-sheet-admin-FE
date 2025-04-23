// app/api/subscription/plans/route.ts

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
export async function GET(req: NextRequest) {
  console.log('GET request received in /subscription/plans');

  try {
    // Authenticate the request
    const auth = await authenticate();
    if (!auth.authenticated) {
      console.log('Authentication failed in /subscription/plans');
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    console.log('Fetching plans from API in /subscription/plans');

    const res = await fetch('http://localhost:3001/api/plans', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      }
    });
    if (!res.ok) {
      console.log('Failed to fetch plans from API in /subscription/plans');
      throw new Error('Failed to fetch plans');
    }

    console.log('Plans fetched successfully in /subscription/plans');

    const plans = await res.json();
    return NextResponse.json(plans);
  } catch (error: any) {
    console.log('Error occurred in /subscription/plans', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
  

  export async function POST(req: NextRequest) {
    try {
      // Authenticate the request
      const auth = await authenticate();
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
      }
  
      const body = await req.json();
  
      const { name, price, duration_days, features, description } = body;
  
      if (!name || !price || !duration_days || !features) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
      }
  
      const res = await fetch('http://localhost:3001/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          name,
          price,
          duration_days,
          features,
          description: description || ''
        })
      });
  
      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.message || 'Failed to create plan');
      }
  
      const createdPlan = await res.json();
      return NextResponse.json(createdPlan, { status: 201 });
  
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
  