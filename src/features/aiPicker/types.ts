import type { AiCatalogItem as CoreAiCatalogItem } from "@indep/ai-core";

export type {
  AiCatalogAvailability,
  AiCatalogItem,
  AiCatalogSource,
  AiSiteMode,
  AiSiteProfile,
  BannerCatalogRow,
} from "@indep/ai-core";

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
