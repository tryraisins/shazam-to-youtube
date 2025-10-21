// app/api/auth-callback/route.ts
import { NextResponse } from 'next/server';
import { OAuth2Client, Credentials } from 'google-auth-library';
import { google, youtube_v3 } from 'googleapis';

// --- Setup OAuth Client (needs to be consistent with the other file) ---
const oauth2Client = new OAuth2Client(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

// --- Temporary Storage for CSV Data (must be consistent) ---
// In a real app, this should be a DB lookup.
// Re-declare the mock storage for this file for demonstration
const tempSongStorage = new Map<string, { artist: string; title: string }[]>();

// A simple in-memory store for the mock data since we don't have session/DB
// For a real test, you'd transfer the song data from /api/upload-csv to here.
const stateKey = 'mock_state_for_demo';
tempSongStorage.set(stateKey, [
    { artist: 'The Weeknd', title: 'Blinding Lights' },
    { artist: 'Dua Lipa', title: 'Don\'t Start Now' },
]);


export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state') || stateKey; // Use mock key if state is missing
  
  if (!code) {
    return NextResponse.json({ success: false, message: 'Authorization code missing.' }, { status: 400 });
  }

  try {
    // 1. Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // 2. Retrieve song list from temporary storage
    const songs = tempSongStorage.get(state);
    tempSongStorage.delete(state); // Clean up temp storage

    if (!songs || songs.length === 0) {
      return NextResponse.json({ success: false, message: 'Song data not found or expired.' }, { status: 404 });
    }

    // 3. Initialize YouTube API client
    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });

    // 4. Create the new playlist
    const playlistTitle = `Shazam Export - ${new Date().toLocaleDateString()}`;
    const playlistResponse = await youtube.playlists.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: playlistTitle,
          description: 'Playlist created from a Shazam CSV export using Next.js and YouTube Data API.',
        },
        status: {
          privacyStatus: 'private', // Can be 'public', 'private', or 'unlisted'
        },
      },
    });

    const playlistId = playlistResponse.data.id;
    if (!playlistId) {
        throw new Error("Failed to create playlist.");
    }

    // 5. Search for and add each song to the playlist
    const videoIds: string[] = [];

    for (const song of songs) {
      // YouTube Search API to find the best matching video
      const searchQuery = `${song.artist} ${song.title} official video`;
      const searchResponse = await youtube.search.list({
        part: ['snippet'],
        q: searchQuery,
        maxResults: 1,
        type: ['video'],
      });

      const videoId = searchResponse.data.items?.[0]?.id?.videoId;

      if (videoId) {
        videoIds.push(videoId);

        // Add video to the playlist
        await youtube.playlistItems.insert({
          part: ['snippet'],
          requestBody: {
            snippet: {
              playlistId: playlistId,
              resourceId: {
                kind: 'youtube#video',
                videoId: videoId,
              },
            },
          },
        });
        console.log(`Added video ${videoId} for: ${song.title}`);
      } else {
        console.log(`Could not find video for: ${song.title}`);
      }
    }

    // Redirect to a success page or the new playlist URL
    const successUrl = `/?status=success&playlistId=${playlistId}`;
    return NextResponse.redirect(new URL(successUrl, process.env.YOUTUBE_REDIRECT_URI).origin);
    
  } catch (error) {
    console.error('Playlist creation error:', error);
    return NextResponse.json({ 
        success: false, 
        message: 'Failed to create playlist or process callback. Check console for details.' 
    }, { status: 500 });
  }
}

// Ensure the handler doesn't require the body to be parsed as JSON, etc.
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };