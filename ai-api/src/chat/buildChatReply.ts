import {
  buildRuleBasedReply,
  type RuleBasedReply,
} from "../../../packages/ai-core/src/index.js";
import type { AiCatalogItem } from "../types.js";
import { completeDeepSeekChat, isDeepSeekEnabled } from "../llm/deepseek.js";

function formatCarLine(car: AiCatalogItem): string {
  const price = new Intl.NumberFormat("ru-RU").format(car.priceFrom);
  return `- ${car.title} (${car.brand}), цена от ${price} ₽`;
}

function buildLlmSystemPrompt(siteDisplayName: string): string {
  return (
    `Ты ИИ-консультант автосалона «${siteDisplayName}» по НОВЫМ автомобилям. ` +
    "Цены в каталоге указаны «от». Отвечай кратко по-русски (2–4 предложения), дружелюбно и по делу. " +
    "НЕ придумывай автомобили, марки, цены и наличие — опирайся только на список кандидатов ниже. " +
    "Если кандидатов нет — вежливо попроси уточнить марку, бюджет или тип кузова. " +
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

export async function buildChatReply(
  userText: string,
  catalog: AiCatalogItem[],
  options?: { selectedCount?: number; fixedBrand?: string; siteDisplayName?: string },
): Promise<RuleBasedReply & { replySource: "llm" | "rules" }> {
  const ruleReply = buildRuleBasedReply(userText, catalog, options);

  if (!isDeepSeekEnabled()) {
    return { ...ruleReply, replySource: "rules" };
  }

  try {
    const text = await completeDeepSeekChat([
      {
        role: "system",
        content: buildLlmSystemPrompt(options?.siteDisplayName ?? "дилера"),
      },
      {
        role: "user",
        content: buildLlmUserPrompt(userText, ruleReply),
      },
    ]);

    return {
      ...ruleReply,
      text,
      replySource: "llm",
    };
  } catch (err) {
    console.warn("[ai-api] DeepSeek failed, using rule-based text:", err);
    return { ...ruleReply, replySource: "rules" };
  }
}
