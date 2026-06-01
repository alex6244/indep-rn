import type { AiCatalogItem } from "../../types";
import { resolveBrandFromCatalog } from "../resolveBrandFromCatalog";

const sample: AiCatalogItem[] = [
  {
    id: "1",
    siteId: "indep",
    brand: "BELGEE",
    title: "BELGEE X50",
    priceFrom: 1_419_000,
    imageUrl: "https://example.com/x.jpg",
    year: 2026,
    condition: "new",
    availability: "from_price",
  },
];

describe("resolveBrandFromCatalog", () => {
  it("resolves belgee from user text", () => {
    expect(resolveBrandFromCatalog("belgee", sample)).toBe("BELGEE");
    expect(resolveBrandFromCatalog("хочу belgee", sample)).toBe("BELGEE");
  });
});
