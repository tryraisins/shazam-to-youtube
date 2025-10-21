// lib/youtube-auth.ts
import { google } from 'googleapis';

// Create OAuth2 client with explicit redirect URI
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/api/auth/callback' // Hardcode the redirect URI here
);

export const getAuthUrl = () => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube'],
    include_granted_scopes: true,
    prompt: 'consent',
  });
  
  console.log('Generated auth URL:', authUrl);
  return authUrl;
};

export const getTokens = async (code: string) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Tokens received:', tokens);
    return tokens;
  } catch (error) {
    console.error('Token exchange error:', error);
    throw new Error('Failed to exchange authorization code for tokens');
  }
};

export const getYouTubeClient = (accessToken: string) => {
  const client = new google.auth.OAuth2();
  client.setCredentials({ access_token: accessToken });
  return google.youtube({ version: 'v3', auth: client });
};