import React from "react";
import { render } from "@testing-library/react-native";
import AiPickerRoute from "../ai-picker";

jest.mock("../../hooks/useProtected", () => ({
  useRequireAuth: jest.fn(),
}));

jest.mock("../../features/aiPicker/ui/AiPickerScreen", () => ({
  AiPickerScreen: () => {
    const { Text } = require("react-native");
    return <Text testID="ai-picker-screen">chat</Text>;
  },
}));

jest.mock("../../shared/ui/ScreenStateLoading", () => ({
  ScreenStateLoading: () => {
    const { Text } = require("react-native");
    return <Text testID="loading">loading</Text>;
  },
}));

const { useRequireAuth } = jest.requireMock("../../hooks/useProtected") as {
  useRequireAuth: jest.Mock;
};

describe("AiPickerRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading while auth is resolving", () => {
    useRequireAuth.mockReturnValue({ user: null, loading: true });
    const { getByTestId, queryByTestId } = render(<AiPickerRoute />);
    expect(getByTestId("loading")).toBeTruthy();
    expect(queryByTestId("ai-picker-screen")).toBeNull();
  });

  it("does not render chat without user", () => {
    useRequireAuth.mockReturnValue({ user: null, loading: false });
    const { getByTestId, queryByTestId } = render(<AiPickerRoute />);
    expect(getByTestId("loading")).toBeTruthy();
    expect(queryByTestId("ai-picker-screen")).toBeNull();
  });

  it("renders chat for authenticated user", () => {
    useRequireAuth.mockReturnValue({
      user: { id: "1", role: "client" },
      loading: false,
    });
    const { getByTestId, queryByTestId } = render(<AiPickerRoute />);
    expect(getByTestId("ai-picker-screen")).toBeTruthy();
    expect(queryByTestId("loading")).toBeNull();
  });
});
