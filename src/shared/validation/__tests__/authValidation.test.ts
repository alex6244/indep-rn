import {
  getPasswordStrength,
  isEmailValid,
  normalizeEmail,
} from "../authValidation";

describe("normalizeEmail", () => {
  it("trims whitespace and lowercases", () => {
    expect(normalizeEmail("  User@Example.COM  ")).toBe("user@example.com");
  });

  it("returns empty string unchanged", () => {
    expect(normalizeEmail("")).toBe("");
  });
});

describe("isEmailValid", () => {
  it("accepts valid emails", () => {
    expect(isEmailValid("user@example.com")).toBe(true);
    expect(isEmailValid("user+tag@sub.domain.org")).toBe(true);
    expect(isEmailValid("u@b.co")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(isEmailValid("")).toBe(false);
    expect(isEmailValid("notanemail")).toBe(false);
    expect(isEmailValid("missing@tld")).toBe(false);
    expect(isEmailValid("@nodomain.com")).toBe(false);
    expect(isEmailValid("spaces in@email.com")).toBe(false);
  });
});

describe("getPasswordStrength", () => {
  it("returns score 0 and isStrongEnough=false for empty password", () => {
    const result = getPasswordStrength("");
    expect(result.score).toBe(0);
    expect(result.isStrongEnough).toBe(false);
    expect(result.feedback).toBe("Введите пароль.");
  });

  it("returns isStrongEnough=false for weak password", () => {
    const result = getPasswordStrength("123456");
    expect(result.score).toBeLessThan(3);
    expect(result.isStrongEnough).toBe(false);
    expect(typeof result.feedback).toBe("string");
    expect(result.feedback!.length).toBeGreaterThan(0);
  });

  it("returns isStrongEnough=false for common dictionary word", () => {
    const result = getPasswordStrength("password");
    expect(result.isStrongEnough).toBe(false);
  });

  it("returns isStrongEnough=true for strong password", () => {
    const result = getPasswordStrength("correct-horse-battery-staple-42!");
    expect(result.score).toBeGreaterThanOrEqual(3);
    expect(result.isStrongEnough).toBe(true);
    expect(result.feedback).toBeUndefined();
  });

  it("returns isStrongEnough=true for complex random-looking password", () => {
    const result = getPasswordStrength("X7#mK!p9qZ@w");
    expect(result.isStrongEnough).toBe(true);
  });

  it("penalises password matching userInputs (name/email)", () => {
    const name = "Ivan";
    const email = "ivan@example.com";
    const withoutInputs = getPasswordStrength("Ivan2024");
    const withInputs = getPasswordStrength("Ivan2024", [name, email]);
    expect(withInputs.score).toBeLessThanOrEqual(withoutInputs.score);
  });

  it("returns no feedback when password is strong enough", () => {
    const result = getPasswordStrength("Tr0ub4dor&3-extra");
    expect(result.isStrongEnough).toBe(true);
    expect(result.feedback).toBeUndefined();
  });
});
