// app/api/subscription/subscription/[id]/route.ts

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

// Get a subscription by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  console.log(`GET request received for subscription ID: ${params.id}`);

  try {
    // Authenticate the request
    const auth = await authenticate();
    if (!auth.authenticated) {
      console.log('Authentication failed in GET /subscription/subscription/[id]');
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    console.log(`Fetching subscription with ID ${params.id} from API`);

    const res = await fetch(`http://localhost:3001/api/subscriptions/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      }
    });

    if (!res.ok) {
      console.log(`Failed to fetch subscription with ID ${params.id}`);
      throw new Error('Failed to fetch subscription');
    }

    console.log(`Subscription with ID ${params.id} fetched successfully`);

    const subscription = await res.json();
    return NextResponse.json(subscription);
  } catch (error: any) {
    console.log(`Error occurred while fetching subscription with ID ${params.id}`, error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Update a subscription
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  console.log(`PUT request received for subscription ID: ${params.id}`);

  try {
    // Authenticate the request
    const auth = await authenticate();
    if (!auth.authenticated) {
      console.log('Authentication failed in PUT /subscription/subscription/[id]');
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { coach_id, plan_id, start_date, end_date, status, payment_status, payment_method, payment_reference, payment_notes } = body;

    if (!coach_id || !plan_id || !start_date || !end_date) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    console.log(`Updating subscription with ID ${params.id}`);

    const res = await fetch(`http://localhost:3001/api/subscriptions/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        coach_id,
        plan_id,
        start_date,
        end_date,
        status: status || 'active',
        payment_status: payment_status || 'pending',
        payment_method: payment_method || '',
        payment_reference: payment_reference || '',
        payment_notes: payment_notes || ''
      })
    });

    if (!res.ok) {
      console.log(`Failed to update subscription with ID ${params.id}`);
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || 'Failed to update subscription');
    }

    console.log(`Subscription with ID ${params.id} updated successfully`);

    const updatedSubscription = await res.json();
    return NextResponse.json(updatedSubscription);
  } catch (error: any) {
    console.log(`Error occurred while updating subscription with ID ${params.id}`, error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Delete a subscription
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  console.log(`DELETE request received for subscription ID: ${params.id}`);

  try {
    // Authenticate the request
    const auth = await authenticate();
    if (!auth.authenticated) {
      console.log('Authentication failed in DELETE /subscription/subscription/[id]');
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    console.log(`Deleting subscription with ID ${params.id} from API`);

    const res = await fetch(`http://localhost:3001/api/subscriptions/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      }
    });

    if (!res.ok) {
      console.log(`Failed to delete subscription with ID ${params.id}`);
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete subscription');
    }

    console.log(`Subscription with ID ${params.id} deleted successfully`);

    // Return a success response with no content
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.log(`Error occurred while deleting subscription with ID ${params.id}`, error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}