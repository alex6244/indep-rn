import type { AiCatalogItem, AiChatMessage } from "../types";

export function createMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Titles for lead confirmation when local catalog is empty (remote chat). */
export function resolveSelectedCarTitles(
  catalog: AiCatalogItem[],
  selectedIds: Set<string>,
  messages: AiChatMessage[],
): string[] {
  const byId = new Map<string, string>();
  for (const item of catalog) {
    byId.set(item.id, item.title);
  }
  for (const message of messages) {
    if (!("cars" in message)) continue;
    for (const car of message.cars) {
      byId.set(car.id, car.title);
    }
  }
  return [...selectedIds]
    .map((id) => byId.get(id))
    .filter((title): title is string => typeof title === "string" && title.length > 0);
}

export function formatCatalogSourceLabel(
  source: "api" | "seed",
  count: number,
): string {
  return source === "api"
    ? `Каталог: с сайта (${count})`
    : `Каталог: офлайн (${count})`;
}

/** Как сейчас работает подбор: сервер ai-api или локальный fallback. */
export function formatAiPickerConnectionLabel(opts: {
  useRemoteApi: boolean;
  catalogSource: "api" | "seed" | null;
  chatUsesLocalFallback: boolean;
}): string {
  if (!opts.useRemoteApi) {
    return "Режим: только в приложении";
  }
  if (opts.catalogSource === "seed" || opts.chatUsesLocalFallback) {
    return "Режим: локально (сервер ИИ не используется)";
  }
  return "Режим: сервер ИИ";
}

export const LEAD_SUGGEST_HINT =
  "Можете оставить телефон — менеджер перезвонит.";

export function shouldShowLeadCta(
  suggestLead: boolean,
  selectedCount: number,
  leadSent: boolean,
): boolean {
  return suggestLead && selectedCount > 0 && !leadSent;
}
