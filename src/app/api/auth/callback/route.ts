import { NextResponse } from 'next/server';
import { getTokens } from '@/lib/youtube-auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    console.log('OAuth callback received:', { code, error });
    
    if (error) {
      console.error('OAuth error:', error);
      // Return an HTML page that sends error message to parent
      return new Response(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  type: 'youtube-auth-error',
                  error: 'Authentication failed: ${error}'
                }, '${process.env.NEXTAUTH_URL || 'http://localhost:3000'}');
                window.close();
              } else {
                // Fallback if no opener (redirect instead)
                window.location.href = '${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=auth_failed';
              }
            </script>
          </body>
        </html>
      `, { 
        headers: { 
          'Content-Type': 'text/html',
          'Cache-Control': 'no-store'
        } 
      });
    }
    
    if (!code) {
      throw new Error('No authorization code provided');
    }

    const tokens = await getTokens(code);
    
    if (!tokens.access_token) {
      throw new Error('No access token received');
    }

    console.log('OAuth successful, access token received');
    
    // Return an HTML page that sends token to parent and closes
    return new Response(`
      <html>
        <head>
          <title>Authentication Successful</title>
        </head>
        <body>
          <div style="text-align: center; margin-top: 50px;">
            <h2>Authentication Successful!</h2>
            <p>You can close this window and return to the application.</p>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'youtube-auth-success',
                accessToken: '${tokens.access_token}'
              }, '${process.env.NEXTAUTH_URL || 'http://localhost:3000'}');
              // Don't close immediately, let user see success message
              setTimeout(() => window.close(), 2000);
            } else {
              // Fallback if no opener
              window.location.href = '${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?access_token=${tokens.access_token}&success=true';
            }
          </script>
        </body>
      </html>
    `, { 
      headers: { 
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store'
      } 
    });
    
  } catch (error) {
    console.error('Auth callback error:', error);
    
    return new Response(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'youtube-auth-error',
                error: '${error instanceof Error ? error.message : 'Authentication failed'}'
              }, '${process.env.NEXTAUTH_URL || 'http://localhost:3000'}');
              window.close();
            } else {
              window.location.href = '${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=auth_failed';
            }
          </script>
        </body>
      </html>
    `, { 
      headers: { 
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store'
      } 
    });
  }
}