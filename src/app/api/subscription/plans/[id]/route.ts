// app/api/subscription/plans/[id]/route.ts

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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  console.log(`DELETE request received for plan ID: ${params.id}`);

  try {
    // Authenticate the request
    const auth = await authenticate();
    if (!auth.authenticated) {
      console.log('Authentication failed in DELETE /subscription/plans/[id]');
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    console.log(`Deleting plan with ID ${params.id} from API`);

    const res = await fetch(`http://localhost:3001/api/plans/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      }
    });

    if (!res.ok) {
      console.log(`Failed to delete plan with ID ${params.id}`);
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete plan');
    }

    console.log(`Plan with ID ${params.id} deleted successfully`);

    // Return a success response with no content
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.log(`Error occurred while deleting plan with ID ${params.id}`, error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  console.log(`GET request received for plan ID: ${params.id}`);

  try {
    // Authenticate the request
    const auth = await authenticate();
    if (!auth.authenticated) {
      console.log('Authentication failed in GET /subscription/plans/[id]');
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    console.log(`Fetching plan with ID ${params.id} from API`);

    const res = await fetch(`http://localhost:3001/api/plans/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      }
    });

    if (!res.ok) {
      console.log(`Failed to fetch plan with ID ${params.id}`);
      throw new Error('Failed to fetch plan');
    }

    console.log(`Plan with ID ${params.id} fetched successfully`);

    const plan = await res.json();
    return NextResponse.json(plan);
  } catch (error: any) {
    console.log(`Error occurred while fetching plan with ID ${params.id}`, error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  console.log(`PUT request received for plan ID: ${params.id}`);

  try {
    // Authenticate the request
    const auth = await authenticate();
    if (!auth.authenticated) {
      console.log('Authentication failed in PUT /subscription/plans/[id]');
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { name, price, duration_days, features, description } = body;

    if (!name || !price || !duration_days || !features) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    console.log(`Updating plan with ID ${params.id}`);

    const res = await fetch(`http://localhost:3001/api/plans/${params.id}`, {
      method: 'PUT',
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
      console.log(`Failed to update plan with ID ${params.id}`);
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || 'Failed to update plan');
    }

    console.log(`Plan with ID ${params.id} updated successfully`);

    const updatedPlan = await res.json();
    return NextResponse.json(updatedPlan);
  } catch (error: any) {
    console.log(`Error occurred while updating plan with ID ${params.id}`, error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}