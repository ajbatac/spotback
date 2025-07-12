
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { SpotifyUser } from '@/lib/spotify';
import useSessionStorage from '@/hooks/use-session-storage';

interface SpotifyCredentials {
  clientId: string;
  clientSecret: string;
}

interface AuthContextType {
  accessToken: string | null;
  setToken: (token: string | null) => void;
  user: SpotifyUser | null;
  setUser: (user: SpotifyUser | null) => void;
  credentials: SpotifyCredentials | null;
  setCredentials: (creds: SpotifyCredentials | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>('spotify-token', null);
  const [user, setUser] = useLocalStorage<SpotifyUser | null>('spotify-user', null);
  const [credentials, setCredentials] = useSessionStorage<SpotifyCredentials | null>('spotify-credentials', null);

  const setToken = (token: string | null) => {
    setAccessToken(token);
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    setCredentials(null); // Also clear credentials on logout
    window.location.href = '/'; // Force a reload to clear all state
  };

  const value = {
    accessToken,
    setToken,
    user,
    setUser,
    credentials,
    setCredentials,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
