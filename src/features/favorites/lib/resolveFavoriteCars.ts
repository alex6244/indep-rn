import { carService } from "../../../services/carService";
import type { Car } from "../../../types/car";

/** Resolves favorite ids to cars; skips ids that fail to load. */
export async function resolveFavoriteCars(ids: string[]): Promise<Car[]> {
  if (ids.length === 0) return [];

  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        return await carService.getById(id);
      } catch {
        return null;
      }
    }),
  );

  return results.filter((car): car is Car => car !== null);
}
