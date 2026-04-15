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
    const apiReports = [{ id: "api-r1", title: "API report" }];
    api.get.mockResolvedValue(apiReports);

    const result = await reportsService.getPurchasedReports();

    expect(api.get).toHaveBeenCalledWith("/reports/purchased");
    expect(result).toEqual(apiReports);
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
    const duplicateCheckReports = [{ id: "api-r2", title: "Duplicate candidate" }];
    api.get.mockResolvedValue(duplicateCheckReports);

    const result = await reportsService.getReportsForDuplicateCheck();

    expect(api.get).toHaveBeenCalledWith("/reports/purchased");
    expect(result).toEqual(duplicateCheckReports);
  });

  it("throws explicit not-found message for mock getReportById", async () => {
    await expect(reportsService.getReportById("missing")).rejects.toMatchObject({
      message: "Отчёт не найден.",
    });
  });
});

