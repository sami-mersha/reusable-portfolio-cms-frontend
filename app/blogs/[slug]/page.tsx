import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  FolderOpen,
  Home,
  MessageSquareText,
} from "lucide-react";

import BlogCommentForm from "@/app/_components/BlogCommentForm";
import PublicErrorState from "@/app/_components/PublicErrorState";
import {
  formatBlogDate,
  getBlogBySlug,
  getBlogDescription,
  getBlogsPage,
  getBlogReadTime,
  getBlogSummary,
  getVerifiedCommentCount,
  isApprovedComment,
} from "@/app/_lib/blogs";
import { buildUserFacingErrorState, logServerError } from "@/app/_lib/errors";
import { getPortfolio } from "@/app/_lib/portfolio";
import { sanitizeHtml } from "@/app/_lib/sanitize";
import {
  buildBlogJsonLd,
  buildBlogKeywords,
  getCanonicalUrl,
  serializeJsonLd,
} from "@/app/_lib/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const canonicalUrl = getCanonicalUrl(`/blogs/${slug}`);

  try {
    const [blog, portfolio] = await Promise.all([
      getBlogBySlug(slug),
      getPortfolio().catch(() => null),
    ]);

    if (!blog) {
      return {
        title: "Blog Not Found",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const profileName = portfolio?.profile.name;
    const description = getBlogDescription(blog);
    const title = blog.meta_title.trim() || (profileName ? `${blog.title} | ${profileName}` : blog.title);

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      keywords: buildBlogKeywords(blog, profileName),
      openGraph: {
        type: "article",
        url: canonicalUrl,
        title: blog.title,
        description,
        siteName: profileName,
        publishedTime: blog.published_at ?? blog.created_at,
        modifiedTime: blog.updated_at,
        images: blog.cover_image
          ? [
              {
                url: blog.cover_image,
                alt: blog.title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description,
        images: blog.cover_image ? [blog.cover_image] : undefined,
      },
    };
  } catch (error) {
    logServerError("Failed to generate blog metadata", error);

    return {
      title: "Blog | Portfolio",
      description: "Blog article from the portfolio.",
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  try {
    const [blog, portfolio, blogPage] = await Promise.all([
      getBlogBySlug(slug),
      getPortfolio().catch(() => null),
      getBlogsPage(1).catch(() => null),
    ]);

    if (!blog) {
      notFound();
    }

    const profileName = portfolio?.profile.name;
    const approvedComments = blog.comments.filter((comment) =>
      isApprovedComment(comment.is_approved),
    );
    const verifiedCommentCount = getVerifiedCommentCount(blog);
    // Related posts are pulled from page 1 of the archive and filtered by category.
    const relatedPosts =
      blogPage?.data.filter((item) => {
        if (item.slug === blog.slug) return false;
        if (blog.category && item.category) {
          return item.category.slug === blog.category.slug;
        }
        return false;
      }) ?? [];
    const jsonLd = buildBlogJsonLd(
      {
        ...blog,
        comments: approvedComments,
      },
      profileName,
    );

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />

        <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <Button variant="ghost" asChild className="pl-0">
              <Link href="/blogs">
                <ArrowLeft className="size-4" />
                Back to blogs
              </Link>
            </Button>
            {blog.category ? <Badge variant="outline">{blog.category.name}</Badge> : null}
            <Badge>{formatBlogDate(blog.published_at ?? blog.created_at)}</Badge>
          </div>

          <div className="grid gap-10">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
                  {blog.title}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                  {getBlogSummary(blog)}
                </p>
              </div>

              <div className="surface-glow overflow-hidden border-white/40 bg-white/70 dark:bg-slate-950/45">
                <div className="relative overflow-hidden flex items-center justify-center">
                  {blog.cover_image ? (
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      loading="lazy"
                      className="h-[90vh] w-auto object-contain"
                    />
                  ) : (
                    <div className="h-[90vh] w-auto bg-gradient-to-br from-amber-100 via-white to-sky-100 dark:from-amber-400/20 dark:via-slate-950 dark:to-sky-400/20" />
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background/70 dark:to-slate-950/60" />
                </div>
                <div className="p-6 sm:p-8">
                  {/* Blog content comes from the CMS and is rendered as HTML. */}
                  <article
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content) }}
                  />
                </div>
              </div>

              {/* Comments sit directly after the article to match reading order. */}
              <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
                <CardContent className="p-6">
                  <div className="mb-6 space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">Verified comments</h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {verifiedCommentCount > 0
                        ? `${verifiedCommentCount} approved ${verifiedCommentCount === 1 ? "reader comment is" : "reader comments are"} visible below.`
                        : "Only approved reader comments are shown here."}
                    </p>
                  </div>

                  {verifiedCommentCount > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {approvedComments.map((comment) => {
                        const initials = `${comment.first_name?.[0] ?? ""}${comment.last_name?.[0] ?? ""}`.toUpperCase();

                        return (
                          <div
                            key={comment.id}
                            className="rounded-[1.4rem] border border-border/60 bg-background/65 p-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border/60 bg-primary/10 text-sm font-semibold text-primary">
                                {initials || "?"}
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="font-medium text-foreground">
                                    {comment.first_name} {comment.last_name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatBlogDate(comment.created_at)}
                                  </p>
                                </div>
                                <p className="mt-2 leading-7 text-muted-foreground">
                                  {comment.comment}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-[1.4rem] border border-dashed border-border/70 bg-background/50 p-5 text-sm leading-7 text-muted-foreground">
                      No approved comments yet. Be the first to send one for review.
                    </div>
                  )}
                </CardContent>
              </Card>

              <BlogCommentForm blogId={blog.id} />
            </div>

            {relatedPosts.length > 0 ? (
              <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
                <CardContent className="grid gap-4 p-6">
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
                      Related posts
                    </p>
                    <h2 className="text-xl font-semibold">More in this category</h2>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedPosts.slice(0, 3).map((item) => (
                      <Link
                        key={item.id}
                        href={`/blogs/${item.slug}`}
                        className="group flex items-center gap-3 rounded-[1.1rem] border border-border/60 bg-background/70 px-3 py-3 transition hover:border-primary/30 hover:bg-background/90"
                      >
                        <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-[0.9rem] border border-border/60 bg-background/70">
                          {item.cover_image ? (
                            <Image
                              src={item.cover_image}
                              alt={item.title}
                              fill
                              sizes="64px"
                              unoptimized
                              className="object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-white to-sky-100 dark:from-amber-400/20 dark:via-slate-950 dark:to-sky-400/20" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground transition group-hover:text-primary">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatBlogDate(item.published_at ?? item.created_at)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
                <CardContent className="grid gap-4 p-6 text-sm text-muted-foreground">
                  <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="size-4 text-primary" />
                      Published
                    </span>
                    <span className="font-medium text-foreground">
                      {formatBlogDate(blog.published_at ?? blog.created_at)}
                    </span>
                  </div>

                  <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="size-4 text-primary" />
                      Read time
                    </span>
                    <span className="font-medium text-foreground">
                      {getBlogReadTime(blog.content)}
                    </span>
                  </div>

                  <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="inline-flex items-center gap-2">
                      <MessageSquareText className="size-4 text-primary" />
                      Verified comments
                    </span>
                    <span className="font-medium text-foreground">
                      {verifiedCommentCount}
                    </span>
                  </div>

                  <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="inline-flex items-center gap-2">
                      <FolderOpen className="size-4 text-primary" />
                      Category
                    </span>
                    <span className="font-medium text-foreground">
                      {blog.category?.name ?? "General"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
                <CardContent className="grid gap-4 p-6">
                  <p className="text-sm leading-7 text-muted-foreground">
                    Stay in the flow and keep reading. Explore more posts or return to the
                    portfolio homepage.
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button asChild className="w-full sm:w-auto">
                      <Link href="/blogs">
                        More blogs
                        <ArrowLeft className="size-4 rotate-180" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                      <Link href="/">
                        <Home className="size-4" />
                        Back home
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            
            
          </div>
        </section>
      </>
    );
  } catch (error) {
    const errorState = buildUserFacingErrorState(error, {
      title: "Blog details are temporarily unavailable",
      publicMessage:
        "We couldn't load this article right now. The backend service may be temporarily unavailable. Please try again shortly.",
      debugMessage:
        "The blog detail page could not load backend data. Debug details are shown below.",
      debugHint:
        "Verify the backend response for /api/blogs/{slug} and confirm the requested slug exists.",
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
