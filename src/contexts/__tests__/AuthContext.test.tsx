import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { AuthProvider, useAuth } from "../AuthContext";
import { AuthFlowError } from "../../services/authTypes";
import type { User } from "../../types/user";

jest.mock("../../services/authService", () => ({
  authService: {
    me: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    requestVerification: jest.fn(),
    confirmVerification: jest.fn(),
    logout: jest.fn(),
  },
}));

jest.mock("../../services/api", () => ({
  tokenStorage: {
    get: jest.fn(),
    clear: jest.fn(),
    set: jest.fn(),
  },
  refreshTokenStorage: {
    get: jest.fn(),
    clear: jest.fn(),
    set: jest.fn(),
  },
  setRefreshHandler: jest.fn(),
  setUnauthorizedHandler: jest.fn(),
}));

const { authService } = jest.requireMock("../../services/authService") as {
  authService: {
    me: jest.Mock;
    login: jest.Mock;
    register: jest.Mock;
    requestVerification: jest.Mock;
    confirmVerification: jest.Mock;
    logout: jest.Mock;
  };
};

const { tokenStorage, refreshTokenStorage, setUnauthorizedHandler } = jest.requireMock(
  "../../services/api",
) as {
  tokenStorage: {
    get: jest.Mock;
    clear: jest.Mock;
    set: jest.Mock;
  };
  refreshTokenStorage: {
    get: jest.Mock;
    clear: jest.Mock;
    set: jest.Mock;
  };
  setUnauthorizedHandler: jest.Mock;
};

const asyncStorageMock = AsyncStorage as unknown as {
  getItem: jest.Mock;
  removeItem: jest.Mock;
  setItem: jest.Mock;
};

type AuthSnapshot = ReturnType<typeof useAuth>;

function createSnapshotProbe(onSnapshot: (snapshot: AuthSnapshot) => void) {
  return function SnapshotProbe() {
    const auth = useAuth();
    React.useEffect(() => {
      onSnapshot(auth);
    }, [auth]);
    return null;
  };
}

async function flushAsync(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

function sampleUser(): User {
  return {
    id: "u1",
    login: "client@test.com",
    role: "client",
    name: "Client",
    email: "client@test.com",
  };
}

describe("AuthContext restore/logout flow", () => {
  let latestSnapshot: AuthSnapshot | null = null;

  beforeEach(() => {
    latestSnapshot = null;
    jest.clearAllMocks();
    delete process.env.EXPO_PUBLIC_AUTH_SOURCE;
    delete process.env.EXPO_PUBLIC_MOCK_TOKEN_TTL_MS;
    tokenStorage.get.mockResolvedValue(null);
    tokenStorage.clear.mockResolvedValue(undefined);
    refreshTokenStorage.clear.mockResolvedValue(undefined);
    asyncStorageMock.getItem.mockResolvedValue(null);
    asyncStorageMock.removeItem.mockResolvedValue(undefined);
    asyncStorageMock.setItem.mockResolvedValue(undefined);
    authService.me.mockReset();
    authService.login.mockReset();
    authService.register.mockReset();
    authService.requestVerification.mockReset();
    authService.confirmVerification.mockReset();
    authService.logout.mockReset();
  });

  it("restores session in api mode when token and me() exist", async () => {
    process.env.EXPO_PUBLIC_AUTH_SOURCE = "api";
    const user = sampleUser();
    tokenStorage.get.mockResolvedValue("token");
    authService.me.mockResolvedValue(user);

    const SnapshotProbe = createSnapshotProbe((snapshot) => {
      latestSnapshot = snapshot;
    });

    await act(async () => {
      TestRenderer.create(
        <AuthProvider>
          <SnapshotProbe />
        </AuthProvider>,
      );
    });

    await flushAsync();

    expect(authService.me).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("@auth/user", JSON.stringify(user));
    expect(latestSnapshot?.loading).toBe(false);
    expect(latestSnapshot?.user?.id).toBe(user.id);
  });

  it("falls back to api source and warns on invalid auth source env", async () => {
    process.env.EXPO_PUBLIC_AUTH_SOURCE = "broken-source";
    const telemetrySpy = jest.fn();
    (
      globalThis as unknown as {
        __INDEP_REPORT_TELEMETRY__?: (payload: {
          name: string;
          attributes?: Record<string, unknown>;
          timestamp: number;
        }) => void;
      }
    ).__INDEP_REPORT_TELEMETRY__ = telemetrySpy;
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    const user = sampleUser();
    tokenStorage.get.mockResolvedValue("token");
    authService.me.mockResolvedValue(user);

    const SnapshotProbe = createSnapshotProbe((snapshot) => {
      latestSnapshot = snapshot;
    });

    await act(async () => {
      TestRenderer.create(
        <AuthProvider>
          <SnapshotProbe />
        </AuthProvider>,
      );
    });

    await flushAsync();

    expect(authService.me).toHaveBeenCalledTimes(1);
    expect(latestSnapshot?.user?.id).toBe(user.id);
    expect(warnSpy).toHaveBeenCalledWith(
      '[auth] Invalid EXPO_PUBLIC_AUTH_SOURCE="broken-source". Falling back to "api".',
    );
    expect(telemetrySpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "invalid_env_source",
        attributes: expect.objectContaining({
          source: "auth",
          key: "EXPO_PUBLIC_AUTH_SOURCE",
          value: "broken-source",
          fallback: "api",
        }),
      }),
    );
    delete (
      globalThis as unknown as { __INDEP_REPORT_TELEMETRY__?: unknown }
    ).__INDEP_REPORT_TELEMETRY__;
    warnSpy.mockRestore();
  });

  it("clears invalid token on restore failure in api mode", async () => {
    process.env.EXPO_PUBLIC_AUTH_SOURCE = "api";
    tokenStorage.get.mockResolvedValue("bad-token");
    authService.me.mockRejectedValue(new AuthFlowError("invalid_credentials"));

    const SnapshotProbe = createSnapshotProbe((snapshot) => {
      latestSnapshot = snapshot;
    });

    await act(async () => {
      TestRenderer.create(
        <AuthProvider>
          <SnapshotProbe />
        </AuthProvider>,
      );
    });

    await flushAsync();

    expect(tokenStorage.clear).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("@auth/user");
    expect(latestSnapshot?.loading).toBe(false);
    expect(latestSnapshot?.user).toBeNull();
  });

  it("cleans user session on logout in api mode", async () => {
    process.env.EXPO_PUBLIC_AUTH_SOURCE = "api";
    const user = sampleUser();
    authService.login.mockResolvedValue(user);
    authService.logout.mockResolvedValue(undefined);

    const SnapshotProbe = createSnapshotProbe((snapshot) => {
      latestSnapshot = snapshot;
    });

    await act(async () => {
      TestRenderer.create(
        <AuthProvider>
          <SnapshotProbe />
        </AuthProvider>,
      );
    });

    await flushAsync();
    await act(async () => {
      const result = await latestSnapshot?.login({ email: user.email, password: "123456" });
      expect(result).toEqual({ success: true });
      expect(latestSnapshot?.authError).toBeNull();
    });

    await act(async () => {
      await latestSnapshot?.logout();
    });

    expect(authService.logout).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("@auth/user");
    expect(latestSnapshot?.user).toBeNull();
  });

  it("clears refresh token in unauthorized handler", async () => {
    process.env.EXPO_PUBLIC_AUTH_SOURCE = "api";
    const user = sampleUser();
    authService.login.mockResolvedValue(user);

    const SnapshotProbe = createSnapshotProbe((snapshot) => {
      latestSnapshot = snapshot;
    });

    await act(async () => {
      TestRenderer.create(
        <AuthProvider>
          <SnapshotProbe />
        </AuthProvider>,
      );
    });

    await flushAsync();
    await act(async () => {
      await latestSnapshot?.login({ email: user.email, password: "123456" });
    });
    expect(latestSnapshot?.user?.id).toBe(user.id);

    const unauthorizedHandler = setUnauthorizedHandler.mock.calls.find(
      ([handler]) => typeof handler === "function",
    )?.[0] as (() => Promise<void>) | undefined;
    expect(unauthorizedHandler).toBeDefined();

    await act(async () => {
      await unauthorizedHandler?.();
    });

    expect(refreshTokenStorage.clear).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("@auth/user");
    expect(latestSnapshot?.user).toBeNull();
  });

  it("uses mock gateway in mock mode", async () => {
    process.env.EXPO_PUBLIC_AUTH_SOURCE = "mock";

    const SnapshotProbe = createSnapshotProbe((snapshot) => {
      latestSnapshot = snapshot;
    });

    await act(async () => {
      TestRenderer.create(
        <AuthProvider>
          <SnapshotProbe />
        </AuthProvider>,
      );
    });

    await flushAsync();
    await act(async () => {
      const result = await latestSnapshot?.login({
        email: "client@test.com",
        password: "client123",
      });
      expect(result).toEqual({ success: true });
      expect(latestSnapshot?.authError).toBeNull();
    });

    expect(authService.login).not.toHaveBeenCalled();
    expect(latestSnapshot?.user?.email).toBe("client@test.com");
  });

  it("does not restore expired mock session and clears storage", async () => {
    process.env.EXPO_PUBLIC_AUTH_SOURCE = "mock";
    process.env.EXPO_PUBLIC_MOCK_TOKEN_TTL_MS = "1000";
    const user = sampleUser();
    const nowMs = 10_000;
    const nowSpy = jest.spyOn(Date, "now").mockReturnValue(nowMs);
    tokenStorage.get.mockResolvedValue(`mock_${user.id}_${nowMs - 1500}`);
    asyncStorageMock.getItem.mockResolvedValue(JSON.stringify(user));

    const SnapshotProbe = createSnapshotProbe((snapshot) => {
      latestSnapshot = snapshot;
    });

    await act(async () => {
      TestRenderer.create(
        <AuthProvider>
          <SnapshotProbe />
        </AuthProvider>,
      );
    });

    await flushAsync();

    expect(tokenStorage.clear).toHaveBeenCalledTimes(1);
    expect(asyncStorageMock.removeItem).toHaveBeenCalledWith("@auth/user");
    expect(latestSnapshot?.loading).toBe(false);
    expect(latestSnapshot?.user).toBeNull();
    nowSpy.mockRestore();
  });

  it("restores fresh mock session within ttl", async () => {
    process.env.EXPO_PUBLIC_AUTH_SOURCE = "mock";
    process.env.EXPO_PUBLIC_MOCK_TOKEN_TTL_MS = "1000";
    const user = sampleUser();
    const nowMs = 20_000;
    const nowSpy = jest.spyOn(Date, "now").mockReturnValue(nowMs);
    tokenStorage.get.mockResolvedValue(`mock_${user.id}_${nowMs - 500}`);
    asyncStorageMock.getItem.mockResolvedValue(JSON.stringify(user));

    const SnapshotProbe = createSnapshotProbe((snapshot) => {
      latestSnapshot = snapshot;
    });

    await act(async () => {
      TestRenderer.create(
        <AuthProvider>
          <SnapshotProbe />
        </AuthProvider>,
      );
    });

    await flushAsync();

    expect(tokenStorage.clear).not.toHaveBeenCalled();
    expect(latestSnapshot?.loading).toBe(false);
    expect(latestSnapshot?.user?.id).toBe(user.id);
    nowSpy.mockRestore();
  });

  it("falls back to default ttl when env ttl is invalid", async () => {
    process.env.EXPO_PUBLIC_AUTH_SOURCE = "mock";
    process.env.EXPO_PUBLIC_MOCK_TOKEN_TTL_MS = "not-a-number";
    const user = sampleUser();
    const nowMs = 30_000;
    const nowSpy = jest.spyOn(Date, "now").mockReturnValue(nowMs);
    tokenStorage.get.mockResolvedValue(`mock_${user.id}_${nowMs - 1000}`);
    asyncStorageMock.getItem.mockResolvedValue(JSON.stringify(user));

    const SnapshotProbe = createSnapshotProbe((snapshot) => {
      latestSnapshot = snapshot;
    });

    await act(async () => {
      TestRenderer.create(
        <AuthProvider>
          <SnapshotProbe />
        </AuthProvider>,
      );
    });

    await flushAsync();

    expect(tokenStorage.clear).not.toHaveBeenCalled();
    expect(latestSnapshot?.loading).toBe(false);
    expect(latestSnapshot?.user?.id).toBe(user.id);
    nowSpy.mockRestore();
  });

  it("stores structured authError on login failure and clears it after success", async () => {
    process.env.EXPO_PUBLIC_AUTH_SOURCE = "api";
    const user = sampleUser();
    authService.login
      .mockRejectedValueOnce(new AuthFlowError("invalid_credentials", "Wrong credentials"))
      .mockResolvedValueOnce(user);

    const SnapshotProbe = createSnapshotProbe((snapshot) => {
      latestSnapshot = snapshot;
    });

    await act(async () => {
      TestRenderer.create(
        <AuthProvider>
          <SnapshotProbe />
        </AuthProvider>,
      );
    });

    await flushAsync();

    await act(async () => {
      const failed = await latestSnapshot?.login({
        email: "client@test.com",
        password: "bad-password",
      });
      expect(failed).toEqual({
        success: false,
        error: { code: "invalid_credentials", message: "Wrong credentials" },
      });
    });
    expect(latestSnapshot?.authError).toEqual({
      code: "invalid_credentials",
      message: "Wrong credentials",
    });

    await act(async () => {
      const success = await latestSnapshot?.login({
        email: "client@test.com",
        password: "good-password",
      });
      expect(success).toEqual({ success: true });
    });
    expect(latestSnapshot?.authError).toBeNull();
  });

  it("requestVerification + confirmVerification set user in api mode", async () => {
    process.env.EXPO_PUBLIC_AUTH_SOURCE = "api";
    const user = sampleUser();
    authService.requestVerification.mockResolvedValue({ message: "sent" });
    authService.confirmVerification.mockResolvedValue(user);

    const SnapshotProbe = createSnapshotProbe((snapshot) => {
      latestSnapshot = snapshot;
    });
    await act(async () => {
      TestRenderer.create(
        <AuthProvider>
          <SnapshotProbe />
        </AuthProvider>,
      );
    });
    await flushAsync();

    await act(async () => {
      const requested = await latestSnapshot?.requestVerification("client@test.com");
      expect(requested).toEqual({ success: true });
    });
    await act(async () => {
      const confirmed = await latestSnapshot?.confirmVerification({
        email: "client@test.com",
        code: "123456",
      });
      expect(confirmed).toEqual({ success: true });
    });

    expect(authService.requestVerification).toHaveBeenCalledWith("client@test.com");
    expect(authService.confirmVerification).toHaveBeenCalledWith({
      email: "client@test.com",
      code: "123456",
    });
    expect(latestSnapshot?.user?.id).toBe(user.id);
  });

  it("returns structured error when confirmVerification fails", async () => {
    process.env.EXPO_PUBLIC_AUTH_SOURCE = "api";
    authService.confirmVerification.mockRejectedValue(
      new AuthFlowError("validation_error", "Неверный код"),
    );

    const SnapshotProbe = createSnapshotProbe((snapshot) => {
      latestSnapshot = snapshot;
    });
    await act(async () => {
      TestRenderer.create(
        <AuthProvider>
          <SnapshotProbe />
        </AuthProvider>,
      );
    });
    await flushAsync();

    await act(async () => {
      const result = await latestSnapshot?.confirmVerification({
        email: "client@test.com",
        code: "000000",
      });
      expect(result).toEqual({
        success: false,
        error: { code: "validation_error", message: "Неверный код" },
      });
    });
    expect(latestSnapshot?.authError).toEqual({
      code: "validation_error",
      message: "Неверный код",
    });
  });
});
