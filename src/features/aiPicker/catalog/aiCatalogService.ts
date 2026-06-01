import indepSeed from "../../../data/ai/indep-banner-catalog.seed.json";
import indepSite from "../../../data/ai/sites/indep.json";
import type { AiCatalogItem, AiSiteProfile } from "../types";
import type { BannerCatalogRow } from "./bannerApiTypes";
import { mapBannerListToAiCatalog } from "./mapBannerToAiCatalogItem";

const SITE_PROFILES: Record<string, AiSiteProfile> = {
  indep: indepSite as AiSiteProfile,
};

const CATALOG_TIMEOUT_MS = 15000;

export function getAiSiteProfile(siteId: string): AiSiteProfile {
  const profile = SITE_PROFILES[siteId];
  if (!profile) {
    throw new Error(`Unknown AI siteId: ${siteId}`);
  }
  return profile;
}

function loadSeedCatalog(siteId: string): AiCatalogItem[] {
  if (siteId === "indep") {
    return mapBannerListToAiCatalog(indepSeed as BannerCatalogRow[], siteId);
  }
  return [];
}

export type AiCatalogLoadResult = {
  items: AiCatalogItem[];
  source: "api" | "seed";
};

export async function loadAiCatalog(siteId = "indep"): Promise<AiCatalogItem[]> {
  const result = await loadAiCatalogWithMeta(siteId);
  return result.items;
}

export async function loadAiCatalogWithMeta(siteId = "indep"): Promise<AiCatalogLoadResult> {
  const site = getAiSiteProfile(siteId);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CATALOG_TIMEOUT_MS);
    const response = await fetch(site.catalogBannersUrl, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Catalog HTTP ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload) || payload.length === 0) {
      throw new Error("Catalog empty");
    }

    const items = mapBannerListToAiCatalog(payload, siteId);
    if (items.length === 0) {
      throw new Error("Catalog mapping yielded no items");
    }

    return { items, source: "api" };
  } catch (error) {
    if (__DEV__) {
      console.warn("[ai-picker] catalog API failed, using seed", error);
    }
    return { items: loadSeedCatalog(siteId), source: "seed" };
  }
}
