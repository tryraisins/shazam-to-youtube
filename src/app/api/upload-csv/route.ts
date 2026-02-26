// app/api/upload-csv/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withRateLimit } from "@/lib/security/withRateLimit";
import { OAuth2Client } from "google-auth-library";

// Define the scope needed for YouTube playlist creation
const SCOPES = ["https://www.googleapis.com/auth/youtube"];

// --- Setup OAuth Client (uses env vars automatically) ---
const oauth2Client = new OAuth2Client(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI,
);

// --- Temporary Storage for CSV Data (In a real app, use a DB or session) ---
// Keyed by a simple 'state' or session ID
const tempSongStorage = new Map<string, { artist: string; title: string }[]>();

// **Simplified Mock Function for CSV Parsing**
// Replace this with a robust implementation that reads the actual file stream.
async function mockParseCsv(
  formData: FormData,
): Promise<{ artist: string; title: string }[]> {
  // In a full implementation, you'd read the 'shazamCsv' file, and parse it.
  console.log(
    "Mock parsing CSV - expecting 'Artist' and 'Title' columns. formData:",
    formData,
  );

  // A typical Shazam export might have 'Artist' and 'Track Name' columns
  const mockData = [
    { artist: "The Weeknd", title: "Blinding Lights" },
    { artist: "Dua Lipa", title: "Don't Start Now" },
    // ... actual data from CSV
  ];

  return mockData;
}

// POST Handler
async function handler(req: NextRequest) {
  try {
    const formData = await req.formData();
    // Use the mock parser to get song data
    const songs = await mockParseCsv(formData);

    if (songs.length === 0) {
      return NextResponse.json(
        { success: false, message: "No songs found in the CSV." },
        { status: 400 },
      );
    }

    // 1. Generate a temporary state to link the song data to the user session
    const state = Math.random().toString(36).substring(2, 15);
    tempSongStorage.set(state, songs);

    // 2. Generate the OAuth URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline", // Request a refresh token
      scope: SCOPES,
      state: state, // Pass the song data identifier
    });

    return NextResponse.json({ success: true, authUrl });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export const POST = withRateLimit(handler, "upload");
