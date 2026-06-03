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

/** Round-robin по маркам, чтобы не отдавать 5× LADA подряд из начала каталога. */
export function diversifyByBrand(items: AiCatalogItem[], limit: number): AiCatalogItem[] {
  const queues = new Map<string, AiCatalogItem[]>();
  for (const item of items) {
    const key = item.brand;
    const list = queues.get(key) ?? [];
    list.push(item);
    queues.set(key, list);
  }

  const brands = [...queues.keys()];
  if (brands.length === 0) return [];

  const result: AiCatalogItem[] = [];
  let round = 0;
  while (result.length < limit && round < items.length) {
    for (const brand of brands) {
      const queue = queues.get(brand);
      if (!queue || queue.length === 0) continue;
      result.push(queue.shift()!);
      if (result.length >= limit) break;
    }
    round += 1;
  }
  return result;
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

  if (filter.bodyType === "crossover" && !filter.brand && list.length > 0) {
    const pool = list.slice(0, Math.min(list.length, 40));
    return diversifyByBrand(pool, limit);
  }

  return list.slice(0, limit);
}
