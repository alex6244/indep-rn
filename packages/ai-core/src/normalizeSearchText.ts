import { resolveBrandToken } from "./brandAliases";

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

function transliterateCyrillicToLatin(input: string): string {
  let out = "";
  for (const char of input) {
    const lower = char.toLowerCase();
    if (CYRILLIC_TO_LATIN[lower] !== undefined) {
      out += CYRILLIC_TO_LATIN[lower];
    } else {
      out += char;
    }
  }
  return out;
}

export function normalizeSearchText(input: string): string {
  return transliterateCyrillicToLatin(input)
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[-_/]+/g, " ")
    .replace(/[^a-z0-9а-я\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenizeSearchText(input: string): string[] {
  const normalized = normalizeSearchText(input);
  if (!normalized) return [];

  return normalized
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => {
      if (!token) return false;
      if (/^\d+$/.test(token)) return false;
      return token.length >= 2;
    })
    .map((token) => {
      const brand = resolveBrandToken(token);
      return brand ? brand.toLowerCase() : token;
    });
}

export function buildItemSearchText(parts: {
  brand: string;
  model: string;
  title: string;
}): string {
  const title = parts.title.trim();
  const brand = parts.brand.trim();
  if (title.length > 0 && brand.length > 0 && title.toLowerCase().startsWith(brand.toLowerCase())) {
    return normalizeSearchText(title);
  }
  const combined = [parts.brand, parts.model, parts.title].filter(Boolean).join(" ");
  return normalizeSearchText(combined);
}
