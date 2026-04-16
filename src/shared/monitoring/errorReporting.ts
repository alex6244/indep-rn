type ErrorContext = Record<string, unknown>;

type ErrorReporterPayload = {
  error: unknown;
  context?: ErrorContext;
  timestamp: number;
};

type TelemetryPayload = {
  name: string;
  attributes?: Record<string, unknown>;
  timestamp: number;
};

type GlobalErrorReporter = (payload: ErrorReporterPayload) => void;
type GlobalTelemetryReporter = (payload: TelemetryPayload) => void;
const fallbackSignals = new Set<string>();

function getGlobalErrorReporter(): GlobalErrorReporter | null {
  const maybeFn = (globalThis as { __INDEP_REPORT_ERROR__?: unknown }).__INDEP_REPORT_ERROR__;
  return typeof maybeFn === "function" ? (maybeFn as GlobalErrorReporter) : null;
}

function getGlobalTelemetryReporter(): GlobalTelemetryReporter | null {
  const maybeFn = (globalThis as { __INDEP_REPORT_TELEMETRY__?: unknown }).__INDEP_REPORT_TELEMETRY__;
  return typeof maybeFn === "function" ? (maybeFn as GlobalTelemetryReporter) : null;
}

function emitFallbackSignalOnce(key: string, message: string, payload: unknown): void {
  if (fallbackSignals.has(key)) return;
  fallbackSignals.add(key);
  try {
    console.error(message, payload);
  } catch {
    // Never throw from fallback signal path.
  }
}

// Adapter layer for production error reporting integration (Sentry/Crashlytics/etc.).
export function reportError(error: unknown, context?: ErrorContext): void {
  try {
    const reporter = getGlobalErrorReporter();
    if (reporter) {
      reporter({
        error,
        context,
        timestamp: Date.now(),
      });
      return;
    }
    emitFallbackSignalOnce("missing_error_reporter", "[monitoring][error][fallback]", {
      error,
      context,
    });
  } catch {
    // Never throw from monitoring path.
  }
}

export function reportTelemetry(name: string, attributes?: Record<string, unknown>): void {
  try {
    const reporter = getGlobalTelemetryReporter();
    if (reporter) {
      reporter({
        name,
        attributes,
        timestamp: Date.now(),
      });
      return;
    }
    emitFallbackSignalOnce(
      `missing_telemetry_reporter:${name}`,
      "[monitoring][telemetry][fallback]",
      { name, attributes },
    );
  } catch {
    // Never throw from monitoring path.
  }
}
