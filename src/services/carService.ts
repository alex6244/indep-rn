import { ApiError, api } from "./api";
import { cars as mockCars, type Car } from "../data/cars";

interface CarsParams {
  brand?: string;
  bodyType?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

type CatalogSource = "mock" | "api";

function getCatalogSource(): CatalogSource {
  const raw = process.env.EXPO_PUBLIC_CATALOG_SOURCE?.trim().toLowerCase();
  return raw === "api" ? "api" : "mock";
}

function applyMockFilters(params?: CarsParams): Car[] {
  if (!params) return mockCars;
  return mockCars.filter((car) => {
    if (params.brand && !car.brand.toLowerCase().includes(params.brand.toLowerCase())) return false;
    if (params.bodyType && car.bodyType !== params.bodyType) return false;
    if (typeof params.minPrice === "number" && car.price < params.minPrice) return false;
    if (typeof params.maxPrice === "number" && car.price > params.maxPrice) return false;
    return true;
  });
}

function mapCarsError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return "Войдите в аккаунт, чтобы открыть каталог.";
    if (error.status === 0) return "Проблема с сетью. Проверьте подключение и попробуйте снова.";
    if (error.status >= 500) return "Сервис каталога временно недоступен. Попробуйте позже.";
  }
  return "Не удалось загрузить каталог. Проверьте подключение и попробуйте снова.";
}

export const carService = {
  getAll: async (params?: CarsParams): Promise<Car[]> => {
    if (getCatalogSource() === "mock") {
      return applyMockFilters(params);
    }

    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.set(key, String(value));
      });
    }
    const qs = query.toString();
    try {
      return await api.get<Car[]>(`/cars${qs ? `?${qs}` : ""}`);
    } catch (error) {
      throw new Error(mapCarsError(error));
    }
  },

  getById: async (id: string): Promise<Car> => {
    if (getCatalogSource() === "mock") {
      const car = mockCars.find((item) => item.id === id);
      if (!car) {
        throw new Error("Автомобиль не найден.");
      }
      return car;
    }
    try {
      return await api.get<Car>(`/cars/${id}`);
    } catch (error) {
      throw new Error(mapCarsError(error));
    }
  },
};
