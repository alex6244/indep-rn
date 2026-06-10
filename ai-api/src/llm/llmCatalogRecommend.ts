import {
  diversifyByBrand,
  filterAffordableCompact,
  filterAiCatalog,
} from "../../../packages/ai-core/src/filterCatalog.js";
import { parseUserIntent } from "../../../packages/ai-core/src/parseUserIntent.js";
import type { AiCatalogItem } from "../types.js";
import { completeDeepSeekChat } from "./deepseek.js";

const LLM_CATALOG_LINES = 70;

function pickCatalogForLlm(userText: string, catalog: AiCatalogItem[]): AiCatalogItem[] {
  const intent = parseUserIntent(userText);

  if (intent.profile === "compact" && intent.maxPrice) {
    return filterAffordableCompact(catalog, intent.maxPrice, LLM_CATALOG_LINES);
  }

  if (intent.maxPrice) {
    const affordable = catalog
      .filter((item) => item.priceFrom <= intent.maxPrice!)
      .sort((a, b) => a.priceFrom - b.priceFrom);
    return diversifyByBrand(affordable.slice(0, 100), LLM_CATALOG_LINES);
  }

  if (intent.bodyType) {
    const filtered = filterAiCatalog(catalog, intent, LLM_CATALOG_LINES);
    if (filtered.length > 0) return filtered;
  }

  const sorted = [...catalog].sort((a, b) => a.priceFrom - b.priceFrom);
  return diversifyByBrand(sorted.slice(0, 120), LLM_CATALOG_LINES);
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

  const allowed = new Set(catalog.map((car) => car.id));
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
