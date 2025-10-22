'use client';

import { useState, useEffect } from 'react';
import { ShazamTrack } from '@/lib/csv-parser';
import { Check, Loader2, AlertTriangle, XCircle, PartyPopper } from 'lucide-react'; // Import new icons

interface PlaylistCreationResult {
  success: boolean;
  playlistId?: string;
  totalTracks: number;
  addedTracks: number;
  failedTracks: number;
  error?: string;
  action?: 'created' | 'replaced' | 'updated';
}

interface PlaylistCreatorProps {
  tracks: ShazamTrack[];
  isAuthenticated: boolean;
  accessToken: string;
  onAuthChange: (auth: boolean) => void;
  onTokenChange: (token: string) => void;
}

type ExistingPlaylistAction = 'overwrite' | 'update' | 'new_name';

export default function PlaylistCreator({
  tracks,
  isAuthenticated,
  accessToken,
  onAuthChange,
  onTokenChange,
}: PlaylistCreatorProps) {
  const [playlistTitle, setPlaylistTitle] = useState('My Shazam Tracks');
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<PlaylistCreationResult | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [showExistingPlaylistDialog, setShowExistingPlaylistDialog] = useState(false);
  const [existingPlaylistAction, setExistingPlaylistAction] = useState<ExistingPlaylistAction>('overwrite');
  const [customPlaylistName, setCustomPlaylistName] = useState('');

    // Handle OAuth callback from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
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
    return () => window.removeEventListener('message', handleMessage);
  }, [onAuthChange, onTokenChange]);

  const checkExistingPlaylist = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/check-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken,
          playlistTitle: playlistTitle,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.exists;
      }
      return false;
    } catch (error) {
      console.error('Error checking existing playlist:', error);
      return false;
    }
  };

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
      
      const popup = window.open(authUrl, 'youtube-auth', 'width=600,height=700,left=100,top=100');
      
      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }
      
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          if (!isAuthenticated) {
            setAuthLoading(false);
          }
        }
      }, 1000);
      
    } catch (error) {
      console.error('Authentication failed:', error);
      alert(`Failed to start authentication: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setAuthLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!isAuthenticated || !accessToken) {
      alert('Please authenticate with YouTube first');
      return;
    }

    if (tracks.length === 0) {
      alert('No tracks to add to playlist');
      return;
    }

    // Check if playlist already exists
    const playlistExists = await checkExistingPlaylist();
    
    if (playlistExists) {
      setShowExistingPlaylistDialog(true);
      return;
    }

    // If no existing playlist, proceed with creation
    createPlaylist(playlistTitle, 'create');
  };

  const createPlaylist = async (title: string, action: 'create' | 'overwrite' | 'update') => {
    setIsCreating(true);
    setResult(null);
    setShowExistingPlaylistDialog(false);

    try {
      const response = await fetch('/api/playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tracks: tracks,
          accessToken,
          playlistTitle: title,
          action: action,
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

  const handleExistingPlaylistChoice = () => {
    let finalPlaylistTitle = playlistTitle;
    let action: 'create' | 'overwrite' | 'update' = 'create';

    switch (existingPlaylistAction) {
      case 'overwrite':
        action = 'overwrite';
        break;
      case 'update':
        action = 'update';
        break;
      case 'new_name':
        finalPlaylistTitle = customPlaylistName || `${playlistTitle} ${new Date().toLocaleDateString()}`;
        action = 'create';
        break;
    }
setPlaylistTitle(finalPlaylistTitle);
    createPlaylist(playlistTitle, action);
  };

  const handleRetry = () => {
    setResult(null);
    handleCreatePlaylist();
  };

  return (
    // No bg-white, shadow-md, or p-6.
    <div className="w-full">
      <div className="space-y-6">
        {/* Dark-themed track summary */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="font-medium text-gray-100 mb-2">Track Summary</h3>
          <p className="text-sm text-gray-400">
            Found {tracks.length} tracks in your Shazam history
          </p>
          <div className="mt-2 max-h-40 overflow-y-auto rounded-md">
            {tracks.slice(0, 10).map((track, index) => (
              <div key={`${track.artist}-${track.title}-${index}`} className="text-xs text-gray-400 py-1.5 px-2 border-b border-white/5">
                <span className="font-medium text-gray-300">{track.artist}</span> - {track.title}
              </div>
            ))}
            {tracks.length > 10 && (
              <div className="text-xs text-gray-500 py-1.5 px-2">
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
              className="w-full flex items-center justify-center bg-red-600 text-white py-2.5 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {authLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Opening YouTube...
                </>
              ) : (
                'Connect YouTube Account'
              )}
            </button>
            {authLoading && (
              <p className="text-xs text-gray-500 text-center">
                A new window will open for authentication
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center text-sm text-green-400 mb-2 p-2 bg-green-500/10 rounded-md">
              <Check className="w-4 h-4 mr-2" />
              Connected to YouTube
            </div>
            {/* --- PRIMARY ACTION BUTTON (GRADIENT) --- */}
            <button
              onClick={handleCreatePlaylist}
              disabled={isCreating}
              className="w-full flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white font-semibold py-2.5 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200"
            >
              {isCreating ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Creating Playlist...
                </>
              ) : (
                'Create YouTube Playlist'
              )}
            </button>
            <p className="text-xs text-gray-500 text-center">
              Playlist will be created as: <strong className="text-gray-400">My Shazam Tracks</strong>
            </p>
          </div>
        )}

        {/* --- DARK/GLASS MODAL --- */}
        {showExistingPlaylistDialog && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Playlist Already Exists</h3>
              <p className="text-gray-400 mb-4">
                A playlist named <strong>&quot;My Shazam Tracks&quot;</strong> already exists. What would you like to do?
              </p>
              
              <div className="space-y-3 mb-4">
                {/* Styled Radio Buttons */}
                <label className="flex items-center space-x-3 p-3 rounded-md bg-white/5 hover:bg-white/10 cursor-pointer">
                  <input
                    type="radio"
                    name="existingPlaylistAction"
                    value="overwrite"
                    checked={existingPlaylistAction === 'overwrite'}
                    onChange={(e) => setExistingPlaylistAction(e.target.value as ExistingPlaylistAction)}
                    className="h-4 w-4 text-blue-400 bg-gray-700 border-gray-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-200">
                    <strong>Overwrite</strong> - Replace all content with new tracks
                  </span>
                </label>
                
                <label className="flex items-center space-x-3 p-3 rounded-md bg-white/5 hover:bg-white/10 cursor-pointer">
                  <input
                    type="radio"
                    name="existingPlaylistAction"
                    value="update"
                    checked={existingPlaylistAction === 'update'}
                    onChange={(e) => setExistingPlaylistAction(e.target.value as ExistingPlaylistAction)}
                    className="h-4 w-4 text-blue-400 bg-gray-700 border-gray-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-200">
                    <strong>Update</strong> - Add only new tracks to existing playlist
                  </span>
                </label>
                
                <label className="flex items-center space-x-3 p-3 rounded-md bg-white/5 hover:bg-white/10 cursor-pointer">
                  <input
                    type="radio"
                    name="existingPlaylistAction"
                    value="new_name"
                    checked={existingPlaylistAction === 'new_name'}
                    onChange={(e) => setExistingPlaylistAction(e.target.value as ExistingPlaylistAction)}
                    className="h-4 w-4 text-blue-400 bg-gray-700 border-gray-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-200">
                    <strong>Use different name</strong> - Create a new playlist
                  </span>
                </label>
              </div>

              {existingPlaylistAction === 'new_name' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Playlist Name
                  </label>
                  {/* Dark-themed Input */}
                  <input
                    type="text"
                    value={customPlaylistName}
                    onChange={(e) => setCustomPlaylistName(e.target.value)}
                    placeholder="e.g., My Shazam Vibes"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowExistingPlaylistDialog(false)}
                  className="flex-1 px-4 py-2 text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExistingPlaylistChoice}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- DARK-THEMED RESULT --- */}
        {result && (
          <div className={`p-4 rounded-md ${
            result.success ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'
          }`}>
            <h4 className="font-medium flex items-center">
              {result.success ? (
                <>
                  <PartyPopper className="w-5 h-5 mr-2" />
                  {result.action === 'created' && 'Playlist Created Successfully!'}
                  {result.action === 'replaced' && 'Playlist Updated Successfully!'}
                  {result.action === 'updated' && 'Playlist Enhanced Successfully!'}
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 mr-2" />
                  Creation Failed
                </>
              )}
            </h4>
            {result.success ? (
              <div className="text-sm mt-2 space-y-1">
                <p>Added {result.addedTracks} out of {result.totalTracks} tracks.</p>
                {result.failedTracks > 0 && (
                  <p className="text-yellow-400/80 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    {result.failedTracks} tracks couldn&apos;t be found on YouTube.
                  </p>
                )}
                {result.playlistId && (
                  <p className="text-xs text-gray-500 mt-2">
                    Playlist ID: {result.playlistId}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-sm mt-2">
                <p>{result.error}</p>
                <button
                  onClick={handleRetry}
                  className="mt-2 bg-red-600 text-white py-1 px-3 rounded text-xs hover:bg-red-700 font-medium"
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