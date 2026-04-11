// app/_lib/api.ts
// Central place for backend calls used by the template.
// If you move to a different API structure, start your data integration changes here first.
import { PortfolioApiError, logServerError } from "./errors";

function resolveApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim().replace(/\/+$/, "");

  if (!baseUrl) {
    const error = new PortfolioApiError(
      "NEXT_PUBLIC_BASE_URL is not defined. The backend API URL could not be resolved.",
      { source: "NEXT_PUBLIC_BASE_URL" },
    );

    logServerError("API base URL resolution failed", error);
    throw error;
  }

  return baseUrl;
}

function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${resolveApiBaseUrl()}${normalizedPath}`;
}

export async function fetchFromApi<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const url = buildApiUrl(path);
  const method = init.method?.toUpperCase() ?? "GET";
  const headers = new Headers(init.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const requestInit: RequestInit = {
    ...init,
    headers,
  };

  if (method === "GET" && !requestInit.cache) {
    requestInit.cache = "no-store";
  }

  try {
    const res = await fetch(url, requestInit);

    if (!res.ok) {
      const errorText = await res.text();

      throw new PortfolioApiError(
        `API request to ${path} responded with ${res.status}.${errorText ? ` Response: ${errorText}` : ""}`,
        {
          source: url,
          status: res.status,
        },
      );
    }

    return (await res.json()) as T;
  } catch (err) {
    const normalizedError =
      err instanceof PortfolioApiError
        ? err
        : new PortfolioApiError(`Unable to reach the backend API at ${url}.`, {
            cause: err,
            source: url,
          });

    logServerError("API request failed", normalizedError);
    throw normalizedError;
  }
}

export async function postToApi<T>(path: string, body: unknown, init: RequestInit = {}) {
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetchFromApi<T>(path, {
    ...init,
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

export async function fetchPortfolio<T>(): Promise<T> {
  return fetchFromApi<T>("/api/portfolio");
}
