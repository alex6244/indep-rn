import { api, classifyApiError } from "./api";
import type { Report } from "../types/report";
import { reports as mockReports, getReportById as getMockReportById } from "../data/reports";
import { getReportsSource, mapReportsApiError } from "./reportServiceShared";
import { AppError } from "../shared/errors/appError";
import { apiReportSchema, apiReportsListSchema, type ApiReport } from "./schemas/reportSchemas";

export type { ApiReport };

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

function mapReportsErrorKind(error: unknown): AppError["kind"] {
  const code = classifyApiError(error);
  if (code === "network" || code === "timeout" || code === "aborted") return "network";
  if (code === "unauthorized") return "unauthorized";
  if (code === "not_found") return "not_found";
  if (code === "server_error") return "server";
  return "unknown";
}

function getPayloadShapeError(error: unknown): string[] | undefined {
  if (!(error instanceof Error) || !("issues" in error)) return undefined;
  const issues = (error as { issues?: { path?: (string | number)[]; message?: string }[] }).issues;
  if (!Array.isArray(issues)) return undefined;
  return issues
    .slice(0, 5)
    .map(
      (issue) => `${(issue.path ?? []).join(".") || "root"}: ${issue.message || "invalid value"}`,
    );
}

async function getPurchasedReportsImpl(): Promise<Report[]> {
  if (getReportsSource() === "mock") {
    return mockReports;
  }

  try {
    const response = await api.get<ApiReport[]>("/reports/purchased");
    const parsed = apiReportsListSchema.safeParse(response);
    if (!parsed.success) {
      throw new AppError({
        kind: "validation",
        message: "Получены некорректные данные списка отчётов. Попробуйте позже.",
        cause: parsed.error,
        context: {
          service: "reportsService",
          action: "getPurchasedReports",
          payloadShapeError: getPayloadShapeError(parsed.error),
        },
      });
    }
    return parsed.data.map(mapApiReportToReport);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError({
      kind: mapReportsErrorKind(error),
      message: mapReportsError(error),
      cause: error,
      context: { service: "reportsService", action: "getPurchasedReports" },
    });
  }
}

async function getPurchasedReportByIdImpl(id: string): Promise<Report> {
  if (getReportsSource() === "mock") {
    const report = getMockReportById(id);
    if (!report) {
      throw new AppError({
        kind: "not_found",
        message: "Отчёт не найден.",
        context: { id, service: "reportsService", action: "getReportById" },
      });
    }
    return report;
  }

  try {
    const response = await api.get<ApiReport>(`/reports/${id}`);
    const parsed = apiReportSchema.safeParse(response);
    if (!parsed.success) {
      throw new AppError({
        kind: "validation",
        message: "Получены некорректные данные отчёта. Попробуйте позже.",
        cause: parsed.error,
        context: {
          id,
          service: "reportsService",
          action: "getReportById",
          payloadShapeError: getPayloadShapeError(parsed.error),
        },
      });
    }
    return mapApiReportToReport(parsed.data);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError({
      kind: mapReportsErrorKind(error),
      message: mapReportsError(error),
      cause: error,
      context: { id, service: "reportsService", action: "getReportById" },
    });
  }
}

// Client reports service: read-only purchased/report details domain.
export const clientReportsService = {
  getPurchasedReports: getPurchasedReportsImpl,
  getPurchasedReportById: getPurchasedReportByIdImpl,
  getReportsForDuplicateCheck: getPurchasedReportsImpl,

  /** @deprecated Use getPurchasedReportById for clearer purchased-report intent. */
  getReportById: getPurchasedReportByIdImpl,
};

