import {
  formatAiPickerConnectionLabel,
  resolveSelectedCarTitles,
  shouldShowLeadCta,
} from "../aiPickerUtils";
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

describe("formatAiPickerConnectionLabel", () => {
  it("shows server mode when remote api catalog works", () => {
    expect(
      formatAiPickerConnectionLabel({
        useRemoteApi: true,
        catalogSource: "api",
        chatUsesLocalFallback: false,
      }),
    ).toBe("Режим: сервер ИИ");
  });

  it("shows local mode when catalog is seed", () => {
    expect(
      formatAiPickerConnectionLabel({
        useRemoteApi: true,
        catalogSource: "seed",
        chatUsesLocalFallback: false,
      }),
    ).toContain("локально");
  });

  it("shows local mode when chat fell back", () => {
    expect(
      formatAiPickerConnectionLabel({
        useRemoteApi: true,
        catalogSource: "api",
        chatUsesLocalFallback: true,
      }),
    ).toContain("локально");
  });

  it("shows offline when ai-api url is not configured", () => {
    expect(
      formatAiPickerConnectionLabel({
        useRemoteApi: false,
        catalogSource: "seed",
        chatUsesLocalFallback: false,
      }),
    ).toBe("Режим: только в приложении");
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
