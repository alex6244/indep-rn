import {
  buildRuleBasedReply,
  EONIX_LLM_GUIDANCE,
  type RuleBasedReply,
} from "../../../packages/ai-core/src/index.js";
import type { AiCatalogItem } from "../types.js";
import { completeDeepSeekChat, isDeepSeekEnabled } from "../llm/deepseek.js";
import {
  mapIdsToCatalogItems,
  recommendCarsWithLlm,
} from "../llm/llmCatalogRecommend.js";

function formatCarLine(car: AiCatalogItem): string {
  const price = new Intl.NumberFormat("ru-RU").format(car.priceFrom);
  return `- ${car.title} (${car.brand}), цена от ${price} ₽`;
}

function buildLlmSystemPrompt(siteDisplayName: string): string {
  return (
    `Ты ИИ-консультант автосалона «${siteDisplayName}» по НОВЫМ автомобилям. ` +
    "Цены в каталоге указаны «от». Отвечай кратко по-русски (2–4 предложения), дружелюбно и по делу. " +
    "НЕ придумывай автомобили, марки, цены и наличие — опирайся только на список кандидатов ниже. " +
    `${EONIX_LLM_GUIDANCE} ` +
    "Если кандидаты есть — кратко прокомментируй подбор и предложи отметить понравившиеся и оставить телефон."
  );
}

function buildLlmUserPrompt(
  userText: string,
  ruleReply: RuleBasedReply,
): string {
  const lines = [
    `Запрос клиента: ${userText}`,
    "",
    ruleReply.cars.length > 0
      ? `Кандидаты из каталога (${ruleReply.cars.length}):`
      : "Кандидатов из каталога по этому запросу нет.",
  ];

  for (const car of ruleReply.cars) {
    lines.push(formatCarLine(car));
  }

  return lines.join("\n");
}

async function buildLlmTextForCars(
  userText: string,
  cars: AiCatalogItem[],
  siteDisplayName: string,
): Promise<string> {
  return completeDeepSeekChat([
    {
      role: "system",
      content: buildLlmSystemPrompt(siteDisplayName),
    },
    {
      role: "user",
      content: buildLlmUserPrompt(userText, { text: "", cars, suggestLead: false }),
    },
  ]);
}

export async function buildChatReply(
  userText: string,
  catalog: AiCatalogItem[],
  options?: { selectedCount?: number; fixedBrand?: string; siteDisplayName?: string },
): Promise<RuleBasedReply & { replySource: "llm" | "rules" }> {
  const siteDisplayName = options?.siteDisplayName ?? "дилера";
  let ruleReply = buildRuleBasedReply(userText, catalog, options);
  let cars = ruleReply.cars;
  let usedLlmPick = false;

  if (cars.length === 0 && isDeepSeekEnabled()) {
    try {
      const llmPick = await recommendCarsWithLlm(userText, catalog, 5);
      if (llmPick) {
        cars = mapIdsToCatalogItems(catalog, llmPick.carIds);
        if (cars.length > 0) {
          usedLlmPick = true;
          ruleReply = {
            ...ruleReply,
            cars,
            text: llmPick.message,
            suggestLead: (options?.selectedCount ?? 0) > 0,
          };
        }
      }
    } catch (err) {
      console.warn("[ai-api] DeepSeek catalog pick failed:", err);
    }
  }

  if (cars.length === 0 || !isDeepSeekEnabled()) {
    return { ...ruleReply, cars, replySource: "rules" };
  }

  if (usedLlmPick) {
    return { ...ruleReply, cars, replySource: "llm" };
  }

  try {
    const text = await buildLlmTextForCars(userText, cars, siteDisplayName);
    return {
      ...ruleReply,
      cars,
      text,
      replySource: "llm",
    };
  } catch (err) {
    console.warn("[ai-api] DeepSeek failed, using rule-based text:", err);
    return { ...ruleReply, cars, replySource: "rules" };
  }
}
