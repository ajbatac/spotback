# SpotBack Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2025-07-12

### Added
- **Major Feature: "Bring Your Own Keys" (BYOK) Architecture.** The application now requires users to provide their own Spotify API credentials, making it usable by anyone without needing a publicly approved Spotify app.
- **New Credentials Page (`/credentials`):** A dedicated page for users to securely enter their Spotify Client ID and Client Secret.
  - User-provided keys are stored securely in the browser's `sessionStorage` and are never saved on the server.
  - Includes comprehensive, step-by-step instructions for users on how to:
    1.  Navigate to the Spotify Developer Dashboard.
    2.  Create a new Spotify application.
    3.  Find their Client ID and Client Secret.
    4.  Correctly configure the required `Redirect URI`.
    5.  Add their own Spotify account email to the "Users and Access" list, which is required for apps in Development Mode.
- **Dynamic Redirect URI:** The Redirect URI displayed in the instructions is now dynamically generated from the application's public URL, ensuring accuracy in both development and production environments.
- Added "Why SpotBack?" section to the login page for new users.
- Replaced login page icon with a custom PNG image (`public/spotify.png`).
- Programmatically generate app favicon via `src/app/icon.tsx` to resolve browser and build conflicts.


### Changed
- **Updated Authentication Flow:** The primary user journey now starts with entering API keys. The main login page directs all users to the new credentials page.
- **Stateless Authentication Callback:** The server-side API endpoint (`/api/auth/callback/spotify`) has been re-architected to be completely stateless. It no longer depends on server-side environment variables for Spotify credentials.
- **Simplified Environment:** Removed the server-side `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` environment variables, as they are no longer used.
- Updated login page description to be more energetic and engaging.
- Restored hover animation to all primary action buttons for better user feedback.
- Made the changelog link in the footer open in a new tab.

### Fixed
- **Critical Login Bug:** Resolved an issue where the server-side callback would crash due to using a browser-only function (`atob`), which caused a "dangerous website" warning. Replaced with the correct Node.js `Buffer` method for robust server-side decoding.
- **Redirect URI Mismatch:** Fixed a persistent OAuth error by ensuring the `redirect_uri` used in the Spotify authorization link is dynamically and correctly constructed from the `NEXT_PUBLIC_APP_URL` environment variable. This ensures URL consistency between development and production environments.
- **Invalid URL Bug:** Corrected a string concatenation error that was producing a double slash (`//`) in the generated `redirect_uri`, which made the URL invalid.
- **ReferenceError Fix:** Fixed a typo (`search_params` instead of `searchParams`) on the main page that caused a runtime error when handling the callback from Spotify.
- Corrected page layout to ensure footer sits directly below content, not at the bottom of the viewport.
- Adjusted login page alignment to position content higher on the screen.
- Resolved favicon conflict error by removing the static file from `/public` and using the Next.js App Router's `icon.tsx` convention.
- **Troubleshooting Documentation:** Updated `README.md` to include information about Spotify's "Development Mode" and the necessity of adding approved users, which is the cause of `403 Forbidden` errors.

## [0.2.0] - 2024-07-12

### Added
- QR code in the footer is now a clickable link to support the creator.

### Changed
- Improved UI consistency for all primary action buttons.
- Increased size of the footer QR code for better visibility and usability.

## [0.1.0] - 2024-07-11

### Added
- **Initial Release** of SpotBack!
- Secure Spotify OAuth 2.0 authentication.
- Fetches and displays user profile and all user playlists.
- Select one, multiple, or all playlists for backup.
- User-friendly dashboard to manage playlists and backups.
- Export selected playlists to JSON, XML, or a TXT file of URLs.
- Responsive landing page and dashboard.
- Header with user info and footer with project credits.
- Consistent UI theme with styled buttons, icons, and hover animations.
- Comprehensive `README.md` documentation and a public changelog.
