import { Hono } from "hono";

const mockRefreshCatalog = jest.fn();

jest.mock("../../catalog/catalogStore.js", () => ({
  ensureCatalog: jest.fn(),
  getCatalog: jest.fn(),
  getSite: jest.fn((siteId: string) =>
    siteId === "indep"
      ? {
          siteId: "indep",
          displayName: "Indep",
          mode: "multibrand",
          allowOrder: true,
          catalogBannersUrl: "https://example.com/banners",
          locale: "ru",
          disclaimer: "test",
        }
      : undefined,
  ),
  refreshCatalog: (...args: unknown[]) => mockRefreshCatalog(...args),
  catalogObservabilityFields: (catalog: { loadedAt: number }) => ({
    catalogLoadedAt: new Date(catalog.loadedAt).toISOString(),
    catalogAgeSec: 0,
  }),
}));

import { v1 } from "../v1";

const app = new Hono();
app.route("/v1", v1);

describe("v1 admin catalog refresh", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NODE_ENV: "development",
      AI_API_DEV_LEADS: "true",
      AI_API_DEV_KEY: "test-dev-key",
    };
    mockRefreshCatalog.mockReset();
    mockRefreshCatalog.mockResolvedValue({
      items: [{ id: "1" }],
      source: "api",
      loadedAt: Date.now(),
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns 403 without dev key", async () => {
    const res = await app.request("/v1/admin/catalog/indep/refresh", {
      method: "POST",
    });
    expect(res.status).toBe(403);
  });

  it("refreshes catalog with valid dev key", async () => {
    const res = await app.request("/v1/admin/catalog/indep/refresh", {
      method: "POST",
      headers: { "X-Dev-Key": "test-dev-key" },
    });

    expect(res.status).toBe(200);
    expect(mockRefreshCatalog).toHaveBeenCalledWith("indep");

    const body = (await res.json()) as {
      catalogCount: number;
      catalogSource: string;
      catalogLoadedAt: string;
      catalogAgeSec: number;
    };
    expect(body.catalogCount).toBe(1);
    expect(body.catalogSource).toBe("api");
    expect(typeof body.catalogLoadedAt).toBe("string");
    expect(body.catalogAgeSec).toBe(0);
  });
});
