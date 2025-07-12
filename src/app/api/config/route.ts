
import { NextResponse } from 'next/server';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

  const missingVars = [];
  if (!appUrl) missingVars.push('NEXT_PUBLIC_APP_URL');
  if (!clientId) missingVars.push('NEXT_PUBLIC_SPOTIFY_CLIENT_ID');

  if (missingVars.length > 0) {
    const error = `Server configuration is missing required environment variables: ${missingVars.join(', ')}`;
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({
    appUrl,
    clientId,
  });
}
