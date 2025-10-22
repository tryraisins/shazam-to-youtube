'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import PlaylistCreator from '@/components/PlaylistCreator';
import { ShazamTrack } from '@/lib/csv-parser';
import { ExternalLink, Music2, Youtube } from 'lucide-react';

export default function Home() {
  const [tracks, setTracks] = useState<ShazamTrack[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');

  return (
    <div className="min-h-screen relative overflow-hidden">
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
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                EchoList
              </span>
            </h1>
             <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              Seamlessly convert your <span className="text-blue-300 font-medium">Shazam discoveries</span> into curated <span className="text-red-300 font-medium">YouTube playlists</span>
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
            <FileUpload onTracksParsed={setTracks} onParsingStateChange={() => {}} />
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