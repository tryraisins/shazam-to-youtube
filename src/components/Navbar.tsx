'use client';

import { useTheme } from './ThemeProvider';
import { SunIcon, MoonIcon, SignalIcon } from '@heroicons/react/24/outline';
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
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-terracotta-500 via-gold-500 to-teal-500 opacity-60 blur-sm animate-pulse-glow" />

                        {/* Inner circle with icon */}
                        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-terracotta-500 to-gold-500 flex items-center justify-center shadow-lg">
                            <SignalIcon className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    <span
                        className="font-display font-bold text-xl tracking-tight"
                        style={{ fontFamily: "'Bricolage Grotesque', serif" }}
                    >
                        <span className="gradient-text">EchoList</span>
                    </span>
                </div>

                {/* Navigation links */}
                <div className="hidden sm:flex items-center gap-6">
                    <a
                        href="#how-it-works"
                        className="nav-link text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 cursor-pointer"
                    >
                        How it Works
                    </a>
                    <a
                        href="https://www.shazam.com/myshazam"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-link text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 cursor-pointer"
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
                            ? 'linear-gradient(135deg, rgba(62, 205, 181, 0.15) 0%, rgba(212, 168, 83, 0.15) 100%)'
                            : 'linear-gradient(135deg, rgba(232, 93, 58, 0.12) 0%, rgba(212, 168, 83, 0.12) 100%)',
                    }}
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {/* Glow effect on hover */}
                    <div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            background: theme === 'dark'
                                ? 'linear-gradient(135deg, rgba(62, 205, 181, 0.25) 0%, rgba(212, 168, 83, 0.25) 100%)'
                                : 'linear-gradient(135deg, rgba(232, 93, 58, 0.2) 0%, rgba(212, 168, 83, 0.2) 100%)',
                            boxShadow: theme === 'dark'
                                ? '0 0 20px rgba(62, 205, 181, 0.3)'
                                : '0 0 20px rgba(232, 93, 58, 0.3)',
                        }}
                    />

                    {theme === 'dark' ? (
                        <SunIcon className="w-5 h-5 text-gold-400 relative z-10" />
                    ) : (
                        <MoonIcon className="w-5 h-5 text-espresso-600 relative z-10" />
                    )}
                </button>
            </div>
        </nav>
    );
}
