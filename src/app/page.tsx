'use client';

import { useState, useRef, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import PlaylistCreator from '@/components/PlaylistCreator';
import { ShazamTrack } from '@/lib/csv-parser';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import gsap from 'gsap';

export default function Home() {
  const [tracks, setTracks] = useState<ShazamTrack[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Staggered entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.stagger-element',
        { opacity: 0, y: 40, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power4.out', stagger: 0.15, delay: 0.2 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden px-4 sm:px-6 lg:px-12 pb-32 pt-16 flex items-center justify-center">
      <div ref={containerRef} className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative z-10">
        
        {/* Abstract Hero Side */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-10 relative">
          <div className="absolute -left-16 -top-16 w-48 h-48 border border-primary rounded-full opacity-20 stagger-element animate-pulse-slow" />
          
          <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-display font-bold leading-[1.05] stagger-element tracking-tighter">
            Audio<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Matrices.
            </span>
          </h1>

          <p className="text-lg text-text-secondary max-w-sm stagger-element leading-relaxed font-light">
            Upload your exported Shazam history and instantly generate a synced YouTube playlist. 
            No friction, pure geometry.
          </p>

          <div className="stagger-element pt-4 flex items-center gap-6">
            <a
              href="https://www.shazam.com/myshazam"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 px-8 py-5 bg-text-primary text-background font-display font-bold hover:bg-primary transition-colors duration-300 group tracking-widest uppercase text-sm"
            >
              Export Nodes
              <ArrowLongRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </a>
            <div className="hidden sm:block h-[1px] w-16 bg-border" />
          </div>
        </div>

        {/* Interactive Side */}
        <div className="lg:col-span-7 flex flex-col space-y-8 stagger-element relative">
          {/* Abstract backdrop for the functional area */}
          <div className="absolute inset-[-3rem] bg-glass-bg backdrop-blur-3xl -z-10 border border-glass-border shadow-2xl transform-gpu" />
          
          <div className="relative z-10 space-y-8 pt-4">
            <div className="stagger-element tracking-widest text-xs uppercase font-display text-text-muted mb-[-1rem] flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary" />
              Processing Matrix Area
            </div>

            <div className="stagger-element">
              <FileUpload onTracksParsed={setTracks} onParsingStateChange={() => { }} />
            </div>

            {tracks.length > 0 && (
              <div className="stagger-element origin-top animate-stagger-up">
                <PlaylistCreator
                  tracks={tracks}
                  isAuthenticated={isAuthenticated}
                  accessToken={accessToken}
                  onAuthChange={setIsAuthenticated}
                  onTokenChange={setAccessToken}
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}