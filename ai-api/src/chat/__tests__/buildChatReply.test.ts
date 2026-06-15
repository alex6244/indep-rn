import type { AiCatalogItem } from "../../types.js";
import { buildChatReply } from "../buildChatReply.js";
import * as deepseek from "../../llm/deepseek.js";
import * as llmPick from "../../llm/llmCatalogRecommend.js";

jest.mock("../../llm/deepseek.js", () => ({
  isDeepSeekEnabled: jest.fn(),
  completeDeepSeekChat: jest.fn(),
}));

jest.mock("../../llm/llmCatalogRecommend.js", () => ({
  recommendCarsWithLlm: jest.fn(),
  mapIdsToCatalogItems: jest.requireActual("../../llm/llmCatalogRecommend.js")
    .mapIdsToCatalogItems,
}));

const catalog: AiCatalogItem[] = [
  {
    id: "1",
    siteId: "indep",
    brand: "KIA",
    title: "KIA Ceed",
    priceFrom: 1_349_000,
    imageUrl: "https://example.com/p.jpg",
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
    imageUrl: "https://example.com/p.jpg",
    year: 2026,
    condition: "new",
    availability: "from_price",
  },
];

describe("buildChatReply", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(deepseek.isDeepSeekEnabled).mockReturnValue(false);
  });

  it("uses rules when DeepSeek is disabled", async () => {
    const reply = await buildChatReply("киа", catalog, { siteDisplayName: "Indep" });
    expect(reply.replySource).toBe("rules");
    expect(reply.cars.length).toBeGreaterThan(0);
    expect(deepseek.completeDeepSeekChat).not.toHaveBeenCalled();
  });

  it("uses LLM text with rule-selected cars when DeepSeek is enabled", async () => {
    jest.mocked(deepseek.isDeepSeekEnabled).mockReturnValue(true);
    jest
      .mocked(deepseek.completeDeepSeekChat)
      .mockResolvedValue("Отличный выбор! Вот несколько KIA с ценой от — отметьте и оставьте телефон.");

    const reply = await buildChatReply("киа", catalog, { siteDisplayName: "Indep" });

    expect(reply.replySource).toBe("llm");
    expect(reply.cars.length).toBeGreaterThan(0);
    expect(reply.text).toContain("Отличный выбор");
    expect(llmPick.recommendCarsWithLlm).not.toHaveBeenCalled();
  });

  it("uses LLM catalog pick when rules return no cars", async () => {
    jest.mocked(deepseek.isDeepSeekEnabled).mockReturnValue(true);
    jest.mocked(llmPick.recommendCarsWithLlm).mockResolvedValue({
      carIds: ["32"],
      message: "Для седана посмотрите Cerato — компактный и доступный по цене.",
    });

    const reply = await buildChatReply("на дачу поехать", catalog, {
      siteDisplayName: "Indep",
    });

    expect(llmPick.recommendCarsWithLlm).toHaveBeenCalled();
    expect(reply.replySource).toBe("llm");
    expect(reply.cars.map((c) => c.id)).toEqual(["32"]);
    expect(reply.text).toContain("Cerato");
  });

  it("falls back to rules when DeepSeek fails", async () => {
    jest.mocked(deepseek.isDeepSeekEnabled).mockReturnValue(true);
    jest.mocked(deepseek.completeDeepSeekChat).mockRejectedValue(new Error("timeout"));

    const reply = await buildChatReply("киа", catalog, { siteDisplayName: "Indep" });

    expect(reply.replySource).toBe("rules");
    expect(reply.cars.length).toBeGreaterThan(0);
    expect(reply.text).toContain("Подобрал новые автомобили");
  });
});
