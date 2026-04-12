import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, MessageSquareText } from "lucide-react";

import {
  formatBlogDate,
  getBlogReadTime,
  getBlogSummary,
  getVerifiedCommentCount,
} from "@/app/_lib/blogs";
import type { Blog } from "@/app/_lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type BlogCardProps = {
  blog: Blog;
  priority?: boolean;
};

// Editorial-style blog card used in the archive and homepage sections.
export default function BlogCard({ blog, priority = false }: BlogCardProps) {
  const summary = getBlogSummary(blog);
  const summaryLines = blog.cover_image ? "line-clamp-4" : "line-clamp-3";
  const commentCount = getVerifiedCommentCount(blog);

  return (
    <Card className="surface-glow group relative overflow-hidden border-white/40 bg-white/70 dark:bg-slate-950/45">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute -left-24 top-0 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-400/15" />
        <div className="absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-400/15" />
      </div>

      <div className="relative grid gap-5 p-4 sm:gap-6 sm:p-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative order-first aspect-[16/10] overflow-hidden rounded-[1.25rem] border border-border/60 bg-background/70 lg:order-none lg:rounded-[1.5rem]">
          {blog.cover_image ? (
            <Image
              src={blog.cover_image}
              alt={blog.title}
              fill
              priority={priority}
              sizes="(max-width: 1024px) 100vw, 40vw"
              unoptimized
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-white to-sky-100 dark:from-amber-400/20 dark:via-slate-950 dark:to-sky-400/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/45 via-transparent to-transparent" />
        </div>

        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {blog.category ? (
              <Badge className="bg-primary/10 text-primary">{blog.category.name}</Badge>
            ) : null}
            <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-muted-foreground">
              {formatBlogDate(blog.published_at ?? blog.created_at)}
            </span>
          </div>

          <CardHeader className="space-y-3 p-0">
            <CardTitle className="text-xl leading-tight sm:text-2xl">
              <Link href={`/blogs/${blog.slug}`} className="transition hover:text-primary">
                {blog.title}
              </Link>
            </CardTitle>
            <CardDescription
              className={`text-base leading-7 ${summaryLines}`}
            >
              {summary}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-4 p-0 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Clock3 className="size-4 text-primary" />
              {getBlogReadTime(blog.content)}
            </span>
            <span className="inline-flex items-center gap-2">
              <MessageSquareText className="size-4 text-primary" />
              {commentCount} {commentCount === 1 ? "verified comment" : "verified comments"}
            </span>
          </CardContent>

          <CardFooter className="p-0">
            <Button variant="ghost" asChild className="w-full sm:w-auto">
              <Link href={`/blogs/${blog.slug}`}>
                Read article
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
