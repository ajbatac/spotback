# SpotBack - Your Spotify Playlist Backup Tool

SpotBack is a web application built with Next.js that allows users to securely connect to their Spotify account, view their playlists, and export selected playlists into various formats like JSON, XML, and TXT. It leverages the Spotify Web API for data fetching and provides a clean, user-friendly interface for an easy backup experience.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Key Components & Functionality](#key-components--functionality)
- [Can I Restore My Backup to Another Account?](#can-i-restore-my-backup-to-another-account)
- [Project Dependencies](#project-dependencies)
- [Environment Variables](#environment-variables)
- [Getting Started (Local Development)](#getting-started-local-development)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

---

## Features

- **Secure Spotify OAuth 2.0 Login**: Connect your Spotify account securely.
- **Playlist & User Profile Display**: View all your public and private playlists and see your user information.
- **Selective Backup**: Choose one, multiple, or all playlists to back up.
- **Multiple Export Formats**: Export playlists in their official JSON format, as XML, or as a simple TXT file of playlist URLs.
- **Responsive Design**: Fully functional on both desktop and mobile devices.
- **Consistent UI**: Uniform styling and icons for all primary buttons and actions.
- **AI-Powered Metadata Organization**: (Coming Soon) Utilizes Genkit to process and enhance playlist metadata for better readability.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v14) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) for pre-built components.
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) for generative AI flows.
- **Authentication**: OAuth 2.0 with the Spotify Web API.

## Project Structure

The project follows a standard Next.js App Router structure, with logical separation for UI components, context, hooks, and API interaction logic.

```
.
├── public/
│   ├── spotify.png
│   └── changelog.html
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/callback/spotify/route.ts
│   │   │   └── config/route.ts
│   │   ├── globals.css
│   │   ├── icon.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── PlaylistCard.tsx
│   │   └── ui/
│   ├── context/
│   │   └── auth-context.tsx
│   ├── hooks/
│   │   └── use-local-storage.ts
│   ├── lib/
│   │   ├── spotify.ts
│   │   └── utils.ts
├── .env
├── next.config.js
├── package.json
└── README.md
```

## Key Components & Functionality

- **`src/app/page.tsx`**: The main entry point. It acts as a controller, using `AuthContext` to render either the `LoginPage` or the `Dashboard` based on the user's authentication state. It also handles the one-time logic of receiving the access token from the URL after the Spotify redirect.
- **`src/context/auth-context.tsx`**: A React Context that manages the global authentication state, holding the Spotify access token and user profile information. It uses the `use-local-storage` hook to persist state, keeping the user logged in across browser sessions.
- **`src/lib/spotify.ts`**: A client for the Spotify Web API. It includes functions for fetching the user's profile and all of their playlists (handling pagination automatically).
- **`src/components/Dashboard.tsx`**: The main application interface for authenticated users. It fetches data, manages the state for playlist selection, and handles the multi-step backup and download process.
- **`src/components/Header.tsx`**: A responsive header that displays the application logo, the logged-in user's name and profile picture, and a logout button.
- **`src/components/PlaylistCard.tsx`**: A component that displays a single playlist's cover art, name, owner, and track count, along with an interactive checkbox for selection.
- **`src/components/Footer.tsx`**: A site-wide footer containing a link to support the creator, copyright info, and a link to the project's changelog.


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
| `tailwindcss`         | `^3.4.1`   | A utility-first CSS framework for rapid UI development.     |
| `@radix-ui/react-checkbox` | `^1.1.1` | A primitive component for creating accessible checkboxes. |
| `@radix-ui/react-label`| `^2.1.0`   | An accessible label component for form inputs.              |
| `js-file-download`    | `^0.4.12`  | A utility for triggering file downloads in the browser.     |
| `lucide-react`        | `^0.411.0` | A library of simply beautiful open-source icons.            |
| `@types/spotify-api`  | `^0.0.25`  | TypeScript definitions for the Spotify Web API.             |
| `clsx`                | `^2.1.1`   | A tiny utility for constructing `className` strings.        |
| `tailwind-merge`      | `^2.4.0`   | A utility to intelligently merge Tailwind CSS classes.      |

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
NEXT_PUBLIC_APP_URL="https://6000-firebase-studio-1752167974752.cluster-hf4yr35cmnbd4vhbxvfvc6cp5q.cloudworkstations.dev"
```

## Getting Started (Local Development)

1.  **Clone the repository.**
2.  **Install dependencies:** `npm install`
3.  **Set up environment variables:** Create a `.env` file and populate it with your credentials as described above. **For local development, change `NEXT_PUBLIC_APP_URL` to `http://127.0.0.1:9002`**.
4.  **Run the development server:** `npm run dev`

The application will be available at `http://127.0.0.1:9002`.

## Building for Production

To create a production-ready build of the application, run the following command:

```bash
npm run build
```

## Troubleshooting

- **Error: `INVALID_CLIENT: Invalid redirect URI`**: This is the most common error. Double-check that the `NEXT_PUBLIC_APP_URL` in your `.env` file exactly matches one of the Redirect URIs you've configured in the Spotify Developer Dashboard. The full URI must be `http://your-url/api/auth/callback/spotify`.
- **401 Unauthorized / Session Expired**: Spotify access tokens expire after one hour. The application currently requires you to log out and log back in to get a new one.
- **Favicon Errors**: The application uses `src/app/icon.tsx` to generate the favicon, which is the recommended method for the Next.js App Router. If you see conflicts, ensure you do not have a `favicon.ico` file in the `public/` directory.

