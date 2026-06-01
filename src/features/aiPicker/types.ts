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
