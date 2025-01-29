import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Image from 'next/image';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Image Insight',
  description:
    'This project is designed to extract and manage image metadata, focusing on building a scalable system for JPG files.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          {children}
        </div>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <div className="text-center">
            <p>
              © {new Date().getFullYear()} Image Insight by SWK. All rights
              reserved.
            </p>
          </div>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://github.com/loquemedalagana/image-insight"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repository
          </a>
        </footer>
      </body>
    </html>
  );
}
