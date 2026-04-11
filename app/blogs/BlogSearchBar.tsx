"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

// Controlled search form: submit to update the URL and let the server fetch results.
export default function BlogSearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  // Keep the input in sync when navigation happens externally.
  useEffect(() => {
    setValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  // Build the next URL with query + optional page reset.
  function submit(nextValue: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextValue.trim()) {
      params.set("q", nextValue.trim());
      params.delete("page");
    } else {
      params.delete("q");
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `/blogs?${queryString}` : "/blogs";

    startTransition(() => {
      router.push(nextUrl);
    });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit(value);
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search blog posts..."
          className="h-12 w-full rounded-[1.2rem] border border-border/60 bg-background/70 px-11 text-sm outline-none transition placeholder:text-muted-foreground/75 focus:border-primary/45 focus:ring-4 focus:ring-primary/10"
          aria-label="Search blog posts"
          aria-busy={isPending}
        />
      </div>
      <Button type="submit" disabled={isPending} className="h-12 px-6">
        Search
      </Button>
    </form>
  );
}
