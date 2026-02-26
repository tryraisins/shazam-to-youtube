'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useTheme } from './ThemeProvider';

interface FloatingElement {
  id: number;
  type: 'vinyl' | 'wave' | 'note' | 'eq';
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
}

// Musical note SVG paths
const NotePath = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
  </svg>
);

const DoubleNotePath = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M21 3v12.5a3.5 3.5 0 0 1-7 0 3.5 3.5 0 0 1 3.5-3.5c.54 0 1.05.12 1.5.34V6.47L9 8.6v8.9A3.5 3.5 0 0 1 5.5 21 3.5 3.5 0 0 1 2 17.5 3.5 3.5 0 0 1 5.5 14c.54 0 1.05.12 1.5.34V6l14-3z" />
  </svg>
);

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const { theme } = useTheme();

  // Generate floating elements on mount
  useEffect(() => {
    const generated: FloatingElement[] = [];

    // Generate vinyl records (larger, fewer)
    for (let i = 0; i < 2; i++) {
      generated.push({
        id: generated.length,
        type: 'vinyl',
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 100 + Math.random() * 60,
        delay: Math.random() * 2,
        duration: 18 + Math.random() * 10,
        rotation: Math.random() * 360,
      });
    }

    // Generate wave circles
    for (let i = 0; i < 4; i++) {
      generated.push({
        id: generated.length,
        type: 'wave',
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 200 + Math.random() * 200,
        delay: Math.random() * 3,
        duration: 4 + Math.random() * 2,
        rotation: 0,
      });
    }

    // Generate musical notes (fewer for cleaner look)
    for (let i = 0; i < 10; i++) {
      generated.push({
        id: generated.length,
        type: 'note',
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 28,
        delay: Math.random() * 4,
        duration: 8 + Math.random() * 6,
        rotation: -20 + Math.random() * 40,
      });
    }

    // Generate equalizer sets
    for (let i = 0; i < 3; i++) {
      generated.push({
        id: generated.length,
        type: 'eq',
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 50 + Math.random() * 30,
        delay: Math.random() * 2,
        duration: 0.8 + Math.random() * 0.4,
        rotation: 0,
      });
    }

    setElements(generated);
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate blobs with organic morphing
      gsap.to('.blob', {
        x: 'random(-100, 100)',
        y: 'random(-100, 100)',
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 2,
          from: 'random',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getColorClasses = (type: FloatingElement['type'], index: number) => {
    const colors = [
      `text-terracotta-500 ${theme === 'dark' ? 'opacity-15' : 'opacity-10'}`,
      `text-teal-500 ${theme === 'dark' ? 'opacity-12' : 'opacity-8'}`,
      `text-gold-500 ${theme === 'dark' ? 'opacity-14' : 'opacity-8'}`,
    ];
    return colors[index % colors.length];
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10"
    >
      {/* Organic warm blobs */}
      <div
        className="blob blob-terracotta absolute w-[500px] h-[500px] -top-48 -left-48 animate-float animate-morph"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="blob blob-teal absolute w-[550px] h-[550px] top-1/2 -right-72 animate-float-slow animate-morph"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="blob blob-gold absolute w-[400px] h-[400px] -bottom-32 left-1/3 animate-float-slower animate-morph"
        style={{ animationDelay: '4s' }}
      />
      <div
        className="blob blob-terracotta absolute w-[300px] h-[300px] top-1/4 right-1/4 animate-float animate-morph"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="blob blob-teal absolute w-[350px] h-[350px] bottom-1/4 -left-32 animate-float-slow"
        style={{ animationDelay: '3s' }}
      />

      {/* Concentric vinyl groove circles */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] vinyl-grooves rounded-full"
      />

      {/* Subtle dot grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: theme === 'dark'
            ? 'radial-gradient(rgba(245, 240, 232, 0.03) 1px, transparent 1px)'
            : 'radial-gradient(rgba(42, 38, 33, 0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Floating elements */}
      {elements.map((element) => (
        <div
          key={element.id}
          className={`absolute ${getColorClasses(element.type, element.id)}`}
          style={{
            top: `${element.y}%`,
            left: `${element.x}%`,
            width: element.size,
            height: element.size,
            transform: `rotate(${element.rotation}deg)`,
          }}
        >
          {element.type === 'vinyl' && (
            <div
              className="w-full h-full vinyl-record animate-spin-slow opacity-20"
              style={{
                animationDuration: `${element.duration}s`,
                animationDelay: `${element.delay}s`,
              }}
            />
          )}

          {element.type === 'wave' && (
            <div
              className="w-full h-full rounded-full animate-wave"
              style={{
                background: theme === 'dark'
                  ? 'radial-gradient(circle, rgba(255, 122, 85, 0.15) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(232, 93, 58, 0.08) 0%, transparent 70%)',
                animationDuration: `${element.duration}s`,
                animationDelay: `${element.delay}s`,
              }}
            />
          )}

          {element.type === 'note' && (
            <div
              className="w-full h-full animate-float"
              style={{
                animationDuration: `${element.duration}s`,
                animationDelay: `${element.delay}s`,
              }}
            >
              {element.id % 2 === 0 ? <NotePath /> : <DoubleNotePath />}
            </div>
          )}

          {element.type === 'eq' && (
            <div className="flex gap-1 items-end h-full">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="wave-bar w-2 animate-equalizer"
                  style={{
                    height: '100%',
                    animationDuration: `${element.duration}s`,
                    animationDelay: `${element.delay + i * 0.1}s`,
                    opacity: theme === 'dark' ? 0.2 : 0.12,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Radial gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(ellipse at 50% 0%, transparent 0%, #1A1714 100%)'
            : 'radial-gradient(ellipse at 50% 0%, transparent 0%, #FAF7F2 100%)',
        }}
      />

      {/* Noise overlay */}
      <div className="noise-overlay" />
    </div>
  );
}