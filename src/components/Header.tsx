'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const userImage = user?.images?.[0]?.url;

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <nav className="container mx-auto px-4 flex justify-between items-center h-16">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/spotify.png"
            alt="SpotBack Logo"
            width={28}
            height={28}
            data-ai-hint="logo"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Spot<span className="text-primary">Back</span>
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">Your musical memories, secured.</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {userImage ? (
                    <Image 
                        src={userImage} 
                        alt={user.display_name || 'User'}
                        width={28}
                        height={28}
                        className="rounded-full"
                        data-ai-hint="user avatar"
                    />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <span className="hidden sm:inline">{user.display_name}</span>
            </div>
          )}
          <Button variant="outline" onClick={logout} className="transition-all hover:bg-accent/80">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>
    </header>
  );
}
