import type { BannerCatalogRow } from "./bannerApiTypes";
import type { AiCatalogItem } from "../types";

export function mapBannerToAiCatalogItem(
  row: BannerCatalogRow,
  siteId: string,
  year = new Date().getFullYear(),
): AiCatalogItem {
  const priceFrom = Number(row.price_new) || 0;
  const priceWas = Number(row.price_old) || 0;

  return {
    id: String(row.id),
    siteId,
    brand: row.mark_name.trim(),
    title: row.full_name.trim(),
    priceFrom,
    priceWas: priceWas > priceFrom ? priceWas : undefined,
    imageUrl: row.preview,
    year,
    condition: "new",
    availability: "from_price",
  };
}

export function mapBannerListToAiCatalog(
  rows: unknown[],
  siteId: string,
): AiCatalogItem[] {
  const result: AiCatalogItem[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    if (typeof o.id !== "number" || typeof o.mark_name !== "string") continue;
    if (typeof o.full_name !== "string" || typeof o.preview !== "string") continue;
    if (typeof o.price_new !== "number") continue;

    result.push(
      mapBannerToAiCatalogItem({
        id: o.id,
        mark_name: o.mark_name,
        model_name: String(o.model_name ?? ""),
        full_name: o.full_name,
        preview: o.preview,
        mark_logo: String(o.mark_logo ?? ""),
        price_new: o.price_new,
        price_old: typeof o.price_old === "number" ? o.price_old : o.price_new,
      }, siteId),
    );
  }
  return result;
}
