import type { AiCatalogItem } from "./types";

const EONIX_BRAND_RE = /^eonix$/i;

/** Клиент явно просит EONIX. */
const EONIX_EXPLICIT_RE = /eonix|еоникс/i;

/** Супер дешёвый бюджет — не просто «до 2,5 млн», а минимум/копейки. */
const SUPER_BUDGET_RE =
  /сам(ая|ый|ое)\s+дешев|супер\s+дешев|очень\s+дешев|минимальн|за\s+копейк|копеечн|подешевле\s+некуда|до\s*1[,.]?\s*5?\s*млн|до\s*1\s*0{6}|до\s*9\d{5}/i;

/** Супер маленькая / микро — не просто «компакт для города». */
const SUPER_MICRO_RE =
  /супер\s+маленьк|сам(ая|ый|ое)\s+маленьк|микроавто|мини[-\s]?авто|микромобил|крошечн/i;

export const EONIX_LLM_GUIDANCE =
  "Марку EONIX предлагай ТОЛЬКО если клиент явно просит супер дешёвую машину, минимальный бюджет, супер маленькую/микро машину или называет EONIX. " +
  "Во всех остальных случаях (дача, семья, кроссовер, обычный бюджет) не включай EONIX в carIds — выбирай другие марки из каталога.";

export function isEonixBrand(brand: string): boolean {
  return EONIX_BRAND_RE.test(brand.trim());
}

export function isEonixEligibleRequest(userText: string): boolean {
  const normalized = userText.trim();
  if (!normalized) return false;
  return (
    EONIX_EXPLICIT_RE.test(normalized) ||
    SUPER_BUDGET_RE.test(normalized) ||
    SUPER_MICRO_RE.test(normalized)
  );
}

export function withoutEonixUnlessEligible(
  items: AiCatalogItem[],
  userText: string,
): AiCatalogItem[] {
  if (isEonixEligibleRequest(userText)) return items;
  return items.filter((item) => !isEonixBrand(item.brand));
}
