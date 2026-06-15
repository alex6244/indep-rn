import type { AiCatalogItem } from "../types";
import {
  isEonixEligibleRequest,
  withoutEonixUnlessEligible,
} from "../eonixPolicy";

const eonix: AiCatalogItem = {
  id: "268",
  siteId: "indep",
  brand: "EONIX",
  title: "EONIX City M2",
  priceFrom: 600_000,
  imageUrl: "https://example.com/p.jpg",
  year: 2026,
  condition: "new",
  availability: "from_price",
};

const kia: AiCatalogItem = {
  id: "28",
  siteId: "indep",
  brand: "KIA",
  title: "KIA Picanto",
  priceFrom: 1_089_000,
  imageUrl: "https://example.com/p.jpg",
  year: 2026,
  condition: "new",
  availability: "from_price",
};

describe("eonixPolicy", () => {
  it("allows EONIX for super budget or micro requests", () => {
    expect(isEonixEligibleRequest("самая дешевая машина")).toBe(true);
    expect(isEonixEligibleRequest("нужна супер маленькая")).toBe(true);
    expect(isEonixEligibleRequest("покажи eonix")).toBe(true);
  });

  it("blocks EONIX for general requests", () => {
    expect(isEonixEligibleRequest("машину на дачу")).toBe(false);
    expect(isEonixEligibleRequest("семейный кроссовер")).toBe(false);
    expect(isEonixEligibleRequest("дешевый вариант до 2,5 млн")).toBe(false);
  });

  it("filters EONIX from catalog unless eligible", () => {
    expect(withoutEonixUnlessEligible([eonix, kia], "на дачу")).toEqual([kia]);
    expect(withoutEonixUnlessEligible([eonix, kia], "самая дешевая")).toEqual([
      eonix,
      kia,
    ]);
  });
});
