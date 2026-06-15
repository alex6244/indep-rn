import { detectBrandFromText } from "./brandAliases";
import type { CatalogFilter } from "./filterCatalog";

const CROSSOVER_RE = /кроссовер|внедорож|паркетник|\bsuv\b|джип/i;
const DACHA_RE = /дач|загород|деревн|просёл|бездорож|грунтов/i;
const FAMILY_RE = /семейн|дет(ей|и|ям)|большой\s+багаж/i;
const SEDAN_RE = /седан|sedan/i;
const HATCHBACK_RE = /хэтч|хетч|hatchback|\bhatch\b/i;
const YOUNG_DRIVER_RE =
  /девушк|молод(ой|ая|ым|ым)|перв(ый|ая|ое)\s+авто|для\s+город|компакт/i;

export function parseUserIntent(text: string): CatalogFilter {
  const normalized = text.toLowerCase().replace(/\s+/g, " ");
  const filter: CatalogFilter = {};

  if (CROSSOVER_RE.test(normalized) || DACHA_RE.test(normalized)) {
    filter.bodyType = "crossover";
  } else if (FAMILY_RE.test(normalized)) {
    filter.bodyType = "crossover";
    if (!filter.maxPrice) filter.maxPrice = 3_500_000;
  } else if (SEDAN_RE.test(normalized)) {
    filter.bodyType = "sedan";
  } else if (HATCHBACK_RE.test(normalized)) {
    filter.bodyType = "hatchback";
  } else if (!YOUNG_DRIVER_RE.test(normalized)) {
    filter.query = normalized;
  }

  const brand = detectBrandFromText(normalized);
  if (brand) filter.brand = brand;

  const millionMatch = normalized.match(/до\s*(\d+(?:[.,]\d+)?)\s*млн/);
  if (millionMatch) {
    filter.maxPrice = Math.round(parseFloat(millionMatch[1].replace(",", ".")) * 1_000_000);
  }

  const rubMatch = normalized.match(/до\s*(\d[\d\s]{5,})/);
  if (!filter.maxPrice && rubMatch) {
    const digits = rubMatch[1].replace(/\s/g, "");
    const value = Number(digits);
    if (value > 100_000) filter.maxPrice = value;
  }

  if (/дешев|бюджет|недорог|подешевле/.test(normalized) && !filter.maxPrice) {
    filter.maxPrice = 2_500_000;
  }

  if (YOUNG_DRIVER_RE.test(normalized)) {
    if (!filter.maxPrice) filter.maxPrice = 2_500_000;
    if (!filter.bodyType && !filter.brand) filter.profile = "compact";
  }

  return filter;
}
