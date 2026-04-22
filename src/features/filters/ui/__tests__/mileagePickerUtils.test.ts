import {
  clampMileage,
  filterTextToIndex,
  formatMileageRange,
  formatMileageRu,
  MILEAGE_MAX,
  MILEAGE_MIN,
  MILEAGE_STEP,
  MILEAGE_VALUES,
  mileageFromDigitString,
  mileageToFilterString,
  normalizeMileageText,
  valueToNearestIndex,
} from "../mileagePickerUtils";

describe("MILEAGE_VALUES", () => {
  it("starts at MILEAGE_MIN", () => {
    expect(MILEAGE_VALUES[0]).toBe(MILEAGE_MIN);
  });

  it("ends at MILEAGE_MAX", () => {
    expect(MILEAGE_VALUES[MILEAGE_VALUES.length - 1]).toBe(MILEAGE_MAX);
  });

  it("has correct step between consecutive items", () => {
    expect(MILEAGE_VALUES[1] - MILEAGE_VALUES[0]).toBe(MILEAGE_STEP);
    expect(MILEAGE_VALUES[2] - MILEAGE_VALUES[1]).toBe(MILEAGE_STEP);
  });

  it("has length = MILEAGE_MAX / MILEAGE_STEP + 1", () => {
    expect(MILEAGE_VALUES.length).toBe(MILEAGE_MAX / MILEAGE_STEP + 1);
  });
});

describe("clampMileage", () => {
  it("clamps values below min to MILEAGE_MIN", () => {
    expect(clampMileage(-1)).toBe(MILEAGE_MIN);
    expect(clampMileage(-999_999)).toBe(MILEAGE_MIN);
  });

  it("clamps values above max to MILEAGE_MAX", () => {
    expect(clampMileage(MILEAGE_MAX + 1)).toBe(MILEAGE_MAX);
    expect(clampMileage(9_999_999)).toBe(MILEAGE_MAX);
  });

  it("passes through values within range", () => {
    expect(clampMileage(0)).toBe(0);
    expect(clampMileage(50_000)).toBe(50_000);
    expect(clampMileage(MILEAGE_MAX)).toBe(MILEAGE_MAX);
  });

  it("returns MILEAGE_MIN for NaN and Infinity", () => {
    expect(clampMileage(NaN)).toBe(MILEAGE_MIN);
    expect(clampMileage(Infinity)).toBe(MILEAGE_MIN);
    expect(clampMileage(-Infinity)).toBe(MILEAGE_MIN);
  });

  it("rounds fractional values", () => {
    expect(clampMileage(1.6)).toBe(2);
    expect(clampMileage(1.4)).toBe(1);
  });
});

describe("valueToNearestIndex", () => {
  it("maps 0 to index 0", () => {
    expect(valueToNearestIndex(0)).toBe(0);
  });

  it("maps MILEAGE_MAX to last index", () => {
    expect(valueToNearestIndex(MILEAGE_MAX)).toBe(MILEAGE_VALUES.length - 1);
  });

  it("snaps to nearest step (round down)", () => {
    // 52 000 / 5 000 = 10.4 → round to 10
    expect(valueToNearestIndex(52_000)).toBe(10);
  });

  it("snaps to nearest step (round up)", () => {
    // 53 000 / 5 000 = 10.6 → round to 11
    expect(valueToNearestIndex(53_000)).toBe(11);
  });

  it("clamps out-of-range values", () => {
    expect(valueToNearestIndex(-5_000)).toBe(0);
    expect(valueToNearestIndex(2_000_000)).toBe(MILEAGE_VALUES.length - 1);
  });

  it("correctly maps exact multiples of MILEAGE_STEP", () => {
    expect(valueToNearestIndex(MILEAGE_STEP)).toBe(1);
    expect(valueToNearestIndex(MILEAGE_STEP * 10)).toBe(10);
  });
});

describe("filterTextToIndex", () => {
  it("returns index 0 when text is empty and default is MILEAGE_MIN", () => {
    expect(filterTextToIndex("", MILEAGE_MIN)).toBe(0);
  });

  it("returns last index when text is empty and default is MILEAGE_MAX", () => {
    expect(filterTextToIndex("", MILEAGE_MAX)).toBe(MILEAGE_VALUES.length - 1);
  });

  it("parses a digit string and finds the nearest index", () => {
    // "50000" → km=50000, index=10
    expect(filterTextToIndex("50000", MILEAGE_MIN)).toBe(10);
  });

  it("strips non-digit characters before parsing", () => {
    expect(filterTextToIndex("50 000", MILEAGE_MIN)).toBe(10);
  });
});

describe("from ≤ to constraint logic", () => {
  it("pulling from past to corrects to = from", () => {
    let fromIdx = 10;
    let toIdx = 5;
    // Simulates handleFromChange: setToIdx(prev => Math.max(prev, fromIdx))
    toIdx = Math.max(toIdx, fromIdx);
    expect(fromIdx).toBeLessThanOrEqual(toIdx);
    expect(toIdx).toBe(10);
  });

  it("pulling to below from corrects from = to", () => {
    let fromIdx = 15;
    let toIdx = 8;
    // Simulates handleToChange: setFromIdx(prev => Math.min(prev, toIdx))
    fromIdx = Math.min(fromIdx, toIdx);
    expect(fromIdx).toBeLessThanOrEqual(toIdx);
    expect(fromIdx).toBe(8);
  });

  it("equal from and to is valid", () => {
    const fromIdx = 10;
    const toIdx = 10;
    expect(fromIdx).toBeLessThanOrEqual(toIdx);
  });
});

describe("apply produces correct filter strings", () => {
  it("fromIdx=0 → empty from string (no lower constraint)", () => {
    const fromVal = MILEAGE_VALUES[0];
    const fromText = fromVal === MILEAGE_MIN ? "" : mileageToFilterString(fromVal);
    expect(fromText).toBe("");
  });

  it("toIdx=last → empty to string (no upper constraint)", () => {
    const toVal = MILEAGE_VALUES[MILEAGE_VALUES.length - 1];
    const toText = toVal === MILEAGE_MAX ? "" : mileageToFilterString(toVal);
    expect(toText).toBe("");
  });

  it("non-default indices produce numeric strings", () => {
    const fromVal = MILEAGE_VALUES[10]; // 50 000
    const toVal = MILEAGE_VALUES[30];   // 150 000
    const fromText = fromVal === MILEAGE_MIN ? "" : mileageToFilterString(fromVal);
    const toText = toVal === MILEAGE_MAX ? "" : mileageToFilterString(toVal);
    expect(fromText).toBe("50000");
    expect(toText).toBe("150000");
  });
});

describe("mileageFromDigitString", () => {
  it("returns whenEmpty when text is empty", () => {
    expect(mileageFromDigitString("", 0)).toBe(0);
    expect(mileageFromDigitString("", MILEAGE_MAX)).toBe(MILEAGE_MAX);
  });

  it("strips non-digit chars", () => {
    expect(mileageFromDigitString("50 000", 0)).toBe(50_000);
  });

  it("clamps to range", () => {
    expect(mileageFromDigitString("9999999", 0)).toBe(MILEAGE_MAX);
  });
});

describe("normalizeMileageText", () => {
  it("returns empty string for empty input", () => {
    expect(normalizeMileageText("")).toBe("");
  });

  it("strips non-digits and clamps", () => {
    expect(normalizeMileageText("50 000")).toBe("50000");
    expect(normalizeMileageText("abc")).toBe("");
  });
});

describe("formatMileageRu", () => {
  it("formats zero as '0'", () => {
    expect(formatMileageRu(0)).toBe("0");
  });

  it("formats thousands with separator", () => {
    // ru-RU uses thin space (U+202F) or regular space depending on env
    const result = formatMileageRu(50_000);
    expect(result.replace(/\s/g, " ")).toBe("50 000");
  });
});

describe("formatMileageRange", () => {
  it("returns 'Любой пробег' when both are empty", () => {
    expect(formatMileageRange("", "")).toBe("Любой пробег");
  });

  it("shows 'от X км' when only from is set", () => {
    expect(formatMileageRange("50000", "")).toContain("от");
    expect(formatMileageRange("50000", "")).toContain("км");
  });

  it("shows 'до X км' when only to is set", () => {
    expect(formatMileageRange("", "150000")).toContain("до");
    expect(formatMileageRange("", "150000")).toContain("км");
  });

  it("shows range when both are set", () => {
    const result = formatMileageRange("50000", "150000");
    expect(result).toContain("—");
    expect(result).toContain("км");
  });
});
