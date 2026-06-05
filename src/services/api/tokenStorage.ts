import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { envBool } from "../../config/env";
import { reportTelemetry } from "../../shared/monitoring/errorReporting";

let inMemoryToken: string | null = null;
const TOKEN_KEY = "auth.token";
const LEGACY_TOKEN_KEY = "@auth/token";

const REFRESH_TOKEN_KEY = "auth.refresh_token";
const LEGACY_REFRESH_TOKEN_KEY = "@auth/refresh_token";
let inMemoryRefreshToken: string | null = null;

type StorageTelemetryOperation = "get" | "set" | "clear";
type StorageTelemetryStorage = "secure_store" | "async_storage" | "fallback";

type StorageTelemetryEvent = {
  operation: StorageTelemetryOperation;
  storage: StorageTelemetryStorage;
  error: string;
  scope: "token_storage";
  timestamp: number;
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  try {
    return String(error);
  } catch {
    return "unknown_error";
  }
}

// Non-blocking reporter: observability only, never control-flow.
function reportStorageTelemetry(event: StorageTelemetryEvent): void {
  try {
    reportTelemetry("token_storage_failure", event);
  } catch {
    // Never throw from telemetry path.
  }
}

function trackStorageFailure(
  operation: StorageTelemetryOperation,
  storage: StorageTelemetryStorage,
  error: unknown,
): void {
  reportStorageTelemetry({
    operation,
    storage,
    error: toErrorMessage(error),
    scope: "token_storage",
    timestamp: Date.now(),
  });
}

function allowInsecureAsyncTokenStorage(): boolean {
  // AsyncStorage is not a secure storage for tokens. Keep it strictly opt-in.
  if (process.env.NODE_ENV === "test") return true;
  return envBool("EXPO_PUBLIC_ALLOW_INSECURE_TOKEN_STORAGE");
}

async function getSecureItemWithMigration(
  key: string,
  legacyKey: string,
): Promise<string | null> {
  try {
    const currentValue = await SecureStore.getItemAsync(key);
    if (currentValue) return currentValue;
  } catch (error) {
    trackStorageFailure("get", "secure_store", error);
  }

  try {
    const legacyValue = await SecureStore.getItemAsync(legacyKey);
    if (!legacyValue) return null;
    try {
      await SecureStore.setItemAsync(key, legacyValue);
    } catch (error) {
      trackStorageFailure("set", "secure_store", error);
    }
    try {
      await SecureStore.deleteItemAsync(legacyKey);
    } catch (error) {
      trackStorageFailure("clear", "secure_store", error);
    }
    return legacyValue;
  } catch (error) {
    trackStorageFailure("get", "secure_store", error);
    return null;
  }
}

async function getAsyncItemWithMigration(
  key: string,
  legacyKey: string,
): Promise<string | null> {
  try {
    const currentValue = await AsyncStorage.getItem(key);
    if (currentValue) return currentValue;
  } catch (error) {
    trackStorageFailure("get", "async_storage", error);
  }

  try {
    const legacyValue = await AsyncStorage.getItem(legacyKey);
    if (!legacyValue) return null;
    try {
      await AsyncStorage.setItem(key, legacyValue);
    } catch (error) {
      trackStorageFailure("set", "async_storage", error);
    }
    try {
      await AsyncStorage.removeItem(legacyKey);
    } catch (error) {
      trackStorageFailure("clear", "async_storage", error);
    }
    return legacyValue;
  } catch (error) {
    trackStorageFailure("get", "async_storage", error);
    return null;
  }
}

export const refreshTokenStorage = {
  get: async () => {
    if (inMemoryRefreshToken) return inMemoryRefreshToken;
    const secure = await getSecureItemWithMigration(
      REFRESH_TOKEN_KEY,
      LEGACY_REFRESH_TOKEN_KEY,
    );
    if (secure) {
      inMemoryRefreshToken = secure;
      return secure;
    }
    if (!allowInsecureAsyncTokenStorage()) return null;
    const fallback = await getAsyncItemWithMigration(
      REFRESH_TOKEN_KEY,
      LEGACY_REFRESH_TOKEN_KEY,
    );
    if (fallback) {
      inMemoryRefreshToken = fallback;
      return fallback;
    }
    return null;
  },
  set: async (token: string) => {
    inMemoryRefreshToken = token;
    try {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
      return;
    } catch (error) {
      trackStorageFailure("set", "secure_store", error);
    }
    if (!allowInsecureAsyncTokenStorage()) return;
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      trackStorageFailure("set", "async_storage", error);
    }
  },
  clear: async () => {
    inMemoryRefreshToken = null;
    try {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      trackStorageFailure("clear", "secure_store", error);
    }
    try {
      await SecureStore.deleteItemAsync(LEGACY_REFRESH_TOKEN_KEY);
    } catch (error) {
      trackStorageFailure("clear", "secure_store", error);
    }
    if (!allowInsecureAsyncTokenStorage()) return;
    try {
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      trackStorageFailure("clear", "async_storage", error);
    }
    try {
      await AsyncStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
    } catch (error) {
      trackStorageFailure("clear", "async_storage", error);
    }
  },
};

// ─── Токены ──────────────────────────────────────────────────────────────────

export const tokenStorage = {
  get: async () => {
    if (inMemoryToken) return inMemoryToken;

    const secure = await getSecureItemWithMigration(TOKEN_KEY, LEGACY_TOKEN_KEY);
    if (secure) {
      inMemoryToken = secure;
      return secure;
    }

    if (!allowInsecureAsyncTokenStorage()) return null;
    const fallback = await getAsyncItemWithMigration(TOKEN_KEY, LEGACY_TOKEN_KEY);
    if (fallback) {
      inMemoryToken = fallback;
      return fallback;
    }

    return null;
  },
  set: async (token: string) => {
    inMemoryToken = token;
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      return;
    } catch (error) {
      trackStorageFailure("set", "secure_store", error);
    }
    if (!allowInsecureAsyncTokenStorage()) return;
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      trackStorageFailure("set", "async_storage", error);
      trackStorageFailure("set", "fallback", error);
    }
  },
  clear: async () => {
    inMemoryToken = null;
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      trackStorageFailure("clear", "secure_store", error);
    }
    try {
      await SecureStore.deleteItemAsync(LEGACY_TOKEN_KEY);
    } catch (error) {
      trackStorageFailure("clear", "secure_store", error);
    }
    if (!allowInsecureAsyncTokenStorage()) return;
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      trackStorageFailure("clear", "async_storage", error);
      trackStorageFailure("clear", "fallback", error);
    }
    try {
      await AsyncStorage.removeItem(LEGACY_TOKEN_KEY);
    } catch (error) {
      trackStorageFailure("clear", "async_storage", error);
      trackStorageFailure("clear", "fallback", error);
    }
  },
};
