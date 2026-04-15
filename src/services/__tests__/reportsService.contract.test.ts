import { reportsService } from "../reportsService";

jest.mock("../api", () => {
  class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
      super(message);
      this.status = status;
      this.name = "ApiError";
    }
  }

  return {
    ApiError,
    api: {
      get: jest.fn(),
    },
  };
});

jest.mock("../../data/reports", () => ({
  reports: [{ id: "r1", title: "Mock report" }],
  getReportById: jest.fn((id: string) => (id === "r1" ? { id: "r1", title: "Mock report" } : null)),
}));

const { api } = jest.requireMock("../api") as {
  api: { get: jest.Mock };
};

const MockApiError = (jest.requireMock("../api") as { ApiError: new (status: number, message: string) => Error })
  .ApiError;

function createApiReport(overrides?: Partial<Record<string, unknown>>) {
  return {
    id: "api-r1",
    price: "1 200 000",
    title: "API report",
    subtitle: "xDrive",
    city: "Moscow",
    imageUrl: "https://example.com/main.jpg",
    carouselImages: ["https://example.com/1.jpg"],
    photosCountText: "1 фото",
    defects: {
      schemeImageUrl: "https://example.com/scheme.jpg",
      photoImageUrls: ["https://example.com/d1.jpg"],
      summaryText: "Без дефектов",
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
    ...(overrides ?? {}),
  };
}

describe("reportsService contract", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.EXPO_PUBLIC_REPORTS_SOURCE;
  });

  it("returns purchased reports from mock source by default", async () => {
    const result = await reportsService.getPurchasedReports();

    expect(result).toEqual([{ id: "r1", title: "Mock report" }]);
  });

  it("returns mapped purchased reports in api mode", async () => {
    process.env.EXPO_PUBLIC_REPORTS_SOURCE = "api";
    const apiReports = [createApiReport()];
    api.get.mockResolvedValue(apiReports);

    const result = await reportsService.getPurchasedReports();

    expect(api.get).toHaveBeenCalledWith("/reports/purchased");
    expect(result).toMatchObject([
      {
        id: "api-r1",
        title: "API report",
        imageUrl: { uri: "https://example.com/main.jpg" },
      },
    ]);
  });

  it("maps 500 to user-friendly Error in api mode", async () => {
    process.env.EXPO_PUBLIC_REPORTS_SOURCE = "api";
    api.get.mockRejectedValue(new MockApiError(500, "Server Error"));

    await expect(reportsService.getPurchasedReports()).rejects.toMatchObject({
      message: "Сервис отчётов временно недоступен. Попробуйте позже.",
    });
  });

  it("returns duplicate-check reports shape in api mode", async () => {
    process.env.EXPO_PUBLIC_REPORTS_SOURCE = "api";
    const duplicateCheckReports = [createApiReport({ id: "api-r2", title: "Duplicate candidate" })];
    api.get.mockResolvedValue(duplicateCheckReports);

    const result = await reportsService.getReportsForDuplicateCheck();

    expect(api.get).toHaveBeenCalledWith("/reports/purchased");
    expect(result).toMatchObject([
      {
        id: "api-r2",
        title: "Duplicate candidate",
        imageUrl: { uri: "https://example.com/main.jpg" },
      },
    ]);
  });

  it("throws explicit not-found message for mock getReportById", async () => {
    await expect(reportsService.getReportById("missing")).rejects.toMatchObject({
      message: "Отчёт не найден.",
    });
  });
});

