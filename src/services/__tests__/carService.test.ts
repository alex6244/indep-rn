import { carService } from "../carService";

jest.mock("../api", () => {
  class ApiError extends Error {
    status: number;
    code?: string;

    constructor(status: number, message: string, code?: string) {
      super(message);
      this.status = status;
      this.code = code;
      this.name = "ApiError";
    }
  }

  const classifyApiError = (error: unknown): string => {
    if (!(error instanceof ApiError)) return "unknown";
    if (error.code) return error.code;
    if (error.status === 401) return "unauthorized";
    if (error.status === 404) return "not_found";
    if (error.status >= 500) return "server_error";
    if (error.status === 0) return "network";
    return "unknown";
  };

  return {
    ApiError,
    classifyApiError,
    api: {
      get: jest.fn(),
    },
  };
});

jest.mock("../../data/cars", () => ({
  cars: [
    { id: "car-1", brand: "BMW", bodyType: "sedan", price: 1500000 },
    { id: "car-2", brand: "Audi", bodyType: "suv", price: 2200000 },
  ],
}));

const { api } = jest.requireMock("../api") as {
  api: { get: jest.Mock };
};

const MockApiError = (jest.requireMock("../api") as {
  ApiError: new (status: number, message: string, code?: string) => Error;
}).ApiError;

function createApiCar(overrides?: Partial<Record<string, unknown>>) {
  return {
    id: "api-car-1",
    title: "Skoda Octavia",
    brand: "Skoda",
    price: 1000000,
    mileage: 50000,
    year: 2021,
    engine: "1.4",
    power: 150,
    driveType: "FWD",
    address: "Moscow",
    images: ["https://example.com/car.jpg"],
    ...(overrides ?? {}),
  };
}

describe("carService contract", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.EXPO_PUBLIC_CATALOG_SOURCE;
  });

  it("returns filtered cars in explicit mock mode", async () => {
    process.env.EXPO_PUBLIC_CATALOG_SOURCE = "mock";
    const result = await carService.getAll({ brand: "bmw", minPrice: 1000000, maxPrice: 2000000 });

    expect(result).toEqual([{ id: "car-1", brand: "BMW", bodyType: "sedan", price: 1500000 }]);
  });

  it("falls back to api source and warns on invalid env value", async () => {
    process.env.EXPO_PUBLIC_CATALOG_SOURCE = "broken-source";
    const telemetrySpy = jest.fn();
    (
      globalThis as unknown as {
        __INDEP_REPORT_TELEMETRY__?: (payload: {
          name: string;
          attributes?: Record<string, unknown>;
          timestamp: number;
        }) => void;
      }
    ).__INDEP_REPORT_TELEMETRY__ = telemetrySpy;
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    const cars = [createApiCar()];
    api.get.mockResolvedValue(cars);

    const result = await carService.getAll();

    expect(api.get).toHaveBeenCalledWith("/cars");
    expect(result).toEqual(cars);
    expect(warnSpy).toHaveBeenCalledWith(
      '[catalog] Invalid EXPO_PUBLIC_CATALOG_SOURCE="broken-source". Falling back to "api".',
    );
    expect(telemetrySpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "invalid_env_source",
        attributes: expect.objectContaining({
          source: "catalog",
          key: "EXPO_PUBLIC_CATALOG_SOURCE",
          value: "broken-source",
          fallback: "api",
        }),
      }),
    );
    delete (
      globalThis as unknown as { __INDEP_REPORT_TELEMETRY__?: unknown }
    ).__INDEP_REPORT_TELEMETRY__;
    warnSpy.mockRestore();
  });

  it("returns api response shape in api mode", async () => {
    process.env.EXPO_PUBLIC_CATALOG_SOURCE = "api";
    const cars = [createApiCar()];
    api.get.mockResolvedValue(cars);

    const result = await carService.getAll({ page: 2, limit: 20 });

    expect(api.get).toHaveBeenCalledWith("/cars?page=2&limit=20");
    expect(result).toEqual(cars);
  });

  it("maps 401 to user-friendly Error in api mode", async () => {
    process.env.EXPO_PUBLIC_CATALOG_SOURCE = "api";
    api.get.mockRejectedValue(new MockApiError(401, "Unauthorized"));

    await expect(carService.getAll()).rejects.toBeInstanceOf(Error);
    await expect(carService.getAll()).rejects.toMatchObject({
      message: "Войдите в аккаунт, чтобы открыть каталог.",
    });
  });

  it("maps network failure to user-friendly Error in api mode", async () => {
    process.env.EXPO_PUBLIC_CATALOG_SOURCE = "api";
    api.get.mockRejectedValue(new MockApiError(0, "Network request failed", "network"));

    await expect(carService.getById("car-1")).rejects.toMatchObject({
      message: "Проблема с сетью. Проверьте подключение и попробуйте снова.",
    });
  });

  it("maps timeout failure to user-friendly Error in api mode", async () => {
    process.env.EXPO_PUBLIC_CATALOG_SOURCE = "api";
    api.get.mockRejectedValue(new MockApiError(0, "Request timeout", "timeout"));

    await expect(carService.getAll()).rejects.toMatchObject({
      message: "Каталог отвечает слишком долго. Попробуйте снова.",
    });
  });

  it("throws controlled AppError on invalid api payload", async () => {
    process.env.EXPO_PUBLIC_CATALOG_SOURCE = "api";
    api.get.mockResolvedValue([{ id: "broken-car" }]);

    await expect(carService.getAll()).rejects.toMatchObject({
      kind: "validation",
      message: "Получены некорректные данные каталога. Попробуйте позже.",
      context: expect.objectContaining({
        service: "carService",
        action: "getAll",
        payloadShapeError: expect.any(Array),
      }),
    });
  });
});

