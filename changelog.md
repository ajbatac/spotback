# SpotBack Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-08-01

### Added
- **Initial Release** of SpotBack!
- Secure Spotify OAuth 2.0 authentication.
- Fetches and displays all user playlists and top artists.
- Select one, multiple, or all playlists for backup.
- Export selected playlists to CSV, JSON, ZIP, and official Spotify API formats.
- Beautiful, responsive landing page for new users.
- User-friendly dashboard to manage playlists.
- "Buy me a pizza" support widget.
- Comprehensive `README.md` documentation.
- Docker support for both development (`Dockerfile.dev`) and production (`Dockerfile.prod`).
- Docker Compose (`docker-compose.yml`) for easy local development setup.
- Publicly accessible changelog page.
- AI-powered metadata organization flow (currently placeholder).

### Changed
- Improved error handling for Spotify API rate limits and server errors (e.g., 504 Gateway Timeout).
- Refined UI/UX for a smoother, more intuitive experience.
- Updated color scheme to a vibrant, Spotify-inspired theme.

### Fixed
- Resolved multiple issues with the "Buy me a pizza" widget not appearing correctly by embedding it in an `<iframe>`.
