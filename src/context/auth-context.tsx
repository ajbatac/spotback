
"use client";

import React, { createContext, useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/use-local-storage';

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>('spotify-token', null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This effect runs on the client after hydration
    const hash = window.location.hash;
    if (hash.includes('access_token=')) {
      const token = hash.split('access_token=')[1].split('&')[0];
      setAccessToken(token);
      // Clean the URL
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [setAccessToken]);

  useEffect(() => {
    // Redirect logic based on token presence
    if (!accessToken && pathname !== '/login') {
       router.replace('/login');
    } else if (accessToken && pathname === '/login') {
       router.replace('/');
    }
  }, [accessToken, pathname, router]);

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

    