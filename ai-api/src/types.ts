export type { AiCatalogItem } from "../../packages/ai-core/src/types";

export type AiSiteMode = "multibrand" | "monobrand";

export type AiSiteProfile = {
  siteId: string;
  displayName: string;
  mode: AiSiteMode;
  allowOrder: boolean;
  catalogBannersUrl: string;
  locale: string;
  disclaimer: string;
  /**
   * For `monobrand` sites: canonical brand name from catalog API (e.g. "LADA", "KIA").
   * AI must not suggest other brands.
   */
  brand?: string;
};
