import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-6 mt-auto bg-background/50 border-t">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} SpotBack. All Rights Reserved.
        </p>
        <p className="mt-1">
          Made with ❤️ by your AI coding partner.
        </p>
      </div>
    </footer>
  );
}
