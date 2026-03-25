import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface FavoritesContextValue {
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  setFavorite: (id: string, value: boolean) => void;
  loading: boolean;
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

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setFavoriteIds(parsed.map(String));
          }
        }
      } catch (e) {
        if (__DEV__) console.log("Favorites load error", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds)).catch(
      () => {
        /* ignore */
      },
    );
  }, [favoriteIds]);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(String(id)),
    [favoriteIds],
  );

  const setFavorite = useCallback((id: string, value: boolean) => {
    setFavoriteIds((prev) => {
      const sId = String(id);
      if (value) {
        if (prev.includes(sId)) return prev;
        return [...prev, sId];
      }
      return prev.filter((x) => x !== sId);
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const sId = String(id);
      if (prev.includes(sId)) {
        return prev.filter((x) => x !== sId);
      }
      return [...prev, sId];
    });
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, isFavorite, toggleFavorite, setFavorite, loading }}
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

