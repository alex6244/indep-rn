/** Canonical brand → aliases (latin + cyrillic). Models are not listed here. */
export const BRAND_ALIASES: Record<string, string[]> = {
  KIA: ["kia", "киа"],
  HAVAL: ["haval", "хавал", "хавейл"],
  LADA: ["lada", "лада", "ваз"],
  GEELY: ["geely", "джили", "гили"],
  BELGEE: ["belgee", "белджи", "белги"],
  CHERY: ["chery", "чери"],
  HYUNDAI: ["hyundai", "хендай", "хёндай", "хюндай"],
  RENAULT: ["renault", "рено"],
  SKODA: ["skoda", "шкода"],
  SOLARIS: ["solaris", "солярис"],
  UAZ: ["uaz", "уаз"],
  BMW: ["bmw", "бмв", "bmv"],
  MERCEDES: ["mercedes", "мерседес", "мерс"],
};

export function resolveBrandToken(token: string): string | undefined {
  const normalized = token.toLowerCase().trim();
  if (!normalized) return undefined;

  for (const [brand, aliases] of Object.entries(BRAND_ALIASES)) {
    if (brand.toLowerCase() === normalized) return brand;
    if (aliases.some((alias) => alias === normalized)) return brand;
  }
  return undefined;
}

export function detectBrandFromText(text: string): string | undefined {
  const normalized = text.toLowerCase().replace(/\s+/g, " ");
  for (const [brand, aliases] of Object.entries(BRAND_ALIASES)) {
    if (aliases.some((alias) => normalized.includes(alias))) {
      return brand;
    }
  }
  return undefined;
}
