import {
  formatReportsPackageCountLabel,
  formatReportsPackagePrice,
} from "../reportsPackage.data";

describe("reportsPackage.data", () => {
  it("formats report count labels in Russian", () => {
    expect(formatReportsPackageCountLabel(1)).toBe("1 отчёт");
    expect(formatReportsPackageCountLabel(5)).toBe("5 отчётов");
    expect(formatReportsPackageCountLabel(10)).toBe("10 отчётов");
  });

  it("formats price with ruble sign", () => {
    expect(formatReportsPackagePrice(550)).toContain("550");
    expect(formatReportsPackagePrice(550)).toContain("₽");
  });
});
