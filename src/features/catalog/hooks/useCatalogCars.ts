import { useCallback, useEffect, useRef, useState } from "react";
import { carService } from "../../../services/carService";
import { AppError } from "../../../shared/errors/appError";
import { createRequestVersionTracker } from "../../../shared/async/requestVersion";
import type { Car } from "../../../types/car";

const LOAD_ERROR_FALLBACK =
  "Не удалось загрузить каталог. Проверьте подключение и попробуйте снова.";

function toLoadErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error && error.message.trim()) return error.message;
  return LOAD_ERROR_FALLBACK;
}

export type UseCatalogCarsResult = {
  cars: Car[];
  loading: boolean;
  error: string | null;
  /** Reload catalog; optional AbortSignal for mount/unmount lifecycle. */
  reload: (signal?: AbortSignal) => Promise<void>;
};

export function useCatalogCars(): UseCatalogCarsResult {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadRequestTrackerRef = useRef(createRequestVersionTracker());

  const reload = useCallback(async (signal?: AbortSignal): Promise<void> => {
    const requestId = loadRequestTrackerRef.current.next();
    setLoading(true);
    setError(null);

    try {
      const fetchedCars = await carService.getAll(undefined, signal);
      if (signal?.aborted || !loadRequestTrackerRef.current.isActive(requestId)) return;
      setCars(Array.isArray(fetchedCars) ? fetchedCars : []);
    } catch (caught) {
      if (signal?.aborted || !loadRequestTrackerRef.current.isActive(requestId)) return;
      setError(toLoadErrorMessage(caught));
    } finally {
      if (!signal?.aborted && loadRequestTrackerRef.current.isActive(requestId)) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    void reload(abortController.signal);
    return () => abortController.abort();
  }, [reload]);

  return { cars, loading, error, reload };
}
