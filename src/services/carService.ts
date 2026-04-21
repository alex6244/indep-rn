import { ApiError, api, classifyApiError } from "./api";
import { cars as mockCars } from "../data/cars";
import type { Car } from "../types/car";
import { AppError } from "../shared/errors/appError";
import { readSourceEnv } from "../config/sources";
import { apiCarSchema, apiCarsListSchema, type ApiCar } from "./schemas/carSchemas";

interface CarsParams {
  brand?: string;
  bodyType?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

type CatalogSource = "mock" | "api";
function mapApiCarToDomainCar(apiCar: ApiCar): Car {
  return {
    id: apiCar.id,
    title: apiCar.title,
    brand: apiCar.brand,
    price: apiCar.price,
    mileage: apiCar.mileage,
    year: apiCar.year,
    engine: apiCar.engine,
    power: apiCar.power,
    driveType: apiCar.driveType,
    driveLabel: apiCar.driveLabel,
    transmission: apiCar.transmission,
    fuelType: apiCar.fuelType,
    address: apiCar.address,
    images: apiCar.images,
    bodyType: apiCar.bodyType,
    features: apiCar.features,
    paymentType: apiCar.paymentType,
    hasDiscount: apiCar.hasDiscount,
    vatReturn: apiCar.vatReturn,
    weeklyOffer: apiCar.weeklyOffer,
  };
}

function getCatalogSource(): CatalogSource {
  return readSourceEnv({
    source: "catalog",
    key: "EXPO_PUBLIC_CATALOG_SOURCE",
    allowed: ["api", "mock"] as const,
    fallback: "api",
  });
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
  const code = classifyApiError(error);
  if (code === "network") return "Проблема с сетью. Проверьте подключение и попробуйте снова.";
  if (code === "timeout") return "Каталог отвечает слишком долго. Попробуйте снова.";
  if (code === "aborted") return "Запрос был отменён.";

  if (error instanceof ApiError) {
    if (error.status === 401) return "Войдите в аккаунт, чтобы открыть каталог.";
    if (error.status === 404) return "Автомобиль не найден.";
    if (error.status >= 500) return "Сервис каталога временно недоступен. Попробуйте позже.";
  }
  return "Не удалось загрузить каталог. Проверьте подключение и попробуйте снова.";
}

function mapCarsErrorKind(error: unknown): AppError["kind"] {
  const code = classifyApiError(error);
  if (code === "network" || code === "timeout" || code === "aborted") return "network";
  if (code === "unauthorized") return "unauthorized";
  if (code === "not_found") return "not_found";
  if (code === "server_error") return "server";
  return "unknown";
}

function getPayloadShapeError(error: unknown): string[] | undefined {
  if (!(error instanceof Error) || !("issues" in error)) return undefined;
  const issues = (error as { issues?: { path?: (string | number)[]; message?: string }[] }).issues;
  if (!Array.isArray(issues)) return undefined;
  return issues.slice(0, 5).map((issue) => `${(issue.path ?? []).join(".") || "root"}: ${issue.message || "invalid value"}`);
}

export const carService = {
  getAll: async (params?: CarsParams, signal?: AbortSignal): Promise<Car[]> => {
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
      const path = `/cars${qs ? `?${qs}` : ""}`;
      const response = signal
        ? await api.get<ApiCar[]>(path, { signal })
        : await api.get<ApiCar[]>(path);
      const parsed = apiCarsListSchema.safeParse(response);
      if (!parsed.success) {
        throw new AppError({
          kind: "validation",
          message: "Получены некорректные данные каталога. Попробуйте позже.",
          cause: parsed.error,
          context: {
            service: "carService",
            action: "getAll",
            payloadShapeError: getPayloadShapeError(parsed.error),
          },
        });
      }
      return parsed.data.map(mapApiCarToDomainCar);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        kind: mapCarsErrorKind(error),
        message: mapCarsError(error),
        cause: error,
        context: { service: "carService", action: "getAll" },
      });
    }
  },

  getById: async (id: string): Promise<Car> => {
    if (getCatalogSource() === "mock") {
      const car = mockCars.find((item) => item.id === id);
      if (!car) {
        throw new AppError({
          kind: "not_found",
          message: "Автомобиль не найден.",
          context: { id, service: "carService", action: "getById" },
        });
      }
      return car;
    }
    try {
      const response = await api.get<ApiCar>(`/cars/${id}`);
      const parsed = apiCarSchema.safeParse(response);
      if (!parsed.success) {
        throw new AppError({
          kind: "validation",
          message: "Получены некорректные данные автомобиля. Попробуйте позже.",
          cause: parsed.error,
          context: {
            service: "carService",
            action: "getById",
            id,
            payloadShapeError: getPayloadShapeError(parsed.error),
          },
        });
      }
      return mapApiCarToDomainCar(parsed.data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        kind: mapCarsErrorKind(error),
        message: mapCarsError(error),
        cause: error,
        context: { service: "carService", action: "getById", id },
      });
    }
  },
};
