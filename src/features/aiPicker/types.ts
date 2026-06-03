import type { AiCatalogItem as CoreAiCatalogItem } from "@indep/ai-core";

export type { AiCatalogAvailability, AiCatalogItem } from "@indep/ai-core";

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
   * When present, AI must not suggest other brands.
   */
  brand?: string;
};

export type AiChatCarBlock = {
  cars: CoreAiCatalogItem[];
};

export type AiChatMessage =
  | {
      id: string;
      role: "user" | "assistant";
      text: string;
    }
  | {
      id: string;
      role: "assistant";
      text: string;
      cars: CoreAiCatalogItem[];
    };
