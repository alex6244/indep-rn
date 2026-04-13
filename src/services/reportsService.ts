import { ApiError, api } from "./api";
import type { Report } from "../entities/report/types";
import { reports as mockReports, getReportById as getMockReportById } from "../data/reports";

type ReportsSource = "mock" | "api";

function getReportsSource(): ReportsSource {
  const raw = process.env.EXPO_PUBLIC_REPORTS_SOURCE?.trim().toLowerCase();
  return raw === "api" ? "api" : "mock";
}

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
    if (getReportsSource() === "mock") {
      return mockReports;
    }

    try {
      return await api.get<Report[]>("/reports/purchased");
    } catch (error) {
      throw new Error(mapReportsError(error));
    }
  },
  getReportById: async (id: string): Promise<Report> => {
    if (getReportsSource() === "mock") {
      const report = getMockReportById(id);
      if (!report) {
        throw new Error("Отчёт не найден.");
      }
      return report;
    }

    try {
      return await api.get<Report>(`/reports/${id}`);
    } catch (error) {
      throw new Error(mapReportsError(error));
    }
  },
  getReportsForDuplicateCheck: async (): Promise<Report[]> => {
    if (getReportsSource() === "mock") {
      return mockReports;
    }

    try {
      return await api.get<Report[]>("/reports/purchased");
    } catch (error) {
      throw new Error(mapReportsError(error));
    }
  },
};

