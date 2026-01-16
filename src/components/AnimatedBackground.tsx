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
    const types: FloatingElement['type'][] = ['vinyl', 'wave', 'note', 'eq'];
    const generated: FloatingElement[] = [];

    // Generate vinyl records (larger, fewer)
    for (let i = 0; i < 3; i++) {
      generated.push({
        id: generated.length,
        type: 'vinyl',
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 120 + Math.random() * 80,
        delay: Math.random() * 2,
        duration: 15 + Math.random() * 10,
        rotation: Math.random() * 360,
      });
    }

    // Generate wave circles
    for (let i = 0; i < 6; i++) {
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

    // Generate musical notes
    for (let i = 0; i < 15; i++) {
      generated.push({
        id: generated.length,
        type: 'note',
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 24 + Math.random() * 32,
        delay: Math.random() * 4,
        duration: 8 + Math.random() * 6,
        rotation: -20 + Math.random() * 40,
      });
    }

    // Generate equalizer sets
    for (let i = 0; i < 5; i++) {
      generated.push({
        id: generated.length,
        type: 'eq',
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 60 + Math.random() * 40,
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
      // Animate blobs
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
    const coralOpacity = theme === 'dark' ? 'opacity-20' : 'opacity-15';
    const oceanOpacity = theme === 'dark' ? 'opacity-15' : 'opacity-12';
    const amberOpacity = theme === 'dark' ? 'opacity-18' : 'opacity-12';

    const colors = [
      `text-coral-500 ${coralOpacity}`,
      `text-ocean-500 ${oceanOpacity}`,
      `text-amber-500 ${amberOpacity}`,
    ];
    return colors[index % colors.length];
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10"
    >
      {/* Abstract gradient blobs */}
      <div
        className="blob blob-coral absolute w-[500px] h-[500px] -top-48 -left-48 animate-float"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="blob blob-ocean absolute w-[600px] h-[600px] top-1/2 -right-72 animate-float-slow"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="blob blob-amber absolute w-[450px] h-[450px] -bottom-32 left-1/3 animate-float-slower"
        style={{ animationDelay: '4s' }}
      />
      <div
        className="blob blob-coral absolute w-[350px] h-[350px] top-1/4 right-1/4 animate-float"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="blob blob-ocean absolute w-[400px] h-[400px] bottom-1/4 -left-32 animate-float-slow"
        style={{ animationDelay: '3s' }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: theme === 'dark'
            ? 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
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
              className="w-full h-full vinyl-record animate-spin-slow opacity-30"
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
                  ? 'radial-gradient(circle, rgba(255, 107, 69, 0.1) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(255, 107, 69, 0.08) 0%, transparent 70%)',
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
                    opacity: theme === 'dark' ? 0.3 : 0.2,
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
            ? 'radial-gradient(ellipse at 50% 0%, transparent 0%, rgba(10, 10, 15, 0.8) 100%)'
            : 'radial-gradient(ellipse at 50% 0%, transparent 0%, rgba(250, 248, 245, 0.6) 100%)',
        }}
      />

      {/* Noise overlay */}
      <div className="noise-overlay" />
    </div>
  );
}