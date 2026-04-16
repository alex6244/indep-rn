import React from "react";
import { Text } from "react-native";
import TestRenderer, { act } from "react-test-renderer";
import { ErrorBoundary } from "../ErrorBoundary";

jest.mock("../../monitoring/errorReporting", () => ({
  reportError: jest.fn(),
}));

const { reportError } = jest.requireMock("../../monitoring/errorReporting") as {
  reportError: jest.Mock;
};

function ThrowingChild() {
  throw new Error("boom");
}

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders children when there is no render error", () => {
    let root: TestRenderer.ReactTestRenderer;
    act(() => {
      root = TestRenderer.create(
        <ErrorBoundary>
          <Text testID="child-ok">ok</Text>
        </ErrorBoundary>,
      );
    });

    expect(root!.root.findByProps({ testID: "child-ok" })).toBeTruthy();
  });

  it("captures render errors and shows fallback UI", () => {
    let root: TestRenderer.ReactTestRenderer;
    act(() => {
      root = TestRenderer.create(
        <ErrorBoundary>
          <ThrowingChild />
        </ErrorBoundary>,
      );
    });

    expect(reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        source: "ErrorBoundary",
        componentStack: expect.any(String),
      }),
    );
    expect(root!.root.findByProps({ children: "Что-то пошло не так" })).toBeTruthy();
  });
});
