import { ApiError, classifyApiError } from "./api";
import { readSourceEnv } from "../config/sources";

export type ReportsSource = "mock" | "api";

export function getReportsSource(): ReportsSource {
  return readSourceEnv({
    source: "reports",
    key: "EXPO_PUBLIC_REPORTS_SOURCE",
    allowed: ["api", "mock"] as const,
    fallback: "api",
  });
}

type ReportsErrorMessages = {
  notFound: string;
  fallback: string;
};

export function mapReportsApiError(error: unknown, messages: ReportsErrorMessages): string {
  const code = classifyApiError(error);
  if (code === "timeout") return "Сервис отчётов долго отвечает. Попробуйте снова.";
  if (code === "network") return "Проблема с сетью. Проверьте подключение и попробуйте ещё раз.";
  if (code === "aborted") return "Запрос был отменён.";

  if (error instanceof ApiError) {
    if (error.status === 401) return "Сессия истекла. Войдите снова.";
    if (error.status === 404) return messages.notFound;
    if (error.status >= 500) return "Сервис отчётов временно недоступен. Попробуйте позже.";
  }
  return messages.fallback;
}
