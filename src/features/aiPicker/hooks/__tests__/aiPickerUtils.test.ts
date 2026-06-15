import { resolveSelectedCarTitles, shouldShowLeadCta } from "../aiPickerUtils";
import type { AiCatalogItem, AiChatMessage } from "../../types";

describe("resolveSelectedCarTitles", () => {
  it("resolves titles from chat messages when not in bootstrap catalog", () => {
    const catalog: AiCatalogItem[] = [];
    const messages: AiChatMessage[] = [
      {
        id: "a1",
        role: "assistant",
        text: "Варианты",
        cars: [
          {
            id: "99",
            siteId: "indep",
            brand: "KIA",
            title: "KIA Sportage New",
            priceFrom: 1_499_000,
            year: 2026,
            condition: "new",
            availability: "from_price",
          },
        ],
      },
    ];

    expect(resolveSelectedCarTitles(catalog, new Set(["99"]), messages)).toEqual([
      "KIA Sportage New",
    ]);
  });
});

describe("shouldShowLeadCta", () => {
  it("shows CTA when server suggests lead and cars are selected", () => {
    expect(shouldShowLeadCta(true, 2, false)).toBe(true);
  });

  it("hides CTA when lead already sent", () => {
    expect(shouldShowLeadCta(true, 2, true)).toBe(false);
  });

  it("hides CTA when no cars selected", () => {
    expect(shouldShowLeadCta(true, 0, false)).toBe(false);
  });
});
