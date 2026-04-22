import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { renderHook, act } from "@testing-library/react-native";
import { useProtected, useRequireAuth } from "../useProtected";


jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

const { useAuth } = jest.requireMock("../../contexts/AuthContext") as {
  useAuth: jest.Mock;
};
const { useRouter } = jest.requireMock("expo-router") as {
  useRouter: jest.Mock;
};

describe("useProtected redirect contract", () => {
  const push = jest.fn();
  const replace = jest.fn();

  beforeEach(() => {
    push.mockReset();
    replace.mockReset();
    useRouter.mockReturnValue({ push, replace });
  });

  it("checkAuth redirects and returns false when user is missing", () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    const { result } = renderHook(() => useProtected());
    const checkResult = result.current.checkAuth({ redirectTo: "/(auth)" });
    expect(checkResult).toBe(false);
    expect(push).toHaveBeenCalledWith("/(auth)");
  });

  it("checkAuth returns true and does not redirect when user exists", () => {
    useAuth.mockReturnValue({ user: { id: "u1" }, loading: false });
    const { result } = renderHook(() => useProtected());
    const checkResult = result.current.checkAuth({ redirectTo: "/(auth)" });
    expect(checkResult).toBe(true);
    expect(push).not.toHaveBeenCalled();
  });

  it("useRequireAuth redirects only when loading is false and user is missing", async () => {
    useAuth.mockReturnValue({ user: null, loading: true });
    const { rerender } = renderHook(() => useRequireAuth("/(auth)"));
    await act(async () => Promise.resolve());
    expect(replace).not.toHaveBeenCalled();

    useAuth.mockReturnValue({ user: null, loading: false });
    rerender({});
    await act(async () => Promise.resolve());
    expect(replace).toHaveBeenCalledWith("/(auth)");
  });
});
