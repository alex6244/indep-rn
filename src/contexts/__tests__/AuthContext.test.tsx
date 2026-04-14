import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { AuthProvider, useAuth } from "../AuthContext";
import { AuthFlowError } from "../../services/authTypes";
import type { User } from "../../data/users";

jest.mock("../../services/authService", () => ({
  authService: {
    me: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
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
    logout: jest.Mock;
  };
};

const { tokenStorage } = jest.requireMock("../../services/api") as {
  tokenStorage: {
    get: jest.Mock;
    clear: jest.Mock;
    set: jest.Mock;
  };
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
    tokenStorage.get.mockResolvedValue(null);
    tokenStorage.clear.mockResolvedValue(undefined);
    authService.me.mockReset();
    authService.login.mockReset();
    authService.register.mockReset();
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
});
