import { ApiError } from "./api";
import { reportTelemetry } from "../shared/monitoring/errorReporting";

export type ReportsSource = "mock" | "api";

export function getReportsSource(): ReportsSource {
  const raw = process.env.EXPO_PUBLIC_REPORTS_SOURCE?.trim().toLowerCase();
  if (!raw || raw === "api") return "api";
  if (raw === "mock") return "mock";
  reportTelemetry("invalid_env_source", {
    source: "reports",
    key: "EXPO_PUBLIC_REPORTS_SOURCE",
    value: raw,
    fallback: "api",
  });
  if (__DEV__) {
    console.warn(
      `[reports] Invalid EXPO_PUBLIC_REPORTS_SOURCE="${raw}". Falling back to "api".`,
    );
  }
  return "api";
}

type ReportsErrorMessages = {
  notFound: string;
  fallback: string;
};

export function mapReportsApiError(error: unknown, messages: ReportsErrorMessages): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return "Сессия истекла. Войдите снова.";
    if (error.status === 404) return messages.notFound;
    if (error.status === 0) return "Проблема с сетью. Проверьте подключение и попробуйте ещё раз.";
    if (error.status >= 500) return "Сервис отчётов временно недоступен. Попробуйте позже.";
  }
  return messages.fallback;
}
