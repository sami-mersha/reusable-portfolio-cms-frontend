// This generates sitemap.xml from live portfolio data so project pages can be indexed.
import type { MetadataRoute } from "next";

import { getAllBlogs } from "./_lib/blogs";
import { logServerError } from "./_lib/errors";
import { getPortfolio } from "./_lib/portfolio";
import { getCanonicalUrl } from "./_lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [portfolioResult, blogsResult] = await Promise.allSettled([
      getPortfolio(),
      getAllBlogs(),
    ]);

    const portfolioData =
      portfolioResult.status === "fulfilled" ? portfolioResult.value : null;
    const blogs = blogsResult.status === "fulfilled" ? blogsResult.value : [];

    if (!portfolioData && blogs.length === 0) {
      throw portfolioResult.status === "rejected"
        ? portfolioResult.reason
        : blogsResult.status === "rejected"
          ? blogsResult.reason
          : new Error("No sitemap data available.");
    }

    const siteLastModified = [
      portfolioData?.profile.updated_at,
      ...(portfolioData?.projects.map((project) => project.updated_at) ?? []),
      ...(portfolioData?.experiences.map((experience) => experience.updated_at) ?? []),
      ...(portfolioData?.certificates.map((certificate) => certificate.updated_at) ?? []),
      ...(portfolioData?.resumes.map((resume) => resume.updated_at) ?? []),
      ...blogs.map((blog) => blog.updated_at),
    ]
      .filter(Boolean)
      .sort()
      .at(-1);

    const images = [
      portfolioData?.profile.image_url,
      ...(portfolioData?.projects.map((project) => project.image_url) ?? []),
      ...(portfolioData?.certificates.map((certificate) => certificate.image_url) ?? []),
      ...blogs.map((blog) => blog.cover_image),
    ].filter((image): image is string => Boolean(image));

    const entries: MetadataRoute.Sitemap = [
      {
        url: getCanonicalUrl("/"),
        lastModified: siteLastModified ? new Date(siteLastModified) : new Date(),
        changeFrequency: "weekly",
        priority: 1,
        images,
      },
    ];

    if (portfolioData) {
      entries.push(
        ...portfolioData.projects.map((project) => ({
          url: getCanonicalUrl(`/projects/${project.slug}`),
          lastModified: new Date(project.updated_at),
          changeFrequency: "monthly" as const,
          priority: 0.8,
          images: [project.image_url],
        })),
      );
    }

    if (blogs.length > 0) {
      const latestBlogUpdate = blogs
        .map((blog) => blog.updated_at)
        .filter(Boolean)
        .sort()
        .at(-1);

      entries.push({
        url: getCanonicalUrl("/blogs"),
        lastModified: latestBlogUpdate ? new Date(latestBlogUpdate) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
        images: blogs
          .map((blog) => blog.cover_image)
          .filter((image): image is string => Boolean(image)),
      });

      entries.push(
        ...blogs.map((blog) => ({
          url: getCanonicalUrl(`/blogs/${blog.slug}`),
          lastModified: new Date(blog.updated_at),
          changeFrequency: "monthly" as const,
          priority: 0.7,
          images: [blog.cover_image],
        })),
      );
    }

    return entries;
  } catch (error) {
    logServerError("Failed to generate sitemap", error);

    return [
      {
        url: getCanonicalUrl("/"),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1,
      },
    ];
  }
}
