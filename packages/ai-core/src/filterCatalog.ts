import type { AiCatalogItem } from "./types";

export type CatalogFilter = {
  brand?: string;
  maxPrice?: number;
  minPrice?: number;
  query?: string;
  bodyType?: "crossover";
};

const CROSSOVER_TITLE_RE =
  /\b(niva|jolion|sportage|tucson|creta|duster|tiggo|coolray|monjaro|dargo|arkana|kaptur|x-?ray cross|granta cross|vesta cross|patriot|hunter|f7|h9|h3|atlas|dashing|outlander|forester|x-trail|qashqai|rav4|highlander)\b/i;

export function isCrossoverTitle(title: string): boolean {
  return CROSSOVER_TITLE_RE.test(title);
}

export function filterAiCatalog(
  items: AiCatalogItem[],
  filter: CatalogFilter,
  limit = 5,
): AiCatalogItem[] {
  let list = items;

  if (filter.brand) {
    const brand = filter.brand.toLowerCase();
    list = list.filter(
      (item) =>
        item.brand.toLowerCase() === brand || item.brand.toLowerCase().includes(brand),
    );
  }

  if (typeof filter.maxPrice === "number") {
    list = list.filter((item) => item.priceFrom <= filter.maxPrice!);
  }

  if (typeof filter.minPrice === "number") {
    list = list.filter((item) => item.priceFrom >= filter.minPrice!);
  }

  if (filter.bodyType === "crossover") {
    list = list.filter((item) => isCrossoverTitle(item.title));
  }

  if (filter.query) {
    const q = filter.query.toLowerCase();
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.brand.toLowerCase().includes(q),
    );
  }

  return list.slice(0, limit);
}
