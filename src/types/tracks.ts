// types/track.ts
export interface ShazamTrack {
  title: string;
  artist: string;
  album?: string;
}

export interface PlaylistCreationResult {
  success: boolean;
  playlistId?: string;
  totalTracks: number;
  addedTracks: number;
  failedTracks: number;
  error?: string;
}

export interface YouTubeAuthState {
  isAuthenticated: boolean;
  accessToken: string;
}

export interface PlaylistCreatorProps {
  tracks: ShazamTrack[];
  isAuthenticated: boolean;
  accessToken: string;
  onAuthChange: (auth: boolean) => void;
  onTokenChange: (token: string) => void;
}

