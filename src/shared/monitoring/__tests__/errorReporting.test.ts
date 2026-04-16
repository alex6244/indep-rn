import { reportError, reportTelemetry } from "../errorReporting";

describe("errorReporting adapter", () => {
  beforeEach(() => {
    delete (
      globalThis as unknown as { __INDEP_REPORT_ERROR__?: unknown }
    ).__INDEP_REPORT_ERROR__;
    delete (
      globalThis as unknown as { __INDEP_REPORT_TELEMETRY__?: unknown }
    ).__INDEP_REPORT_TELEMETRY__;
  });

  it("does not throw when reporters are not configured", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => reportError(new Error("boom"), { scope: "test" })).not.toThrow();
    expect(() => reportTelemetry("test_event", { scope: "test" })).not.toThrow();
    consoleErrorSpy.mockRestore();
  });

  it("calls configured error reporter in production-like mode", () => {
    const originalDev = (globalThis as { __DEV__?: boolean }).__DEV__;
    (globalThis as { __DEV__?: boolean }).__DEV__ = false;
    const errorReporter = jest.fn();
    (
      globalThis as unknown as {
        __INDEP_REPORT_ERROR__?: (payload: {
          error: unknown;
          context?: Record<string, unknown>;
          timestamp: number;
        }) => void;
      }
    ).__INDEP_REPORT_ERROR__ = errorReporter;

    reportError(new Error("boom"), { source: "test" });

    expect(errorReporter).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Error),
        context: { source: "test" },
      }),
    );

    (globalThis as { __DEV__?: boolean }).__DEV__ = originalDev;
  });

  it("calls configured telemetry reporter in production-like mode", () => {
    const originalDev = (globalThis as { __DEV__?: boolean }).__DEV__;
    (globalThis as { __DEV__?: boolean }).__DEV__ = false;
    const telemetryReporter = jest.fn();
    (
      globalThis as unknown as {
        __INDEP_REPORT_TELEMETRY__?: (payload: {
          name: string;
          attributes?: Record<string, unknown>;
          timestamp: number;
        }) => void;
      }
    ).__INDEP_REPORT_TELEMETRY__ = telemetryReporter;

    reportTelemetry("test_event", { scope: "monitoring" });

    expect(telemetryReporter).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "test_event",
        attributes: { scope: "monitoring" },
      }),
    );

    (globalThis as { __DEV__?: boolean }).__DEV__ = originalDev;
  });
});
