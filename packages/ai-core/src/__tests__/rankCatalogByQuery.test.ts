import { buildItemSearchText } from "../normalizeSearchText";
import { rankCatalogByQuery } from "../rankCatalogByQuery";
import type { AiCatalogItem } from "../types";

function kiaCar(
  id: string,
  title: string,
  model: string,
  priceFrom: number,
): AiCatalogItem {
  const brand = "KIA";
  return {
    id,
    siteId: "indep",
    brand,
    title,
    model,
    searchText: buildItemSearchText({ brand, model, title }),
    priceFrom,
    imageUrl: "https://example.com/p.jpg",
    year: 2026,
    condition: "new",
    availability: "from_price",
  };
}

const kiaCatalog: AiCatalogItem[] = [
  kiaCar("1", "KIA Picanto", "Picanto", 1_089_000),
  kiaCar("2", "KIA Cerato", "Cerato", 1_850_000),
  kiaCar("3", "KIA Sportage New", "Sportage", 2_499_000),
  kiaCar("4", "KIA Seltos", "Seltos", 2_199_000),
  kiaCar("5", "KIA K5", "K5", 2_350_000),
  kiaCar("6", "KIA Rio", "Rio", 1_650_000),
  kiaCar("7", "KIA Rio X", "Rio X", 1_750_000),
  kiaCar("8", "KIA Soul", "Soul", 1_990_000),
];

describe("rankCatalogByQuery", () => {
  it("ranks KIA Rio first for «киа рио»", () => {
    const { items } = rankCatalogByQuery("киа рио", kiaCatalog, { limit: 5 });
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]?.title).toMatch(/Rio/i);
  });

  it("ranks KIA Rio first for «KIA Rio»", () => {
    const { items } = rankCatalogByQuery("KIA Rio", kiaCatalog, { limit: 5 });
    expect(items[0]?.title).toMatch(/Rio/i);
  });

  it("filters KIA by budget for «киа до 2 млн»", () => {
    const { items, intent } = rankCatalogByQuery("киа до 2 млн", kiaCatalog, { limit: 8 });
    expect(intent.brand).toBe("KIA");
    expect(intent.maxPrice).toBe(2_000_000);
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((car) => car.brand === "KIA" && car.priceFrom <= 2_000_000)).toBe(true);
    expect(items.some((car) => car.title.includes("Sportage"))).toBe(false);
  });
});
