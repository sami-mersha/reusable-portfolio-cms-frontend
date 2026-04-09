// app/_lib/api.ts
// Central place for backend calls used by the template.
// If you move to a different API structure, start your data integration changes here first.
import { PortfolioApiError, logServerError } from "./errors";

export async function fetchPortfolio<T>(): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim().replace(/\/+$/, "");
  const url = baseUrl ? `${baseUrl}/api/portfolio` : undefined;

  if (!url) {
    const error = new PortfolioApiError(
      "NEXT_PUBLIC_BASE_URL is not defined. The portfolio API URL could not be resolved.",
      { source: "NEXT_PUBLIC_BASE_URL" },
    );

    logServerError("Portfolio fetch failed", error);
    throw error;
  }

  try {
    // The frontend is meant to always reflect the latest CMS/API data in this template.
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      const errorText = await res.text();

      throw new PortfolioApiError(
        `Portfolio API responded with ${res.status}.${errorText ? ` Response: ${errorText}` : ""}`,
        {
          source: url,
          status: res.status,
        },
      );
    }

    return (await res.json()) as T;
  } catch (err) {
    // Normalize transport/runtime failures into one error shape for page and metadata fallbacks.
    const normalizedError =
      err instanceof PortfolioApiError
        ? err
        : new PortfolioApiError(`Unable to reach the portfolio API at ${url}.`, {
            cause: err,
            source: url,
          });

    logServerError("Portfolio fetch failed", normalizedError);
    throw normalizedError;
  }
}
