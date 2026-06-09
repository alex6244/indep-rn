import { mapBannerListToAiCatalog, mapBannerToAiCatalogItem } from "../mapBanner";

describe("mapBannerToAiCatalogItem", () => {
  it("maps banner row to AiCatalogItem", () => {
    const item = mapBannerToAiCatalogItem(
      {
        id: 10,
        mark_name: "KIA",
        model_name: "Rio",
        full_name: "KIA Rio",
        preview: "https://example.com/p.jpg",
        mark_logo: "https://example.com/logo.png",
        price_new: 1_500_000,
        price_old: 1_700_000,
      },
      "indep",
      2026,
    );

    expect(item).toMatchObject({
      id: "10",
      siteId: "indep",
      brand: "KIA",
      title: "KIA Rio",
      priceFrom: 1_500_000,
      priceWas: 1_700_000,
      condition: "new",
      availability: "from_price",
      year: 2026,
    });
  });

  it("skips invalid rows in list", () => {
    const list = mapBannerListToAiCatalog([{ id: "bad" }, { id: 1, mark_name: "X" }], "indep");
    expect(list).toHaveLength(0);
  });
});
