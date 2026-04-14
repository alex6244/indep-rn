import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface FavoritesContextValue {
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  setFavorite: (id: string, value: boolean) => void;
  loading: boolean;
  favoritesError: string | null;
  clearFavoritesError: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "@favorites";

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoritesError, setFavoritesError] = useState<string | null>(null);
  const favoriteIdsRef = useRef<string[]>([]);
  const persistQueueRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const normalized = parsed.map(String);
            favoriteIdsRef.current = normalized;
            setFavoriteIds(normalized);
          }
        }
      } catch {
        // Повреждённые данные — сбрасываем, избранное начнётся с чистого листа
        await AsyncStorage.removeItem(STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(String(id)),
    [favoriteIds],
  );

  const persistFavoriteUpdate = useCallback((updater: (prev: string[]) => string[]) => {
    persistQueueRef.current = persistQueueRef.current
      .then(async () => {
        const prev = favoriteIdsRef.current;
        const next = updater(prev);
        if (next === prev) return;

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        favoriteIdsRef.current = next;
        setFavoriteIds(next);
      })
      .catch(() => {
        setFavoritesError("Не удалось сохранить избранное");
      });
  }, []);

  const setFavorite = useCallback((id: string, value: boolean) => {
    const sId = String(id);
    persistFavoriteUpdate((prev) => {
      const next = value
        ? prev.includes(sId) ? prev : [...prev, sId]
        : prev.filter((x) => x !== sId);
      return next;
    });
  }, [persistFavoriteUpdate]);

  const toggleFavorite = useCallback((id: string) => {
    const sId = String(id);
    persistFavoriteUpdate((prev) => {
      const wasInFavorites = prev.includes(sId);
      const next = wasInFavorites ? prev.filter((x) => x !== sId) : [...prev, sId];
      return next;
    });
  }, [persistFavoriteUpdate]);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        isFavorite,
        toggleFavorite,
        setFavorite,
        loading,
        favoritesError,
        clearFavoritesError: () => setFavoritesError(null),
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
};

