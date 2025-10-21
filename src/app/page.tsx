'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import PlaylistCreator from '@/components/PlaylistCreator';
import { ShazamTrack } from '@/lib/csv-parser';

export default function Home() {
  const [tracks, setTracks] = useState<ShazamTrack[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shazam to YouTube
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Convert your Shazam CSV exports to YouTube playlists
          </p>
        </div>

        <div className="space-y-8">
          <FileUpload onTracksParsed={setTracks} />

          {tracks.length > 0 && (
            <PlaylistCreator
              tracks={tracks}
              isAuthenticated={isAuthenticated}
              accessToken={accessToken}
              onAuthChange={setIsAuthenticated}
              onTokenChange={setAccessToken}
            />
          )}
        </div>
      </div>
    </div>
  );
}