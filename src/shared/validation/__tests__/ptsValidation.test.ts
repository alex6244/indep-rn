import {
  formatEngineVolumeInput,
  formatVinInput,
  validateEngineVolume,
  validatePtsForm,
  validatePtsFormFields,
  validateVin,
  validateYear,
  YEAR_MAX,
  YEAR_MIN,
} from "../ptsValidation";

const VALID_VIN = "WVWZZZ1JZ3W386752";

describe("formatVinInput", () => {
  it("uppercases and strips invalid chars", () => {
    expect(formatVinInput("  wvwzzz1jz3w386752  ")).toBe("WVWZZZ1JZ3W386752");
  });

  it("removes I O Q", () => {
    expect(formatVinInput("IOQ123")).toBe("123");
  });

  it("limits to 17 chars", () => {
    expect(formatVinInput("A".repeat(20))).toHaveLength(17);
  });
});

describe("validateVin", () => {
  it("accepts valid 17-char VIN", () => {
    const result = validateVin(VALID_VIN);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.normalized).toBe(VALID_VIN);
    }
  });

  it("rejects 16 characters", () => {
    const result = validateVin("WVWZZZ1JZ3W38675");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toMatch(/17/);
    }
  });

  it("rejects empty", () => {
    expect(validateVin("").ok).toBe(false);
  });
});

describe("formatEngineVolumeInput", () => {
  it("formats two digits with dot", () => {
    expect(formatEngineVolumeInput("16")).toBe("1.6");
    expect(formatEngineVolumeInput("20")).toBe("2.0");
  });

  it("keeps single digit while typing", () => {
    expect(formatEngineVolumeInput("2")).toBe("2");
  });

  it("rejects leading zero", () => {
    expect(formatEngineVolumeInput("06")).toBe("");
  });
});

describe("validateEngineVolume", () => {
  it("accepts X.Y format", () => {
    expect(validateEngineVolume("1.6").ok).toBe(true);
    expect(validateEngineVolume("2.0").ok).toBe(true);
  });

  it("rejects incomplete", () => {
    expect(validateEngineVolume("2").ok).toBe(false);
    expect(validateEngineVolume("").ok).toBe(false);
  });
});

describe("validateYear", () => {
  it("accepts year in range", () => {
    const result = validateYear(String(YEAR_MAX));
    expect(result.ok).toBe(true);
  });

  it("rejects year below min", () => {
    expect(validateYear(String(YEAR_MIN - 1)).ok).toBe(false);
  });
});

describe("validatePtsFormFields", () => {
  it("returns all field errors", () => {
    const errors = validatePtsFormFields({
      vin: "",
      year: "",
      engineVolume: "",
    });
    expect(errors).toEqual({
      vin: "Укажите VIN",
      year: "Укажите год выпуска",
      engineVolume: "Укажите объём двигателя",
    });
  });

  it("returns null when valid", () => {
    expect(
      validatePtsFormFields({
        vin: VALID_VIN,
        year: String(YEAR_MAX),
        engineVolume: "1.6",
      }),
    ).toBeNull();
  });
});

describe("validatePtsForm", () => {
  it("returns null for valid PTS", () => {
    expect(
      validatePtsForm({
        vin: VALID_VIN,
        year: String(YEAR_MAX),
        engineVolume: "2.0",
      }),
    ).toBeNull();
  });

  it("returns first error message", () => {
    expect(
      validatePtsForm({
        vin: "",
        year: String(YEAR_MAX),
        engineVolume: "2.0",
      }),
    ).toMatch(/VIN/i);
  });
});
