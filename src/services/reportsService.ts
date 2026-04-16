import { api } from "./api";
import type { Report } from "../types/report";
import { reports as mockReports, getReportById as getMockReportById } from "../data/reports";
import { getReportsSource, mapReportsApiError } from "./reportServiceShared";
import { AppError } from "../shared/errors/appError";

export type ApiReport = {
  id: string;
  price: string;
  title: string;
  subtitle: string;
  city: string;
  imageUrl: string;
  carouselImages: string[];
  photosCountText?: string;
  defects: {
    schemeImageUrl: string;
    photoImageUrls: string[];
    summaryText: string;
  };
  ptsData: { label: string; value: string }[];
  mileageText: string;
  owners: {
    jur: { title: string; value: string };
    phys: { title: string; value: string };
  };
  legalCleanliness: {
    badgeText: string;
    items: { text: string; tone: "ok" | "bad" }[];
  };
  commercialUsage: {
    badgeText: string;
    items: { text: string; tone: "ok" | "bad" }[];
  };
  penalties: {
    amountText: string;
    dateText: string;
    descriptionText: string;
    paid: boolean;
  }[];
  costEstimation: {
    text: string;
    rangeText: string;
  };
  yearText?: string;
  bodyTypeText?: string;
};

function toImageSource(uri: string) {
  return { uri };
}

export function mapApiReportToReport(apiReport: ApiReport): Report {
  return {
    id: apiReport.id,
    price: apiReport.price,
    title: apiReport.title,
    subtitle: apiReport.subtitle,
    city: apiReport.city,
    imageUrl: toImageSource(apiReport.imageUrl),
    carouselImages: apiReport.carouselImages.map(toImageSource),
    photosCountText: apiReport.photosCountText,
    defects: {
      schemeImageUrl: toImageSource(apiReport.defects.schemeImageUrl),
      photoImageUrls: apiReport.defects.photoImageUrls.map(toImageSource),
      summaryText: apiReport.defects.summaryText,
    },
    ptsData: apiReport.ptsData,
    mileageText: apiReport.mileageText,
    owners: apiReport.owners,
    legalCleanliness: apiReport.legalCleanliness,
    commercialUsage: apiReport.commercialUsage,
    penalties: apiReport.penalties,
    costEstimation: apiReport.costEstimation,
    yearText: apiReport.yearText,
    bodyTypeText: apiReport.bodyTypeText,
  };
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
      throw new AppError({
        kind: "unknown",
        message: mapReportsError(error),
        cause: error,
        context: { service: "reportsService", action: "getPurchasedReports" },
      });
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
      throw new AppError({
        kind: "unknown",
        message: mapReportsError(error),
        cause: error,
        context: { service: "reportsService", action: "getReportById" },
      });
    }
  },
  getReportsForDuplicateCheck: async (): Promise<Report[]> => {
    return reportsService.getPurchasedReports();
  },
};

