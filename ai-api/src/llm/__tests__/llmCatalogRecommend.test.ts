import type { AiCatalogItem } from "../../types.js";
import {
  mapIdsToCatalogItems,
  pickCatalogForLlm,
  recommendCarsWithLlm,
} from "../llmCatalogRecommend.js";
import * as deepseek from "../deepseek.js";

jest.mock("../deepseek.js", () => ({
  completeDeepSeekChat: jest.fn(),
}));

function car(
  partial: Pick<AiCatalogItem, "id" | "brand" | "title" | "priceFrom"> &
    Partial<Pick<AiCatalogItem, "model" | "searchText">>,
): AiCatalogItem {
  const brand = partial.brand;
  const title = partial.title;
  const model = partial.model ?? title.replace(new RegExp(`^${brand}\\s+`, "i"), "").trim();
  return {
    siteId: "indep",
    imageUrl: "https://example.com/p.jpg",
    year: 2026,
    condition: "new",
    availability: "from_price",
    searchText: partial.searchText ?? `${brand} ${model} ${title}`.toLowerCase(),
    model,
    ...partial,
  };
}

const catalog: AiCatalogItem[] = [
  car({
    id: "268",
    brand: "EONIX",
    title: "EONIX City M2",
    priceFrom: 600_000,
    model: "City M2",
  }),
  car({
    id: "28",
    brand: "KIA",
    title: "KIA Picanto",
    priceFrom: 1_089_000,
    model: "Picanto",
  }),
  car({
    id: "32",
    brand: "KIA",
    title: "KIA Cerato",
    priceFrom: 850_000,
    model: "Cerato",
  }),
  car({
    id: "rio",
    brand: "KIA",
    title: "KIA Rio",
    priceFrom: 1_650_000,
    model: "Rio",
    searchText: "kia rio",
  }),
  car({
    id: "39",
    brand: "KIA",
    title: "KIA Sportage New",
    priceFrom: 1_499_000,
    model: "Sportage",
  }),
  car({
    id: "bmw1",
    brand: "BMW",
    title: "BMW X3",
    priceFrom: 4_500_000,
    model: "X3",
  }),
  car({
    id: "bmw2",
    brand: "BMW",
    title: "BMW 7 Series",
    priceFrom: 6_500_000,
    model: "7 Series",
  }),
];

function lastUserPrompt(): string {
  const calls = jest.mocked(deepseek.completeDeepSeekChat).mock.calls;
  const last = calls[calls.length - 1]?.[0];
  const user = last?.find((m) => m.role === "user");
  return user?.content ?? "";
}

describe("pickCatalogForLlm", () => {
  it("includes KIA Rio for «киа рио»", () => {
    const subset = pickCatalogForLlm("киа рио", catalog);
    expect(subset.some((c) => /rio/i.test(c.title))).toBe(true);
    expect(subset[0]?.title).toMatch(/Rio/i);
  });

  it("includes BMW within budget for «BMW до 5 млн», not only cheap KIA", () => {
    const subset = pickCatalogForLlm("BMW до 5 млн", catalog);
    expect(subset.some((c) => c.brand === "BMW" && c.id === "bmw1")).toBe(true);
    expect(subset.every((c) => c.brand === "BMW")).toBe(true);
    expect(subset.some((c) => c.id === "bmw2")).toBe(false);
    expect(subset.some((c) => c.brand === "KIA")).toBe(false);
  });

  it("includes only KIA within budget for «KIA до 2 млн»", () => {
    const subset = pickCatalogForLlm("KIA до 2 млн", catalog);
    expect(subset.every((c) => c.brand === "KIA")).toBe(true);
    expect(subset.every((c) => c.priceFrom <= 2_000_000)).toBe(true);
    expect(subset.some((c) => c.brand === "BMW")).toBe(false);
  });

  it("prefers crossovers for dacha and excludes EONIX", () => {
    const subset = pickCatalogForLlm("машину на дачу", catalog);
    expect(subset.some((c) => /sportage/i.test(c.title))).toBe(true);
    expect(subset.every((c) => c.brand !== "EONIX")).toBe(true);
  });
});

describe("llmCatalogRecommend", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("maps valid ids to catalog items", () => {
    const items = mapIdsToCatalogItems(catalog, ["32", "missing", "28"]);
    expect(items.map((c) => c.id)).toEqual(["32", "28"]);
  });

  it("parses LLM json recommendation", async () => {
    jest.mocked(deepseek.completeDeepSeekChat).mockResolvedValue(
      JSON.stringify({
        carIds: ["28", "32"],
        message: "Для города подойдут компактные KIA — отметьте и оставьте телефон.",
      }),
    );

    const result = await recommendCarsWithLlm("для девушки в город", catalog, 5);
    expect(result?.carIds).toEqual(["28", "32"]);
    expect(result?.message).toContain("город");
  });

  it("sends Rio line to LLM for «киа рио»", async () => {
    jest.mocked(deepseek.completeDeepSeekChat).mockResolvedValue(
      JSON.stringify({
        carIds: ["rio"],
        message: "KIA Rio подходит.",
      }),
    );

    await recommendCarsWithLlm("киа рио", catalog, 5);
    const prompt = lastUserPrompt();
    expect(prompt).toContain("Rio");
    expect(prompt).toContain("rio");
  });

  it("sends BMW lines to LLM for «BMW до 5 млн»", async () => {
    jest.mocked(deepseek.completeDeepSeekChat).mockResolvedValue(
      JSON.stringify({
        carIds: ["bmw1"],
        message: "BMW X3 в бюджете.",
      }),
    );

    await recommendCarsWithLlm("BMW до 5 млн", catalog, 5);
    const prompt = lastUserPrompt();
    expect(prompt).toContain("BMW");
    expect(prompt).toContain("bmw1");
    expect(prompt).not.toContain("KIA Picanto");
    expect(prompt).not.toContain("EONIX");
  });

  it("drops EONIX from LLM picks for general requests", async () => {
    jest.mocked(deepseek.completeDeepSeekChat).mockResolvedValue(
      JSON.stringify({
        carIds: ["268", "39"],
        message: "Вот варианты.",
      }),
    );

    const result = await recommendCarsWithLlm("машину на дачу", catalog, 5);
    expect(result?.carIds).toEqual(["39"]);
    expect(lastUserPrompt()).toContain("Sportage");
    expect(lastUserPrompt()).not.toContain("EONIX");
  });
});
