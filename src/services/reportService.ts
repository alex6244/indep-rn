import { ApiError, api } from "./api";
import type { DraftReport } from "../features/pickerReport/ui/pickerReportTypes";
import type { SubmittedReport } from "../types/submittedReport";

type ApiSubmittedReport = {
  id: string;
  carId: string;
  pickerId: string;
  clientId?: string;
  status: "draft" | "pending" | "completed";
  createdAt: string;
  data: DraftReport;
};

type ReportSource = "mock" | "api";

export function mapApiSubmittedReportToDomainSubmittedReport(
  apiReport: ApiSubmittedReport,
): SubmittedReport {
  return { ...apiReport };
}

function getReportSource(): ReportSource {
  const raw = process.env.EXPO_PUBLIC_REPORTS_SOURCE?.trim().toLowerCase();
  return raw === "api" ? "api" : "mock";
}

function mapReportServiceError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return "Сессия истекла. Войдите снова.";
    if (error.status === 404) return "Отчёт не найден.";
    if (error.status === 0) return "Проблема с сетью. Проверьте подключение и попробуйте ещё раз.";
    if (error.status >= 500) return "Сервис отчётов временно недоступен. Попробуйте позже.";
  }
  return "Не удалось выполнить операцию с отчётом. Попробуйте ещё раз.";
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

export const reportService = {
  submit: async (draft: DraftReport): Promise<SubmittedReport> => {
    if (getReportSource() === "mock") {
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
      // TODO(architecture): migrate service error contracts to a shared AppError format.
      throw new Error(mapReportServiceError(error));
    }
  },

  getById: async (id: string): Promise<SubmittedReport> => {
    if (getReportSource() === "mock") {
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
      // TODO(architecture): migrate service error contracts to a shared AppError format.
      throw new Error(mapReportServiceError(error));
    }
  },

  getMy: async (): Promise<SubmittedReport[]> => {
    if (getReportSource() === "mock") {
      return [...mockSubmittedReports];
    }

    try {
      const response = await api.get<ApiSubmittedReport[]>("/reports/my");
      return response.map(mapApiSubmittedReportToDomainSubmittedReport);
    } catch (error) {
      // TODO(architecture): migrate service error contracts to a shared AppError format.
      throw new Error(mapReportServiceError(error));
    }
  },
};
