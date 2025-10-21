import { NextResponse } from 'next/server';
import { getYouTubeClient } from '@/lib/youtube-auth';

export async function POST(request: Request) {
  try {
    const { accessToken, playlistTitle } = await request.json();

    if (!accessToken || !playlistTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const youtube = getYouTubeClient(accessToken);

    // Search for existing playlists with the same name
    const playlistsResponse = await youtube.playlists.list({
      part: ['snippet'],
      mine: true,
      maxResults: 50
    });

    const existingPlaylist = playlistsResponse.data.items?.find(
      playlist => playlist.snippet?.title?.toLowerCase() === playlistTitle.toLowerCase()
    );

    return NextResponse.json({
      exists: !!existingPlaylist,
      playlistId: existingPlaylist?.id
    });

  } catch (error) {
    console.error('Error checking playlist:', error);
    return NextResponse.json(
      { error: 'Failed to check existing playlists' },
      { status: 500 }
    );
  }
}