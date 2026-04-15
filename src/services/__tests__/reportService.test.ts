import { reportService } from "../reportService";

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
      post: jest.fn(),
      get: jest.fn(),
    },
  };
});

const { api, ApiError } = jest.requireMock("../api") as {
  ApiError: new (status: number, message: string) => Error;
  api: {
    post: jest.Mock;
    get: jest.Mock;
  };
};

describe("reportService contract", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_REPORTS_SOURCE = "api";
  });

  it("submit returns SubmittedReport shape in api mode", async () => {
    const payload = {
      id: "rep-1",
      carId: "car-1",
      pickerId: "picker-1",
      status: "pending",
      createdAt: "2026-04-14T10:00:00.000Z",
      data: { mileage: "100000" },
    };
    api.post.mockResolvedValue(payload);

    const result = await reportService.submit(payload.data as never);

    expect(api.post).toHaveBeenCalledWith("/reports", payload.data);
    expect(result).toEqual(payload);
  });

  it("getSubmittedById resolves from submitted reports collection in api mode", async () => {
    const payload = [
      {
        id: "rep-2",
        carId: "car-2",
        pickerId: "picker-2",
        status: "completed",
        createdAt: "2026-04-14T11:00:00.000Z",
        data: { mileage: "120000" },
      },
      {
        id: "rep-2-extra",
        carId: "car-2-extra",
        pickerId: "picker-2-extra",
        status: "pending",
        createdAt: "2026-04-14T11:05:00.000Z",
        data: { mileage: "121000" },
      },
    ];
    api.get.mockResolvedValue(payload);

    const result = await reportService.getSubmittedById("rep-2");

    expect(api.get).toHaveBeenCalledWith("/reports/my");
    expect(result).toEqual(payload[0]);
  });

  it("getMy returns array shape in api mode", async () => {
    const payload = [
      {
        id: "rep-3",
        carId: "car-3",
        pickerId: "picker-3",
        status: "draft",
        createdAt: "2026-04-14T12:00:00.000Z",
        data: { mileage: "140000" },
      },
    ];
    api.get.mockResolvedValue(payload);

    const result = await reportService.getMy();

    expect(api.get).toHaveBeenCalledWith("/reports/my");
    expect(result).toEqual(payload);
  });

  it("maps 401 to user-friendly Error message", async () => {
    api.get.mockRejectedValue(new ApiError(401, "Unauthorized"));

    await expect(reportService.getMy()).rejects.toMatchObject({
      message: "Сессия истекла. Войдите снова.",
    });
  });

  it("maps network error (status 0) to user-friendly Error message", async () => {
    api.post.mockRejectedValue(new ApiError(0, "Network request failed"));

    await expect(reportService.submit({} as never)).rejects.toMatchObject({
      message: "Проблема с сетью. Проверьте подключение и попробуйте ещё раз.",
    });
  });

  it("maps 500 to user-friendly Error message", async () => {
    api.get.mockRejectedValue(new ApiError(500, "Server Error"));

    await expect(reportService.getMy()).rejects.toMatchObject({
      message: "Сервис отчётов временно недоступен. Попробуйте позже.",
    });
  });

  it("uses mock mode without calling api", async () => {
    process.env.EXPO_PUBLIC_REPORTS_SOURCE = "mock";
    const nowSpy = jest.spyOn(Date, "now").mockReturnValue(1710000000000);
    const draft = {
      media: { salonPhoto: false, bodyPhoto: true, salonVideo: false, bodyVideo: false },
      generalInfo: {},
      pts: {
        vin: "VINMOCK123",
        brand: "Mock",
        model: "Model",
        year: "2022",
        color: "Black",
        engineVolume: "2.0",
        ptsType: "original",
        hasElectronicPts: true,
      },
      mileage: "12345",
      owners: [],
      legalCleanliness: { pledge: true, registrationRestrictions: true, wanted: true },
      commercialUsage: { taxiPermission: true, carSharing: true, leasing: true },
      defects: { mode: "scheme", damages: [{ id: "d1", description: "" }], activeDamageId: "d1" },
    };

    const submitted = await reportService.submit(draft as never);
    const list = await reportService.getMy();
    const byId = await reportService.getSubmittedById(submitted.id);

    expect(api.post).not.toHaveBeenCalled();
    expect(api.get).not.toHaveBeenCalled();
    expect(submitted).toMatchObject({
      id: "mock_submitted_1710000000000",
      status: "pending",
      data: draft,
    });
    expect(list.some((x) => x.id === submitted.id)).toBe(true);
    expect(byId.id).toBe(submitted.id);
    nowSpy.mockRestore();
  });

  it("throws not-found error in mock mode for unknown id", async () => {
    process.env.EXPO_PUBLIC_REPORTS_SOURCE = "mock";

    await expect(reportService.getSubmittedById("missing-id")).rejects.toMatchObject({
      message: "Отчёт не найден.",
    });
  });

  it("keeps deprecated getById alias for backward compatibility", async () => {
    const payload = [
      {
        id: "rep-legacy",
        carId: "car-legacy",
        pickerId: "picker-legacy",
        status: "pending",
        createdAt: "2026-04-14T13:00:00.000Z",
        data: { mileage: "150000" },
      },
    ];
    api.get.mockResolvedValue(payload);

    const result = await reportService.getById("rep-legacy");

    expect(api.get).toHaveBeenCalledWith("/reports/my");
    expect(result).toEqual(payload[0]);
  });
});

