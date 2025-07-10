# SpotBack - Your Spotify Playlist Backup Tool

SpotBack is a web application built with Next.js that allows users to securely connect to their Spotify account, view their playlists and top artists, and export selected playlists into various formats like CSV, JSON, and ZIP. It leverages the Spotify Web API for data fetching and provides a clean, user-friendly interface for an easy backup experience.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Key Components & Functionality](#key-components--functionality)
- [Project Dependencies](#project-dependencies)
- [Environment Variables](#environment-variables)
- [Getting Started (Local Development)](#getting-started-local-development)
  - [Prerequisites](#prerequisites)
  - [Manual Setup](#manual-setup)
  - [Docker Setup](#docker-setup)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
  - [Using Docker](#using-docker)
  - [Firebase App Hosting](#firebase-app-hosting)
- [Troubleshooting](#troubleshooting)

---

## Features

- **Secure Spotify OAuth 2.0 Login**: Connect your Spotify account securely.
- **Playlist & Top Artist Display**: View all your public and private playlists, along with your top artists.
- **Selective Backup**: Choose one, multiple, or all playlists to back up.
- **Multiple Export Formats**:
  - **CSV**: A simple, universal format for track data.
  - **JSON**: A simplified JSON format, great for custom scripts.
  - **ZIP**: A compressed archive containing a separate CSV file for each selected playlist.
  - **Spotify API Format**: A complete JSON export matching the official Spotify API response, perfect for archival or programmatic use.
- **AI-Powered Metadata Organization**: Utilizes Genkit to process and enhance playlist metadata for better readability.
- **Responsive Design**: Fully functional on both desktop and mobile devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v15.3) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) for pre-built components.
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) for generative AI flows.
- **Authentication**: OAuth 2.0 with the Spotify Web API.
- **Containerization**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

## Project Structure

The project follows a standard Next.js App Router structure, with logical separation for UI components, AI logic, and utility functions.

```
.
├── public/
│   └── bmc-button.html     # Isolated HTML for the "Buy Me a Pizza" widget
│   └── spotify.png         # App logo
├── src/
│   ├── ai/
│   │   ├── flows/
│   │   │   └── ...ts       # Genkit flows for AI functionality
│   │   └── genkit.ts       # Genkit AI instance configuration
│   ├── app/
│   │   ├── api/
│   │   │   └── ...ts       # API routes (e.g., Spotify OAuth callback)
│   │   ├── globals.css     # Global styles and Tailwind directives
│   │   ├── layout.tsx      # Root layout for the application
│   │   └── page.tsx        # The main page component
│   ├── components/
│   │   ├── ui/             # Reusable UI components from shadcn/ui
│   │   └── *.tsx           # Custom application-specific components
│   ├── context/
│   │   └── auth-context.tsx # React context for managing auth state
│   ├── hooks/
│   │   ├── use-local-storage.ts # Hook for persisting state to localStorage
│   │   └── ...ts           # Other custom React hooks
│   ├── lib/
│   │   ├── spotify.ts      # Functions for interacting with the Spotify API
│   │   └── utils.ts        # Utility functions (e.g., `cn` for Tailwind)
│   └── types/
│       └── spotify.d.ts    # TypeScript type definitions for Spotify API objects
├── .env.example            # Example environment variables
├── Dockerfile.dev          # Dockerfile for development
├── Dockerfile.prod         # Dockerfile for production
├── docker-compose.yml      # Docker Compose for easy development setup
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies and scripts
└── README.md               # This file
```

## Key Components & Functionality

- **`src/app/page.tsx`**: The main entry point of the UI. It handles the core logic: authentication state, data fetching from Spotify, user interaction (selecting playlists), and triggering the export process.
- **`src/app/api/auth/callback/spotify/route.ts`**: The server-side API route that handles the OAuth 2.0 callback from Spotify. It exchanges the authorization code for an access token and securely redirects the user back to the main application.
- **`src/lib/spotify.ts`**: A collection of server-side functions that act as a client for the Spotify Web API. It includes functions for fetching user profiles, playlists, and top artists, with built-in error handling for API responses.
- **`src/context/auth-context.tsx`**: A React Context provider that manages the Spotify access token. It uses the `use-local-storage` hook to persist the token, keeping the user logged in across browser sessions.
- **`src/components/playlist-card.tsx`**: A UI component that displays a single playlist's cover art, name, and track count, and handles its selection state.
- **`src/ai/flows/organize-playlist-metadata.ts`**: A Genkit flow that takes raw playlist metadata and uses an AI model to return a well-structured and readable version.

## Project Dependencies

Here is a list of the primary dependencies used in this project:

| Package               | Version    | Description                                                 |
| --------------------- | ---------- | ----------------------------------------------------------- |
| `next`                | `15.3.3`   | The React framework for building the application.           |
| `react`               | `18.3.1`   | A JavaScript library for building user interfaces.          |
| `typescript`          | `^5`       | A typed superset of JavaScript that compiles to plain JS.   |
| `tailwindcss`         | `^3.4.1`   | A utility-first CSS framework for rapid UI development.     |
| `@shadcn/ui`          | various    | A collection of beautifully designed, reusable components.  |
| `genkit`              | `^1.13.0`  | Google's framework for building AI-powered features.        |
| `@genkit-ai/googleai` | `^1.13.0`  | Google AI plugin for Genkit.                                |
| `lucide-react`        | `^0.475.0` | A library of simply beautiful open-source icons.            |
| `jszip`               | `^3.10.1`  | A library for creating, reading, and editing .zip files.    |
| `zod`                 | `^3.24.2`  | A TypeScript-first schema declaration and validation library. |

## Environment Variables

To run this project, you need to create a `.env` file in the root of the project and add the following environment variables. You can get Spotify credentials by creating an app on the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).

```bash
# .env

# Spotify API Credentials
NEXT_PUBLIC_SPOTIFY_CLIENT_ID="YOUR_SPOTIFY_CLIENT_ID"
SPOTIFY_CLIENT_SECRET="YOUR_SPOTIFY_CLIENT_SECRET"

# The public URL of your application.
# For local development, this is typically http://127.0.0.1:9002
# For production, it must be the public URL of your deployed app.
# IMPORTANT: You must add this URL (including the /api/auth/callback/spotify part)
# to the "Redirect URIs" in your Spotify Developer Dashboard settings.
NEXT_PUBLIC_APP_URL="http://127.0.0.1:9002"

# Optional: Google AI API Key for Genkit
# GOOGLE_API_KEY="YOUR_GOOGLE_AI_API_KEY"
```

See `.env.example` for a template.

## Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/products/docker-desktop/) (for Docker setup)

### Manual Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    - Create a file named `.env` in the project root.
    - Copy the contents from `.env.example` and fill in your Spotify credentials.
    - **Important**: Make sure the `Redirect URI` in your Spotify app settings matches `NEXT_PUBLIC_APP_URL` + `/api/auth/callback/spotify`.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://127.0.0.1:9002`.

### Docker Setup

This is the recommended way to run the application locally, as it ensures a consistent environment.

1.  **Set up environment variables:**
    - Create a `.env` file as described in the "Manual Setup" section.

2.  **Build and run the container:**
    ```bash
    docker-compose up --build
    ```
    The application will be available at `http://127.0.0.1:9002`. The container uses `Dockerfile.dev` and mounts the `src` directory, so changes to your code will trigger hot-reloading.

## Building for Production

To create a production-ready build of the application, run the following command:

```bash
npm run build
```

This will create an optimized build in the `.next` directory. You can then start the production server with `npm run start`.

## Deployment

### Using Docker

The `Dockerfile.prod` is optimized for production. It creates a small, efficient image by using a multi-stage build process.

1.  **Build the production Docker image:**
    ```bash
    docker build -f Dockerfile.prod -t spotback-prod .
    ```

2.  **Run the container:**
    - Remember to pass your environment variables to the container. You can do this with an `.env` file or directly on the command line.
    ```bash
    docker run -p 9002:9002 --env-file .env spotback-prod
    ```
    Your application will be running on port 9002.

### Firebase App Hosting

This project is configured to be easily deployed to Firebase App Hosting.

1.  **Install the Firebase CLI:**
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login to Firebase:**
    ```bash
    firebase login
    ```

3.  **Initialize Firebase in your project:**
    ```bash
    firebase init apphosting
    ```
    Follow the prompts to connect to your Firebase project.

4.  **Deploy:**
    ```bash
    firebase apphosting:backends:deploy
    ```
    The Firebase CLI will build your application using the configuration in `apphosting.yaml` and deploy it. Remember to configure your environment variables in the Google Cloud Secret Manager as prompted during setup.

## Troubleshooting

-   **Error: `INVALID_CLIENT: Invalid redirect URI`**: This is the most common error. Double-check that the `NEXT_PUBLIC_APP_URL` in your `.env` file exactly matches one of the Redirect URIs you've configured in the Spotify Developer Dashboard. The full URI must be `http://your-url/api/auth/callback/spotify`.
-   **401 Unauthorized / Session Expired**: Spotify access tokens expire after one hour. The application currently requires you to log out and log back in.
-   **Docker Build Fails**: Ensure Docker has enough resources (CPU/memory) allocated in its settings. Clear your Docker cache (`docker builder prune`) and try again.
-   **"Buy me a pizza" button not showing**: The widget is loaded in an `<iframe>`. Ensure your browser or any ad-blockers are not blocking content from `buymeacoffee.com`.
