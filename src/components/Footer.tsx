import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-background/50 border-t pb-6">
      <div className="container mx-auto px-4 pt-6 text-center text-sm text-muted-foreground flex flex-col items-center">
        <div className="mb-4">
          <Link href="https://buymeacoffee.com/emailsig" target="_blank" rel="noopener noreferrer">
            <Image
                src="/bmc_qr.png"
                alt="Buy me a coffee QR code"
                width={120}
                height={120}
                className="rounded-lg"
                data-ai-hint="qr code"
            />
          </Link>
        </div>
        <div>
            <p>
            &copy; {new Date().getFullYear()} SpotBack. All Rights Reserved.
            </p>
            <p className="mt-1">
            Created with ❤️ by{' '}
            <a
                href="https.www.instagram.com/ajbatac"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline underline-offset-4"
            >
                AJ Batac (@ajbatac)
            </a>{' '}
            - v0.3.0{' '}
            <Link
                href="/changelog.html"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline underline-offset-4"
            >
                (changelog)
            </Link>
            </p>
        </div>
      </div>
    </footer>
  );
}
