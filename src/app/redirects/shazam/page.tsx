// app/redirect/shazam/page.tsx
'use client';

import { useEffect } from 'react';

export default function ShazamRedirect() {
  useEffect(() => {
    // This runs in browser context only
    const timer = setTimeout(() => {
      window.open('https://shazam.com/myshazam', '_blank', 'noopener,noreferrer');
      window.history.back(); // Go back to previous page
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-300">Opening Shazam in your browser...</p>
      </div>
    </div>
  );
}