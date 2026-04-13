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
  },
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
      const ok = await latestSnapshot?.login({ email: user.email, password: "123456" });
      expect(ok).toBe(true);
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
      const ok = await latestSnapshot?.login({
        email: "client@test.com",
        password: "client123",
      });
      expect(ok).toBe(true);
    });

    expect(authService.login).not.toHaveBeenCalled();
    expect(latestSnapshot?.user?.email).toBe("client@test.com");
  });
});
