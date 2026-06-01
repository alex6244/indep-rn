export type AiCatalogAvailability = "from_price" | "order";

export type AiCatalogItem = {
  id: string;
  siteId: string;
  brand: string;
  title: string;
  priceFrom: number;
  priceWas?: number;
  imageUrl: string;
  year: number;
  condition: "new";
  availability: AiCatalogAvailability;
};
