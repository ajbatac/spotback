
import React from 'react';

export default function LoginPage() {
  // IMPORTANT: Replace "YOUR_NEW_CLIENT_ID" with the Client ID from the NEW application 
  // you created in the Spotify Developer Dashboard.
  const clientId = "24d698cf100a45839dea80b3b2cec963"; 
  const redirectUri = "http://127.0.0.1:9002/api/auth/callback/spotify";
  const scopes = "user-read-private user-read-email playlist-read-private playlist-read-collaborative";

  // Manually build and encode the URL to ensure it is perfect.
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Spotify Login Test - Barebones Link</h1>
      <p>
        This is the simplest possible test. The link below is a completely hardcoded string.
      </p>
      <p>
        <strong>Action:</strong> Click this link.
      </p>
      <a 
        href={authUrl} 
        style={{
          fontSize: '1.2rem',
          color: '#1DB954',
          border: '2px solid #1DB954',
          padding: '10px 20px',
          display: 'inline-block',
          marginTop: '1rem',
          textDecoration: 'none'
        }}
      >
        Login with Spotify (Hardcoded Link)
      </a>
      <hr style={{ margin: '2rem 0' }} />
      <h2>Generated URL Details</h2>
      <p>The link above points to the following URL:</p>
      <pre style={{ backgroundColor: '#f0f0f0', padding: '1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        <code>{authUrl}</code>
      </pre>
      <p style={{ marginTop: '1rem' }}>
        If this still fails, please double-check that this exact URI is in your Spotify Dashboard: <strong><code>{redirectUri}</code></strong>
      </p>
    </div>
  );
}
