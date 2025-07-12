import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import { AuthProvider } from '@/context/auth-context';
import './globals.css';
import { cn } from '@/lib/utils';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { Suspense } from 'react';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'SpotBack',
  description: 'Backup Your Spotify Playlist',
};

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'bg-background font-sans antialiased',
          ptSans.variable
        )}
      >
        {gaMeasurementId && (
            <Suspense>
                <GoogleAnalytics ga_id={gaMeasurementId} />
            </Suspense>
        )}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
