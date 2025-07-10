
"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // For this debug step, we always start at the login page.
    router.replace('/login');
  }, [router]);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting to Login...</h1>
    </div>
  );
}
