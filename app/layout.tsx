import type { Metadata } from 'next';
import './globals.css';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import ClientCursor from './components/ClientCursor';
import { ActiveSectionProvider } from './contexts/ActiveSectionContext';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const title = 'Julienne Panes | Full-Stack Software Developer Portfolio';
const description =
  'Julienne Panes is a Full-Stack Software Developer specializing in Next.js and Java. Explore her projects, tech stack, and professional experience.';

export const metadata: Metadata = {
  metadataBase: new URL('https://juliennepanes.pages.dev'),
  title: title,
  description: description,
  applicationName: 'Julienne Panes Portfolio',
  icons: {
    icon: '/icon.svg',
  },
  authors: [
    { name: 'Julienne Panes', url: 'https://juliennepanes.pages.dev/' },
  ],
  keywords: [
    'Julienne Panes',
    'Portfolio',
    'Software Developer',
    'Web Developer',
    'Full-Stack Developer',
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'CSS',
    'HTML',
    'Tech Stack',
    'Projects',
    'Experience',
    'About Me',
  ],
  openGraph: {
    title: title,
    description: description,
    url: 'https://juliennepanes.pages.dev/',
    siteName: 'Julienne Panes Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/Preview.png',
        width: 1200,
        height: 630,
        alt: 'Julienne Panes Portfolio Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: title,
    description: description,
    images: ['/Preview.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${spaceMono.variable} antialiased`}
      >
        <ClientCursor />
        <ActiveSectionProvider>{children}</ActiveSectionProvider>
      </body>
    </html>
  );
}

export const runtime = 'edge';
