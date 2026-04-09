// This file serves a favicon from the portfolio API so each deployed portfolio can brand itself.
import { getPortfolio } from "./_lib/portfolio";
import { logServerError } from "./_lib/errors";

export const dynamic = "force-dynamic";

export default async function Icon() {
  try {
    const { profile } = await getPortfolio();
    const faviconUrl = profile.favicon_url?.trim();

    if (!faviconUrl) {
      return new Response(null, { status: 204 });
    }

    const response = await fetch(faviconUrl, { cache: "no-store" });

    if (!response.ok) {
      return new Response(null, { status: 204 });
    }

    return new Response(await response.arrayBuffer(), {
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "image/x-icon",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    logServerError("Failed to load dynamic favicon", error);
    return new Response(null, { status: 204 });
  }
}
