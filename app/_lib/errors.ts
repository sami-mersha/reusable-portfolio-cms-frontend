import { isDebugEnabled } from "./debug";

type UserFacingErrorOptions = {
  title: string;
  publicMessage: string;
  debugMessage?: string;
  publicHint?: string;
  debugHint?: string;
};

export type UserFacingErrorState = {
  title: string;
  message: string;
  hint?: string;
  details?: string;
  isDebug: boolean;
};

export class PortfolioApiError extends Error {
  status?: number;
  source?: string;

  constructor(
    message: string,
    options: {
      cause?: unknown;
      source?: string;
      status?: number;
    } = {},
  ) {
    super(message, options.cause ? { cause: options.cause } : undefined);
    this.name = "PortfolioApiError";
    this.status = options.status;
    this.source = options.source;
  }
}

export function formatErrorDetails(error: unknown): string {
  if (error instanceof Error) {
    const causeMessage =
      error.cause instanceof Error
        ? ` Cause: ${error.cause.message}`
        : typeof error.cause === "string"
          ? ` Cause: ${error.cause}`
          : "";

    return `${error.name}: ${error.message}${causeMessage}`;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error";
  }
}

export function logServerError(context: string, error: unknown) {
  console.error(`[${context}]`, error);
}

export function buildUserFacingErrorState(
  error: unknown,
  options: UserFacingErrorOptions,
): UserFacingErrorState {
  // All route UIs should go through this helper so debug mode stays consistent:
  // production users get safe copy, while template developers can opt into details.
  const isDebug = isDebugEnabled();

  return {
    title: options.title,
    message: isDebug
      ? options.debugMessage ?? `${options.title} Debug details are shown below.`
      : options.publicMessage,
    hint: isDebug ? options.debugHint : options.publicHint,
    details: isDebug ? formatErrorDetails(error) : undefined,
    isDebug,
  };
}
