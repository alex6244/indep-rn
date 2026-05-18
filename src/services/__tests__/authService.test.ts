import {
  authService,
  mapApiUserToDomain,
  normalizeUserRole,
  toApiRole,
} from "../authService";
import { getDefaultAuthErrorMessage } from "../authTypes";

jest.mock("../api", () => {
  class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
      super(message);
      this.status = status;
      this.name = "ApiError";
    }
  }

  return {
    ApiError,
    api: {
      post: jest.fn(),
      get: jest.fn(),
    },
    tokenStorage: {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
    },
    refreshTokenStorage: {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
    },
  };
});

const { api, tokenStorage, refreshTokenStorage, ApiError } = jest.requireMock("../api") as {
  ApiError: new (status: number, message: string) => Error;
  api: {
    post: jest.Mock;
    get: jest.Mock;
  };
  tokenStorage: {
    get: jest.Mock;
    set: jest.Mock;
    clear: jest.Mock;
  };
  refreshTokenStorage: {
    get: jest.Mock;
    set: jest.Mock;
    clear: jest.Mock;
  };
};

describe("authService.refresh rotation policy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.EXPO_PUBLIC_REQUIRE_REFRESH_ROTATION;
    refreshTokenStorage.get.mockResolvedValue("stored-refresh");
    refreshTokenStorage.set.mockResolvedValue(undefined);
    refreshTokenStorage.clear.mockResolvedValue(undefined);
    tokenStorage.clear.mockResolvedValue(undefined);
  });

  it("stores new refresh token returned by backend", async () => {
    api.post.mockResolvedValue({
      token: "new-access",
      refresh_token: "new-refresh",
    });

    const result = await authService.refresh();

    expect(result).toBe("new-access");
    expect(refreshTokenStorage.set).toHaveBeenCalledWith("new-refresh");
    expect(refreshTokenStorage.clear).not.toHaveBeenCalled();
    expect(tokenStorage.clear).not.toHaveBeenCalled();
  });

  it("invalidates session when rotation is required and refresh token is missing", async () => {
    process.env.EXPO_PUBLIC_REQUIRE_REFRESH_ROTATION = "true";
    api.post.mockResolvedValue({
      token: "new-access",
    });

    const result = await authService.refresh();

    expect(result).toBeNull();
    expect(refreshTokenStorage.clear).toHaveBeenCalledTimes(1);
    expect(tokenStorage.clear).toHaveBeenCalledTimes(1);
    expect(refreshTokenStorage.set).not.toHaveBeenCalled();
  });

  it("invalidates session on refresh 401", async () => {
    api.post.mockRejectedValue(new ApiError(401, "Unauthorized"));

    const result = await authService.refresh();

    expect(result).toBeNull();
    expect(refreshTokenStorage.clear).toHaveBeenCalledTimes(1);
    expect(tokenStorage.clear).toHaveBeenCalledTimes(1);
  });

  it("throws transient refresh network errors without forced cleanup", async () => {
    api.post.mockRejectedValue(new ApiError(0, "Network request failed"));

    await expect(authService.refresh()).rejects.toMatchObject({
      message: "Network request failed",
    });
    expect(refreshTokenStorage.clear).not.toHaveBeenCalled();
    expect(tokenStorage.clear).not.toHaveBeenCalled();
  });

  it("throws transient refresh 5xx errors without forced cleanup", async () => {
    api.post.mockRejectedValue(new ApiError(500, "Server Error"));

    await expect(authService.refresh()).rejects.toMatchObject({
      message: "Server Error",
    });
    expect(refreshTokenStorage.clear).not.toHaveBeenCalled();
    expect(tokenStorage.clear).not.toHaveBeenCalled();
  });
});

describe("authService contract", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.EXPO_PUBLIC_REQUIRE_REFRESH_ROTATION;
    tokenStorage.set.mockResolvedValue(undefined);
    refreshTokenStorage.set.mockResolvedValue(undefined);
    tokenStorage.clear.mockResolvedValue(undefined);
    refreshTokenStorage.clear.mockResolvedValue(undefined);
  });

  it("login returns user and persists tokens", async () => {
    const user = {
      id: "u1",
      login: "user@test.com",
      role: "client",
      name: "User",
      email: "user@test.com",
    };
    api.post.mockResolvedValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user,
    });

    const result = await authService.login({ email: "user@test.com", password: "123456" });

    expect(result).toEqual(user);
    expect(tokenStorage.set).toHaveBeenCalledWith("access-token");
    expect(refreshTokenStorage.set).toHaveBeenCalledWith("refresh-token");
  });

  it("login throws structured invalid_credentials error on 401", async () => {
    const apiError = new ApiError(401, "Unauthorized");
    api.post.mockRejectedValue(apiError);

    await expect(authService.login({ email: "user@test.com", password: "bad" })).rejects.toEqual({
      code: "invalid_credentials",
      message: getDefaultAuthErrorMessage("invalid_credentials"),
    });
  });

  it("login throws structured network_error on transport failure", async () => {
    api.post.mockRejectedValue(new TypeError("Network request failed"));

    await expect(authService.login({ email: "user@test.com", password: "123456" })).rejects.toEqual({
      code: "network_error",
      message: getDefaultAuthErrorMessage("network_error"),
    });
  });

  it("login surfaces plain Error message as unknown auth error", async () => {
    api.post.mockRejectedValue(new Error("non-api-failure"));

    await expect(authService.login({ email: "user@test.com", password: "123456" })).rejects.toEqual({
      code: "unknown",
      message: "non-api-failure",
    });
  });

  it("register returns user and persists access token", async () => {
    const user = {
      id: "u2",
      login: "new@test.com",
      role: "picker",
      name: "New User",
      email: "new@test.com",
    };
    api.post.mockResolvedValue({
      accessToken: "register-token",
      user,
    });

    const result = await authService.register({
      name: "New User",
      email: "new@test.com",
      password: "123456",
      role: "picker",
    });

    expect(result).toEqual(user);
    expect(tokenStorage.set).toHaveBeenCalledWith("register-token");
  });

  it("supports legacy auth DTO fields for backward compatibility", async () => {
    const user = {
      id: "u4",
      login: "legacy@test.com",
      role: "client",
      name: "Legacy",
      email: "legacy@test.com",
    };
    api.post.mockResolvedValue({
      token: "legacy-token",
      refresh_token: "legacy-refresh",
      user,
    });

    const result = await authService.login({ email: "legacy@test.com", password: "123456" });

    expect(result).toEqual(user);
    expect(tokenStorage.set).toHaveBeenCalledWith("legacy-token");
    expect(refreshTokenStorage.set).toHaveBeenCalledWith("legacy-refresh");
  });

  it("me returns user on success", async () => {
    const user = {
      id: "u3",
      login: "me@test.com",
      role: "client",
      name: "Me",
      email: "me@test.com",
    };
    api.get.mockResolvedValue(user);

    await expect(authService.me()).resolves.toEqual(user);
    expect(api.get).toHaveBeenCalledWith("/me");
  });

  it("me throws structured network_error for status 0", async () => {
    const apiError = new ApiError(0, "Network request failed");
    api.get.mockRejectedValue(apiError);

    await expect(authService.me()).rejects.toEqual({
      code: "network_error",
      message: getDefaultAuthErrorMessage("network_error"),
    });
  });

  it("requestVerification calls backend endpoint", async () => {
    api.post.mockResolvedValue({ message: "Код отправлен" });
    await expect(
      authService.requestVerification({ email: "user@test.com", name: "User Name", role: "client" }),
    ).resolves.toEqual({
      message: "Код отправлен",
    });
    expect(api.post).toHaveBeenCalledWith("/auth/request-verification", {
      email: "user@test.com",
      name: "User Name",
      role: "client",
    });
  });

  it("requestVerification maps picker domain role to realtor for API", async () => {
    api.post.mockResolvedValue({ message: "Код отправлен" });
    await authService.requestVerification({
      email: "picker@test.com",
      name: "Picker",
      role: "picker",
    });
    expect(api.post).toHaveBeenCalledWith("/auth/request-verification", {
      email: "picker@test.com",
      name: "Picker",
      role: "realtor",
    });
  });

  it("confirmVerification stores token and returns user", async () => {
    const user = {
      id: "u5",
      login: "otp@test.com",
      role: "client",
      name: "OTP User",
      email: "otp@test.com",
    };
    api.post.mockResolvedValue({
      token: "otp-access-token",
      user,
    });

    await expect(
      authService.confirmVerification({ email: "otp@test.com", code: "123456" }),
    ).resolves.toEqual(user);
    expect(tokenStorage.set).toHaveBeenCalledWith("otp-access-token");
    expect(api.post).toHaveBeenCalledWith("/auth/confirm-verification", {
      email: "otp@test.com",
      code: "123456",
    });
  });

  it("confirmVerification accepts Laravel-style access_token and nested tokens", async () => {
    const user = {
      id: "u6",
      login: "snake@test.com",
      role: "client",
      name: "Snake",
      email: "snake@test.com",
    };
    api.post.mockResolvedValue({
      user,
      tokens: {
        access_token: "snake-access",
        refresh_token: "snake-refresh",
      },
    });

    await expect(
      authService.confirmVerification({ email: "snake@test.com", code: "123456" }),
    ).resolves.toEqual(user);
    expect(tokenStorage.set).toHaveBeenCalledWith("snake-access");
    expect(refreshTokenStorage.set).toHaveBeenCalledWith("snake-refresh");
    expect(api.get).not.toHaveBeenCalled();
  });

  it("normalizeUserRole maps case and aliases to picker", () => {
    expect(normalizeUserRole("Picker")).toBe("picker");
    expect(normalizeUserRole("PICKER")).toBe("picker");
    expect(normalizeUserRole("realtor")).toBe("picker");
    expect(normalizeUserRole("REALTOR")).toBe("picker");
    expect(toApiRole("picker")).toBe("realtor");
    expect(toApiRole("client")).toBe("client");
    expect(mapApiUserToDomain({ id: 1, email: "a@b.c", role: "realtor" })?.role).toBe(
      "picker",
    );
  });

  it("confirmVerification applies picker role from payload when API user is client", async () => {
    api.post.mockResolvedValue({
      api_token: "picker-token",
      user: {
        id: 9,
        email: "picker@test.com",
        name: "Picker User",
        role: "client",
      },
    });

    await expect(
      authService.confirmVerification({
        email: "picker@test.com",
        code: "123456",
        role: "picker",
      }),
    ).resolves.toMatchObject({
      id: "9",
      email: "picker@test.com",
      role: "picker",
    });
    expect(api.post).toHaveBeenCalledWith("/auth/confirm-verification", {
      email: "picker@test.com",
      code: "123456",
      role: "realtor",
    });
  });

  it("confirmVerification maps realtor from API user to picker domain role", async () => {
    api.post.mockResolvedValue({
      token: "t",
      user: {
        id: 10,
        email: "r@test.com",
        name: "Realtor",
        role: "realtor",
      },
    });

    await expect(
      authService.confirmVerification({ email: "r@test.com", code: "123456" }),
    ).resolves.toMatchObject({ role: "picker" });
  });

  it("confirmVerification normalizes Laravel user (numeric id, api_token)", async () => {
    api.post.mockResolvedValue({
      message: "Регистрация успешна",
      is_new_user: true,
      api_token: "RYux9a8AcVxnOL2vHCfpJoLbFp4dNUMMve0rCFFNDJYvOXOQSjonorEeayow",
      user: {
        id: 32,
        email: "altabagua@yandex.ru",
        name: "alexx",
        role: "client",
        email_verified_at: [],
      },
    });

    await expect(
      authService.confirmVerification({
        email: "altabagua@yandex.ru",
        code: "123456",
      }),
    ).resolves.toEqual({
      id: "32",
      login: "altabagua@yandex.ru",
      role: "client",
      name: "alexx",
      email: "altabagua@yandex.ru",
    });
    expect(tokenStorage.set).toHaveBeenCalledWith(
      "RYux9a8AcVxnOL2vHCfpJoLbFp4dNUMMve0rCFFNDJYvOXOQSjonorEeayow",
    );
  });

  it("confirmVerification persists backend api_token (single-issue token)", async () => {
    const user = {
      id: "u-api-token",
      login: "api@test.com",
      role: "client",
      name: "Api Token User",
      email: "api@test.com",
    };
    api.post.mockResolvedValue({
      api_token: "secret-api-token-once",
      user,
    });

    await expect(
      authService.confirmVerification({ email: "api@test.com", code: "123456" }),
    ).resolves.toEqual(user);
    expect(tokenStorage.set).toHaveBeenCalledWith("secret-api-token-once");
    expect(api.get).not.toHaveBeenCalled();
  });

  it("confirmVerification calls me() when response has tokens but no user object", async () => {
    const user = {
      id: "u7",
      login: "me@test.com",
      role: "client",
      name: "Me User",
      email: "me@test.com",
    };
    api.post.mockResolvedValue({ access_token: "only-token" });
    api.get.mockResolvedValue(user);

    await expect(
      authService.confirmVerification({ email: "me@test.com", code: "123456" }),
    ).resolves.toEqual(user);
    expect(tokenStorage.set).toHaveBeenCalledWith("only-token");
    expect(api.get).toHaveBeenCalledWith("/me");
  });

  it("confirmVerification maps 429 into rate_limited auth error", async () => {
    api.post.mockRejectedValue(new ApiError(429, "Too many requests"));
    await expect(
      authService.confirmVerification({ email: "otp@test.com", code: "123456" }),
    ).rejects.toEqual({
      code: "rate_limited",
      message: getDefaultAuthErrorMessage("rate_limited"),
    });
  });

  it("confirmVerification preserves backend validation message for 422", async () => {
    api.post.mockRejectedValue(new ApiError(422, "Неверный или истёкший код"));
    await expect(
      authService.confirmVerification({ email: "otp@test.com", code: "123456" }),
    ).rejects.toEqual({
      code: "validation_error",
      message: "Неверный или истёкший код",
    });
  });

  it("confirmVerification surfaces backend message for 500 when not generic HTTP text", async () => {
    api.post.mockRejectedValue(
      new ApiError(500, "SQLSTATE[42S22]: Column not found"),
    );
    await expect(
      authService.confirmVerification({ email: "otp@test.com", code: "123456" }),
    ).rejects.toEqual({
      code: "server_error",
      message: "SQLSTATE[42S22]: Column not found",
    });
  });
});

