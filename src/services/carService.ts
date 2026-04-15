import { ApiError, api } from "./api";
import { cars as mockCars } from "../data/cars";
import type { Car } from "../types/car";

interface CarsParams {
  brand?: string;
  bodyType?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

type CatalogSource = "mock" | "api";
type ApiCar = {
  id: string;
  title: string;
  brand: string;
  price: number;
  mileage: number;
  year: number;
  engine: string;
  power: number;
  driveType: string;
  driveLabel?: string;
  transmission?: string;
  fuelType?: string;
  address: string;
  images: string[];
  bodyType?: "Седан" | "Кроссовер" | "Хэтчбек";
  features?: string[];
  paymentType?: "cash" | "credit";
  hasDiscount?: boolean;
  vatReturn?: boolean;
  weeklyOffer?: boolean;
};

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
      const response = await api.get<ApiCar[]>(`/cars${qs ? `?${qs}` : ""}`);
      return response.map(mapApiCarToDomainCar);
    } catch (error) {
      // TODO(architecture): migrate service error contracts to a shared AppError format.
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
      const response = await api.get<ApiCar>(`/cars/${id}`);
      return mapApiCarToDomainCar(response);
    } catch (error) {
      // TODO(architecture): migrate service error contracts to a shared AppError format.
      throw new Error(mapCarsError(error));
    }
  },
};
