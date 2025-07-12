'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';

export function Header() {
  const { logout } = useAuth();

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <nav className="container mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center gap-3">
          <Music className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Spot<span className="text-primary">Back</span>
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">Your musical memories, secured.</p>
          </div>
        </div>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </nav>
    </header>
  );
}
