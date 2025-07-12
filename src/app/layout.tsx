import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import { AuthProvider } from '@/context/auth-context';
import './globals.css';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/Footer';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'SpotBack',
  description: 'Backup Your Spotify Playlist',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased flex flex-col',
          ptSans.variable
        )}
      >
        <AuthProvider>
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
