import { api, classifyApiError } from "./api";
import type { DraftReport } from "../types/draftReport";
import type { Report } from "../types/report";
import type { SubmittedReport } from "../types/submittedReport";
import { mapApiReportToReport } from "./clientReportsService";
import { mapSubmittedReportToReport } from "./mapSubmittedReportToReport";
import { getReportsSource, mapReportsApiError } from "./reportServiceShared";
import { AppError } from "../shared/errors/appError";
import { apiReportSchema, apiReportsListSchema } from "./schemas/reportSchemas";

type ApiSubmittedReport = {
  id: string;
  carId: string;
  pickerId: string;
  clientId?: string;
  status: "draft" | "pending" | "completed";
  createdAt: string;
  data: DraftReport;
};

export function mapApiSubmittedReportToDomainSubmittedReport(
  apiReport: ApiSubmittedReport,
): SubmittedReport {
  return { ...apiReport };
}

function mapReportServiceError(error: unknown): string {
  return mapReportsApiError(error, {
    notFound: "Отчёт не найден.",
    fallback: "Не удалось выполнить операцию с отчётом. Попробуйте ещё раз.",
  });
}

function mapPickerReportsListError(error: unknown): string {
  return mapReportsApiError(error, {
    notFound: "Отчёты не найдены.",
    fallback: "Не удалось загрузить отчёты. Попробуйте ещё раз.",
  });
}

function mapPickerReportsErrorKind(error: unknown): AppError["kind"] {
  const code = classifyApiError(error);
  if (code === "network" || code === "timeout" || code === "aborted") return "network";
  if (code === "unauthorized") return "unauthorized";
  if (code === "not_found") return "not_found";
  if (code === "server_error") return "server";
  return "unknown";
}

function isSubmittedReportShape(item: unknown): item is ApiSubmittedReport {
  if (!item || typeof item !== "object") return false;
  const o = item as Record<string, unknown>;
  return typeof o.id === "string" && o.data !== null && typeof o.data === "object";
}

function mapResponseItemToReport(item: unknown): Report | null {
  if (!item || typeof item !== "object") return null;
  const parsedReport = apiReportSchema.safeParse(item);
  if (parsedReport.success) {
    return mapApiReportToReport(parsedReport.data);
  }
  if (isSubmittedReportShape(item)) {
    return mapSubmittedReportToReport(mapApiSubmittedReportToDomainSubmittedReport(item));
  }
  return null;
}

const mockSubmittedReports: SubmittedReport[] = [
  {
    id: "mock_submitted_1",
    carId: "car_mock_1",
    pickerId: "picker_mock_1",
    status: "pending",
    createdAt: "2026-01-01T00:00:00.000Z",
    data: {
      media: {
        salonPhoto: null,
        bodyPhoto: null,
        salonVideo: null,
        bodyVideo: null,
      },
      generalInfo: {},
      pts: {
        vin: "MOCKVIN1234567890",
        brand: "Mock",
        model: "Car",
        year: "2020",
        color: "Black",
        engineVolume: "2.0",
        ptsType: "original",
        hasElectronicPts: true,
      },
      mileage: "100000",
      owners: [],
      legalCleanliness: {
        pledge: true,
        registrationRestrictions: true,
        wanted: true,
      },
      commercialUsage: {
        taxiPermission: true,
        carSharing: true,
        leasing: true,
      },
      defects: {
        mode: "scheme",
        damages: [{ id: "damage_1", description: "" }],
        activeDamageId: "damage_1",
      },
    },
  },
];

async function submitImpl(draft: DraftReport): Promise<SubmittedReport> {
  if (getReportsSource() === "mock") {
    const mockItem: SubmittedReport = {
      id: `mock_submitted_${Date.now()}`,
      carId: "car_mock_submitted",
      pickerId: "picker_mock_submitted",
      status: "pending",
      createdAt: new Date().toISOString(),
      data: draft,
    };
    mockSubmittedReports.unshift(mockItem);
    return mockItem;
  }

  try {
    const response = await api.post<ApiSubmittedReport>("/reports", draft);
    return mapApiSubmittedReportToDomainSubmittedReport(response);
  } catch (error) {
    throw new AppError({
      kind: "unknown",
      message: mapReportServiceError(error),
      cause: error,
      context: { service: "reportService", action: "submit" },
    });
  }
}

async function getSubmittedByIdImpl(id: string): Promise<SubmittedReport> {
  if (getReportsSource() === "mock") {
    const report = mockSubmittedReports.find((item) => item.id === id);
    if (!report) {
      throw new AppError({
        kind: "not_found",
        message: "Отчёт не найден.",
        context: { id, service: "reportService", action: "getSubmittedById" },
      });
    }
    return report;
  }

  try {
    const response = await api.get<ApiSubmittedReport>(`/reports/${id}`);
    return mapApiSubmittedReportToDomainSubmittedReport(response);
  } catch (error) {
    throw new AppError({
      kind: "unknown",
      message: mapReportServiceError(error),
      cause: error,
      context: { service: "reportService", action: "getSubmittedById" },
    });
  }
}

async function getMySubmittedReportsImpl(): Promise<SubmittedReport[]> {
  if (getReportsSource() === "mock") {
    return [...mockSubmittedReports];
  }

  try {
    const response = await api.get<unknown>("/reports/my");
    if (!Array.isArray(response)) return [];
    return response.filter(isSubmittedReportShape).map(mapApiSubmittedReportToDomainSubmittedReport);
  } catch (error) {
    throw new AppError({
      kind: mapPickerReportsErrorKind(error),
      message: mapPickerReportsListError(error),
      cause: error,
      context: { service: "pickerReportsService", action: "getMySubmittedReports" },
    });
  }
}

async function getMyReportsForDisplayImpl(): Promise<Report[]> {
  if (getReportsSource() === "mock") {
    return mockSubmittedReports.map(mapSubmittedReportToReport);
  }

  try {
    const response = await api.get<unknown>("/reports/my");
    const parsedList = apiReportsListSchema.safeParse(response);
    if (parsedList.success) {
      return parsedList.data.map(mapApiReportToReport);
    }
    if (!Array.isArray(response)) return [];
    return response
      .map(mapResponseItemToReport)
      .filter((report): report is Report => report !== null);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError({
      kind: mapPickerReportsErrorKind(error),
      message: mapPickerReportsListError(error),
      cause: error,
      context: { service: "pickerReportsService", action: "getMyReportsForDisplay" },
    });
  }
}

async function getReportForDisplayByIdImpl(id: string, signal?: AbortSignal): Promise<Report> {
  if (getReportsSource() === "mock") {
    const submitted = mockSubmittedReports.find((item) => item.id === id);
    if (!submitted) {
      throw new AppError({
        kind: "not_found",
        message: "Отчёт не найден.",
        context: { id, service: "pickerReportsService", action: "getReportForDisplayById" },
      });
    }
    return mapSubmittedReportToReport(submitted);
  }

  try {
    const response = await api.get<unknown>(`/reports/${id}`, { signal });
    const mapped = mapResponseItemToReport(response);
    if (mapped) return mapped;
    throw new AppError({
      kind: "not_found",
      message: "Отчёт не найден.",
      context: { id, service: "pickerReportsService", action: "getReportForDisplayById" },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError({
      kind: mapPickerReportsErrorKind(error),
      message: mapReportServiceError(error),
      cause: error,
      context: { id, service: "pickerReportsService", action: "getReportForDisplayById" },
    });
  }
}

// Picker submitted reports service: submit/create and own submitted reports domain.
export const pickerReportsService = {
  submit: submitImpl,
  getSubmittedReportById: getSubmittedByIdImpl,
  getMySubmittedReports: getMySubmittedReportsImpl,
  getMyReportsForDisplay: getMyReportsForDisplayImpl,
  getReportForDisplayById: getReportForDisplayByIdImpl,

  /** @deprecated Use getSubmittedReportById for clearer submitted-report intent. */
  getSubmittedById: getSubmittedByIdImpl,
  /** @deprecated Use getMySubmittedReports for clearer submitted-report intent. */
  getMy: getMySubmittedReportsImpl,
  /** @deprecated Use getSubmittedReportById for clearer submitted-report intent. */
  getById: getSubmittedByIdImpl,
};

