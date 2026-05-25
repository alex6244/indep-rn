import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { favoritesService } from "../services/favoritesService";

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

function readStorage(): Promise<string[]> {
  return AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  });
}

function writeStorage(ids: string[]): Promise<void> {
  return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoritesError, setFavoritesError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const wasLoggedInRef = useRef(false);
  const favoriteIdsRef = useRef<string[]>([]);
  const favoriteIdsSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const applyIds = useCallback((ids: string[]) => {
    favoriteIdsRef.current = ids;
    if (isMountedRef.current) setFavoriteIds(ids);
  }, []);

  // Load favorites: API when logged in, AsyncStorage when guest
  useEffect(() => {
    let active = true;
    setLoading(true);

    const load = async () => {
      try {
        if (isLoggedIn) {
          const ids = await favoritesService.getAll();
          if (!active) return;
          applyIds(ids);
          void writeStorage(ids);
        } else {
          const ids = await readStorage();
          if (!active) return;
          applyIds(ids);
        }
      } catch {
        if (!active) return;
        // fallback to local cache on API error
        const ids = await readStorage();
        if (!active) return;
        applyIds(ids);
      } finally {
        if (active && isMountedRef.current) setLoading(false);
      }
    };

    void load();
    return () => { active = false; };
  }, [isLoggedIn, applyIds]);

  // Clear favorites only when user logs out (not for guests on first load)
  useEffect(() => {
    if (wasLoggedInRef.current && !isLoggedIn) {
      applyIds([]);
      void AsyncStorage.removeItem(STORAGE_KEY);
    }
    wasLoggedInRef.current = isLoggedIn;
  }, [isLoggedIn, applyIds]);

  const isFavorite = useCallback(
    (id: string) => favoriteIdsSet.has(String(id)),
    [favoriteIdsSet],
  );

  const setFavorite = useCallback(
    (id: string, value: boolean) => {
      const sId = String(id);
      const prev = favoriteIdsRef.current;
      const alreadyIn = prev.includes(sId);
      if (value === alreadyIn) return;

      const next = value
        ? [...prev, sId]
        : prev.filter((x) => x !== sId);

      // Optimistic update
      applyIds(next);

      if (isLoggedIn) {
        const call = value
          ? favoritesService.add(sId)
          : favoritesService.remove(sId);

        call.catch(() => {
          // Rollback
          applyIds(prev);
          if (isMountedRef.current) setFavoritesError("Не удалось обновить избранное");
        });
      } else {
        void writeStorage(next).catch(() => {
          applyIds(prev);
          if (isMountedRef.current) setFavoritesError("Не удалось сохранить избранное");
        });
      }
    },
    [isLoggedIn, applyIds],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      const sId = String(id);
      setFavorite(sId, !favoriteIdsRef.current.includes(sId));
    },
    [setFavorite],
  );

  const clearFavoritesError = useCallback(() => setFavoritesError(null), []);

  useEffect(() => {
    return () => { isMountedRef.current = false; };
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        isFavorite,
        toggleFavorite,
        setFavorite,
        loading,
        favoritesError,
        clearFavoritesError,
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
