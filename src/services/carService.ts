import { api } from "./api";
import type { Car } from "../data/cars";

interface CarsParams {
  brand?: string;
  bodyType?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export const carService = {
  getAll: (params?: CarsParams): Promise<Car[]> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.set(key, String(value));
      });
    }
    const qs = query.toString();
    return api.get<Car[]>(`/cars${qs ? `?${qs}` : ""}`);
  },

  getById: (id: string): Promise<Car> => api.get<Car>(`/cars/${id}`),
};
