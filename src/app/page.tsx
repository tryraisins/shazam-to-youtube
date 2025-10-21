'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import PlaylistCreator from '@/components/PlaylistCreator';
import { ShazamTrack } from '@/lib/csv-parser';
import { ExternalLink, Music2, Youtube, Radio, Mic, Headphones, Disc, Volume2, Music, Smartphone } from 'lucide-react';

// Animated Background Component
function AnimatedBackground() {
  const [musicIcons, setMusicIcons] = useState([]);
  const [waveCircles, setWaveCircles] = useState([]);
  const [equalizers, setEqualizers] = useState([]);

  const icons = [Music2, Radio, Mic, Headphones, Disc, Volume2, Music, Smartphone];
  const colors = ['blue', 'purple', 'pink', 'cyan', 'indigo', 'violet', 'fuchsia'];

  // Helper function to get color RGB values
  const getColorRGB = (color) => {
    const colorMap = {
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

  const getEqualizerColor = (color) => {
    const colorMap = {
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

  const getIconColor = (color) => {
    const colorMap = {
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
    const generatedIcons = Array.from({ length: 40 }, (_, i) => {
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
    const generatedCircles = Array.from({ length: 12 }, (_, i) => {
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
    const generatedEqualizers = Array.from({ length: 8 }, (_, i) => {
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
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

export default function Home() {
  const [tracks, setTracks] = useState<ShazamTrack[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl animate-glow transform hover:scale-110 transition-transform duration-300">
                <Music2 className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                →
              </div>
              <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-2xl animate-glow transform hover:scale-110 transition-transform duration-300" style={{ animationDelay: '1.5s' }}>
                <Youtube className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Shazam to YouTube
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Transform your Shazam discoveries into YouTube playlists in seconds
            </p>
          </div>

          {/* Export Button Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 mb-8 animate-slide-up hover:bg-gray-800/70 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2 justify-center sm:justify-start">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold">1</span>
                  Export Your Shazam Data
                </h2>
                <p className="text-gray-400">
                  Visit Shazam to download your music history as a CSV file
                </p>
              </div>
              <a
                href="https://www.shazam.com/myshazam"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Export from Shazam
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 mb-8 animate-slide-up hover:bg-gray-800/70 transition-all duration-300" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold">2</span>
              Upload Your CSV File
            </h2>
            <FileUpload onTracksParsed={setTracks} />
          </div>

          {/* Playlist Creator */}
          {tracks.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 animate-slide-up hover:bg-gray-800/70 transition-all duration-300">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 text-sm font-bold">3</span>
                Create Your Playlist
              </h2>
              <PlaylistCreator
                tracks={tracks}
                isAuthenticated={isAuthenticated}
                accessToken={accessToken}
                onAuthChange={setIsAuthenticated}
                onTokenChange={setAccessToken}
              />
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-12 text-gray-500 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <p className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Your data stays private and is processed locally in your browser
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 40px rgba(147, 51, 234, 0.5); }
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}