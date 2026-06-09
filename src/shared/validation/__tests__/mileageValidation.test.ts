import {
  formatMileageInput,
  parseMileageDigits,
  validateMileage,
} from "../mileageValidation";

describe("formatMileageInput", () => {
  it("formats thousands with spaces", () => {
    expect(formatMileageInput("125000")).toBe("125 000");
  });

  it("strips non-digits", () => {
    expect(formatMileageInput("12a3 45")).toBe("12 345");
  });
});

describe("validateMileage", () => {
  it("accepts valid mileage", () => {
    const result = validateMileage("125 000");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.normalized).toBe("125 000");
    }
  });

  it("rejects empty", () => {
    const result = validateMileage("");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Укажите пробег");
    }
  });

  it("rejects zero", () => {
    expect(validateMileage("0").ok).toBe(false);
  });

  it("rejects over max", () => {
    expect(validateMileage("10000000").ok).toBe(false);
  });
});

describe("parseMileageDigits", () => {
  it("parses formatted value", () => {
    expect(parseMileageDigits("125 000")).toBe(125000);
  });
});
