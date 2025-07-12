
import { NextResponse } from 'next/server';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

  if (!appUrl || !clientId) {
    return NextResponse.json(
      { error: 'Server configuration is missing required environment variables.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    appUrl,
    clientId,
  });
}
