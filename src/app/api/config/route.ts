import { NextResponse } from 'next/server';

export async function GET() {
  // This endpoint is no longer needed for providing credentials,
  // but can be kept for providing other public-facing configurations like the app URL.
  // We remove the check for client ID as it's no longer sourced from the server's environment.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    const error = 'Server configuration is missing required environment variable: NEXT_PUBLIC_APP_URL. Please check your .env file.';
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({
    appUrl,
  });
}
