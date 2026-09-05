import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'NEXUS — Experimental 3D Cinematic Experience',
  description: 'An experimental 3D WebGL cinematic journey exploring the dissolving boundary between human and machine intelligence. Where does human end and machine begin?',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} bg-[#050505] text-white`}>
      <body className="antialiased selection:bg-[#00F0FF] selection:text-[#050505]">
        {children}
      </body>
    </html>
  );
}
