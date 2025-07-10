
import React from 'react';

export default function LoginPage() {
  const clientId = '8b373f6c1fe94611a68553f3c0e49c45'; 
  const redirectUri = 'http://127.0.0.1:9002/api/auth/callback/spotify';
  const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
  ];
  
  const scopeString = encodeURIComponent(scopes.join(' '));
  const redirectUriString = encodeURIComponent(redirectUri);

  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopeString}&redirect_uri=${redirectUriString}`;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Spotify Login Test</h1>
      <p>This is a barebones test to isolate the redirect URI issue.</p>
      <p>
        The link below is a simple, hardcoded <code>&lt;a&gt;</code> tag. There is no React state or dynamic logic involved in its creation.
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
        If this still fails with an "Insecure redirect URI" error, it confirms the issue is a mismatch with the URI configured in your Spotify Developer Dashboard. Please ensure it is set to <strong>exactly</strong>: <code>{redirectUri}</code>
      </p>
    </div>
  );
}
