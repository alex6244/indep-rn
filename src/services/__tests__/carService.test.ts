import { carService } from "../carService";

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

jest.mock("../../data/cars", () => ({
  cars: [
    { id: "car-1", brand: "BMW", bodyType: "sedan", price: 1500000 },
    { id: "car-2", brand: "Audi", bodyType: "suv", price: 2200000 },
  ],
}));

const { api } = jest.requireMock("../api") as {
  api: { get: jest.Mock };
};

const MockApiError = (jest.requireMock("../api") as { ApiError: new (status: number, message: string) => Error })
  .ApiError;

describe("carService contract", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.EXPO_PUBLIC_CATALOG_SOURCE;
  });

  it("returns filtered cars in mock mode", async () => {
    const result = await carService.getAll({ brand: "bmw", minPrice: 1000000, maxPrice: 2000000 });

    expect(result).toEqual([{ id: "car-1", brand: "BMW", bodyType: "sedan", price: 1500000 }]);
  });

  it("returns api response shape in api mode", async () => {
    process.env.EXPO_PUBLIC_CATALOG_SOURCE = "api";
    const cars = [{ id: "api-car-1", brand: "Skoda", price: 1000000 }];
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
    api.get.mockRejectedValue(new MockApiError(0, "Network request failed"));

    await expect(carService.getById("car-1")).rejects.toMatchObject({
      message: "Проблема с сетью. Проверьте подключение и попробуйте снова.",
    });
  });
});

