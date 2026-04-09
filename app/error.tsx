'use client';

// This route-level error boundary catches unexpected rendering errors for most pages.
// It reuses the same public/debug messaging rules as the rest of the template.
import { useEffect } from "react";

import PublicErrorState from "./_components/PublicErrorState";
import { buildUserFacingErrorState } from "./_lib/errors";

export default function Error({
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
    title: "Something went wrong while loading this page",
    publicMessage:
      "We couldn't load this page right now. Please try again in a moment.",
    debugMessage:
      "The page hit an unexpected runtime error. Debug details are shown below.",
    debugHint:
      "Inspect the error details below and verify the API, environment variables, and server logs.",
  });

  return (
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
  );
}
