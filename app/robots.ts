// This generates robots.txt from the current site URL and indexing rules.
import type { MetadataRoute } from "next";

import { getCanonicalUrl, shouldIndexSite } from "./_lib/seo";

export default function robots(): MetadataRoute.Robots {
  const canIndex = shouldIndexSite();

  return {
    rules: {
      userAgent: "*",
      allow: canIndex ? "/" : undefined,
      disallow: canIndex ? undefined : "/",
    },
    sitemap: getCanonicalUrl("/sitemap.xml"),
    host: getCanonicalUrl(),
  };
}
