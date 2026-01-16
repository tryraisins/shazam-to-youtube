import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";

export const metadata: Metadata = {
  title: "EchoList | Transform Shazam to YouTube",
  description: "Seamlessly convert your Shazam discoveries into curated YouTube playlists in seconds",
  keywords: ["Shazam", "YouTube", "playlist", "music", "converter", "songs"],
  authors: [{ name: "EchoList" }],
  openGraph: {
    title: "EchoList | Transform Shazam to YouTube",
    description: "Seamlessly convert your Shazam discoveries into curated YouTube playlists",
    type: "website",
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
      <body className="antialiased min-h-screen">
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