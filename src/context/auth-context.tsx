
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/use-local-storage';

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>('spotify-token', null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const hash = window.location.hash;
        if (hash.includes('access_token=')) {
          const token = hash.split('access_token=')[1].split('&')[0];
          setAccessToken(token);
          // Clean the URL by replacing the history state
          window.history.replaceState(null, '', '/');
        }
    }
  }, [setAccessToken]);

  useEffect(() => {
    if (!isMounted) return;

    // Check for error in query params
    if(typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        if (error) {
            // Optionally show a toast or message to the user
            console.error("Spotify Auth Error:", error);
            // Clean the URL
            window.history.replaceState(null, '', '/login');
        }
    }

    if (!accessToken && pathname !== '/login') {
       router.replace('/login');
    } else if (accessToken && pathname === '/login') {
       router.replace('/');
    }
  }, [accessToken, pathname, router, isMounted]);

  const value = { accessToken, setAccessToken };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
