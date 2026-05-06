import { formatResendCountdown, maskEmail, sanitizeOtpCode } from "../maskEmail";

describe("maskEmail", () => {
  it("masks valid email", () => {
    expect(maskEmail("alex@example.com")).toBe("a***@example.com");
  });

  it("trims input before masking", () => {
    expect(maskEmail("  user@test.org ")).toBe("u***@test.org");
  });

  it("returns fallback for invalid email", () => {
    expect(maskEmail("invalid-email")).toBe("указанный email");
  });
});

describe("sanitizeOtpCode", () => {
  it("keeps only digits and max 6 chars", () => {
    expect(sanitizeOtpCode("12a3-456789")).toBe("123456");
  });
});

describe("formatResendCountdown", () => {
  it("formats seconds to mm:ss", () => {
    expect(formatResendCountdown(59)).toBe("00:59");
    expect(formatResendCountdown(61)).toBe("01:01");
  });
});
