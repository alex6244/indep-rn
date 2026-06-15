import {
  EONIX_LLM_GUIDANCE,
  withoutEonixUnlessEligible,
} from "../../../packages/ai-core/src/eonixPolicy.js";
import { diversifyByBrand } from "../../../packages/ai-core/src/filterCatalog.js";
import { searchCatalog } from "../../../packages/ai-core/src/searchCatalog.js";
import type { AiCatalogItem } from "../types.js";
import { completeDeepSeekChat } from "./deepseek.js";

const LLM_CATALOG_LINES = 70;
const LLM_CATALOG_KEEP_ALL_MAX = 80;

function capCatalogForLlm(pool: AiCatalogItem[]): AiCatalogItem[] {
  if (pool.length <= LLM_CATALOG_KEEP_ALL_MAX) return pool;
  return diversifyByBrand(pool, LLM_CATALOG_LINES);
}

/** @internal exported for tests */
export function pickCatalogForLlm(userText: string, catalog: AiCatalogItem[]): AiCatalogItem[] {
  const scopedCatalog = withoutEonixUnlessEligible(catalog, userText);
  const result = searchCatalog(userText, scopedCatalog, { limit: LLM_CATALOG_LINES });

  if (result.items.length > 0) {
    return capCatalogForLlm(result.items);
  }

  return diversifyByBrand(scopedCatalog, LLM_CATALOG_LINES);
}

export type LlmCatalogRecommendation = {
  carIds: string[];
  message: string;
};

function formatCatalogLine(car: AiCatalogItem): string {
  return `${car.id}|${car.brand}|${car.title}|${car.priceFrom}`;
}

function parseRecommendation(raw: string): LlmCatalogRecommendation | null {
  try {
    const parsed = JSON.parse(raw) as {
      carIds?: unknown;
      message?: unknown;
    };
    if (!Array.isArray(parsed.carIds) || typeof parsed.message !== "string") {
      return null;
    }
    const carIds = parsed.carIds.filter((id): id is string => typeof id === "string");
    const message = parsed.message.trim();
    if (carIds.length === 0 || message.length === 0) return null;
    return { carIds, message };
  } catch {
    return null;
  }
}

export async function recommendCarsWithLlm(
  userText: string,
  catalog: AiCatalogItem[],
  limit = 5,
): Promise<LlmCatalogRecommendation | null> {
  if (catalog.length === 0) return null;

  const subset = pickCatalogForLlm(userText, catalog);
  const lines = subset.map(formatCatalogLine).join("\n");
  const raw = await completeDeepSeekChat(
    [
      {
        role: "system",
        content:
          "Ты ИИ-консультант автосалона по новым автомобилям. Подбери до " +
          `${limit} вариантов из каталога под запрос клиента. ` +
          "Верни JSON: {\"carIds\":[\"id1\",\"id2\"],\"message\":\"текст\"}. " +
          "carIds — только id из списка каталога, не выдумывай модели. " +
          `${EONIX_LLM_GUIDANCE} ` +
          "message — 2–4 предложения по-русски: почему эти варианты, цены «от», предложи отметить и оставить телефон.",
      },
      {
        role: "user",
        content: `Запрос клиента: ${userText}\n\nКаталог (id|марка|модель|цена_от_руб):\n${lines}`,
      },
    ],
    { jsonObject: true },
  );

  const parsed = parseRecommendation(raw);
  if (!parsed) return null;

  const allowed = new Set(
    withoutEonixUnlessEligible(catalog, userText).map((car) => car.id),
  );
  const carIds = [...new Set(parsed.carIds.filter((id) => allowed.has(id)))].slice(
    0,
    limit,
  );
  if (carIds.length === 0) return null;

  return { carIds, message: parsed.message };
}

export function mapIdsToCatalogItems(
  catalog: AiCatalogItem[],
  carIds: string[],
): AiCatalogItem[] {
  const byId = new Map(catalog.map((car) => [car.id, car]));
  return carIds
    .map((id) => byId.get(id))
    .filter((car): car is AiCatalogItem => car !== undefined);
}
