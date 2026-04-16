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

// Picker submitted reports service: submit/create and own submitted reports domain.
export const reportService = {
  submit: async (draft: DraftReport): Promise<SubmittedReport> => {
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
  },

  getSubmittedById: async (id: string): Promise<SubmittedReport> => {
    if (getReportsSource() === "mock") {
      const report = mockSubmittedReports.find((item) => item.id === id);
      if (!report) {
        throw new Error("Отчёт не найден.");
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
  },

  getMy: async (): Promise<SubmittedReport[]> => {
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
  },

  /** @deprecated Use getSubmittedById for clearer submitted-report intent. */
  getById: async (id: string): Promise<SubmittedReport> => reportService.getSubmittedById(id),
};
