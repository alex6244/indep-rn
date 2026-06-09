export type AiCatalogAvailability = "from_price" | "order";

export type AiCatalogSource = "api" | "seed";

export type AiCatalogItem = {
  id: string;
  siteId: string;
  brand: string;
  title: string;
  priceFrom: number;
  priceWas?: number;
  imageUrl: string;
  year: number;
  condition: "new";
  availability: AiCatalogAvailability;
};

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

export type BannerCatalogRow = {
  id: number;
  mark_name: string;
  model_name?: string;
  full_name: string;
  preview: string;
  mark_logo?: string;
  price_new: number;
  price_old: number;
};
