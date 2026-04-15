import type { DraftReport } from "../features/pickerReport/ui/pickerReportTypes";

export type SubmittedReport = {
  id: string;
  carId: string;
  pickerId: string;
  clientId?: string;
  status: "draft" | "pending" | "completed";
  createdAt: string;
  data: DraftReport;
};
