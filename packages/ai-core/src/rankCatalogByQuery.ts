import { detectBrandFromText, resolveBrandToken } from "./brandAliases";
import { withoutEonixUnlessEligible } from "./eonixPolicy";
import {
  filterAffordableCompact,
  isCrossoverTitle,
  isHatchbackTitle,
  isSedanTitle,
  type BodyType,
  type CatalogFilter,
} from "./filterCatalog";
import { buildItemSearchText, normalizeSearchText, tokenizeSearchText } from "./normalizeSearchText";
import { parseUserIntent } from "./parseUserIntent";
import { resolveBrandFromCatalog } from "./resolveBrandFromCatalog";
import type { AiCatalogItem } from "./types";

export type CatalogSearchOptions = {
  limit?: number;
  maxPrice?: number;
  bodyType?: BodyType;
  fixedBrand?: string;
};

export type CatalogSearchResult = {
  items: AiCatalogItem[];
  intent: CatalogFilter;
  matchedTokens: string[];
};

const QUERY_STOP_WORDS = new Set([
  "до",
  "млн",
  "миллион",
  "миллионов",
  "руб",
  "рублей",
  "от",
  "новый",
  "новая",
  "новое",
  "авто",
  "машина",
  "машину",
  "машины",
  "интересует",
  "нужен",
  "нужна",
  "нужно",
]);

function ensureSearchText(item: AiCatalogItem): string {
  if (item.searchText && item.searchText.length > 0) {
    return item.searchText;
  }
  return buildItemSearchText({
    brand: item.brand,
    model: item.model ?? "",
    title: item.title,
  });
}

function enrichIntent(
  userText: string,
  catalog: AiCatalogItem[],
  options?: CatalogSearchOptions,
): CatalogFilter {
  const intent = parseUserIntent(userText);
  if (!intent.brand) {
    const fromCatalog = resolveBrandFromCatalog(userText, catalog);
    if (fromCatalog) intent.brand = fromCatalog;
  }
  if (!intent.brand) {
    const fromAliases = detectBrandFromText(userText);
    if (fromAliases) intent.brand = fromAliases;
  }
  if (options?.fixedBrand) {
    intent.brand = options.fixedBrand;
  }
  if (options?.maxPrice !== undefined) {
    intent.maxPrice = options.maxPrice;
  }
  if (options?.bodyType) {
    intent.bodyType = options.bodyType;
  }
  return intent;
}

function extractQueryTokens(userText: string, intent: CatalogFilter): string[] {
  const seen = new Set<string>();
  const tokens: string[] = [];

  for (const token of tokenizeSearchText(userText)) {
    if (QUERY_STOP_WORDS.has(token)) continue;
    if (resolveBrandToken(token)) continue;
    if (intent.brand && normalizeSearchText(intent.brand) === token) continue;
    if (seen.has(token)) continue;
    seen.add(token);
    tokens.push(token);
  }

  return tokens;
}

function brandsMatch(a: string, b: string): boolean {
  return normalizeSearchText(a) === normalizeSearchText(b);
}

function passesHardFilters(item: AiCatalogItem, intent: CatalogFilter): boolean {
  if (intent.brand && !brandsMatch(item.brand, intent.brand)) {
    return false;
  }
  if (typeof intent.maxPrice === "number" && item.priceFrom > intent.maxPrice) {
    return false;
  }
  if (typeof intent.minPrice === "number" && item.priceFrom < intent.minPrice) {
    return false;
  }
  if (intent.bodyType === "crossover" && !isCrossoverTitle(item.title)) {
    return false;
  }
  if (intent.bodyType === "sedan" && !isSedanTitle(item.title)) {
    return false;
  }
  if (intent.bodyType === "hatchback" && !isHatchbackTitle(item.title)) {
    return false;
  }
  return true;
}

function tokenInText(token: string, text: string): boolean {
  const normalizedText = normalizeSearchText(text);
  const normalizedToken = normalizeSearchText(token);
  if (!normalizedToken || !normalizedText) return false;
  return normalizedText.includes(normalizedToken);
}

function tokenMatchesModel(token: string, model: string): boolean {
  const normalizedModel = normalizeSearchText(model);
  const normalizedToken = normalizeSearchText(token);
  if (!normalizedModel || !normalizedToken) return false;
  if (normalizedModel === normalizedToken) return true;
  return normalizedModel.split(" ").some((part) => part === normalizedToken || part.startsWith(normalizedToken));
}

function scoreItem(
  item: AiCatalogItem,
  intent: CatalogFilter,
  queryTokens: string[],
): number {
  if (!passesHardFilters(item, intent)) return -1;

  let score = 0;
  const searchText = ensureSearchText(item);
  const model = item.model ?? "";

  if (intent.brand && brandsMatch(item.brand, intent.brand)) {
    score += 100;
  }

  for (const token of queryTokens) {
    if (model && tokenMatchesModel(token, model)) {
      score += 80;
      continue;
    }
    if (tokenInText(token, searchText)) {
      score += 50;
      continue;
    }
    if (tokenInText(token, item.title)) {
      score += 30;
    }
  }

  return score;
}

export function rankCatalogByQuery(
  userText: string,
  catalog: AiCatalogItem[],
  options?: CatalogSearchOptions,
): CatalogSearchResult {
  const limit = options?.limit ?? 5;
  const scoped = withoutEonixUnlessEligible(catalog, userText);
  const intent = enrichIntent(userText, scoped, options);
  const matchedTokens = extractQueryTokens(userText, intent);

  if (intent.profile === "compact" && intent.maxPrice) {
    return {
      items: filterAffordableCompact(scoped, intent.maxPrice, limit),
      intent,
      matchedTokens,
    };
  }

  const scored = scoped
    .map((item) => ({
      item,
      score: scoreItem(item, intent, matchedTokens),
    }))
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.item.priceFrom - b.item.priceFrom;
    });

  const positive = scored.filter((entry) => entry.score > 0);
  const pool = (positive.length > 0 ? positive : scored).map((entry) => entry.item);

  return {
    items: pool.slice(0, limit),
    intent,
    matchedTokens,
  };
}
