import { cache } from "react";

import { fetchPortfolio } from "./api";
import { PortfolioData } from "./types";

export const getPortfolio = cache(async (): Promise<PortfolioData> => {
  return fetchPortfolio<PortfolioData>();
});
