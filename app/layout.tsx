// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import Header from './_components/Header';
import Footer from './_components/Footer';
import { getPortfolio } from './_lib/portfolio';
import { ThemeProvider } from '@/components/theme-provider';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Samuel Mersha Portfolio',
  description: 'Tech enthusiast & Software Engineer Portfolio',
};

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
