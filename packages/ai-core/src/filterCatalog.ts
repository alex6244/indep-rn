import type { AiCatalogItem } from "./types";

export type BodyType = "crossover" | "sedan" | "hatchback";

export type CatalogFilter = {
  brand?: string;
  maxPrice?: number;
  minPrice?: number;
  query?: string;
  bodyType?: BodyType;
  /** Компактные/доступные авто — для «молодой девушке», «первый авто» и т.п. */
  profile?: "compact";
};

const CROSSOVER_TITLE_RE =
  /\b(niva|jolion|sportage|tucson|creta|duster|tiggo|coolray|monjaro|dargo|arkana|kaptur|x-?ray cross|granta cross|vesta cross|patriot|hunter|f7|h9|h3|atlas|dashing|outlander|forester|x-trail|qashqai|rav4|highlander)\b/i;

export function isCrossoverTitle(title: string): boolean {
  return CROSSOVER_TITLE_RE.test(title);
}

const HATCHBACK_TITLE_RE =
  /(picanto|polo|fabia|rio(?!\s+x)|sandero|хэтч|hatch|i20|kalina)/i;

const SEDAN_MODEL_RE =
  /(седан|sedan|cerato|ceed(?!\s+sw)|solaris|logan|granta(?!\s+cross)|vesta(?!\s+cross)|octavia|rapid|camry|corolla|elantra|aura|emgrand|preface|arrizo)/i;

export function isHatchbackTitle(title: string): boolean {
  return HATCHBACK_TITLE_RE.test(title);
}

export function isSedanTitle(title: string): boolean {
  if (isCrossoverTitle(title) || isHatchbackTitle(title)) return false;
  return SEDAN_MODEL_RE.test(title);
}

/** Бюджетные «рабочие» седаны — не для профиля «молодой девушке». */
const BUDGET_SEDAN_RE =
  /(granta(?!\s+cross)|vesta(?!\s+cross)|logan|kalina|priora)/i;

const CITY_COMPACT_RE =
  /(picanto|rio|sandero|polo|fabia|i20|solaris\s+hc|cerato|ceed(?!\s+sw)|city\s+m|eonix)/i;

export function isCityCompactTitle(title: string): boolean {
  if (isCrossoverTitle(title) || BUDGET_SEDAN_RE.test(title)) return false;
  return isHatchbackTitle(title) || CITY_COMPACT_RE.test(title);
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

/** Доступные компактные модели с разнообразием по маркам. */
export function filterAffordableCompact(
  items: AiCatalogItem[],
  maxPrice: number,
  limit = 5,
): AiCatalogItem[] {
  const affordable = items
    .filter((item) => item.priceFrom <= maxPrice)
    .sort((a, b) => a.priceFrom - b.priceFrom);

  const preferred = affordable.filter((item) => isCityCompactTitle(item.title));

  let pool = preferred;
  if (pool.length < limit) {
    const extra = affordable.filter(
      (item) =>
        !isCrossoverTitle(item.title) &&
        !BUDGET_SEDAN_RE.test(item.title) &&
        !pool.some((p) => p.id === item.id),
    );
    pool = [...pool, ...extra];
  }

  return diversifyByBrand(pool.slice(0, 50), limit);
}

export function filterAiCatalog(
  items: AiCatalogItem[],
  filter: CatalogFilter,
  limit = 5,
): AiCatalogItem[] {
  if (filter.profile === "compact" && typeof filter.maxPrice === "number") {
    return filterAffordableCompact(items, filter.maxPrice, limit);
  }

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

  if (filter.bodyType === "sedan") {
    list = list.filter((item) => isSedanTitle(item.title));
  }

  if (filter.bodyType === "hatchback") {
    list = list.filter((item) => isHatchbackTitle(item.title));
  }

  if (filter.query) {
    const q = filter.query.toLowerCase();
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.brand.toLowerCase().includes(q),
    );
  }

  if (
    (filter.bodyType === "crossover" ||
      filter.bodyType === "sedan" ||
      filter.bodyType === "hatchback") &&
    !filter.brand &&
    list.length > 0
  ) {
    const pool = list.slice(0, Math.min(list.length, 40));
    return diversifyByBrand(pool, limit);
  }

  return list.slice(0, limit);
}
