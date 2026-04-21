import {
  ApiError,
  api,
  resetApiBaseUrlCacheForTests,
  setRefreshHandler,
  setUnauthorizedHandler,
  tokenStorage,
} from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

type MockResponseOptions = {
  status: number;
  body?: unknown;
  text?: string;
};

async function waitForCalls(fn: jest.Mock, expected: number): Promise<void> {
  for (let i = 0; i < 30; i += 1) {
    if (fn.mock.calls.length >= expected) return;
    await Promise.resolve();
  }
}

function createResponse({ status, body, text }: MockResponseOptions): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn(async () => body),
    text: jest.fn(async () => text ?? (typeof body === "string" ? body : "")),
  } as unknown as Response;
}

function encodeBase64Url(input: string): string {
  const maybeBtoa = (globalThis as { btoa?: (value: string) => string }).btoa;
  if (maybeBtoa) {
    return maybeBtoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }
  const maybeBuffer = (
    globalThis as {
      Buffer?: {
        from: (value: string, encoding: string) => { toString: (encoding: string) => string };
      };
    }
  ).Buffer;
  if (maybeBuffer) {
    return maybeBuffer
      .from(input, "utf8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }
  throw new Error("No base64 encoder available in test runtime");
}

function createJwtWithExp(exp: number): string {
  const header = encodeBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = encodeBase64Url(JSON.stringify({ exp }));
  return `${header}.${payload}.signature`;
}

describe("api retry/abort/401 policy", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    resetApiBaseUrlCacheForTests();
    process.env.EXPO_PUBLIC_API_URL = "https://api.example.com";
    process.env.EXPO_PUBLIC_ALLOW_HTTP_DEV = "false";
    fetchMock.mockReset();
    (globalThis as { fetch?: typeof fetch }).fetch = fetchMock as unknown as typeof fetch;
    setUnauthorizedHandler(null);
    setRefreshHandler(null);
    delete process.env.EXPO_PUBLIC_ALLOW_INSECURE_TOKEN_STORAGE;
  });

  afterEach(() => {
    resetApiBaseUrlCacheForTests();
    setUnauthorizedHandler(null);
    setRefreshHandler(null);
    jest.restoreAllMocks();
  });

  it("does not fall back to AsyncStorage for token storage by default", async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const secureSetSpy = jest.spyOn(SecureStore, "setItemAsync").mockRejectedValue(new Error("secure fail"));
    const asyncSetSpy = jest.spyOn(AsyncStorage, "setItem").mockResolvedValue(undefined as never);
    const secureDeleteSpy = jest
      .spyOn(SecureStore, "deleteItemAsync")
      .mockResolvedValue(undefined as never);

    await expect(tokenStorage.set("t")).resolves.toBeUndefined();

    expect(secureSetSpy).toHaveBeenCalled();
    expect(asyncSetSpy).not.toHaveBeenCalled();

    await tokenStorage.clear();

    secureSetSpy.mockRestore();
    asyncSetSpy.mockRestore();
    secureDeleteSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("falls back to AsyncStorage only when explicit insecure flag is enabled", async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    process.env.EXPO_PUBLIC_ALLOW_INSECURE_TOKEN_STORAGE = "true";
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const secureSetSpy = jest.spyOn(SecureStore, "setItemAsync").mockRejectedValue(new Error("secure fail"));
    const asyncSetSpy = jest.spyOn(AsyncStorage, "setItem").mockResolvedValue(undefined as never);
    const secureDeleteSpy = jest
      .spyOn(SecureStore, "deleteItemAsync")
      .mockResolvedValue(undefined as never);

    await expect(tokenStorage.set("t")).resolves.toBeUndefined();

    expect(secureSetSpy).toHaveBeenCalled();
    expect(asyncSetSpy).toHaveBeenCalled();

    await tokenStorage.clear();

    secureSetSpy.mockRestore();
    asyncSetSpy.mockRestore();
    secureDeleteSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("does not retry manually aborted GET", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(api.get("/cars", { signal: controller.signal })).rejects.toMatchObject({
      status: 0,
      message: "Request aborted",
      code: "aborted",
    });

    expect(fetchMock).toHaveBeenCalledTimes(0);
  });

  it("retries GET on network failures", async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError("Network request failed"))
      .mockRejectedValueOnce(new TypeError("Network request failed"))
      .mockResolvedValueOnce(createResponse({ status: 200, body: [{ id: "1" }] }));

    const result = await api.get<{ id: string }[]>("/cars");

    expect(result).toEqual([{ id: "1" }]);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("does not retry POST on network failures", async () => {
    fetchMock.mockRejectedValue(new TypeError("Network request failed"));

    await expect(api.post("/auth/login", { email: "a@b.c", password: "123456" })).rejects.toMatchObject(
      {
        status: 0,
        message: "Network request failed",
        code: "network",
      },
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("classifies timeout errors when fetch aborts without caller signal", async () => {
    fetchMock.mockRejectedValue({ name: "AbortError" });

    await expect(api.get("/cars")).rejects.toMatchObject({
      status: 0,
      message: "Request timeout",
      code: "timeout",
    });
  });

  it("clears token and triggers unauthorized handler on 401", async () => {
    const clearSpy = jest.spyOn(tokenStorage, "clear").mockResolvedValue();
    const unauthorizedHandler = jest.fn(async () => undefined);
    setUnauthorizedHandler(unauthorizedHandler);

    fetchMock.mockResolvedValue(createResponse({ status: 401, body: { message: "Unauthorized" } }));

    await expect(api.get("/auth/me")).rejects.toMatchObject({
      status: 401,
      message: "Unauthorized",
      code: "unauthorized",
    });

    expect(clearSpy).toHaveBeenCalledTimes(1);
    expect(unauthorizedHandler).toHaveBeenCalledTimes(1);
  });

  it("runs unauthorized handler as single in-flight task during 401 storm", async () => {
    const deferred: { resolve?: () => void } = {};
    const unauthorizedHandler = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          deferred.resolve = resolve;
        }),
    );
    setUnauthorizedHandler(unauthorizedHandler);

    fetchMock.mockResolvedValue(createResponse({ status: 401, body: { message: "Unauthorized" } }));

    const p1 = api.get("/a").catch((error) => error as ApiError);
    const p2 = api.get("/b").catch((error) => error as ApiError);

    await waitForCalls(unauthorizedHandler, 1);
    expect(unauthorizedHandler).toHaveBeenCalledTimes(1);

    deferred.resolve?.();
    const [e1, e2] = (await Promise.all([p1, p2])) as [ApiError, ApiError];

    expect(e1).toBeInstanceOf(ApiError);
    expect(e2).toBeInstanceOf(ApiError);
    expect(e1.status).toBe(401);
    expect(e2.status).toBe(401);
  });

  it("refreshes token on 401 and retries request once", async () => {
    // Ensure clean token state for this test.
    const deleteSpy = jest.spyOn(SecureStore, "deleteItemAsync").mockResolvedValue(undefined as never);
    const secureGetSpy = jest.spyOn(SecureStore, "getItemAsync").mockResolvedValue(null);
    const secureSetSpy = jest.spyOn(SecureStore, "setItemAsync").mockResolvedValue(undefined as never);
    const asyncGetSpy = jest.spyOn(AsyncStorage, "getItem").mockResolvedValue(null);
    await tokenStorage.clear();

    const refreshedJwt = createJwtWithExp(Math.floor(Date.now() / 1000) + 600);
    const refreshHandler = jest.fn(async () => refreshedJwt);
    setRefreshHandler(refreshHandler);
    const unauthorizedHandler = jest.fn(async () => undefined);
    setUnauthorizedHandler(unauthorizedHandler);

    fetchMock
      .mockResolvedValueOnce(createResponse({ status: 401, body: { message: "Unauthorized" } }))
      .mockResolvedValueOnce(createResponse({ status: 200, body: { ok: true } }));

    await expect(api.get<{ ok: boolean }>("/secure")).resolves.toEqual({ ok: true });

    expect(refreshHandler).toHaveBeenCalledTimes(1);
    expect(unauthorizedHandler).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const retryInit = fetchMock.mock.calls[1][1] as RequestInit;
    expect((retryInit.headers as Record<string, string>)["Authorization"]).toBe(
      `Bearer ${refreshedJwt}`,
    );

    deleteSpy.mockRestore();
    secureGetSpy.mockRestore();
    secureSetSpy.mockRestore();
    asyncGetSpy.mockRestore();
  });

  it("deduplicates refresh flow across parallel 401 responses", async () => {
    const refreshedJwt = createJwtWithExp(Math.floor(Date.now() / 1000) + 600);
    const refreshHandler = jest.fn(async () => refreshedJwt);
    setRefreshHandler(refreshHandler);
    fetchMock
      .mockResolvedValueOnce(createResponse({ status: 401, body: { message: "Unauthorized" } }))
      .mockResolvedValueOnce(createResponse({ status: 401, body: { message: "Unauthorized" } }))
      .mockResolvedValueOnce(createResponse({ status: 200, body: { ok: true } }))
      .mockResolvedValueOnce(createResponse({ status: 200, body: { ok: true } }));

    const [r1, r2] = await Promise.all([
      api.get<{ ok: boolean }>("/secure/1"),
      api.get<{ ok: boolean }>("/secure/2"),
    ]);

    expect(r1).toEqual({ ok: true });
    expect(r2).toEqual({ ok: true });
    expect(refreshHandler).toHaveBeenCalledTimes(1);
  });

  it("does not force logout when refresh fails with transient error", async () => {
    const clearSpy = jest.spyOn(tokenStorage, "clear").mockResolvedValue();
    const unauthorizedHandler = jest.fn(async () => undefined);
    setUnauthorizedHandler(unauthorizedHandler);
    setRefreshHandler(async () => {
      throw new ApiError(0, "Network request failed");
    });
    fetchMock.mockResolvedValue(createResponse({ status: 401, body: { message: "Unauthorized" } }));

    await expect(api.get("/auth/me")).rejects.toMatchObject({
      status: 0,
      message: "Network request failed",
      code: "network",
    });

    expect(clearSpy).not.toHaveBeenCalled();
    expect(unauthorizedHandler).not.toHaveBeenCalled();
  });

  it("refreshes expired access token before request", async () => {
    const expiredToken = createJwtWithExp(Math.floor(Date.now() / 1000) - 120);
    const refreshedToken = "fresh-access-token";
    jest.spyOn(tokenStorage, "get").mockResolvedValue(expiredToken);
    const tokenSetSpy = jest.spyOn(tokenStorage, "set").mockResolvedValue();
    const refreshHandler = jest.fn(async () => refreshedToken);
    setRefreshHandler(refreshHandler);
    fetchMock.mockResolvedValue(createResponse({ status: 200, body: { ok: true } }));

    await expect(api.get<{ ok: boolean }>("/secure")).resolves.toEqual({ ok: true });

    expect(refreshHandler).toHaveBeenCalledTimes(1);
    expect(tokenSetSpy).toHaveBeenCalledWith(refreshedToken);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
    expect((requestInit.headers as Record<string, string>)["Authorization"]).toBe(
      `Bearer ${refreshedToken}`,
    );
  });

  it("does not pre-refresh when token exp is still valid", async () => {
    const validToken = createJwtWithExp(Math.floor(Date.now() / 1000) + 600);
    jest.spyOn(tokenStorage, "get").mockResolvedValue(validToken);
    const refreshHandler = jest.fn(async () => "unused-token");
    setRefreshHandler(refreshHandler);
    fetchMock.mockResolvedValue(createResponse({ status: 200, body: { ok: true } }));

    await expect(api.get<{ ok: boolean }>("/secure")).resolves.toEqual({ ok: true });

    expect(refreshHandler).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("treats invalid JWT payload as expired and pre-refreshes safely", async () => {
    jest.spyOn(tokenStorage, "get").mockResolvedValue("broken.payload.token");
    const refreshHandler = jest.fn(async () => "refreshed-token");
    setRefreshHandler(refreshHandler);
    fetchMock.mockResolvedValue(createResponse({ status: 200, body: { ok: true } }));

    await expect(api.get<{ ok: boolean }>("/secure")).resolves.toEqual({ ok: true });

    expect(refreshHandler).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
    expect((requestInit.headers as Record<string, string>)["Authorization"]).toBe(
      "Bearer refreshed-token",
    );
  });

  it("uses updated base URL after explicit cache reset", async () => {
    jest.spyOn(tokenStorage, "get").mockResolvedValue(null);
    process.env.EXPO_PUBLIC_API_URL = "https://first.example.com";
    fetchMock.mockResolvedValue(createResponse({ status: 200, body: { ok: true } }));
    await expect(api.get<{ ok: boolean }>("/cars")).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://first.example.com/cars",
      expect.any(Object),
    );

    process.env.EXPO_PUBLIC_API_URL = "https://second.example.com";
    resetApiBaseUrlCacheForTests();
    fetchMock.mockResolvedValue(createResponse({ status: 200, body: { ok: true } }));
    await expect(api.get<{ ok: boolean }>("/cars")).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://second.example.com/cars",
      expect.any(Object),
    );
  });

  it("marks not found responses with not_found code", async () => {
    jest.spyOn(tokenStorage, "get").mockResolvedValue(null);
    fetchMock.mockResolvedValue(createResponse({ status: 404, body: { message: "Not found" } }));

    await expect(api.get("/cars/unknown")).rejects.toMatchObject({
      status: 404,
      code: "not_found",
    });
  });

  it("marks server responses with server_error code", async () => {
    jest.spyOn(tokenStorage, "get").mockResolvedValue(null);
    fetchMock.mockResolvedValue(createResponse({ status: 503, body: { message: "Service unavailable" } }));

    await expect(api.get("/cars")).rejects.toMatchObject({
      status: 503,
      code: "server_error",
    });
  });
});
