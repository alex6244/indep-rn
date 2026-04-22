import { pickerReportsService, mapApiSubmittedReportToDomainSubmittedReport } from "./pickerReportsService";

export { mapApiSubmittedReportToDomainSubmittedReport };

/**
 * @deprecated Use pickerReportsService from "./pickerReportsService".
 * Backward-compatible alias for submitted reports flow.
 */
export const reportService = pickerReportsService;
