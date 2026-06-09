export function createMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatCatalogSourceLabel(
  source: "api" | "seed",
  count: number,
): string {
  return source === "api"
    ? `Каталог: с сайта (${count})`
    : `Каталог: офлайн (${count})`;
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
