import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { room, username } = body;

    if (!room || !username) {
      return NextResponse.json(
        { error: "Missing room or username" },
        { status: 400 }
      );
    }

    // Environment variables must be set up in your .env.local
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "LiveKit credentials not configured" },
        { status: 500 }
      );
    }

    // Create a new AccessToken
    const token = new AccessToken(apiKey, apiSecret, {
      identity: username,
      name: username,
    });

    // Grant permissions to the room
    token.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
    });

    // Return the token as a response
    return NextResponse.json({ token: token.toJwt() });
  } catch (error) {
    console.error("Error generating LiveKit token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
