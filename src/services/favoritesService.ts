import { api } from "./api";
import { z } from "zod";

const favoriteIdsSchema = z.array(z.string());

export const favoritesService = {
  async getAll(): Promise<string[]> {
    const data = await api.get("/favorites");
    const parsed = favoriteIdsSchema.safeParse(data);
    return parsed.success ? parsed.data : [];
  },

  async add(carId: string): Promise<void> {
    await api.post(`/favorites/${carId}`, {});
  },

  async remove(carId: string): Promise<void> {
    await api.delete(`/favorites/${carId}`);
  },
};
