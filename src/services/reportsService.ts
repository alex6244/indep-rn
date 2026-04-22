import {
  clientReportsService,
  mapApiReportToReport,
  type ApiReport,
} from "./clientReportsService";

export type { ApiReport };
export { mapApiReportToReport };

/**
 * @deprecated Use clientReportsService from "./clientReportsService".
 * Backward-compatible alias for purchased reports flow.
 */
export const reportsService = clientReportsService;

