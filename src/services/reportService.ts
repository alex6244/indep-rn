import { api } from "./api";
import type { DraftReport } from "../features/pickerReport/ui/pickerReportTypes";

export type ApiReport = {
  id: string;
  carId: string;
  pickerId: string;
  clientId?: string;
  status: "draft" | "pending" | "completed";
  createdAt: string;
  data: DraftReport;
};

export type SubmittedReport = ApiReport;

export function mapApiReportToSubmittedReport(apiReport: ApiReport): SubmittedReport {
  return { ...apiReport };
}

export const reportService = {
  submit: async (draft: DraftReport): Promise<SubmittedReport> => {
    const response = await api.post<ApiReport>("/reports", draft);
    return mapApiReportToSubmittedReport(response);
  },

  getById: async (id: string): Promise<SubmittedReport> => {
    const response = await api.get<ApiReport>(`/reports/${id}`);
    return mapApiReportToSubmittedReport(response);
  },

  getMy: async (): Promise<SubmittedReport[]> => {
    const response = await api.get<ApiReport[]>("/reports/my");
    return response.map(mapApiReportToSubmittedReport);
  },
};
