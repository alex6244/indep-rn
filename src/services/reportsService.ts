import { api } from "./api";
import type { Report } from "../types/report";
import { reports as mockReports, getReportById as getMockReportById } from "../data/reports";
import { getReportsSource, mapReportsApiError } from "./reportServiceShared";

type ApiReport = Report;

export function mapApiReportToReport(apiReport: ApiReport): Report {
  return { ...apiReport };
}

function mapReportsError(error: unknown): string {
  return mapReportsApiError(error, {
    notFound: "Отчёты не найдены.",
    fallback: "Не удалось загрузить отчёты. Попробуйте ещё раз.",
  });
}

// Client reports service: read-only purchased/report details domain.
export const reportsService = {
  getPurchasedReports: async (): Promise<Report[]> => {
    if (getReportsSource() === "mock") {
      return mockReports;
    }

    try {
      const response = await api.get<ApiReport[]>("/reports/purchased");
      return response.map(mapApiReportToReport);
    } catch (error) {
      // TODO(architecture): migrate service error contracts to a shared AppError format.
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
      // TODO(architecture): migrate service error contracts to a shared AppError format.
      throw new Error(mapReportsError(error));
    }
  },
  getReportsForDuplicateCheck: async (): Promise<Report[]> => {
    return reportsService.getPurchasedReports();
  },
};

