// These loading and fallback components keep the template polished while data is still loading
// or when shared profile data is temporarily unavailable.
import Link from "next/link";
import { LoaderCircle, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

function LoadingBlock({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "loading-sheen rounded-full border border-white/20 dark:border-white/6",
        className,
      )}
    />
  );
}

export function HeaderLoading() {
  return (
    <header
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4"
    >
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-border/60 bg-background/45 px-4 shadow-[0_18px_64px_-42px_rgba(15,23,42,0.55)] backdrop-blur-xl">
        <div className="flex items-center gap-4 py-4">
          <div className="min-w-0 space-y-2">
            <LoadingBlock className="h-2.5 w-24" />
            <LoadingBlock className="h-5 w-36" />
          </div>

          <div className="ml-auto hidden items-center gap-1 rounded-full border border-border/60 bg-background/60 p-1 lg:flex">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingBlock
                key={index}
                className="h-9 w-20 rounded-full"
              />
            ))}
          </div>

          <LoadingBlock className="ml-auto size-10 rounded-full lg:ml-3" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <LoadingBlock
              key={index}
              className="h-10 w-24 shrink-0 rounded-full"
            />
          ))}
        </div>
      </div>
    </header>
  );
}

export function HeaderFallback() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-border/60 bg-background/45 px-4 shadow-[0_18px_64px_-42px_rgba(15,23,42,0.55)] backdrop-blur-xl">
        <div className="flex items-center gap-4 py-4">
          <Link href="/" className="min-w-0">
            <div className="flex flex-col">
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                Portfolio
              </span>
              <span className="truncate text-lg font-semibold tracking-tight">
                Content unavailable
              </span>
            </div>
          </Link>

          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export function FooterLoading() {
  return (
    <footer aria-hidden="true" className="mt-20 px-4 pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-[2rem] border border-border/60 bg-background/55 p-6 shadow-[0_18px_64px_-42px_rgba(15,23,42,0.55)] backdrop-blur-xl md:flex-row md:items-end md:justify-between md:p-8">
        <div className="space-y-3">
          <LoadingBlock className="h-7 w-40" />
          <LoadingBlock className="h-4 w-full max-w-xl rounded-full" />
          <LoadingBlock className="h-4 w-[92%] max-w-xl rounded-full" />
          <div className="flex flex-col gap-2">
            <LoadingBlock className="h-4 w-44" />
            <LoadingBlock className="h-4 w-36" />
          </div>
          <LoadingBlock className="h-4 w-52" />
        </div>

        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingBlock
              key={index}
              className="h-10 w-28 rounded-full"
            />
          ))}
        </div>
      </div>
    </footer>
  );
}

export function FooterFallback() {
  return (
    <footer className="mt-20 px-4 pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-[2rem] border border-border/60 bg-background/55 p-6 shadow-[0_18px_64px_-42px_rgba(15,23,42,0.55)] backdrop-blur-xl md:p-8">
        <p className="text-lg font-semibold tracking-tight">Portfolio</p>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          Some content is temporarily unavailable while the backend service reconnects.
        </p>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export function PortfolioLoadingScreen() {
  return (
    <section
      aria-live="polite"
      className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:pt-10 md:pt-14"
      role="status"
    >
      <span className="sr-only">Loading portfolio data.</span>

      <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-background/65 p-6 shadow-[0_30px_120px_-60px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(56,189,248,0.14),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(251,191,36,0.12),transparent_30%)]" />

        <div className="relative grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
              <span className="loading-float size-2 rounded-full bg-primary" />
              Syncing portfolio data
            </div>

            <div className="space-y-5">
              <LoadingBlock className="h-4 w-32 rounded-full" />
              <div className="space-y-3">
                <LoadingBlock className="h-12 w-full max-w-[28rem] rounded-[1rem] sm:h-16" />
                <LoadingBlock className="h-12 w-[85%] max-w-[24rem] rounded-[1rem] sm:h-16" />
              </div>
              <div className="space-y-3">
                <LoadingBlock className="h-5 w-full max-w-2xl rounded-full" />
                <LoadingBlock className="h-5 w-[92%] max-w-2xl rounded-full" />
                <LoadingBlock className="h-5 w-[78%] max-w-xl rounded-full" />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <LoadingBlock className="h-12 w-full rounded-full sm:w-52" />
              <LoadingBlock className="h-12 w-full rounded-full sm:w-36" />
              <LoadingBlock className="h-12 w-full rounded-full sm:w-32" />
            </div>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center">
              <LoadingBlock className="h-4 w-56 rounded-full" />
              <LoadingBlock className="h-4 w-40 rounded-full" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="surface-glow rounded-[1.6rem] border border-white/40 bg-white/70 p-5 dark:bg-slate-950/45"
                >
                  <LoadingBlock className="h-10 w-14 rounded-2xl" />
                  <LoadingBlock className="mt-4 h-4 w-28 rounded-full" />
                  <LoadingBlock className="mt-2 h-4 w-24 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="surface-glow rounded-[1.75rem] border border-white/40 bg-white/70 p-3 dark:bg-slate-950/45">
            <div className="relative grid min-h-[33rem] place-items-center overflow-hidden rounded-[1.5rem] border border-border/60 bg-background/80 p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_52%)]" />
              <div className="loading-orbit absolute inset-8 rounded-full border border-primary/18" />
              <div className="loading-orbit-reverse absolute inset-14 rounded-full border border-sky-400/20" />
              <div className="loading-orbit absolute inset-24 rounded-full border border-amber-400/20" />

              <div className="loading-float relative flex size-32 items-center justify-center rounded-full border border-border/60 bg-background/90 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.65)]">
                <LoaderCircle className="size-10 animate-spin text-primary" />
              </div>

              <div className="loading-float absolute left-6 top-8 rounded-full border border-primary/20 bg-background/85 px-4 py-2 text-sm text-muted-foreground shadow-lg [animation-delay:-1.2s]">
                Featured projects
              </div>
              <div className="loading-float absolute right-6 top-16 rounded-full border border-sky-400/20 bg-background/85 px-4 py-2 text-sm text-muted-foreground shadow-lg [animation-delay:-2s]">
                Skills matrix
              </div>
              <div className="loading-float absolute bottom-8 left-8 rounded-full border border-amber-400/20 bg-background/85 px-4 py-2 text-sm text-muted-foreground shadow-lg [animation-delay:-2.8s]">
                Experience timeline
              </div>

              <div className="absolute bottom-6 right-6 max-w-[14rem] rounded-[1.4rem] border border-border/60 bg-background/85 p-4 shadow-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="size-4 text-primary" />
                  Preparing live sections
                </div>
                <div className="mt-4 space-y-3">
                  <LoadingBlock className="h-3.5 w-full rounded-full" />
                  <LoadingBlock className="h-3.5 w-[82%] rounded-full" />
                  <LoadingBlock className="h-3.5 w-[68%] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="mt-10 grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[1.75rem] border border-border/60 bg-background/55 p-6 shadow-[0_18px_64px_-42px_rgba(15,23,42,0.55)] backdrop-blur-xl"
          >
            <LoadingBlock className="h-5 w-36 rounded-full" />
            <div className="mt-6 space-y-3">
              <LoadingBlock className="h-4 w-full rounded-full" />
              <LoadingBlock className="h-4 w-[92%] rounded-full" />
              <LoadingBlock className="h-4 w-[76%] rounded-full" />
            </div>
            <div className="mt-8 grid gap-3">
              {Array.from({ length: 3 }).map((_, rowIndex) => (
                <LoadingBlock
                  key={rowIndex}
                  className="h-16 rounded-[1.25rem]"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
