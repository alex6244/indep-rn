import { readFile } from "node:fs/promises";
import path from "node:path";
import type { AiCatalogItem, AiSiteProfile } from "../types.js";
import { mapBannerListToAiCatalog } from "../../../packages/ai-core/src/mapBanner.js";
import { envInt } from "../lib/env.js";

function getRepoRoot(): string {
  if (process.env.AI_API_REPO_ROOT) {
    return process.env.AI_API_REPO_ROOT;
  }
  const cwd = process.cwd();
  return path.basename(cwd) === "ai-api" ? path.resolve(cwd, "..") : cwd;
}

export type SiteState = {
  items: AiCatalogItem[];
  source: "api" | "seed";
  loadedAt: number;
};

const sites = new Map<string, AiSiteProfile>();
const catalogs = new Map<string, SiteState>();

export function getCatalogTtlMs(): number {
  return envInt("AI_API_CATALOG_TTL_MS", 3_600_000);
}

export function catalogObservabilityFields(
  catalog: SiteState,
  now = Date.now(),
): { catalogLoadedAt: string; catalogAgeSec: number } {
  return {
    catalogLoadedAt: new Date(catalog.loadedAt).toISOString(),
    catalogAgeSec: Math.max(0, Math.floor((now - catalog.loadedAt) / 1000)),
  };
}

export function registerSite(profile: AiSiteProfile): void {
  sites.set(profile.siteId, profile);
}

export function getSite(siteId: string): AiSiteProfile | undefined {
  return sites.get(siteId);
}

export function getCatalog(siteId: string): SiteState | undefined {
  return catalogs.get(siteId);
}

export function resetCatalogStoreForTests(): void {
  sites.clear();
  catalogs.clear();
}

async function loadSeed(siteId: string): Promise<AiCatalogItem[]> {
  const seedPath = path.join(getRepoRoot(), "src/data/ai/indep-banner-catalog.seed.json");
  const raw = await readFile(seedPath, "utf8");
  const rows = JSON.parse(raw) as unknown[];
  return mapBannerListToAiCatalog(rows, siteId);
}

export async function refreshCatalog(siteId: string): Promise<SiteState> {
  const site = sites.get(siteId);
  if (!site) {
    throw new Error(`Unknown site: ${siteId}`);
  }

  const previous = catalogs.get(siteId);

  try {
    const res = await fetch(site.catalogBannersUrl, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = (await res.json()) as unknown[];
    const items = mapBannerListToAiCatalog(rows, siteId);
    if (items.length === 0) throw new Error("Empty catalog from API");

    const state: SiteState = { items, source: "api", loadedAt: Date.now() };
    catalogs.set(siteId, state);
    return state;
  } catch (err) {
    if (previous?.source === "api") {
      console.warn(
        `[ai-api] catalog refresh failed for ${siteId}, keeping stale api cache:`,
        err,
      );
      return previous;
    }

    console.warn(`[ai-api] catalog API failed for ${siteId}, using seed:`, err);
    const items = await loadSeed(siteId);
    const state: SiteState = { items, source: "seed", loadedAt: Date.now() };
    catalogs.set(siteId, state);
    return state;
  }
}

export async function ensureCatalog(siteId: string): Promise<SiteState> {
  const existing = catalogs.get(siteId);
  const ttlMs = getCatalogTtlMs();
  const now = Date.now();

  if (!existing) {
    return refreshCatalog(siteId);
  }

  if (now - existing.loadedAt > ttlMs) {
    return refreshCatalog(siteId);
  }

  return existing;
}
