import { mapApiReportToReport, type ApiReport } from "../reportsService";

function buildSampleApiReport(): ApiReport {
  return {
    id: "r1",
    price: "1 200 000",
    title: "BMW 3",
    subtitle: "xDrive",
    city: "Moscow",
    imageUrl: "https://example.com/main.jpg",
    carouselImages: ["https://example.com/1.jpg"],
    photosCountText: "1 фото",
    defects: {
      schemeImageUrl: "https://example.com/scheme.jpg",
      photoImageUrls: ["https://example.com/d1.jpg"],
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
    const apiReport = buildSampleApiReport();

    const result = mapApiReportToReport(apiReport);

    expect(result).toMatchObject({
      ...apiReport,
      imageUrl: { uri: "https://example.com/main.jpg" },
      carouselImages: [{ uri: "https://example.com/1.jpg" }],
      defects: {
        ...apiReport.defects,
        schemeImageUrl: { uri: "https://example.com/scheme.jpg" },
        photoImageUrls: [{ uri: "https://example.com/d1.jpg" }],
      },
    });
    expect(result).not.toBe(apiReport);
  });
});

