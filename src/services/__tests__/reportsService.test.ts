import type { Report } from "../../types/report";
import { mapApiReportToReport } from "../reportsService";

function buildSampleReport(): Report {
  const mainImage = { uri: "https://example.com/main.jpg" };
  const carouselImage = { uri: "https://example.com/1.jpg" };
  const schemeImage = { uri: "https://example.com/scheme.jpg" };
  const defectsImage = { uri: "https://example.com/d1.jpg" };

  return {
    id: "r1",
    price: "1 200 000",
    title: "BMW 3",
    subtitle: "xDrive",
    city: "Moscow",
    imageUrl: mainImage,
    carouselImages: [carouselImage],
    photosCountText: "1 фото",
    defects: {
      schemeImageUrl: schemeImage,
      photoImageUrls: [defectsImage],
      summaryText: "Без серьезных дефектов",
    },
    ptsData: [{ label: "VIN", value: "XXX" }],
    mileageText: "80 000 км",
    owners: {
      jur: { title: "Юр", value: "1" },
      phys: { title: "Физ", value: "2" },
    },
    legalCleanliness: {
      badgeText: "ОК",
      items: [{ text: "Залогов нет", tone: "ok" }],
    },
    commercialUsage: {
      badgeText: "ОК",
      items: [{ text: "Не такси", tone: "ok" }],
    },
    penalties: [
      {
        amountText: "0",
        dateText: "01.01.2026",
        descriptionText: "Нет штрафов",
        paid: true,
      },
    ],
    costEstimation: {
      text: "Рыночная стоимость",
      rangeText: "1 100 000 - 1 300 000",
    },
    yearText: "2019",
    bodyTypeText: "Седан",
  };
}

describe("reportsService mapper", () => {
  it("maps api report to domain report", () => {
    const apiReport = buildSampleReport();

    const result = mapApiReportToReport(apiReport);

    expect(result).toEqual(apiReport);
    expect(result).not.toBe(apiReport);
  });
});

