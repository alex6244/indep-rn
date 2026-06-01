import type { AiCatalogItem } from "./types";

export function resolveBrandFromCatalog(
  text: string,
  catalog: AiCatalogItem[],
): string | undefined {
  const normalized = text.toLowerCase().replace(/\s+/g, " ");
  const brands = [...new Set(catalog.map((item) => item.brand).filter(Boolean))];

  let best: { brand: string; score: number } | undefined;

  for (const brand of brands) {
    const key = brand.toLowerCase();
    if (key.length < 2) continue;

    if (normalized === key || normalized.includes(key)) {
      const score = key.length;
      if (!best || score > best.score) {
        best = { brand, score };
      }
    }
  }

  return best?.brand;
}
