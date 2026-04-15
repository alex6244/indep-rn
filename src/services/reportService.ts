import { api } from "./api";
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

export function mapApiSubmittedReportToDomainSubmittedReport(
  apiReport: ApiSubmittedReport,
): SubmittedReport {
  return { ...apiReport };
}

export const reportService = {
  submit: async (draft: DraftReport): Promise<SubmittedReport> => {
    const response = await api.post<ApiSubmittedReport>("/reports", draft);
    return mapApiSubmittedReportToDomainSubmittedReport(response);
  },

  getById: async (id: string): Promise<SubmittedReport> => {
    const response = await api.get<ApiSubmittedReport>(`/reports/${id}`);
    return mapApiSubmittedReportToDomainSubmittedReport(response);
  },

  getMy: async (): Promise<SubmittedReport[]> => {
    const response = await api.get<ApiSubmittedReport[]>("/reports/my");
    return response.map(mapApiSubmittedReportToDomainSubmittedReport);
  },
};
