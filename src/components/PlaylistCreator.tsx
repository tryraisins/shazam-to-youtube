'use client';

import { useState, useEffect } from 'react';
import { ShazamTrack } from '@/lib/csv-parser';

interface PlaylistCreationResult {
  success: boolean;
  playlistId?: string;
  totalTracks: number;
  addedTracks: number;
  failedTracks: number;
  error?: string;
}

interface PlaylistCreatorProps {
  tracks: ShazamTrack[];
  isAuthenticated: boolean;
  accessToken: string;
  onAuthChange: (auth: boolean) => void;
  onTokenChange: (token: string) => void;
}

export default function PlaylistCreator({
  tracks,
  isAuthenticated,
  accessToken,
  onAuthChange,
  onTokenChange,
}: PlaylistCreatorProps) {
  const [playlistTitle, setPlaylistTitle] = useState('My Shazam Playlist');
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<PlaylistCreationResult | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Handle OAuth callback from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Check origin for security
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'youtube-auth-success') {
        const { accessToken: tokenFromPopup } = event.data;
        if (tokenFromPopup) {
          onTokenChange(tokenFromPopup);
          onAuthChange(true);
          setAuthLoading(false);
        }
      } else if (event.data.type === 'youtube-auth-error') {
        console.error('OAuth error from popup:', event.data.error);
        alert('YouTube authentication failed. Please try again.');
        setAuthLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onAuthChange, onTokenChange]);

  const authenticateWithYouTube = async () => {
    setAuthLoading(true);
    try {
      const response = await fetch('/api/auth');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get auth URL');
      }
      
      const { authUrl } = await response.json();
      
      if (!authUrl) {
        throw new Error('No authentication URL received');
      }
      
      console.log('Opening auth in new tab:', authUrl);
      
      // Open in new tab instead of redirecting
      const popup = window.open(
        authUrl,
        'youtube-auth',
        'width=600,height=700,left=100,top=100'
      );
      
      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }
      
      // Check if popup is closed (fallback mechanism)
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          if (!isAuthenticated) {
            setAuthLoading(false);
            // User might have closed the popup without completing auth
            console.log('Auth popup was closed');
          }
        }
      }, 1000);
      
    } catch (error) {
      console.error('Authentication failed:', error);
      alert(`Failed to start authentication: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setAuthLoading(false);
    }
  };

  const createPlaylist = async () => {
    if (!isAuthenticated || !accessToken) {
      alert('Please authenticate with YouTube first');
      return;
    }

    if (tracks.length === 0) {
      alert('No tracks to add to playlist');
      return;
    }

    setIsCreating(true);
    setResult(null);

    try {
      const response = await fetch('/api/playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tracks: tracks,
          accessToken,
          playlistTitle,
        }),
      });

      const resultData: PlaylistCreationResult = await response.json();
      
      if (!response.ok) {
        throw new Error(resultData.error || 'Failed to create playlist');
      }

      setResult(resultData);
    } catch (error) {
      console.error('Playlist creation failed:', error);
      setResult({
        success: false,
        totalTracks: tracks.length,
        addedTracks: 0,
        failedTracks: tracks.length,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    createPlaylist();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Create YouTube Playlist</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="playlist-title" className="block text-sm font-medium text-gray-700 mb-2">
            Playlist Title
          </label>
          <input
            id="playlist-title"
            type="text"
            value={playlistTitle}
            onChange={(e) => setPlaylistTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter playlist title"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-2">Track Summary</h3>
          <p className="text-sm text-gray-600">
            Found {tracks.length} tracks in your Shazam history
          </p>
          <div className="mt-2 max-h-40 overflow-y-auto">
            {tracks.slice(0, 10).map((track, index) => (
              <div key={`${track.artist}-${track.title}-${index}`} className="text-xs text-gray-500 py-1 border-b border-gray-200">
                <span className="font-medium">{track.artist}</span> - {track.title}
              </div>
            ))}
            {tracks.length > 10 && (
              <div className="text-xs text-gray-400 py-1">
                ... and {tracks.length - 10} more tracks
              </div>
            )}
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="space-y-2">
            <button
              onClick={authenticateWithYouTube}
              disabled={authLoading}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {authLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Opening YouTube...
                </span>
              ) : (
                'Connect YouTube Account'
              )}
            </button>
            {authLoading && (
              <p className="text-xs text-gray-500 text-center">
                A new window will open for YouTube authentication
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center text-sm text-green-600 mb-2">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Connected to YouTube
            </div>
            <button
              onClick={createPlaylist}
              disabled={isCreating}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isCreating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Playlist...
                </span>
              ) : (
                'Create YouTube Playlist'
              )}
            </button>
          </div>
        )}

        {result && (
          <div className={`p-4 rounded-md ${
            result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <h4 className="font-medium flex items-center">
              {result.success ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Playlist Created Successfully!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Creation Failed
                </>
              )}
            </h4>
            {result.success ? (
              <div className="text-sm mt-2 space-y-1">
                <p>Added {result.addedTracks} out of {result.totalTracks} tracks to your playlist.</p>
                {result.failedTracks > 0 && (
                  <p className="text-yellow-700">
                    {result.failedTracks} tracks couldn&apos;t be found on YouTube.
                  </p>
                )}
                {result.playlistId && (
                  <p className="text-xs opacity-75">
                    Playlist ID: {result.playlistId}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-sm mt-2">
                <p>{result.error}</p>
                <button
                  onClick={handleRetry}
                  className="mt-2 bg-red-600 text-white py-1 px-3 rounded text-xs hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}