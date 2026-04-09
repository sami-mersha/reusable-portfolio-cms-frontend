// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { ReactNode, Suspense } from 'react';
import Header from './_components/Header';
import Footer from './_components/Footer';
import {
  FooterFallback,
  FooterLoading,
  HeaderFallback,
  HeaderLoading,
} from './_components/PortfolioLoading';
import { logServerError } from './_lib/errors';
import { getPortfolio } from './_lib/portfolio';
import {
  buildPortfolioKeywords,
  buildSeoDescription,
  buildSeoTitle,
  getCanonicalUrl,
  getSiteUrl,
  shouldIndexSite,
} from './_lib/seo';
import type { PortfolioData } from './_lib/types';
import { ThemeProvider } from '@/components/theme-provider';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = getCanonicalUrl("/");
  const shouldIndex = shouldIndexSite();

  try {
    const data = await getPortfolio();
    const { profile } = data;

    const title = buildSeoTitle(profile.name, profile.tagline);
    const description = buildSeoDescription(profile.tagline, profile.bio);

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
          url:
            profile.linktree_url ||
            profile.linkedin_url ||
            profile.github_url ||
            undefined,
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
  } catch (error) {
    logServerError("Failed to generate root metadata", error);

    // Metadata should degrade gracefully when the backend is down so the app can still render.
    return {
      metadataBase: new URL(getSiteUrl()),
      title: "Portfolio",
      description: "Professional portfolio, projects, and experience.",
      applicationName: "Portfolio",
      alternates: {
        canonical: canonicalUrl,
      },
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
      openGraph: {
        type: 'website',
        url: canonicalUrl,
        title: "Portfolio",
        description: "Professional portfolio, projects, and experience.",
        siteName: "Portfolio",
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: "Portfolio",
        description: "Professional portfolio, projects, and experience.",
      },
    };
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  // Start the shared portfolio request once and let the header/footer consume it independently.
  const portfolioPromise = getPortfolio();

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
            <Suspense fallback={<HeaderLoading />}>
              <HeaderSlot portfolioPromise={portfolioPromise} />
            </Suspense>
            <main className="min-h-screen pt-36 sm:pt-40 lg:pt-28">{children}</main>
            <Suspense fallback={<FooterLoading />}>
              <FooterSlot portfolioPromise={portfolioPromise} />
            </Suspense>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

async function HeaderSlot({
  portfolioPromise,
}: {
  portfolioPromise: Promise<PortfolioData>;
}) {
  let profile: PortfolioData["profile"];

  try {
    ({ profile } = await portfolioPromise);
  } catch (error) {
    logServerError("Failed to render header", error);
    // Keep top-level navigation usable even when portfolio data is unavailable.
    return <HeaderFallback />;
  }

  return <Header profile={profile} />;
}

async function FooterSlot({
  portfolioPromise,
}: {
  portfolioPromise: Promise<PortfolioData>;
}) {
  let profile: PortfolioData["profile"];

  try {
    ({ profile } = await portfolioPromise);
  } catch (error) {
    logServerError("Failed to render footer", error);
    // The footer uses the same strategy as the header so the shell never disappears.
    return <FooterFallback />;
  }

  return <Footer profile={profile} />;
}
