import {
  extractBearerToken,
  isAuthRequired,
  validateTokenWithMe,
} from "../requireUserAuth.js";

describe("requireUserAuth helpers", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.AI_API_AUTH_REQUIRED;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("extractBearerToken parses Authorization header", () => {
    expect(extractBearerToken("Bearer abc.def")).toBe("abc.def");
    expect(extractBearerToken("Basic x")).toBeNull();
    expect(extractBearerToken(undefined)).toBeNull();
  });

  it("isAuthRequired defaults to false outside production", () => {
    process.env.NODE_ENV = "test";
    expect(isAuthRequired()).toBe(false);
  });

  it("isAuthRequired respects AI_API_AUTH_REQUIRED=true", () => {
    process.env.AI_API_AUTH_REQUIRED = "true";
    expect(isAuthRequired()).toBe(true);
  });

  it("validateTokenWithMe returns true on HTTP 200", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: true });
    await expect(
      validateTokenWithMe("https://example.com/me", "token", fetchImpl),
    ).resolves.toBe(true);
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://example.com/me",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer token",
        }),
      }),
    );
  });

  it("validateTokenWithMe returns false on HTTP 401", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: false, status: 401 });
    await expect(
      validateTokenWithMe("https://example.com/me", "token", fetchImpl),
    ).resolves.toBe(false);
  });
});
