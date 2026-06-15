import {
  rankCatalogByQuery,
  type CatalogSearchOptions,
  type CatalogSearchResult,
} from "./rankCatalogByQuery";
import type { AiCatalogItem } from "./types";

export type { CatalogSearchOptions, CatalogSearchResult };

export function searchCatalog(
  userText: string,
  catalog: AiCatalogItem[],
  options?: CatalogSearchOptions,
): CatalogSearchResult {
  return rankCatalogByQuery(userText, catalog, options);
}
