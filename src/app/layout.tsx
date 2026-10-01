import type { Metadata, Viewport } from 'next';
import { prisma } from '@/lib/db';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#030508',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await prisma.seoSetting.findUnique({
      where: { id: 'seo_default' },
    });
    if (seo) {
      return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mahabbah.dev'),
        title: {
          default: seo.siteTitle,
          template: `%s | ${seo.siteTitle}`,
        },
        description: seo.metaDescription,
        keywords: seo.keywords.split(',').map((k) => k.trim()),
        openGraph: {
          title: seo.ogTitle,
          description: seo.ogDescription,
          images: seo.ogImage ? [{ url: seo.ogImage }] : [],
          type: 'website',
          locale: 'en_US',
        },
        icons: {
          icon: seo.favicon || '/favicon.svg',
          shortcut: '/favicon.svg',
          apple: '/favicon.svg',
        },
      };
    }
  } catch {
    // Database connection fallback during initial build
  }

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mahabbah.dev'),
    title: {
      default: 'Mahabbah Mahabban Romadhon | AI Engineer & Cyber Security Specialist',
      template: '%s | Mahabbah Romadhon',
    },
    description:
      'Portfolio of Mahabbah Mahabban Romadhon — AI Practitioner (Computer Vision, YOLOv8) & Cybersecurity Specialist (CBBH).',
    icons: {
      icon: '/favicon.svg',
      shortcut: '/favicon.svg',
      apple: '/favicon.svg',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#030508] text-slate-100 min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
