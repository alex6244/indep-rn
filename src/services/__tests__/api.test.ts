import { ApiError, api, setRefreshHandler, setUnauthorizedHandler, tokenStorage } from "../api";

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
    process.env.EXPO_PUBLIC_API_URL = "https://api.example.com";
    process.env.EXPO_PUBLIC_ALLOW_HTTP_DEV = "false";
    fetchMock.mockReset();
    (globalThis as { fetch?: typeof fetch }).fetch = fetchMock as unknown as typeof fetch;
    setUnauthorizedHandler(null);
    setRefreshHandler(null);
  });

  afterEach(() => {
    setUnauthorizedHandler(null);
    setRefreshHandler(null);
    jest.restoreAllMocks();
  });

  it("does not retry manually aborted GET", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(api.get("/cars", { signal: controller.signal })).rejects.toMatchObject({
      status: 0,
      message: "Request aborted",
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
      },
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("clears token and triggers unauthorized handler on 401", async () => {
    const clearSpy = jest.spyOn(tokenStorage, "clear").mockResolvedValue();
    const unauthorizedHandler = jest.fn(async () => undefined);
    setUnauthorizedHandler(unauthorizedHandler);

    fetchMock.mockResolvedValue(createResponse({ status: 401, body: { message: "Unauthorized" } }));

    await expect(api.get("/auth/me")).rejects.toMatchObject({
      status: 401,
      message: "Unauthorized",
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

  it("does not crash preflight on invalid JWT payload", async () => {
    jest.spyOn(tokenStorage, "get").mockResolvedValue("broken.payload.token");
    const refreshHandler = jest.fn(async () => "unused-token");
    setRefreshHandler(refreshHandler);
    fetchMock.mockResolvedValue(createResponse({ status: 200, body: { ok: true } }));

    await expect(api.get<{ ok: boolean }>("/secure")).resolves.toEqual({ ok: true });

    expect(refreshHandler).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
