'use client';

import { useState, useEffect } from 'react';
import { Music2, Radio, Mic, Headphones, Disc, Volume2, Music, Smartphone } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// Types for animated background components
interface MusicIcon {
  id: number;
  Icon: LucideIcon;
  color: string;
  size: number;
  top: number;
  left: number;
  delay: number;
  duration: number;
  opacity: number;
  animationType: string;
}

interface WaveCircle {
  id: number;
  color: string;
  size: number;
  top: number;
  left: number;
  delay: number;
}

interface Equalizer {
  id: number;
  bars: number;
  top: number;
  left: number;
  barColors: string[];
  delays: number[];
}

export default function AnimatedBackground() {
  const [musicIcons, setMusicIcons] = useState<MusicIcon[]>([]);
  const [waveCircles, setWaveCircles] = useState<WaveCircle[]>([]);
  const [equalizers, setEqualizers] = useState<Equalizer[]>([]);

  const icons: LucideIcon[] = [Music2, Radio, Mic, Headphones, Disc, Volume2, Music, Smartphone];
  const colors: string[] = ['blue', 'purple', 'pink', 'cyan', 'indigo', 'violet', 'fuchsia'];

  // Helper function to get color RGB values
  const getColorRGB = (color: string): string => {
    const colorMap: Record<string, string> = {
      blue: 'rgba(59, 130, 246, 0.1)',
      purple: 'rgba(147, 51, 234, 0.1)',
      pink: 'rgba(236, 72, 153, 0.1)',
      cyan: 'rgba(34, 211, 238, 0.1)',
      indigo: 'rgba(99, 102, 241, 0.1)',
      violet: 'rgba(139, 92, 246, 0.1)',
      fuchsia: 'rgba(217, 70, 239, 0.1)'
    };
    return colorMap[color] || colorMap.blue;
  };

  const getEqualizerColor = (color: string): string => {
    const colorMap: Record<string, string> = {
      blue: 'rgba(96, 165, 250, 0.25)',
      purple: 'rgba(168, 85, 247, 0.25)',
      pink: 'rgba(244, 114, 182, 0.25)',
      cyan: 'rgba(103, 232, 249, 0.25)',
      indigo: 'rgba(129, 140, 248, 0.25)',
      violet: 'rgba(167, 139, 250, 0.25)',
      fuchsia: 'rgba(232, 121, 249, 0.25)'
    };
    return colorMap[color] || colorMap.blue;
  };

  const getIconColor = (color: string): string => {
    const colorMap: Record<string, string> = {
      blue: '#60a5fa',
      purple: '#a855f7',
      pink: '#f472b6',
      cyan: '#67e8f9',
      indigo: '#818cf8',
      violet: '#a78bfa',
      fuchsia: '#e879f9'
    };
    return colorMap[color] || colorMap.blue;
  };

  useEffect(() => {
    // Generate 40 random music icons
    const generatedIcons: MusicIcon[] = Array.from({ length: 40 }, (_, i) => {
      const Icon = icons[Math.floor(Math.random() * icons.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.floor(Math.random() * 4) + 6; // 6-9 (w-6 to w-9)
      const top = Math.random() * 95; // 0-95%
      const left = Math.random() * 95; // 0-95%
      const delay = Math.random() * 4; // 0-4s
      const duration = Math.random() * 3 + 5; // 5-8s
      const opacity = Math.floor(Math.random() * 2) + 3; // 30-40
      const animationType = Math.random() > 0.5 ? 'float' : 'float-delayed';

      return {
        id: i,
        Icon,
        color,
        size,
        top,
        left,
        delay,
        duration,
        opacity,
        animationType
      };
    });
    setMusicIcons(generatedIcons);

    // Generate 12 wave circles
    const generatedCircles: WaveCircle[] = Array.from({ length: 12 }, (_, i) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.floor(Math.random() * 200) + 200; // 200-400px
      const top = Math.random() * 90; // 0-90%
      const left = Math.random() * 90; // 0-90%
      const delay = Math.random() * 3; // 0-3s

      return {
        id: i,
        color,
        size,
        top,
        left,
        delay
      };
    });
    setWaveCircles(generatedCircles);

    // Generate 8 equalizer sets
    const generatedEqualizers: Equalizer[] = Array.from({ length: 8 }, (_, i) => {
      const bars = Math.floor(Math.random() * 3) + 3; // 3-5 bars
      const top = Math.random() * 90; // 0-90%
      const left = Math.random() * 90; // 0-90%
      const barColors = Array.from({ length: bars }, () => 
        colors[Math.floor(Math.random() * colors.length)]
      );
      const delays = Array.from({ length: bars }, () => Math.random() * 0.5);

      return {
        id: i,
        bars,
        top,
        left,
        barColors,
        delays
      };
    });
    setEqualizers(generatedEqualizers);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-gray-900">
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg); 
            opacity: 0.3; 
          }
          25% { 
            transform: translate(15px, -20px) rotate(10deg); 
            opacity: 0.5; 
          }
          50% { 
            transform: translate(-10px, -35px) rotate(-8deg); 
            opacity: 0.6; 
          }
          75% { 
            transform: translate(-20px, -15px) rotate(12deg); 
            opacity: 0.4; 
          }
        }
        @keyframes float-delayed {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg); 
            opacity: 0.3; 
          }
          25% { 
            transform: translate(-18px, -25px) rotate(-12deg); 
            opacity: 0.5; 
          }
          50% { 
            transform: translate(12px, -40px) rotate(10deg); 
            opacity: 0.7; 
          }
          75% { 
            transform: translate(10px, -20px) rotate(-10deg); 
            opacity: 0.4; 
          }
        }
        @keyframes equalizer {
          0%, 100% { transform: scaleY(0.2); }
          50% { transform: scaleY(1); }
        }
        @keyframes pulse-wave {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.1; 
          }
          50% { 
            transform: scale(1.3); 
            opacity: 0.2; 
          }
        }
      `}</style>

      {/* Wave Circles */}
      {waveCircles.map((circle) => (
        <div
          key={`circle-${circle.id}`}
          className={`absolute rounded-full blur-3xl`}
          style={{
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            top: `${circle.top}%`,
            left: `${circle.left}%`,
            backgroundColor: getColorRGB(circle.color),
            animation: `pulse-wave 3s ease-in-out infinite`,
            animationDelay: `${circle.delay}s`
          }}
        />
      ))}

      {/* Floating Music Icons */}
      {musicIcons.map((item) => (
        <div
          key={`icon-${item.id}`}
          className="absolute"
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            animation: `${item.animationType} ${item.duration}s ease-in-out infinite`,
            animationDelay: `${item.delay}s`
          }}
        >
          <item.Icon 
            style={{
              width: `${item.size * 4}px`,
              height: `${item.size * 4}px`,
              opacity: item.opacity / 10,
              color: getIconColor(item.color)
            }}
          />
        </div>
      ))}

      {/* Equalizer Bars */}
      {equalizers.map((eq) => (
        <div
          key={`eq-${eq.id}`}
          className="absolute flex gap-1"
          style={{
            top: `${eq.top}%`,
            left: `${eq.left}%`
          }}
        >
          {Array.from({ length: eq.bars }, (_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full`}
              style={{
                height: '50px',
                backgroundColor: getEqualizerColor(eq.barColors[i]),
                animation: 'equalizer 1s ease-in-out infinite',
                animationDelay: `${eq.delays[i]}s`,
                transformOrigin: 'bottom'
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}