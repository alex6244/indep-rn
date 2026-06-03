import {
  checkRateLimit,
  getClientIp,
  resetRateLimitStoreForTests,
} from "../rateLimit";

describe("getClientIp", () => {
  it("uses first x-forwarded-for address", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.1, 10.0.0.1",
    });
    expect(getClientIp(headers)).toBe("203.0.113.1");
  });

  it("falls back to x-real-ip", () => {
    const headers = new Headers({ "x-real-ip": "198.51.100.2" });
    expect(getClientIp(headers)).toBe("198.51.100.2");
  });

  it("returns unknown when no proxy headers", () => {
    expect(getClientIp(new Headers())).toBe("unknown");
  });
});

describe("checkRateLimit", () => {
  const baseNow = 1_700_000_000_000;

  beforeEach(() => {
    resetRateLimitStoreForTests();
    process.env.AI_API_RATE_CHAT_PER_MIN = "3";
    process.env.AI_API_RATE_LIMIT_ENABLED = "true";
  });

  afterEach(() => {
    delete process.env.AI_API_RATE_CHAT_PER_MIN;
    delete process.env.AI_API_RATE_LIMIT_ENABLED;
    resetRateLimitStoreForTests();
  });

  it("allows requests under the limit", () => {
    expect(checkRateLimit("chat", "1.2.3.4", baseNow).allowed).toBe(true);
    expect(checkRateLimit("chat", "1.2.3.4", baseNow + 1).allowed).toBe(true);
    expect(checkRateLimit("chat", "1.2.3.4", baseNow + 2).allowed).toBe(true);
  });

  it("returns 429 after limit exceeded in the same window", () => {
    checkRateLimit("chat", "1.2.3.4", baseNow);
    checkRateLimit("chat", "1.2.3.4", baseNow + 1);
    checkRateLimit("chat", "1.2.3.4", baseNow + 2);

    const blocked = checkRateLimit("chat", "1.2.3.4", baseNow + 3);
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.retryAfterSec).toBeGreaterThan(0);
    }
  });

  it("resets count after the window", () => {
    checkRateLimit("chat", "1.2.3.4", baseNow);
    checkRateLimit("chat", "1.2.3.4", baseNow + 1);
    checkRateLimit("chat", "1.2.3.4", baseNow + 2);
    expect(checkRateLimit("chat", "1.2.3.4", baseNow + 3).allowed).toBe(false);

    expect(checkRateLimit("chat", "1.2.3.4", baseNow + 60_001).allowed).toBe(
      true,
    );
  });

  it("tracks IPs independently", () => {
    process.env.AI_API_RATE_CHAT_PER_MIN = "1";
    expect(checkRateLimit("chat", "a", baseNow).allowed).toBe(true);
    expect(checkRateLimit("chat", "b", baseNow).allowed).toBe(true);
    expect(checkRateLimit("chat", "a", baseNow + 1).allowed).toBe(false);
    expect(checkRateLimit("chat", "b", baseNow + 1).allowed).toBe(false);
  });
});
