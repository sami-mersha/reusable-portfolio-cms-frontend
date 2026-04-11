import Link from "next/link";

import type { PaginationLink } from "@/app/_lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Backend pagination links include "Previous", "Next", and numbered pages.
function getPaginationLabel(link: PaginationLink) {
  if (link.label.includes("Previous")) {
    return "Previous";
  }

  if (link.label.includes("Next")) {
    return "Next";
  }

  return link.page ? String(link.page) : link.label;
}

// Preserve the active search query when moving between pages.
function getBlogsPageHref(page: number, query?: string) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  if (query) {
    params.set("q", query);
  }

  const queryString = params.toString();

  return queryString ? `/blogs?${queryString}` : "/blogs";
}

export default function BlogPagination({
  links,
  query,
}: {
  links: PaginationLink[];
  query?: string;
}) {
  // Only keep real pages + prev/next controls from the backend.
  const visibleLinks = links.filter(
    (link) => link.page !== null || /Previous|Next/.test(link.label),
  );

  if (visibleLinks.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Blog pagination" className="flex flex-wrap items-center gap-3">
      {visibleLinks.map((link) => {
        const label = getPaginationLabel(link);

        if (link.page === null) {
          return (
            <span
              key={link.label}
              className="inline-flex h-10 items-center justify-center rounded-full border border-border/60 px-5 text-sm text-muted-foreground/60"
            >
              {label}
            </span>
          );
        }

        return (
          <Button
            key={`${link.label}-${link.page}`}
            variant={link.active ? "default" : "outline"}
            asChild
            className={cn(link.active ? "pointer-events-none" : undefined)}
          >
            <Link
              href={getBlogsPageHref(link.page, query)}
              aria-current={link.active ? "page" : undefined}
            >
              {label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
