// These helpers expose portfolio-specific data queries so pages do not talk to the raw API directly.
import { cache } from "react";

import { fetchPortfolio } from "./api";
import { PortfolioData, Project } from "./types";

export const getPortfolio = cache(async (): Promise<PortfolioData> => {
  return fetchPortfolio<PortfolioData>();
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const data = await getPortfolio();

  return data.projects.find((project) => project.slug === slug) ?? null;
});
