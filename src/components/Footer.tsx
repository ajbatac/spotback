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
          Created with ❤️ by{' '}
          <a
            href="https://www.instagram.com/ajbatac"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            AJ Batac (@ajbatac)
          </a>{' '}
          - v0.1{' '}
          <Link
            href="/changelog.html"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            (changelog)
          </Link>
        </p>
      </div>
    </footer>
  );
}
