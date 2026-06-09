import {
  ensureCatalog,
  getCatalog,
  getCatalogTtlMs,
  registerSite,
  resetCatalogStoreForTests,
} from "../catalogStore";
import type { AiSiteProfile } from "../../types";

const mockSite: AiSiteProfile = {
  siteId: "indep",
  displayName: "Indep",
  mode: "multibrand",
  allowOrder: true,
  catalogBannersUrl: "https://example.com/banners",
  locale: "ru",
  disclaimer: "test",
};

const mockBannerRow = {
  id: 1,
  mark_name: "KIA",
  model_name: "Rio",
  full_name: "KIA Rio",
  preview: "https://example.com/p.jpg",
  mark_logo: "",
  price_new: 1_500_000,
  price_old: 1_700_000,
};

function mockApiFetch(): jest.Mock {
  return jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [mockBannerRow],
  });
}

describe("catalogStore TTL", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    resetCatalogStoreForTests();
    registerSite(mockSite);
    process.env.AI_API_CATALOG_TTL_MS = "60000";
    global.fetch = mockApiFetch();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.AI_API_CATALOG_TTL_MS;
  });

  it("uses default TTL of 1 hour", () => {
    delete process.env.AI_API_CATALOG_TTL_MS;
    expect(getCatalogTtlMs()).toBe(3_600_000);
  });

  it("reuses fresh cache without a second fetch", async () => {
    await ensureCatalog("indep");
    await ensureCatalog("indep");

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("refreshes stale cache after TTL", async () => {
    jest.useFakeTimers();
    const fetchMock = mockApiFetch();
    global.fetch = fetchMock;

    await ensureCatalog("indep");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(60_001);
    await ensureCatalog("indep");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  });

  it("keeps stale api cache when refresh fails", async () => {
    jest.useFakeTimers();
    const fetchMock = mockApiFetch();
    global.fetch = fetchMock;

    const first = await ensureCatalog("indep");
    const firstLoadedAt = first.loadedAt;

    jest.advanceTimersByTime(60_001);
    fetchMock.mockRejectedValueOnce(new Error("network down"));

    const second = await ensureCatalog("indep");

    expect(second.source).toBe("api");
    expect(second.items).toEqual(first.items);
    expect(second.loadedAt).toBe(firstLoadedAt);
    expect(getCatalog("indep")?.loadedAt).toBe(firstLoadedAt);

    jest.useRealTimers();
  });
});
