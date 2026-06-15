import {
  extractBearerToken,
  isAuthRequired,
  isMockAuthAllowed,
  isMockDevToken,
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

  it("isMockDevToken matches app mock bearer format", () => {
    expect(isMockDevToken("mock_client_1_1718123456789")).toBe(true);
    expect(isMockDevToken("eyJhbGciOiJIUzI1NiJ9")).toBe(false);
  });

  it("isMockAuthAllowed is false by default", () => {
    delete process.env.AI_API_ALLOW_MOCK_AUTH;
    expect(isMockAuthAllowed()).toBe(false);
  });
});
