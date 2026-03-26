import { api } from "./api";
import type { DraftReport } from "../features/pickerReport/ui/pickerReportTypes";

export interface Report {
  id: string;
  carId: string;
  pickerId: string;
  clientId?: string;
  status: "draft" | "pending" | "completed";
  createdAt: string;
  data: DraftReport;
}

export const reportService = {
  submit: (draft: DraftReport): Promise<Report> =>
    api.post<Report>("/reports", draft),

  getById: (id: string): Promise<Report> => api.get<Report>(`/reports/${id}`),

  getMy: (): Promise<Report[]> => api.get<Report[]>("/reports/my"),
};
