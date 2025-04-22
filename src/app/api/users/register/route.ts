import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  console.log("Session:", session); // Debug session
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = session.user.accessToken;
  console.log("Token:", token); // Debug token

  const body = await req.json();

  try {
    const res = await fetch("http://localhost:3001/api/admins/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Optional, if your backend checks for auth
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("API Response:", data); // Debug API response

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || "Registration failed" },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Registration error:", err); // Debug error
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
