import type { AiCatalogItem } from "../../types.js";
import { buildChatReply } from "../buildChatReply.js";
import * as deepseek from "../../llm/deepseek.js";

jest.mock("../../llm/deepseek.js", () => ({
  isDeepSeekEnabled: jest.fn(),
  completeDeepSeekChat: jest.fn(),
}));

const catalog: AiCatalogItem[] = [
  {
    id: "1",
    siteId: "indep",
    brand: "KIA",
    title: "KIA Ceed",
    priceFrom: 1_349_000,
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
    expect(reply.cars).toHaveLength(1);
    expect(reply.text).toContain("KIA");
    expect(deepseek.completeDeepSeekChat).not.toHaveBeenCalled();
  });

  it("uses LLM text with rule-selected cars when DeepSeek is enabled", async () => {
    jest.mocked(deepseek.isDeepSeekEnabled).mockReturnValue(true);
    jest
      .mocked(deepseek.completeDeepSeekChat)
      .mockResolvedValue("Отличный выбор! Вот несколько KIA с ценой от — отметьте и оставьте телефон.");

    const reply = await buildChatReply("киа", catalog, { siteDisplayName: "Indep" });

    expect(reply.replySource).toBe("llm");
    expect(reply.cars).toHaveLength(1);
    expect(reply.text).toContain("Отличный выбор");
    expect(deepseek.completeDeepSeekChat).toHaveBeenCalled();
  });

  it("falls back to rules when DeepSeek fails", async () => {
    jest.mocked(deepseek.isDeepSeekEnabled).mockReturnValue(true);
    jest.mocked(deepseek.completeDeepSeekChat).mockRejectedValue(new Error("timeout"));

    const reply = await buildChatReply("киа", catalog, { siteDisplayName: "Indep" });

    expect(reply.replySource).toBe("rules");
    expect(reply.cars).toHaveLength(1);
    expect(reply.text).toContain("Подобрал новые автомобили");
  });
});
