import {
  indexToYearText,
  YEAR_MAX,
  YEAR_MIN,
  YEAR_VALUES,
  yearTextToIndex,
} from "../yearPickerUtils";

describe("yearPickerUtils", () => {
  it("lists years descending from max to min", () => {
    expect(YEAR_VALUES[0]).toBe(YEAR_MAX);
    expect(YEAR_VALUES[YEAR_VALUES.length - 1]).toBe(YEAR_MIN);
    expect(YEAR_VALUES.length).toBe(YEAR_MAX - YEAR_MIN + 1);
  });

  it("maps year text to index and back", () => {
    const idx = yearTextToIndex(String(YEAR_MAX - 5));
    expect(indexToYearText(idx)).toBe(String(YEAR_MAX - 5));
  });

  it("defaults empty year to newest", () => {
    expect(yearTextToIndex("")).toBe(0);
    expect(indexToYearText(0)).toBe(String(YEAR_MAX));
  });
});
