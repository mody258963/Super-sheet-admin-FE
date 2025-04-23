// app/api/subscription/subscription/[id]/renew/route.ts

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

// Renew a subscription
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  console.log(`POST request received to renew subscription ID: ${params.id}`);

  try {
    // Authenticate the request
    const auth = await authenticate();
    if (!auth.authenticated) {
      console.log('Authentication failed in POST /subscription/subscription/[id]/renew');
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Get the renewal details from the request body
    const body = await req.json();
    const { payment_method, payment_reference, payment_notes } = body;

    console.log(`Renewing subscription with ID ${params.id}`);

    const res = await fetch(`http://localhost:3001/api/subscriptions/${params.id}/renew`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        payment_method: payment_method || '',
        payment_reference: payment_reference || '',
        payment_notes: payment_notes || ''
      })
    });

    if (!res.ok) {
      console.log(`Failed to renew subscription with ID ${params.id}`);
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || 'Failed to renew subscription');
    }

    console.log(`Subscription with ID ${params.id} renewed successfully`);

    const renewedSubscription = await res.json();
    return NextResponse.json(renewedSubscription);
  } catch (error: any) {
    console.log(`Error occurred while renewing subscription with ID ${params.id}`, error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
