import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import JsonLd from "../components/seo/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "EchoList | Transform Shazam to YouTube",
  description: "Seamlessly convert your Shazam discoveries into curated YouTube playlists in seconds",
  keywords: ["Shazam", "YouTube", "playlist", "music", "converter", "songs"],
  authors: [{ name: "EchoList" }],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "EchoList | Transform Shazam to YouTube",
    description: "Seamlessly convert your Shazam discoveries into curated YouTube playlists in seconds",
    url: '/',
    siteName: 'EchoList',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EchoList Preview',
      }
    ],
    locale: 'en_US',
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EchoList | Transform Shazam to YouTube',
    description: 'Seamlessly convert your Shazam discoveries into curated YouTube playlists in seconds',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of unstyled content on theme change */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && systemPrefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <JsonLd />
        <ThemeProvider>
          <AnimatedBackground />
          <Navbar />
          <main className="relative z-10 pt-28">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}