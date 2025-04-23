// app/api/subscription/subscription/[id]/cancel/route.ts

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

// Cancel a subscription
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  console.log(`POST request received to cancel subscription ID: ${params.id}`);

  try {
    // Authenticate the request
    const auth = await authenticate();
    if (!auth.authenticated) {
      console.log('Authentication failed in POST /subscription/subscription/[id]/cancel');
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Get the cancellation details from the request body
    const body = await req.json();
    const { cancellation_reason } = body;

    console.log(`Cancelling subscription with ID ${params.id}`);

    const res = await fetch(`http://localhost:3001/api/subscriptions/${params.id}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        cancellation_reason: cancellation_reason || ''
      })
    });

    if (!res.ok) {
      console.log(`Failed to cancel subscription with ID ${params.id}`);
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || 'Failed to cancel subscription');
    }

    console.log(`Subscription with ID ${params.id} cancelled successfully`);

    const cancelledSubscription = await res.json();
    return NextResponse.json(cancelledSubscription);
  } catch (error: any) {
    console.log(`Error occurred while cancelling subscription with ID ${params.id}`, error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
