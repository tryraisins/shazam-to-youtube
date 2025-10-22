import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Import Inter
import "./globals.css";
import AnimatedBackground from "../components/AnimatedBackground";

// Setup Inter font
const inter = Inter({
  variable: "--font-sans", // Use a standard CSS variable name
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EchoList",
  description: "Transform your Shazam discoveries into YouTube playlists in seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the font variable to the body */}
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <AnimatedBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}