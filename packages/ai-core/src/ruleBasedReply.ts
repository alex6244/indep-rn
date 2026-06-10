import { filterAiCatalog } from "./filterCatalog";
import type { AiCatalogItem } from "./types";
import { resolveBrandFromCatalog } from "./resolveBrandFromCatalog";
import { parseUserIntent } from "./parseUserIntent";

export type RuleBasedReply = {
  text: string;
  cars: AiCatalogItem[];
  suggestLead: boolean;
};

const GREETING_RE = /^(привет|здравств|добрый|hi|hello|start|начать|помог)/i;

export function buildWelcomeMessage(catalogSize: number): string {
  return (
    "Здравствуйте! Я помогу подобрать новый автомобиль из каталога дилера.\n\n" +
    `Сейчас в базе около ${catalogSize} моделей с ценой «от». ` +
    "Напишите, например: «KIA до 2,5 млн» или «семейный кроссовер до 3 млн»."
  );
}

export function buildRuleBasedReply(
  userText: string,
  catalog: AiCatalogItem[],
  options?: { selectedCount?: number; fixedBrand?: string },
): RuleBasedReply {
  const trimmed = userText.trim();
  if (!trimmed) {
    return {
      text: "Опишите, какой новый автомобиль вас интересует: марка, бюджет или тип кузова.",
      cars: [],
      suggestLead: false,
    };
  }

  if (GREETING_RE.test(trimmed) && trimmed.length < 40) {
    return {
      text: "Чем могу помочь? Укажите марку и бюджет — подберу варианты с ценой «от».",
      cars: [],
      suggestLead: false,
    };
  }

  const intent = parseUserIntent(trimmed);
  if (!intent.brand) {
    const fromCatalog = resolveBrandFromCatalog(trimmed, catalog);
    if (fromCatalog) intent.brand = fromCatalog;
  }

  // Monobrand sites: always constrain suggestions to a fixed brand.
  if (options?.fixedBrand) {
    intent.brand = options.fixedBrand;
  }

  let cars = filterAiCatalog(catalog, intent, 5);

  if (cars.length === 0 && intent.brand) {
    cars = filterAiCatalog(catalog, { brand: intent.brand }, 5);
  }

  if (cars.length === 0 && intent.maxPrice) {
    cars = filterAiCatalog(
      catalog,
      {
        maxPrice: intent.maxPrice,
        bodyType: intent.bodyType,
        brand: intent.brand,
      },
      5,
    );
  }

  if (cars.length === 0) {
    if (options?.fixedBrand) {
      const fixedBrand = options.fixedBrand;
      return {
        text: `По марке ${fixedBrand} сейчас нет позиций в загруженном каталоге. Уточните наличие у менеджера — можем оформить под заказ.`,
        cars: [],
        suggestLead: false,
      };
    }

    const askedBrand = resolveBrandFromCatalog(trimmed, catalog);
    if (askedBrand) {
      return {
        text: `По марке ${askedBrand} сейчас нет позиций в загруженном каталоге. Уточните бюджет или другую марку — можем оформить под заказ.`,
        cars: [],
        suggestLead: false,
      };
    }

    const hint =
      intent.profile === "compact"
        ? "Не нашёл компактных вариантов в загруженном каталоге. Уточните бюджет или марку — например: «KIA до 2 млн»."
        : intent.bodyType === "crossover"
          ? "По кроссоверам в каталоге мало подсказок в названиях — укажите марку или бюджет, например: «KIA кроссовер до 3 млн»."
          : intent.bodyType === "sedan"
            ? "По седанам не нашёл точных совпадений — укажите марку или бюджет, например: «KIA седан до 2 млн»."
            : "Не нашёл по запросу. Уточните марку (например, KIA, BELGEE) или бюджет «до 2,5 млн».";

    return {
      text: hint,
      cars: [],
      suggestLead: false,
    };
  }

  const filters: string[] = [];
  if (intent.brand) filters.push(`марка — ${intent.brand}`);
  if (intent.bodyType === "crossover") filters.push("кроссоверы");
  if (intent.bodyType === "sedan") filters.push("седаны");
  if (intent.bodyType === "hatchback") filters.push("хэтчбеки");
  if (intent.profile === "compact") filters.push("компактные авто");
  if (intent.maxPrice) {
    filters.push(`бюджет до ${new Intl.NumberFormat("ru-RU").format(intent.maxPrice)} ₽`);
  }
  const filterText = filters.length > 0 ? `: ${filters.join(", ")}` : "";
  const text =
    `Подобрал новые автомобили с ценой «от»${filterText} ` +
    `(${cars.length} вариантов). Отметьте понравившиеся и оставьте телефон.`;

  return {
    text,
    cars,
    suggestLead: (options?.selectedCount ?? 0) > 0,
  };
}

export function buildLeadSuccessMessage(phone: string, carTitles: string[]): string {
  const list = carTitles.length > 0 ? carTitles.join(", ") : "выбранные модели";
  return `Спасибо! Заявка принята: ${phone}. Менеджер свяжется с вами по: ${list}.`;
}

export function normalizePhoneInput(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return `+7${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `+7${digits}`;
  }
  return null;
}
