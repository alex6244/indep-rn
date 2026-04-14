import { authService } from "../authService";

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

const { api, tokenStorage, refreshTokenStorage } = jest.requireMock("../api") as {
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
});

