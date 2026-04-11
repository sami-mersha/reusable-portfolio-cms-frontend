import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Blog } from "@/app/_lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import BlogCard from "./BlogCard";

export default function FeaturedBlogs({ blogs }: { blogs: Blog[] }) {
  return (
    <section id="blogs" className="mx-auto max-w-6xl px-4">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <Badge variant="outline" className="w-fit">
            Latest Writing
          </Badge>
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Fresh notes on technology, ideas, systems, and lessons from life.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            A journal of ideas, lessons, and growth.
          </p>
        </div>

        <Button variant="outline" asChild className="w-full md:w-auto">
          <Link href="/blogs">
            More blogs
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>

      {blogs.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {blogs.slice(0, 2).map((blog, index) => (
            <BlogCard key={blog.id} blog={blog} priority={index === 0} />
          ))}
        </div>
      ) : (
        <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
          <CardContent className="p-6 text-muted-foreground">
            No blog posts have been published yet.
          </CardContent>
        </Card>
      )}
    </section>
  );
}
