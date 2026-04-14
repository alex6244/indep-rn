import { ApiError, api } from "./api";
import type { Report } from "../types/report";
import { reports as mockReports, getReportById as getMockReportById } from "../data/reports";

type ReportsSource = "mock" | "api";
type ApiReport = Report;

export function mapApiReportToReport(apiReport: ApiReport): Report {
  return { ...apiReport };
}

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
      const response = await api.get<ApiReport[]>("/reports/purchased");
      return response.map(mapApiReportToReport);
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
      const response = await api.get<ApiReport>(`/reports/${id}`);
      return mapApiReportToReport(response);
    } catch (error) {
      throw new Error(mapReportsError(error));
    }
  },
  getReportsForDuplicateCheck: async (): Promise<Report[]> => {
    if (getReportsSource() === "mock") {
      return mockReports;
    }

    try {
      const response = await api.get<ApiReport[]>("/reports/purchased");
      return response.map(mapApiReportToReport);
    } catch (error) {
      throw new Error(mapReportsError(error));
    }
  },
};

