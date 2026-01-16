'use client';

import { useState, useRef, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import PlaylistCreator from '@/components/PlaylistCreator';
import { ShazamTrack } from '@/lib/csv-parser';
import {
  ArrowTopRightOnSquareIcon,
  MusicalNoteIcon,
  PlayCircleIcon,
  SparklesIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [tracks, setTracks] = useState<ShazamTrack[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');

  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  // Hero entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power4.out', delay: 0.3 }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.6 }
      );

      // Floating animation for hero icons
      gsap.to('.hero-icon', {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.3,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Steps scroll animation
  useEffect(() => {
    if (stepsRef.current) {
      const cards = stepsRef.current.querySelectorAll('.step-card');

      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1,
          }
        );
      });
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <section ref={heroRef} className="text-center py-16 md:py-24">
          {/* Floating music icons decoration */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="hero-icon w-14 h-14 rounded-2xl bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center shadow-neon-coral rotate-[-8deg]">
              <MusicalNoteIcon className="w-7 h-7 text-white" />
            </div>

            <div className="hero-icon flex items-center justify-center" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 rounded-full vinyl-record animate-spin-slow opacity-80" />
            </div>

            <div className="hero-icon w-14 h-14 rounded-2xl bg-gradient-to-br from-ocean-500 to-ocean-600 flex items-center justify-center shadow-neon-ocean rotate-[8deg]">
              <PlayCircleIcon className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Main title */}
          <h1
            ref={titleRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 opacity-0"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            <span className="gradient-text">EchoList</span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed opacity-0"
          >
            Transform your{' '}
            <span className="font-semibold text-coral-500">Shazam discoveries</span>{' '}
            into curated{' '}
            <span className="font-semibold text-ocean-500">YouTube playlists</span>{' '}
            in seconds
          </p>


        </section>

        {/* Steps Section */}
        <section ref={stepsRef} className="space-y-8" id="how-it-works">
          {/* Step 1: Export from Shazam */}
          <div className="step-card glass-card p-6 sm:p-8 relative overflow-hidden">
            {/* Decorative gradient */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: 'radial-gradient(circle at 0% 0%, rgba(255, 107, 69, 0.4) 0%, transparent 50%)',
              }}
            />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-start gap-4">
                  {/* Step number */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-coral-500 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-neon-coral">
                    <span
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      1
                    </span>
                  </div>

                  <div>
                    <h2
                      className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      Export Your Shazam Data
                    </h2>
                    <p className="text-[var(--text-secondary)]">
                      Visit Shazam to download your music discovery history as a CSV file
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="https://www.shazam.com/myshazam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-coral-600 to-amber-600 text-white font-bold shadow-neon-coral hover:opacity-90 transition-all duration-300 cursor-pointer group"
                >
                  Export from Shazam
                  <ArrowTopRightOnSquareIcon className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              {/* Decorative wave bars */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex gap-1 items-end h-16 opacity-20">
                {[40, 65, 35, 80, 50, 70, 45].map((height, i) => (
                  <div
                    key={i}
                    className="wave-bar w-2 animate-equalizer"
                    style={{
                      height: `${height}%`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Upload CSV */}
          <div className="step-card glass-card p-6 sm:p-8 relative overflow-hidden">
            {/* Decorative gradient */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: 'radial-gradient(circle at 100% 0%, rgba(245, 158, 11, 0.4) 0%, transparent 50%)',
              }}
            />

            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-6">
                {/* Step number */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-neon-amber">
                  <span
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    2
                  </span>
                </div>

                <div>
                  <h2
                    className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    Upload Your CSV File
                  </h2>
                  <p className="text-[var(--text-secondary)]">
                    Drag and drop or click to select your exported Shazam data
                  </p>
                </div>
              </div>

              <FileUpload onTracksParsed={setTracks} onParsingStateChange={() => { }} />
            </div>
          </div>

          {/* Step 3: Create Playlist (only shows when tracks are loaded) */}
          {tracks.length > 0 && (
            <div className="step-card glass-card p-6 sm:p-8 relative overflow-hidden">
              {/* Decorative gradient */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: 'radial-gradient(circle at 50% 100%, rgba(20, 184, 166, 0.4) 0%, transparent 50%)',
                }}
              />

              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-6">
                  {/* Step number */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ocean-500 to-ocean-600 flex items-center justify-center flex-shrink-0 shadow-neon-ocean">
                    <span
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      3
                    </span>
                  </div>

                  <div>
                    <h2
                      className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      Create Your Playlist
                    </h2>
                    <p className="text-[var(--text-secondary)]">
                      Connect to YouTube and generate your personalized playlist
                    </p>
                  </div>
                </div>

                <PlaylistCreator
                  tracks={tracks}
                  isAuthenticated={isAuthenticated}
                  accessToken={accessToken}
                  onAuthChange={setIsAuthenticated}
                  onTokenChange={setAccessToken}
                />
              </div>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="glass-card inline-flex items-center gap-3 px-6 py-3 rounded-full">
            <div className="w-2 h-2 rounded-full bg-ocean-500 animate-pulse" />
            <span className="text-sm text-[var(--text-muted)]">
              Your data stays private — processed locally in your browser
            </span>
            <SparklesIcon className="w-4 h-4 text-amber-500" />
          </div>
        </footer>
      </div>
    </div>
  );
}