// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Header from './_components/Header';
import Footer from './_components/Footer';
import { getPortfolio } from './_lib/portfolio';
import {
  buildPortfolioKeywords,
  buildSeoDescription,
  buildSeoTitle,
  getCanonicalUrl,
  getSiteUrl,
  shouldIndexSite,
} from './_lib/seo';
import { ThemeProvider } from '@/components/theme-provider';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolio();
  const { profile } = data;

  const title = buildSeoTitle(profile.name, profile.tagline);
  const description = buildSeoDescription(profile.tagline, profile.bio);
  const canonicalUrl = getCanonicalUrl("/");
  const shouldIndex = shouldIndexSite();

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    applicationName: profile.name,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: buildPortfolioKeywords(data),
    authors: [
      {
        name: profile.name,
        url: profile.linktree_url || profile.linkedin_url || profile.github_url || undefined,
      },
    ],
    creator: profile.name,
    category: "technology",
    robots: {
      index: shouldIndex,
      follow: shouldIndex,
      googleBot: {
        index: shouldIndex,
        follow: shouldIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: profile.favicon_url
      ? {
          icon: [{ url: profile.favicon_url }],
          shortcut: [profile.favicon_url],
        }
      : undefined,
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      siteName: profile.name,
      locale: 'en_US',
      images: profile.image_url
        ? [
            {
              url: profile.image_url,
              alt: `${profile.name} profile photo`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: profile.image_url ? [profile.image_url] : undefined,
    },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const data = await getPortfolio();
  const profile = data.profile;

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative isolate overflow-x-hidden">
            <Header profile={profile} />
            <main className="min-h-screen pt-36 sm:pt-40 lg:pt-28">{children}</main>
            <Footer profile={profile} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
