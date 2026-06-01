import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AiCatalogItem, AiSiteProfile } from "../types.js";
import { mapBannerListToAiCatalog } from "./mapBanner.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");

type SiteState = {
  items: AiCatalogItem[];
  source: "api" | "seed";
  loadedAt: number;
};

const sites = new Map<string, AiSiteProfile>();
const catalogs = new Map<string, SiteState>();

export function registerSite(profile: AiSiteProfile): void {
  sites.set(profile.siteId, profile);
}

export function getSite(siteId: string): AiSiteProfile | undefined {
  return sites.get(siteId);
}

export function getCatalog(siteId: string): SiteState | undefined {
  return catalogs.get(siteId);
}

async function loadSeed(siteId: string): Promise<AiCatalogItem[]> {
  const seedPath = path.join(REPO_ROOT, "src/data/ai/indep-banner-catalog.seed.json");
  const raw = await readFile(seedPath, "utf8");
  const rows = JSON.parse(raw) as unknown[];
  return mapBannerListToAiCatalog(rows, siteId);
}

export async function refreshCatalog(siteId: string): Promise<SiteState> {
  const site = sites.get(siteId);
  if (!site) {
    throw new Error(`Unknown site: ${siteId}`);
  }

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
    console.warn(`[ai-api] catalog API failed for ${siteId}, using seed:`, err);
    const items = await loadSeed(siteId);
    const state: SiteState = { items, source: "seed", loadedAt: Date.now() };
    catalogs.set(siteId, state);
    return state;
  }
}

export async function ensureCatalog(siteId: string): Promise<SiteState> {
  const existing = catalogs.get(siteId);
  if (existing) return existing;
  return refreshCatalog(siteId);
}
