'use client';

import { useState, useEffect, useRef } from 'react';
import { ShazamTrack } from '@/lib/csv-parser';
import {
  CheckIcon,
  XCircleIcon,
  SparklesIcon,
  PlayIcon,
  MusicalNoteIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import gsap from 'gsap';

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

  const containerRef = useRef<HTMLDivElement>(null);
  const trackListRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  // Stagger animation for track list
  useEffect(() => {
    if (trackListRef.current && tracks.length > 0) {
      const items = trackListRef.current.querySelectorAll('.track-item');
      gsap.fromTo(
        items,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
        }
      );
    }
  }, [tracks]);

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

    const playlistExists = await checkExistingPlaylist();

    if (playlistExists) {
      setShowExistingPlaylistDialog(true);
      return;
    }

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
        error: error instanceof Error ? error.message : 'Unknown error occurred',
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
    <div ref={containerRef} className="w-full space-y-6">
      {/* Track Summary Card */}
      <div className="glass-card p-6 relative overflow-hidden">
        {/* Decorative gradient */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: 'radial-gradient(circle at 100% 0%, rgba(255, 107, 69, 0.3) 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 to-amber-500 flex items-center justify-center shadow-neon-coral">
              <MusicalNoteIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3
                className="font-bold text-[var(--text-primary)]"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Track Collection
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                {tracks.length} songs ready to convert
              </p>
            </div>
          </div>

          {/* Track list with scroll */}
          <div
            ref={trackListRef}
            className="max-h-48 overflow-y-auto rounded-xl bg-[var(--surface)] p-3 space-y-1"
          >
            {tracks.slice(0, 15).map((track, index) => (
              <div
                key={`${track.artist}-${track.title}-${index}`}
                className="track-item flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[var(--surface-elevated)] transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral-500/20 to-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <PlayIcon className="w-4 h-4 text-coral-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {track.title}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] truncate">
                    {track.artist}
                  </p>
                </div>
              </div>
            ))}
            {tracks.length > 15 && (
              <div className="text-center py-2 text-sm text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1">
                  <SparklesIcon className="w-4 h-4" />
                  +{tracks.length - 15} more tracks
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Authentication / Action Section */}
      {!isAuthenticated ? (
        <button
          onClick={authenticateWithYouTube}
          disabled={authLoading}
          className="w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          }}
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {authLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting to YouTube...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Connect YouTube Account
              </>
            )}
          </span>
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </button>
      ) : (
        <div className="space-y-4">
          {/* Connected status */}
          <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-ocean-500/10 border border-ocean-500/20">
            <CheckIcon className="w-5 h-5 text-ocean-500" />
            <span className="text-sm font-medium text-ocean-500">Connected to YouTube</span>
          </div>

          {/* Create playlist button */}
          <button
            onClick={handleCreatePlaylist}
            disabled={isCreating}
            className="gradient-btn w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isCreating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Your Playlist...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  Create YouTube Playlist
                </>
              )}
            </span>
          </button>

          <p className="text-center text-sm text-[var(--text-muted)]">
            Playlist name: <span className="font-medium text-[var(--text-secondary)]">{playlistTitle}</span>
          </p>
        </div>
      )}

      {/* Existing Playlist Dialog Modal */}
      {showExistingPlaylistDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card max-w-md w-full p-6 relative overflow-hidden">
            {/* Decorative gradient */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: 'radial-gradient(circle at 0% 100%, rgba(245, 158, 11, 0.3) 0%, transparent 50%)',
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                </div>
                <h3
                  className="text-lg font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  Playlist Already Exists
                </h3>
              </div>

              <p className="text-[var(--text-secondary)] mb-6">
                A playlist named <span className="font-semibold">&quot;{playlistTitle}&quot;</span> already exists. What would you like to do?
              </p>

              <div className="space-y-3 mb-6">
                {[
                  { value: 'overwrite', label: 'Overwrite', desc: 'Replace all content with new tracks' },
                  { value: 'update', label: 'Update', desc: 'Add only new tracks to existing playlist' },
                  { value: 'new_name', label: 'Use different name', desc: 'Create a new playlist' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 ${existingPlaylistAction === option.value
                        ? 'bg-coral-500/10 border border-coral-500/30'
                        : 'bg-[var(--surface)] border border-transparent hover:bg-[var(--surface-elevated)]'
                      }`}
                  >
                    <input
                      type="radio"
                      name="existingPlaylistAction"
                      value={option.value}
                      checked={existingPlaylistAction === option.value}
                      onChange={(e) => setExistingPlaylistAction(e.target.value as ExistingPlaylistAction)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${existingPlaylistAction === option.value
                          ? 'border-coral-500 bg-coral-500'
                          : 'border-[var(--border)]'
                        }`}
                    >
                      {existingPlaylistAction === option.value && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{option.label}</p>
                      <p className="text-sm text-[var(--text-muted)]">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {existingPlaylistAction === 'new_name' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    New Playlist Name
                  </label>
                  <input
                    type="text"
                    value={customPlaylistName}
                    onChange={(e) => setCustomPlaylistName(e.target.value)}
                    placeholder="e.g., My Shazam Vibes"
                    className="w-full px-4 py-3 rounded-xl focus:outline-none"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowExistingPlaylistDialog(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-medium bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExistingPlaylistChoice}
                  className="flex-1 py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-coral-500 to-amber-500 text-white hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div
          className={`glass-card p-6 relative overflow-hidden ${result.success ? '' : ''
            }`}
        >
          {/* Decorative gradient based on success */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: result.success
                ? 'radial-gradient(circle at 50% 0%, rgba(20, 184, 166, 0.3) 0%, transparent 50%)'
                : 'radial-gradient(circle at 50% 0%, rgba(239, 68, 68, 0.3) 0%, transparent 50%)',
            }}
          />

          <div className="relative z-10">
            {result.success ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-ocean-500/20 flex items-center justify-center">
                    <SparklesIcon className="w-6 h-6 text-ocean-500" />
                  </div>
                  <div>
                    <h3
                      className="font-bold text-[var(--text-primary)]"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {result.action === 'created' && 'Playlist Created!'}
                      {result.action === 'replaced' && 'Playlist Updated!'}
                      {result.action === 'updated' && 'Playlist Enhanced!'}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      Added {result.addedTracks} of {result.totalTracks} tracks
                    </p>
                  </div>
                </div>

                {result.failedTracks > 0 && (
                  <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm mb-4">
                    <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
                    {result.failedTracks} tracks couldn&apos;t be found on YouTube
                  </div>
                )}

                {result.playlistId && (
                  <a
                    href={`https://www.youtube.com/playlist?list=${result.playlistId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-coral-500 to-amber-500 text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    Open Playlist on YouTube
                  </a>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <XCircleIcon className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3
                      className="font-bold text-[var(--text-primary)]"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      Creation Failed
                    </h3>
                    <p className="text-sm text-red-500">{result.error}</p>
                  </div>
                </div>

                <button
                  onClick={handleRetry}
                  className="py-3 px-5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}