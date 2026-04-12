import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import BlogCard from "@/app/_components/BlogCard";
import BlogPagination from "@/app/_components/BlogPagination";
import PublicErrorState from "@/app/_components/PublicErrorState";
import {
  getBlogsPage,
  hydrateBlogsWithVerifiedCommentCounts,
  searchBlogs,
} from "@/app/_lib/blogs";
import { buildUserFacingErrorState, logServerError } from "@/app/_lib/errors";
import { getPortfolio } from "@/app/_lib/portfolio";
import {
  buildBlogCollectionJsonLd,
  getCanonicalUrl,
  serializeJsonLd,
} from "@/app/_lib/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BlogSearchBar from "@/app/blogs/BlogSearchBar";

export const dynamic = "force-dynamic";

type BlogsPageProps = {
  searchParams: Promise<{
    page?: string | string[];
    q?: string | string[];
  }>;
};

// Convert the `page` query param to a safe number (defaults to 1).
function resolvePage(value: string | string[] | undefined) {
  const pageValue = Array.isArray(value) ? value[0] : value;
  const page = Number(pageValue);

  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

// Normalize search terms so empty values don't trigger the search endpoint.
function resolveQuery(value: string | string[] | undefined) {
  const query = Array.isArray(value) ? value[0] : value;

  return query?.trim() ?? "";
}

export async function generateMetadata({
  searchParams,
}: BlogsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = resolvePage(params.page);
  const query = resolveQuery(params.q);
  // Avoid indexing search results; canonicalize to the main archive page.
  const canonicalUrl = getCanonicalUrl(
    query
      ? "/blogs"
      : page > 1
        ? `/blogs?page=${page}`
        : "/blogs",
  );

  try {
    const data = await getPortfolio();
    const profileName = data.profile.name;
    const title = query
      ? `${profileName} Blog | Search${page > 1 ? ` (Page ${page})` : ""}`
      : page > 1
        ? `${profileName} Blog | Page ${page}`
        : `${profileName} Blog`;
    const description = query
      ? `Search results for "${query}".`
      : `Read articles, lessons, and project write-ups from ${profileName}.`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      robots: query
        ? {
            index: false,
            follow: true,
          }
        : undefined,
      openGraph: {
        type: "website",
        url: canonicalUrl,
        title,
        description,
        siteName: profileName,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (error) {
    logServerError("Failed to generate blogs metadata", error);

    return {
      title: page > 1 ? `Blog | Page ${page}` : "Blog",
      description: "Articles, lessons, and project write-ups.",
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams;
  const page = resolvePage(params.page);
  const query = resolveQuery(params.q);

  try {
    const [pagination, portfolio, searchPagination] = await Promise.all([
      // Always load the default archive page so we can fall back if search is empty.
      getBlogsPage(page),
      getPortfolio().catch(() => null),
      query ? searchBlogs(query, page) : Promise.resolve(null),
    ]);
    const profileName = portfolio?.profile.name;
    const activePagination = query && searchPagination ? searchPagination : pagination;
    const displayBlogs = await hydrateBlogsWithVerifiedCommentCounts(activePagination.data);
    const jsonLd = buildBlogCollectionJsonLd(displayBlogs, {
      page: activePagination.current_page,
      profileName,
    });

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />

        <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
          <div className="mb-10 flex flex-col gap-5">
            <Button variant="ghost" asChild className="w-fit pl-0">
              <Link href="/">
                <ArrowLeft className="size-4" />
                Back to home
              </Link>
            </Button>

            <div className="space-y-4">
              <Badge variant="outline" className="w-fit">
                Blog Archive
              </Badge>
              <h1 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-5xl">
                A growing archive of notes on technology, ideas, systems, and lessons from life.
              </h1>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                Explore a journal of ideas, lessons, and growth.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <BlogSearchBar />
          </div>

          {displayBlogs.length > 0 ? (
            <>
              <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
                {displayBlogs.map((blog, index) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    priority={!query && pagination.current_page === 1 && index === 0}
                  />
                ))}
              </div>

              {activePagination.last_page > 1 ? (
                <div className="mt-10">
                  <BlogPagination links={activePagination.links} query={query || undefined} />
                </div>
              ) : null}
            </>
          ) : (
            <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
              <CardContent className="p-6 text-muted-foreground">
                {query
                  ? "No blog posts matched your search."
                  : "No blog posts are available on this page yet."}
              </CardContent>
            </Card>
          )}
        </section>
      </>
    );
  } catch (error) {
    const errorState = buildUserFacingErrorState(error, {
      title: "Blog posts are temporarily unavailable",
      publicMessage:
        "We couldn't load the blog archive right now. The backend service may be temporarily unavailable. Please try again shortly.",
      debugMessage:
        "The blogs page could not load backend data. Debug details are shown below.",
      debugHint:
        "Verify the backend response for /api/blogs and make sure pagination parameters are accepted.",
    });

    return (
      <PublicErrorState
        title={errorState.title}
        message={errorState.message}
        hint={errorState.hint}
        details={errorState.details}
      />
    );
  }
}
