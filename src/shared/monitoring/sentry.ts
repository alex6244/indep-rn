import Constants from "expo-constants";
import { Platform } from "react-native";
import { envString } from "../../config/env";
import { ApiError } from "../../services/api";

type ErrorReporterPayload = {
  error: unknown;
  context?: Record<string, unknown>;
  timestamp: number;
};

type TelemetryReporterPayload = {
  name: string;
  attributes?: Record<string, unknown>;
  timestamp: number;
};

let initialized = false;

function getReleaseName(): string | undefined {
  const config = Constants.expoConfig;
  if (!config?.slug || !config.version) return undefined;
  return `${config.slug}@${config.version}`;
}

function normalizeError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(typeof error === "string" ? error : "Unknown application error");
}

export function initSentryMonitoring(): void {
  if (initialized) return;
  initialized = true;

  const dsn = envString("EXPO_PUBLIC_SENTRY_DSN");
  if (!dsn) return;

  // Require dynamically to avoid test/runtime issues when native modules are mocked.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Sentry = require("@sentry/react-native") as typeof import("@sentry/react-native");

  const environment = envString("EXPO_PUBLIC_SENTRY_ENVIRONMENT") || (__DEV__ ? "development" : "production");
  const release = getReleaseName();

  Sentry.init({
    dsn,
    enabled: !__DEV__,
    environment,
    release,
  });

  Sentry.setTag("platform", Platform.OS);
  if (Constants.expoConfig?.version) {
    Sentry.setTag("app_version", Constants.expoConfig.version);
  }

  (
    globalThis as unknown as {
      __INDEP_REPORT_ERROR__?: (payload: ErrorReporterPayload) => void;
    }
  ).__INDEP_REPORT_ERROR__ = ({ error, context, timestamp }: ErrorReporterPayload) => {
    // User-cancelled fetches are expected and should not be tracked as incidents.
    if (error instanceof ApiError && error.code === "aborted") return;
    Sentry.withScope((scope) => {
      if (context) scope.setContext("app_context", context);
      scope.setExtra("timestamp", timestamp);
      Sentry.captureException(normalizeError(error));
    });
  };

  (
    globalThis as unknown as {
      __INDEP_REPORT_TELEMETRY__?: (payload: TelemetryReporterPayload) => void;
    }
  ).__INDEP_REPORT_TELEMETRY__ = ({ name, attributes, timestamp }: TelemetryReporterPayload) => {
    Sentry.addBreadcrumb({
      category: "telemetry",
      message: name,
      data: { ...(attributes ?? {}), timestamp },
      level: "info",
    });
  };
}

