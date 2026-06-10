import { buildRuleBasedReply } from "../ruleBasedReply";
import type { AiCatalogItem } from "../../types";

function makeCatalog(): AiCatalogItem[] {
  return [
    {
      id: "1",
      siteId: "indep",
      brand: "LADA",
      title: "LADA Granta Седан",
      priceFrom: 649900,
      imageUrl: "https://example.com/1.webp",
      year: 2025,
      condition: "new",
      availability: "from_price",
    },
    {
      id: "2",
      siteId: "indep",
      brand: "KIA",
      title: "KIA Sportage New",
      priceFrom: 2_500_000,
      imageUrl: "https://example.com/2.webp",
      year: 2025,
      condition: "new",
      availability: "from_price",
    },
  ];
}

describe("buildRuleBasedReply", () => {
  it('returns no cars for vague request "на дачу поехать"', () => {
    const reply = buildRuleBasedReply("на дачу поехать", makeCatalog());
    expect(reply.cars).toHaveLength(0);
    expect(reply.text).toMatch(/уточните|не нашёл/i);
  });

  it('returns sedans for "седан хочу" when sedans exist in catalog', () => {
    const reply = buildRuleBasedReply("седан хочу", makeCatalog());
    expect(reply.cars.length).toBeGreaterThan(0);
    expect(reply.cars.some((c) => /granta|cerato/i.test(c.title))).toBe(true);
  });

  it('returns crossovers only for "кроссовер", not default LADA sedans', () => {
    const reply = buildRuleBasedReply("кроссовер", makeCatalog());
    expect(reply.cars.every((c) => /sportage|niva|jolion|tucson|creta/i.test(c.title))).toBe(
      reply.cars.length > 0,
    );
    if (reply.cars.length > 0) {
      expect(reply.cars.some((c) => c.brand === "LADA" && /granta/i.test(c.title))).toBe(false);
    }
  });

  it('mixes brands for "кроссовер" on a LADA-heavy catalog slice', () => {
    const catalog: AiCatalogItem[] = [
      {
        id: "1",
        siteId: "indep",
        brand: "LADA",
        title: "LADA Niva Legend",
        priceFrom: 900000,
        imageUrl: "https://example.com/1.webp",
        year: 2025,
        condition: "new",
        availability: "from_price",
      },
      {
        id: "2",
        siteId: "indep",
        brand: "LADA",
        title: "LADA Vesta Cross",
        priceFrom: 1200000,
        imageUrl: "https://example.com/2.webp",
        year: 2025,
        condition: "new",
        availability: "from_price",
      },
      {
        id: "3",
        siteId: "indep",
        brand: "LADA",
        title: "LADA Granta Cross",
        priceFrom: 1100000,
        imageUrl: "https://example.com/3.webp",
        year: 2025,
        condition: "new",
        availability: "from_price",
      },
      {
        id: "4",
        siteId: "indep",
        brand: "KIA",
        title: "KIA Sportage New",
        priceFrom: 2500000,
        imageUrl: "https://example.com/4.webp",
        year: 2025,
        condition: "new",
        availability: "from_price",
      },
      {
        id: "5",
        siteId: "indep",
        brand: "HAVAL",
        title: "HAVAL Jolion",
        priceFrom: 2000000,
        imageUrl: "https://example.com/5.webp",
        year: 2025,
        condition: "new",
        availability: "from_price",
      },
    ];
    const reply = buildRuleBasedReply("кроссовер", catalog);
    expect(reply.cars.length).toBeGreaterThan(1);
    const brands = new Set(reply.cars.map((c) => c.brand));
    expect(brands.size).toBeGreaterThan(1);
  });

  it('returns compact affordable cars for "для молодой девушки"', () => {
    const catalog: AiCatalogItem[] = [
      {
        id: "1",
        siteId: "indep",
        brand: "KIA",
        title: "KIA Picanto",
        priceFrom: 1_089_000,
        imageUrl: "https://example.com/1.webp",
        year: 2025,
        condition: "new",
        availability: "from_price",
      },
      {
        id: "2",
        siteId: "indep",
        brand: "KIA",
        title: "KIA Rio",
        priceFrom: 1_049_000,
        imageUrl: "https://example.com/2.webp",
        year: 2025,
        condition: "new",
        availability: "from_price",
      },
      {
        id: "3",
        siteId: "indep",
        brand: "RENAULT",
        title: "RENAULT Sandero",
        priceFrom: 989_000,
        imageUrl: "https://example.com/3.webp",
        year: 2025,
        condition: "new",
        availability: "from_price",
      },
      {
        id: "4",
        siteId: "indep",
        brand: "KIA",
        title: "KIA Sportage New",
        priceFrom: 2_500_000,
        imageUrl: "https://example.com/4.webp",
        year: 2025,
        condition: "new",
        availability: "from_price",
      },
    ];
    const reply = buildRuleBasedReply("для молодой девушки", catalog);
    expect(reply.cars.length).toBeGreaterThan(0);
    expect(reply.cars.every((c) => c.priceFrom <= 2_500_000)).toBe(true);
    expect(reply.cars.some((c) => /picanto|rio|sandero/i.test(c.title))).toBe(true);
    expect(reply.cars.some((c) => /sportage/i.test(c.title))).toBe(false);
  });

  it("filters by brand and budget", () => {
    const catalog: AiCatalogItem[] = [
      ...makeCatalog(),
      {
        id: "3",
        siteId: "indep",
        brand: "BELGEE",
        title: "BELGEE X50",
        priceFrom: 2_000_000,
        imageUrl: "https://example.com/3.webp",
        year: 2025,
        condition: "new",
        availability: "from_price",
      },
    ];
    const reply = buildRuleBasedReply("belgee до 2,5 млн", catalog);
    expect(reply.cars.length).toBeGreaterThan(0);
    expect(reply.cars.every((c) => c.brand === "BELGEE")).toBe(true);
  });
});
