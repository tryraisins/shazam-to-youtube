'use client';

import { useState, useEffect, useRef } from 'react';
import { ShazamTrack } from '@/lib/csv-parser';
import {
  CheckIcon,
  SparklesIcon,
  PlayIcon,
  MusicalNoteIcon,
  ArrowTopRightOnSquareIcon,
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

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }
      );
    }
  }, []);

  useEffect(() => {
    if (trackListRef.current && tracks.length > 0) {
      const items = trackListRef.current.querySelectorAll('.track-item');
      gsap.fromTo(
        items,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out' }
      );
    }
  }, [tracks]);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, playlistTitle }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.exists;
      }
      return false;
    } catch {
      return false;
    }
  };

  const authenticateWithYouTube = async () => {
    setAuthLoading(true);
    try {
      const response = await fetch('/api/auth');
      if (!response.ok) throw new Error('Failed to get auth URL');
      const { authUrl } = await response.json();
      if (!authUrl) throw new Error('No authentication URL received');

      const popup = window.open(authUrl, 'youtube-auth', 'width=600,height=700,left=100,top=100');
      if (!popup) throw new Error('Popup blocked.');

      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          if (!isAuthenticated) setAuthLoading(false);
        }
      }, 1000);
    } catch (error) {
      alert(`Failed to start authentication: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setAuthLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!isAuthenticated || !accessToken) return alert('Authenticate first');
    if (tracks.length === 0) return alert('No tracks');

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracks, accessToken, playlistTitle: title, action }),
      });
      const resultData: PlaylistCreationResult = await response.json();
      if (!response.ok) throw new Error(resultData.error || 'Failed to create playlist');
      setResult(resultData);
    } catch (error) {
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
    let finalTitle = playlistTitle;
    let action: 'create' | 'overwrite' | 'update' = 'create';
    if (existingPlaylistAction === 'overwrite') action = 'overwrite';
    if (existingPlaylistAction === 'update') action = 'update';
    if (existingPlaylistAction === 'new_name') {
      finalTitle = customPlaylistName || `${playlistTitle} ${new Date().toLocaleDateString()}`;
      action = 'create';
    }
    setPlaylistTitle(finalTitle);
    createPlaylist(finalTitle, action);
  };

  return (
    <div ref={containerRef} className="w-full space-y-8">
      {/* Track Summary Box */}
      <div className="glass-card p-6 border-l-4 border-l-primary relative">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-surface border border-primary flex items-center justify-center">
            <MusicalNoteIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-medium text-lg text-text-primary tracking-tight">
              Awaiting Sequence
            </h3>
            <p className="text-sm text-text-muted font-light">
              {tracks.length} signatures identified
            </p>
          </div>
        </div>

        <div ref={trackListRef} className="max-h-56 overflow-y-auto bg-background/50 border border-border p-2 space-y-1">
          {tracks.slice(0, 15).map((track, index) => (
            <div key={`${track.artist}-${track.title}-${index}`} className="track-item flex items-center gap-4 py-2 px-3 hover:bg-surface transition-colors duration-200">
              <div className="w-6 h-6 border-[0.5px] border-text-muted flex items-center justify-center flex-shrink-0">
                <PlayIcon className="w-3 h-3 text-text-muted" />
              </div>
              <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
                <p className="text-sm font-medium text-text-primary truncate">{track.title}</p>
                <p className="text-xs text-text-muted truncate sm:w-1/3 sm:text-right">{track.artist}</p>
              </div>
            </div>
          ))}
          {tracks.length > 15 && (
            <div className="text-center py-4 text-xs tracking-widest uppercase text-text-muted font-display">
              <span className="inline-flex items-center gap-2">
                <SparklesIcon className="w-3 h-3" />
                +{tracks.length - 15} additional entities
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Area */}
      {!isAuthenticated ? (
        <button
          onClick={authenticateWithYouTube}
          disabled={authLoading}
          className="w-full py-5 px-6 bg-text-primary text-background font-display font-bold text-sm tracking-widest uppercase hover:bg-primary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {authLoading ? (
              <span className="animate-pulse">Authorizing...</span>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                Sync with YouTube
              </>
            )}
          </span>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-sm text-text-muted">Target Network</span>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-display font-medium text-primary">YouTube Connected</span>
            </div>
          </div>

          <button
            onClick={handleCreatePlaylist}
            disabled={isCreating}
            className="w-full py-5 px-6 bg-primary text-background font-display font-bold text-sm tracking-widest uppercase hover:bg-text-primary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-3">
              {isCreating ? <span className="animate-pulse">Generating Matrix...</span> : 'Execute Generation'}
            </span>
          </button>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className={`glass-card p-6 border-l-4 ${result.success ? 'border-l-primary' : 'border-l-secondary'}`}>
          {result.success ? (
            <div className="space-y-4">
              <h3 className="font-display font-medium text-lg text-primary tracking-tight">Sequence Established</h3>
              <p className="text-sm text-text-muted">Successfully mapped {result.addedTracks} / {result.totalTracks} nodes.</p>
              {result.failedTracks > 0 && <p className="text-sm text-secondary">Warning: {result.failedTracks} orphans isolated.</p>}
              {result.playlistId && (
                <a href={`https://www.youtube.com/playlist?list=${result.playlistId}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-sm font-display text-text-primary border-b border-text-primary pb-1 hover:text-primary hover:border-primary transition-colors">
                  Access Network
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-display font-medium text-lg text-secondary tracking-tight">System Fault</h3>
              <p className="text-sm text-text-muted">{result.error}</p>
              <button onClick={() => setResult(null)} className="mt-4 text-sm font-display text-text-primary border-b border-text-primary pb-1 hover:text-secondary transition-colors">Acknowledge</button>
            </div>
          )}
        </div>
      )}

      {/* Dialog Modal handled similarly, streamlined */}
      {showExistingPlaylistDialog && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-card max-w-md w-full p-8 border border-border">
            <h3 className="text-xl font-display mb-2">Collision Detected</h3>
            <p className="text-sm text-text-muted mb-8">Target namespace &quot;{playlistTitle}&quot; is occupied. Select resolution vector:</p>
            <div className="space-y-2 mb-8">
              {['overwrite', 'update', 'new_name'].map((action) => (
                <label key={action} className={`flex items-center gap-4 p-4 cursor-pointer border transition-colors ${existingPlaylistAction === action ? 'border-primary bg-primary/5' : 'border-border bg-surface'}`}>
                  <input type="radio" value={action} checked={existingPlaylistAction === action} onChange={(e) => setExistingPlaylistAction(e.target.value as ExistingPlaylistAction)} className="sr-only" />
                  <div className={`w-4 h-4 border flex items-center justify-center ${existingPlaylistAction === action ? 'border-primary bg-primary' : 'border-border'}`} />
                  <span className="text-sm uppercase tracking-wider font-display">{action.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
            {existingPlaylistAction === 'new_name' && (
              <input type="text" value={customPlaylistName} onChange={(e) => setCustomPlaylistName(e.target.value)} placeholder="Enter isolated namespace..." className="w-full bg-surface border border-border p-3 mb-6 text-sm" />
            )}
            <div className="flex gap-4">
              <button onClick={() => setShowExistingPlaylistDialog(false)} className="flex-1 py-3 border border-border text-sm font-display uppercase tracking-widest hover:bg-surface transition-colors">Abort</button>
              <button onClick={handleExistingPlaylistChoice} className="flex-1 py-3 bg-text-primary text-background font-display font-bold uppercase tracking-widest hover:bg-primary transition-colors">Proceed</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}