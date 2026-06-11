import { Hono } from "hono";

jest.mock("../../catalog/catalogStore.js", () => ({
  ensureCatalog: jest.fn(),
  getCatalog: jest.fn(),
  getSite: jest.fn(() => undefined),
}));

import { v1 } from "../v1";

const app = new Hono();
app.route("/v1", v1);

describe("v1 error responses", () => {
  it("returns structured error for unknown site meta", async () => {
    const res = await app.request("/v1/sites/unknown-site/meta");
    expect(res.status).toBe(404);

    const body = (await res.json()) as { error: { code: string; message: string } };
    expect(body.error).toEqual({
      code: "site_not_found",
      message: "Site not found",
    });
  });

  it("returns structured error for invalid chat body", async () => {
    const res = await app.request("/v1/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId: "indep" }),
    });
    expect(res.status).toBe(400);

    const body = (await res.json()) as { error: { code: string; message: string } };
    expect(body.error.code).toBe("invalid_body");
    expect(typeof body.error.message).toBe("string");
  });

  it("returns 401 for chat without bearer when auth is required", async () => {
    process.env.AI_API_AUTH_REQUIRED = "true";
    process.env.AI_API_AUTH_ME_URL = "https://example.com/me";

    const res = await app.request("/v1/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId: "indep", message: "kia" }),
    });
    expect(res.status).toBe(401);

    const body = (await res.json()) as { error: { code: string; message: string } };
    expect(body.error.code).toBe("unauthorized");

    delete process.env.AI_API_AUTH_REQUIRED;
    delete process.env.AI_API_AUTH_ME_URL;
  });
});
