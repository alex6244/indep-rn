import {
  DD_MM_YYYY_MAX_LENGTH,
  compareDdMmYyyy,
  formatDdMmYyyyInput,
  isEndDateOnOrAfterStart,
  isValidDdMmYyyy,
  validateAllOwnersDates,
  validateOwnerDates,
} from "../formatDdMmYyyy";

describe("formatDdMmYyyyInput", () => {
  it("keeps partial digits without dots", () => {
    expect(formatDdMmYyyyInput("1")).toBe("1");
    expect(formatDdMmYyyyInput("12")).toBe("12");
  });

  it("inserts dots after day and month", () => {
    expect(formatDdMmYyyyInput("123")).toBe("12.3");
    expect(formatDdMmYyyyInput("1234")).toBe("12.34");
    expect(formatDdMmYyyyInput("12345678")).toBe("12.34.5678");
  });

  it("strips non-digits and caps at 8 digits", () => {
    expect(formatDdMmYyyyInput("ab12cd34ef56789012")).toBe("12.34.5678");
  });

  it("exposes expected max masked length", () => {
    expect(DD_MM_YYYY_MAX_LENGTH).toBe(10);
    expect(formatDdMmYyyyInput("31122024").length).toBe(DD_MM_YYYY_MAX_LENGTH);
  });
});

describe("isValidDdMmYyyy", () => {
  it("accepts real dates", () => {
    expect(isValidDdMmYyyy("01.01.2020")).toBe(true);
    expect(isValidDdMmYyyy("29.02.2024")).toBe(true);
    expect(isValidDdMmYyyy("31.12.1999")).toBe(true);
  });

  it("rejects impossible dates and bad format", () => {
    expect(isValidDdMmYyyy("31.02.2024")).toBe(false);
    expect(isValidDdMmYyyy("32.01.2024")).toBe(false);
    expect(isValidDdMmYyyy("00.00.0000")).toBe(false);
    expect(isValidDdMmYyyy("1.2.2024")).toBe(false);
    expect(isValidDdMmYyyy("12.34")).toBe(false);
  });

  it("rejects years outside ownership range", () => {
    expect(isValidDdMmYyyy("01.01.1899")).toBe(false);
    expect(isValidDdMmYyyy("01.01.2101")).toBe(false);
  });
});

describe("compareDdMmYyyy and isEndDateOnOrAfterStart", () => {
  it("orders valid dates", () => {
    expect(compareDdMmYyyy("01.01.2020", "02.01.2020")).toBe(-1);
    expect(compareDdMmYyyy("02.01.2020", "02.01.2020")).toBe(0);
    expect(compareDdMmYyyy("03.01.2020", "02.01.2020")).toBe(1);
  });

  it("returns null for invalid operands", () => {
    expect(compareDdMmYyyy("31.02.2024", "01.01.2020")).toBeNull();
  });

  it("checks end is not before start", () => {
    expect(isEndDateOnOrAfterStart("01.06.2020", "01.06.2020")).toBe(true);
    expect(isEndDateOnOrAfterStart("01.06.2020", "02.06.2020")).toBe(true);
    expect(isEndDateOnOrAfterStart("10.06.2020", "01.06.2020")).toBe(false);
  });
});

describe("validateOwnerDates", () => {
  it("requires both dates", () => {
    expect(validateOwnerDates({ startDate: "", endDate: "" })?.field).toBe("startDate");
    expect(validateOwnerDates({ startDate: "01.01.2020", endDate: "" })?.field).toBe(
      "endDate",
    );
  });

  it("rejects invalid calendar values", () => {
    expect(
      validateOwnerDates({ startDate: "31.02.2020", endDate: "01.03.2020" })?.field,
    ).toBe("startDate");
  });

  it("rejects end before start", () => {
    expect(
      validateOwnerDates({ startDate: "10.06.2020", endDate: "01.06.2020" })?.message,
    ).toMatch(/раньше/);
  });

  it("passes valid range", () => {
    expect(
      validateOwnerDates({ startDate: "01.06.2018", endDate: "15.09.2023" }),
    ).toBeNull();
  });
});

describe("validateAllOwnersDates", () => {
  it("returns first failing owner", () => {
    expect(
      validateAllOwnersDates([
        { startDate: "01.01.2020", endDate: "02.01.2020" },
        { startDate: "10.01.2020", endDate: "01.01.2020" },
      ])?.field,
    ).toBe("endDate");
  });
});
