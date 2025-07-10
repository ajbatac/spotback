
import { NextRequest, NextResponse } from 'next/server';

function createDebugResponse(data: Record<string, any>): NextResponse {
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Spotify Auth Debug</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"; background-color: #f0f2f5; color: #1c1e21; margin: 0; padding: 20px; }
                .container { max-width: 800px; margin: 0 auto; background-color: #fff; border: 1px solid #dddfe2; border-radius: 8px; padding: 20px; }
                h1 { font-size: 24px; color: #1877f2; }
                h2 { font-size: 18px; border-bottom: 1px solid #dddfe2; padding-bottom: 8px; margin-top: 24px; }
                pre { background-color: #e9ebee; padding: 12px; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace; font-size: 13px; }
                code { color: #d63384; }
                .error { color: #fa383e; font-weight: bold; }
                .success { color: #31a24c; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Spotify Auth Callback - Debug Information</h1>
                ${Object.entries(data).map(([key, value]) => `
                    <h2>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h2>
                    <pre><code>${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}</code></pre>
                `).join('')}
            </div>
        </body>
        </html>
    `;
    return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html' },
    });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const debugInfo: Record<string, any> = {
    "Timestamp": new Date().toISOString(),
    "Request URL": req.url,
    "Received Code": code,
    "Received Error": error,
  };

  if (error) {
    debugInfo["Error Details"] = "Spotify returned an error. See above.";
    return createDebugResponse(debugInfo);
  }

  if (!code) {
    debugInfo["Error Details"] = "Code was not found in the callback URL.";
    return createDebugResponse(debugInfo);
  }

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  // This MUST exactly match the URI registered in your Spotify Developer Dashboard.
  const redirectUri = 'https://localhost:9002/api/auth/callback/spotify';

  debugInfo["Server Configuration"] = {
    "Client ID (from env)": clientId,
    "Client Secret (is present?)": !!clientSecret,
    "Redirect URI (hardcoded)": redirectUri
  };

  if (!clientId || !clientSecret) {
    debugInfo["Error Details"] = "Spotify client ID or secret is not configured in server environment variables.";
    return createDebugResponse(debugInfo);
  }

  const requestBody = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
  });

  debugInfo["Token Request to Spotify"] = {
    "URL": "https://accounts.spotify.com/api/token",
    "Method": "POST",
    "Headers": {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    "Body": requestBody.toString(),
  };

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
      body: requestBody,
    });

    const responseData = await response.json();
    debugInfo["Token Response from Spotify"] = {
        "Status": response.status,
        "Status Text": response.statusText,
        "Body": responseData
    };
    
    if (!response.ok) {
        debugInfo["Final Status"] = `<span class="error">Failed to exchange code for token.</span>`;
    } else {
        debugInfo["Final Status"] = `<span class="success">Token exchange was successful!</span>`;
        debugInfo["Next Step"] = `Would normally redirect to /#access_token=${responseData.access_token.substring(0, 15)}...`;
    }

    return createDebugResponse(debugInfo);

  } catch (e: any) {
    debugInfo["Fatal Error during Fetch"] = {
        "Message": e.message,
        "Stack": e.stack
    };
    return createDebugResponse(debugInfo);
  }
}
