'use client';

import { useTheme } from './ThemeProvider';
import { SunIcon, MoonIcon, PlayCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const navRef = useRef<HTMLElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                navRef.current,
                { y: -40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.1 }
            );
        });
        return () => ctx.revert();
    }, []);

    const handleThemeToggle = () => {
        toggleTheme();
    };

    return (
        <nav
            ref={navRef}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 opacity-0"
        >
            <div className="glass-navbar rounded-full px-5 py-2.5 flex items-center justify-between gap-8 border border-border">
                {/* Logo section */}
                <div className="flex items-center gap-3">
                    <div ref={logoRef} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-background">
                        <PlayCircleIcon className="w-5 h-5" />
                    </div>
                    <span className="font-display font-bold text-lg tracking-tight text-text-primary">
                        EchoList
                    </span>
                </div>

                {/* Navigation links */}
                <div className="hidden sm:flex items-center gap-6">
                    <a
                        href="#how-it-works"
                        className="text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-300"
                    >
                        Features
                    </a>
                    <a
                        href="https://www.shazam.com/myshazam"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-300 relative group"
                    >
                        Get Data
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-secondary transition-all duration-300 group-hover:w-full"></span>
                    </a>
                </div>

                {/* Theme toggle */}
                <button
                    onClick={handleThemeToggle}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-surface hover:bg-surface-elevated border border-border transition-colors duration-300"
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {theme === 'dark' ? (
                        <SunIcon className="w-4 h-4 text-primary" />
                    ) : (
                        <MoonIcon className="w-4 h-4 text-primary" />
                    )}
                </button>
            </div>
        </nav>
    );
}
