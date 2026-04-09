import type { MetadataRoute } from "next";

import { getPortfolio } from "./_lib/portfolio";
import { getCanonicalUrl } from "./_lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getPortfolio();

  const siteLastModified = [
    data.profile.updated_at,
    ...data.projects.map((project) => project.updated_at),
    ...data.experiences.map((experience) => experience.updated_at),
    ...data.certificates.map((certificate) => certificate.updated_at),
    ...data.resumes.map((resume) => resume.updated_at),
  ]
    .filter(Boolean)
    .sort()
    .at(-1);

  const images = [
    data.profile.image_url,
    ...data.projects.map((project) => project.image_url),
    ...data.certificates.map((certificate) => certificate.image_url),
  ].filter(Boolean);

  return [
    {
      url: getCanonicalUrl("/"),
      lastModified: siteLastModified ? new Date(siteLastModified) : new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images,
    },
    ...data.projects.map((project) => ({
      url: getCanonicalUrl(`/projects/${project.slug}`),
      lastModified: new Date(project.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [project.image_url],
    })),
  ];
}
