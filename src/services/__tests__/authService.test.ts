import { authService } from "../authService";
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
      token: "access-token",
      refresh_token: "refresh-token",
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

  it("login throws structured unknown error with fallback message", async () => {
    api.post.mockRejectedValue(new Error("non-api-failure"));

    await expect(authService.login({ email: "user@test.com", password: "123456" })).rejects.toEqual({
      code: "unknown",
      message: getDefaultAuthErrorMessage("unknown"),
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
      token: "register-token",
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
    expect(api.get).toHaveBeenCalledWith("/auth/me");
  });

  it("me throws structured network_error for status 0", async () => {
    const apiError = new ApiError(0, "Network request failed");
    api.get.mockRejectedValue(apiError);

    await expect(authService.me()).rejects.toEqual({
      code: "network_error",
      message: getDefaultAuthErrorMessage("network_error"),
    });
  });
});

