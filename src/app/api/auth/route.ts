import { NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/youtube-auth';

export async function GET() {
  try {
    console.log('Environment check:', {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback`
    });

    const authUrl = getAuthUrl();
    
    console.log('Returning auth URL:', authUrl);
    return NextResponse.json({ authUrl });
    
  } catch (error) {
    console.error('Auth URL generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication URL' },
      { status: 500 }
    );
  }
}