# SpotBack - Your Spotify Playlist Backup Tool

SpotBack is a web application built with Next.js that allows users to securely connect to their Spotify account, view their playlists, and export selected playlists into various formats like JSON, XML, and TXT. It leverages the Spotify Web API for data fetching and provides a clean, user-friendly interface for an easy backup experience.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Key Components & Functionality](#key-components--functionality)
- [Environment Variables](#environment-variables)
- [Getting Started (Local Development)](#getting-started-local-development)
  - [Prerequisites](#prerequisites)
  - [Standard Setup](#standard-setup)
  - [Docker Setup](#docker-setup)
- [Deployment](#deployment)
  - [Build](#build)
  - [Firebase App Hosting](#firebase-app-hosting)
- [Troubleshooting](#troubleshooting)

---

## Features

- **Secure Spotify OAuth 2.0 Login**: Connect your Spotify account securely.
- **Playlist & User Profile Display**: View all your public and private playlists and see your user information.
- **Selective Backup**: Choose one, multiple, or all playlists to back up.
- **Multiple Export Formats**: Export playlists in their official JSON format, as XML, or as a simple TXT file of playlist URLs.
- **Responsive Design**: Fully functional on both desktop and mobile devices.
- **Consistent UI**: Uniform styling and icons for all primary buttons and actions.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v14) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) for pre-built components.
- **Authentication**: OAuth 2.0 with the Spotify Web API.
- **Containerization**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

## Project Structure

The project follows a standard Next.js App Router structure, with logical separation for UI components, context, hooks, and API interaction logic.

```
.
├── public/                     # Static assets (images, html files)
│   ├── bmc_qr.png
│   └── spotify.png
├── src/
│   ├── app/                    # Next.js App Router directory
│   │   ├── api/                # API routes
│   │   │   ├── auth/callback/spotify/route.ts  # Handles Spotify OAuth callback
│   │   │   └── config/route.ts # Serves public env vars to the client
│   │   ├── globals.css         # Global styles and Tailwind directives
│   │   ├── icon.tsx            # Programmatically generated favicon
│   │   ├── layout.tsx          # Root application layout
│   │   └── page.tsx            # Main entry point (Login/Dashboard)
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # Core UI components from shadcn/ui
│   │   ├── Dashboard.tsx       # Main authenticated user interface
│   │   ├── Footer.tsx          # Application footer
│   │   ├── Header.tsx          # Application header
│   │   └── PlaylistCard.tsx    # Card for displaying a single playlist
│   ├── context/
│   │   └── auth-context.tsx    # Manages global auth state (token, user)
│   ├── hooks/
│   │   └── use-local-storage.ts# Hook for persisting state to localStorage
│   └── lib/
│       ├── spotify.ts          # Client for interacting with the Spotify API
│       └── utils.ts            # Utility functions (cn, jsonToXml)
├── .env                        # Environment variable declarations (gitignored)
├── apphosting.yaml             # Firebase App Hosting configuration
├── Dockerfile.dev              # Dockerfile for development environment
├── Dockerfile.prod             # Dockerfile for production builds
├── docker-compose.yml          # Docker Compose for local development
├── next.config.js              # Next.js configuration
├── package.json                # Project dependencies and scripts
└── README.md                   # This file
```

## Key Components & Functionality

- **`src/app/page.tsx`**: The main entry point. It acts as a controller, using `AuthContext` to render either the `LoginPage` or the `Dashboard` based on the user's authentication state. It also handles the one-time logic of receiving the access token from the URL after the Spotify redirect.
- **`src/context/auth-context.tsx`**: A React Context that manages the global authentication state, holding the Spotify access token and user profile information. It uses the `use-local-storage` hook to persist state, keeping the user logged in across browser sessions.
- **`src/lib/spotify.ts`**: A client for the Spotify Web API. It includes functions for fetching the user's profile and all of their playlists (handling pagination automatically).
- **`src/components/Dashboard.tsx`**: The main application interface for authenticated users. It fetches data, manages the state for playlist selection, and handles the multi-step backup and download process.
- **`src/app/api/auth/callback/spotify/route.ts`**: The server-side route that finalizes the OAuth 2.0 flow. It receives the authorization code from Spotify, exchanges it for an access token, and redirects the user back to the main application with the token.

## Environment Variables

To run this project, you **must** create a `.env` file in the root of the project by copying `.env.example`. You can get Spotify credentials by creating an app on the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).

```bash
# .env

# Spotify API Credentials
NEXT_PUBLIC_SPOTIFY_CLIENT_ID="YOUR_SPOTIFY_CLIENT_ID"
SPOTIFY_CLIENT_SECRET="YOUR_SPOTIFY_CLIENT_SECRET"

# The public URL of your application.
# For local development, this is typically http://localhost:9002
# For production, it must be the public URL of your deployed app.
# IMPORTANT: You must add this URL (including the /api/auth/callback/spotify part)
# to the "Redirect URIs" in your Spotify Developer Dashboard settings.
NEXT_PUBLIC_APP_URL="https://spotback.website"
```

## Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or later)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/products/docker-desktop/) (for Docker-based setup)

### Standard Setup

1.  **Clone the repository.**
2.  **Install dependencies:** `npm install`
3.  **Set up environment variables:** Create a `.env` file and populate it with your credentials as described above. **For local development, change `NEXT_PUBLIC_APP_URL` to `http://localhost:9002`**.
4.  **Run the development server:** `npm run dev`

The application will be available at `http://localhost:9002`.

### Docker Setup

This method uses Docker Compose to build and run the application in a container.

1.  **Clone the repository.**
2.  **Set up environment variables:** Create a `.env` file as described above. Ensure `NEXT_PUBLIC_APP_URL` is set to `http://localhost:9002`.
3.  **Build and run the container:** `docker-compose up --build`

The application will be available at `http://localhost:9002`, with hot-reloading enabled.

## Deployment

### Build

To create a production-ready build of the application, run the following command:

```bash
npm run build
```

This will generate an optimized build in the `.next` directory.

### Firebase App Hosting

This project is configured for one-click deployment with Firebase App Hosting.

1.  **Set up Firebase**: Ensure you have a Firebase project and the Firebase CLI installed (`npm install -g firebase-tools`).
2.  **Configure Backend**: In the Firebase console, create a new App Hosting backend.
3.  **Connect GitHub**: Connect your GitHub repository to the App Hosting backend.
4.  **Set Secrets**: In the App Hosting settings, add the `SPOTIFY_CLIENT_SECRET` as a secret. The other environment variables are public and are managed via the `.env` file committed to the repository.
5.  **Deploy**: Pushing to the main branch will automatically trigger a new build and deployment.

The `apphosting.yaml` file configures the deployment settings for Firebase.

## Troubleshooting

- **Error: `403 Forbidden` after logging in / User is `null` but Playlists load**: This is the most critical issue for new setups. By default, your Spotify app is in **Development Mode**. This means only users you have explicitly added to the allowlist can properly authenticate.
  - **Solution**: Go to your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), select your application, and go to the "Users and Access" tab. Click "Add New User" and add the email address and name for every person who needs to use the app. They will then be able to log in and grant the correct permissions.

- **Error: `INVALID_CLIENT: Invalid redirect URI`**: This is the most common error. Double-check that the `NEXT_PUBLIC_APP_URL` in your `.env` file (or build environment) exactly matches one of the Redirect URIs you've configured in the Spotify Developer Dashboard. The full URI must be `http://your-url/api/auth/callback/spotify`.

- **401 Unauthorized / Session Expired**: Spotify access tokens expire after one hour. The application currently requires you to log out and log back in to get a new one.

- **Docker Build Fails**: Ensure Docker is running and that you have sufficient permissions to run Docker commands.

- **Favicon Errors**: The application uses `src/app/icon.tsx` to generate the favicon, which is the recommended method for the Next.js App Router. If you see conflicts, ensure you do not have a `favicon.ico` file in the `public/` or `src/app/` directories.
```