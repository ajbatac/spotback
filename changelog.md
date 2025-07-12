# SpotBack Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Added "Why SpotBack?" section to the login page for new users.
- Replaced login page icon with a custom PNG image (`public/spotify.png`).
- Programmatically generate app favicon via `src/app/icon.tsx` to resolve browser and build conflicts.

### Changed
- Updated login page description to be more energetic and engaging.
- Restored hover animation to all primary action buttons for better user feedback.
- Made the changelog link in the footer open in a new tab.

### Fixed
- Corrected page layout to ensure footer sits directly below content, not at the bottom of the viewport.
- Adjusted login page alignment to position content higher on the screen.
- Resolved favicon conflict error by removing the static file from `/public` and using the Next.js App Router's `icon.tsx` convention.

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
