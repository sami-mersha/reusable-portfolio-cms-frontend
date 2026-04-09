'use client';

// This is the last-resort error screen for failures that break the root layout itself.
// If the entire app shell crashes, Next.js will render this file instead.
import { useEffect } from "react";

import PublicErrorState from "./_components/PublicErrorState";
import { buildUserFacingErrorState } from "./_lib/errors";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const state = buildUserFacingErrorState(error, {
    title: "The application is temporarily unavailable",
    publicMessage:
      "We couldn't finish loading the site right now. Please try again shortly.",
    debugMessage:
      "The root application shell failed to render. Debug details are shown below.",
    debugHint:
      "Check shared layout data, environment variables, and backend availability before retrying.",
  });

  return (
    <html lang="en">
      <body>
        <PublicErrorState
          title={state.title}
          message={state.message}
          hint={state.hint}
          details={state.details}
          action={
            <button
              type="button"
              onClick={() => unstable_retry()}
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Try again
            </button>
          }
        />
      </body>
    </html>
  );
}
