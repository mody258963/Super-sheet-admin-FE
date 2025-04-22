import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from "app/api/auth/[...nextauth]/route";

export async function GET() {
    console.log('GET request received'); // Debug: Entry point

    const session = await getServerSession(authOptions);
    console.log('Session:', session); // Debug: Log session details

    if (!session) {
        console.log('Unauthorized access - no session'); // Debug: Unauthorized case
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = session.user.accessToken;
    console.log('Access Token:', token); // Debug: Log token

    try {
        console.log('Fetching admins from API'); // Debug: Before fetch
        const res = await fetch('http://localhost:3001/api/admins', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Response status:', res.status); // Debug: Log response status
        const data = await res.json();
        console.log('Response data:', data); // Debug: Log response data

        if (!res.ok) {
            console.log('Error response from API:', data.message); // Debug: Log API error
            return NextResponse.json(
                { error: data.message || 'Failed to fetch admins' },
                { status: res.status }
            );
        }

        console.log('Admins fetched successfully'); // Debug: Success case
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Fetch admins error:', error); // Debug: Log error
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
