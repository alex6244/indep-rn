import { ApiError, api } from "./api";
import type { Report } from "../data/reports";

function mapReportsError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return "Сессия истекла. Войдите снова.";
    if (error.status === 404) return "Отчёты не найдены.";
    if (error.status === 0) return "Проблема с сетью. Проверьте подключение и попробуйте ещё раз.";
    if (error.status >= 500) return "Сервис отчётов временно недоступен. Попробуйте позже.";
  }
  return "Не удалось загрузить отчёты. Попробуйте ещё раз.";
}

export const reportsService = {
  getPurchasedReports: async (): Promise<Report[]> => {
    try {
      return await api.get<Report[]>("/reports/purchased");
    } catch (error) {
      throw new Error(mapReportsError(error));
    }
  },
};

