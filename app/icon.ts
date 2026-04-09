import { getPortfolio } from "./_lib/portfolio";

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
  } catch {
    return new Response(null, { status: 204 });
  }
}
