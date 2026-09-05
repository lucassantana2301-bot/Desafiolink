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
  title: 'JCS Metalúrgica | Engenharia Industrial de Precisão 3D',
  description: 'Plataforma cinematográfica 3D e configurador de precisão da JCS Metalúrgica. Usinagem de alta tolerância, forjaria industrial e engenharia avançada.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable} bg-[#050505] text-white`}>
      <body className="antialiased selection:bg-[#FF5500] selection:text-white">
        {children}
      </body>
    </html>
  );
}
