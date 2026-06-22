import { describe, expect, it } from "@jest/globals";
import { buildReportPdfHtml } from "../reportPdfService";
import type { Report } from "../../types/report";

function minimalReport(overrides: Partial<Report> = {}): Report {
  return {
    id: "1",
    title: "Test Car",
    subtitle: "Sub",
    bodyTypeText: "Седан",
    yearText: "2024",
    price: "1 000 000 ₽",
    mileageText: "10 000 км",
    owners: {
      jur: { title: "Юр.", value: "0" },
      phys: { title: "Физ.", value: "1" },
    },
    legalCleanliness: {
      badgeText: "Чисто",
      items: [{ text: "Ок", tone: "ok" }],
    },
    commercialUsage: {
      badgeText: "Не использовался",
      items: [{ text: "Ок", tone: "ok" }],
    },
    costEstimation: {
      text: "Оценка",
      rangeText: "900 000 – 1 100 000 ₽",
    },
    penalties: [],
    ...overrides,
  };
}

describe("buildReportPdfHtml", () => {
  it("escapes malicious title so raw tags do not appear in HTML", () => {
    const html = buildReportPdfHtml(
      minimalReport({ title: '<img src=x onerror="alert(1)">' }),
    );

    expect(html).toContain("&lt;img src=x onerror=");
    expect(html).not.toContain('<img src=x onerror="alert(1)">');
  });

  it("escapes penalty description text", () => {
    const html = buildReportPdfHtml(
      minimalReport({
        penalties: [
          {
            amountText: "5000 ₽",
            dateText: "01.01.2024",
            descriptionText: "</div><div>INJECTED",
          },
        ],
      }),
    );

    expect(html).toContain("&lt;/div&gt;&lt;div&gt;INJECTED");
    expect(html).not.toContain("</div><div>INJECTED");
  });
});
