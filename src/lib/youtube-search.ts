import { youtube_v3 } from 'googleapis';

interface ShazamTrack {
  title: string;
  artist: string;
}

export const searchYouTubeVideos = async (
  youtube: youtube_v3.Youtube,
  tracks: ShazamTrack[]
): Promise<{ track: ShazamTrack; videoId: string | null }[]> => {
  const results = [];

  for (const track of tracks) {
    try {
      const searchQuery = `${track.title} ${track.artist}`;
      const response = await youtube.search.list({
        part: ['snippet'],
        q: searchQuery,
        type: ['video'],
        maxResults: 1,
      });

      const video = response.data.items?.[0];
      results.push({
        track,
        videoId: video?.id?.videoId || null,
      });
    } catch (error) {
      console.error(`Error searching for ${track.title}:`, error);
      results.push({ track, videoId: null });
    }
  }

  return results;
};