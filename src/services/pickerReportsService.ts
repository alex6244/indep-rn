import { api } from "./api";
import type { DraftReport } from "../types/draftReport";
import type { SubmittedReport } from "../types/submittedReport";
import { getReportsSource, mapReportsApiError } from "./reportServiceShared";
import { AppError } from "../shared/errors/appError";

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

const mockSubmittedReports: SubmittedReport[] = [
  {
    id: "mock_submitted_1",
    carId: "car_mock_1",
    pickerId: "picker_mock_1",
    status: "pending",
    createdAt: "2026-01-01T00:00:00.000Z",
    data: {
      media: {
        salonPhoto: false,
        bodyPhoto: true,
        salonVideo: false,
        bodyVideo: false,
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
    const response = await api.get<ApiSubmittedReport[]>("/reports/my");
    return response.map(mapApiSubmittedReportToDomainSubmittedReport);
  } catch (error) {
    throw new AppError({
      kind: "unknown",
      message: mapReportServiceError(error),
      cause: error,
      context: { service: "reportService", action: "getMy" },
    });
  }
}

// Picker submitted reports service: submit/create and own submitted reports domain.
export const pickerReportsService = {
  submit: submitImpl,
  getSubmittedReportById: getSubmittedByIdImpl,
  getMySubmittedReports: getMySubmittedReportsImpl,

  /** @deprecated Use getSubmittedReportById for clearer submitted-report intent. */
  getSubmittedById: getSubmittedByIdImpl,
  /** @deprecated Use getMySubmittedReports for clearer submitted-report intent. */
  getMy: getMySubmittedReportsImpl,
  /** @deprecated Use getSubmittedReportById for clearer submitted-report intent. */
  getById: getSubmittedByIdImpl,
};

