'use client';

import { useTheme } from './ThemeProvider';
import { SunIcon, MoonIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const navRef = useRef<HTMLElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        // Entrance animation
        const ctx = gsap.context(() => {
            gsap.fromTo(
                navRef.current,
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)', delay: 0.2 }
            );

            gsap.fromTo(
                logoRef.current,
                { scale: 0, rotation: -180 },
                { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)', delay: 0.5 }
            );
        });

        return () => ctx.revert();
    }, []);

    const handleToggleHover = (isEntering: boolean) => {
        if (toggleRef.current) {
            gsap.to(toggleRef.current, {
                scale: isEntering ? 1.1 : 1,
                rotation: isEntering ? 15 : 0,
                duration: 0.3,
                ease: 'power2.out',
            });
        }
    };

    const handleToggleClick = () => {
        if (toggleRef.current) {
            gsap.to(toggleRef.current, {
                rotation: 360,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => {
                    gsap.set(toggleRef.current, { rotation: 0 });
                },
            });
        }
        toggleTheme();
    };

    return (
        <nav
            ref={navRef}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl opacity-0"
        >
            <div className="glass-navbar rounded-full px-6 py-3 flex items-center justify-between">
                {/* Logo section */}
                <div className="flex items-center gap-3">
                    <div
                        ref={logoRef}
                        className="relative w-10 h-10 flex items-center justify-center"
                    >
                        {/* Animated glow ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-coral-500 via-amber-500 to-ocean-500 opacity-75 blur-sm animate-pulse-glow" />

                        {/* Inner circle with icon */}
                        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-coral-500 to-amber-500 flex items-center justify-center shadow-lg">
                            <MusicalNoteIcon className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    <span
                        className="font-display font-bold text-xl tracking-tight"
                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                        <span className="gradient-text">EchoList</span>
                    </span>
                </div>

                {/* Navigation links */}
                <div className="hidden sm:flex items-center gap-6">
                    <a
                        href="#how-it-works"
                        className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 cursor-pointer"
                    >
                        How it Works
                    </a>
                    <a
                        href="https://www.shazam.com/myshazam"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 cursor-pointer"
                    >
                        Get Shazam Data
                    </a>
                </div>

                {/* Theme toggle */}
                <button
                    ref={toggleRef}
                    onClick={handleToggleClick}
                    onMouseEnter={() => handleToggleHover(true)}
                    onMouseLeave={() => handleToggleHover(false)}
                    className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer group"
                    style={{
                        background: theme === 'dark'
                            ? 'linear-gradient(135deg, rgba(255, 107, 69, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)'
                            : 'linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
                    }}
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {/* Glow effect on hover */}
                    <div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            background: theme === 'dark'
                                ? 'linear-gradient(135deg, rgba(255, 107, 69, 0.3) 0%, rgba(245, 158, 11, 0.3) 100%)'
                                : 'linear-gradient(135deg, rgba(20, 184, 166, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)',
                            boxShadow: theme === 'dark'
                                ? '0 0 20px rgba(255, 107, 69, 0.4)'
                                : '0 0 20px rgba(20, 184, 166, 0.4)',
                        }}
                    />

                    {theme === 'dark' ? (
                        <SunIcon className="w-5 h-5 text-amber-400 relative z-10" />
                    ) : (
                        <MoonIcon className="w-5 h-5 text-ocean-600 relative z-10" />
                    )}
                </button>
            </div>
        </nav>
    );
}
