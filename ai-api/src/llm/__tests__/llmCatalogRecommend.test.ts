import type { AiCatalogItem } from "../../types.js";
import { mapIdsToCatalogItems, recommendCarsWithLlm } from "../llmCatalogRecommend.js";
import * as deepseek from "../deepseek.js";

jest.mock("../deepseek.js", () => ({
  completeDeepSeekChat: jest.fn(),
}));

const catalog: AiCatalogItem[] = [
  {
    id: "28",
    siteId: "indep",
    brand: "KIA",
    title: "KIA Picanto",
    priceFrom: 1_089_000,
    year: 2026,
    condition: "new",
    availability: "from_price",
  },
  {
    id: "32",
    siteId: "indep",
    brand: "KIA",
    title: "KIA Cerato",
    priceFrom: 850_000,
    year: 2026,
    condition: "new",
    availability: "from_price",
  },
];

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
});
