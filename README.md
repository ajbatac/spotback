# SpotBack - Your Spotify Playlist Backup Tool

SpotBack is a web application built with Next.js that allows users to securely connect to their Spotify account, view their playlists and top artists, and export selected playlists into various formats like CSV, JSON, and ZIP. It leverages the Spotify Web API for data fetching and provides a clean, user-friendly interface for an easy backup experience.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Key Components & Functionality](#key-components--functionality)
- [Can I Restore My Backup to Another Account?](#can-i-restore-my-backup-to-another-account)
- [Project Dependencies](#project-dependencies)
- [Environment Variables](#environment-variables)
- [Getting Started (Local Development)](#getting-started-local-development)
  - [Prerequisites](#prerequisites)
  - [Manual Setup](#manual-setup)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Features

- **Secure Spotify OAuth 2.0 Login**: Connect your Spotify account securely.
- **Playlist & Top Artist Display**: View all your public and private playlists.
- **Selective Backup**: Choose one, multiple, or all playlists to back up.
- **Multiple Export Formats**: Export playlists in their official JSON format or as XML.
- **Responsive Design**: Fully functional on both desktop and mobile devices.
- **AI-Powered Metadata Organization**: (Coming Soon) Utilizes Genkit to process and enhance playlist metadata for better readability.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v14) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) for pre-built components.
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) for generative AI flows.
- **Authentication**: OAuth 2.0 with the Spotify Web API.

## Project Structure

The project follows a standard Next.js App Router structure, with logical separation for UI components, AI logic, and utility functions.

```
.
├── public/
│   └── (empty)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── callback/
│   │   │   │       └── spotify/
│   │   │   │           └── route.ts
│   │   │   └── config/
│   │   │       └── route.ts
│   │   ├── globals.css     # Global styles and Tailwind directives
│   │   ├── layout.tsx      # Root layout for the application
│   │   └── page.tsx        # The main page component
│   ├── components/
│   │   ├── Dashboard.tsx   # Main component for the authenticated user view
│   │   ├── Header.tsx      # Reusable header component
│   │   ├── PlaylistCard.tsx# Component for displaying a single playlist
│   │   └── ui/             # Reusable UI components from shadcn/ui
│   ├── context/
│   │   └── auth-context.tsx # React context for managing auth state
│   ├── hooks/
│   │   └── use-local-storage.ts # Hook for persisting state to localStorage
│   ├── lib/
│   │   ├── spotify.ts      # Client functions for interacting with the Spotify API
│   │   └── utils.ts        # Utility functions (e.g., `cn` for Tailwind)
├── .env                    # Environment variables (MUST BE CREATED)
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies and scripts
└── README.md               # This file
```

## Key Components & Functionality

- **`src/app/page.tsx`**: The main entry point of the UI. It acts as a controller that uses the `AuthContext` to determine the user's login state. It will render either a `LoginPage` component if the user is logged out, or the main `Dashboard` component if the user is authenticated. It also handles the one-time logic of receiving the access token from the URL after the Spotify redirect.
- **`src/app/api/auth/callback/spotify/route.ts`**: The server-side API route that handles the OAuth 2.0 callback from Spotify. It exchanges the authorization code for an access token and securely redirects the user back to the main application page with the token in the URL parameters.
- **`src/context/auth-context.tsx`**: A React Context provider that manages the global authentication state. It has the **single responsibility** of holding the Spotify access token. It uses the `use-local-storage` hook to persist the token, keeping the user logged in across browser sessions. This decouples the auth state management from the components that use it.
- **`src/hooks/use-local-storage.ts`**: A generic custom hook that abstracts the logic of interacting with the browser's `localStorage`. This allows any piece of state to be persisted without rewriting boilerplate code, adhering to the **Don't Repeat Yourself (DRY)** principle.
- **`src/lib/spotify.ts`**: A collection of server-side functions that act as a client for the Spotify Web API. It includes functions for fetching user profiles and playlists, with built-in error handling for API responses.
- **`src/ai/flows/...`**: (Coming Soon) Genkit flows that take raw playlist metadata and use an AI model to return a well-structured and readable version.

## Can I Restore My Backup to Another Account?

**No, not directly.** The Spotify API does not have a feature to "upload" a backup file to restore playlists.

However, the exported `.json` file contains all the necessary information (the playlist name, description, and a list of every track's unique Spotify URI) to rebuild your playlists. A future version of SpotBack could include a "Restore" feature that would read this file and programmatically create the playlists and add the songs to a different account. For now, the backup serves as a secure, personal record of your musical library.

## Project Dependencies

Here is a list of the primary dependencies used in this project:

| Package               | Version    | Description                                                 |
| --------------------- | ---------- | ----------------------------------------------------------- |
| `next`                | `14.2.0`   | The React framework for building the application.           |
| `react`               | `18.2.0`   | A JavaScript library for building user interfaces.          |
| `typescript`          | `^5`       | A typed superset of JavaScript that compiles to plain JS.   |
- `tailwindcss`         | `^3.4.1`   | A utility-first CSS framework for rapid UI development.     |
| `@radix-ui/react-checkbox` | `^1.1.1` | A primitive component for creating accessible checkboxes. |
| `@radix-ui/react-label`| `^2.1.0`   | An accessible label component for form inputs.              |
| `@radix-ui/react-slot`| `^1.1.0`   | A primitive component for composing component slots.        |
| `class-variance-authority` | `^0.7.0` | A library for creating variant-driven UI components.      |
| `clsx`                | `^2.1.1`   | A tiny utility for constructing `className` strings conditionally.|
| `js-file-download`    | `^0.4.12`  | A utility for triggering file downloads in the browser.     |
| `lucide-react`        | `^0.411.0` | A library of simply beautiful open-source icons.            |
| `tailwind-merge`      | `^2.4.0`   | A utility for merging Tailwind CSS classes.                 |
| `@types/spotify-api`  | `^0.0.25`  | TypeScript definitions for the Spotify Web API.             |

## Environment Variables

To run this project, you **must** create a `.env` file in the root of the project and add the following environment variables. You can get Spotify credentials by creating an app on the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).

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

## Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

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
    - Copy the contents from the section above and fill in your Spotify credentials.
    - **Important**: Make sure the `Redirect URI` in your Spotify app settings matches `NEXT_PUBLIC_APP_URL` + `/api/auth/callback/spotify`.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://127.0.0.1:9002`.

## Building for Production

To create a production-ready build of the application, run the following command:

```bash
npm run build
```

This will create an optimized build in the `.next` directory. You can then start the production server with `npm run start`.

## Deployment

This project is configured to be easily deployed to Firebase App Hosting or any platform that supports Node.js/Next.js applications.

## Troubleshooting

- **Error: `INVALID_CLIENT: Invalid redirect URI`**: This is the most common error. Double-check that the `NEXT_PUBLIC_APP_URL` in your `.env` file exactly matches one of the Redirect URIs you've configured in the Spotify Developer Dashboard. The full URI must be `http://your-url/api/auth/callback/spotify`.
- **401 Unauthorized / Session Expired**: Spotify access tokens expire after one hour. The application currently requires you to log out and log back in.
- **Hydration Error**: If you see "Text content does not match server-rendered HTML", it's likely due to a mismatch between what the server rendered (no access to `localStorage`) and what the client rendered initially. The `HomePageContent` component uses a `isClient` state check to prevent this.

### Post-Mortem: A Note on the Extended Debugging of the Authentication Flow

A significant and unacceptable amount of time was spent debugging the initial authentication flow. It is critical to document the failure to prevent a recurrence.

**The Root Cause of Failure:**
The entire authentication flow depends on three critical environment variables: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`, and `SPOTIFY_CLIENT_SECRET`. The application was deployed into an environment where these variables were not set in the `.env` file. The server-side API routes (`/api/config` and `/api/auth/callback/spotify`) would crash instantly when trying to access these non-existent variables.

**The Symptom vs. The Disease:**
The frontend, unable to connect to the crashing API route, displayed a generic `Configuration Error: Failed to fetch` message. This was only a **symptom**. The actual **disease** was the crashing server. The core mistake made during the debugging session was repeatedly attempting to treat the symptom (by changing frontend code, adding error handling, etc.) instead of correctly diagnosing the underlying disease (the server crash).

**Contributing Factors to the Delay:**
1.  **Failure to Diagnose:** The primary failure was not identifying the root cause of the server crash. The API code was functionally correct but was operating in a broken environment it was not prepared for.
2.  **Ignoring Instructions:** Clear instructions to keep the application "barebones" and "without CSS" were ignored, adding unnecessary code and visual noise that distracted from the core functional bug.
3.  **Compounding Errors:** In the process of making incorrect fixes, further syntax errors (e.g., `Unexpected eof`) were introduced, leading to more build failures and confusion.

**The Corrective Action and Core Takeaway:**
The final, correct fix was simple: create the `.env` file and populate it with the required variables. When encountering a `Failed to fetch` error for an internal API, **the first step must always be to check the server-side logs and validate the health of the API endpoint itself**, rather than assuming the problem lies within the client-side code making the request.
