// Reusable error card for pages that should show friendly fallback messaging to visitors.
import type { ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, Bug, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PublicErrorStateProps = {
  title: string;
  message: string;
  hint?: string;
  details?: string;
  action?: ReactNode;
  className?: string;
};

export default function PublicErrorState({
  title,
  message,
  hint,
  details,
  action,
  className,
}: PublicErrorStateProps) {
  return (
    <section className={cn("mx-auto max-w-4xl px-4 py-24", className)}>
      <div className="rounded-[2rem] border border-destructive/20 bg-background/85 p-8 shadow-[0_24px_80px_-50px_rgba(220,38,38,0.45)] backdrop-blur-xl sm:p-10">
        <div className="flex flex-col gap-5">
          <div className="inline-flex w-fit items-center gap-3 rounded-full border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">
            <AlertTriangle className="size-4" />
            Service temporarily unavailable
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {message}
            </p>
            {hint ? (
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                {hint}
              </p>
            ) : null}
          </div>

          {/* Debug details are intentionally opt-in through NEXT_PUBLIC_DEBUG. */}
          {details ? (
            <div className="rounded-[1.5rem] border border-amber-500/20 bg-amber-500/8 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-300">
                <Bug className="size-4" />
                Debug details
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap break-words text-sm leading-6 text-amber-900 dark:text-amber-100">
                {details}
              </pre>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {action ?? (
              <Button asChild>
                <Link href="/">
                  <RefreshCcw className="size-4" />
                  Back to home
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
