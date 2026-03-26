import type { MediaUploadState } from "./MediaUploadCard";
import type { PtsFormState } from "./PtsForm";
import type { OwnerDraft } from "./OwnersForm";
import type { LegalCleanlinessState } from "./LegalCleanlinessForm";
import type { CommercialUsageState } from "./CommercialUsageForm";
import type { DefectsState } from "./DefectsForm";

export const PICKER_REPORT_DRAFT_STORAGE_KEY = "@pickerReportDraft";

export type DraftReport = {
  media: MediaUploadState;
  generalInfo: Record<string, boolean>;
  pts: PtsFormState;
  mileage: string;
  owners: OwnerDraft[];
  legalCleanliness: LegalCleanlinessState;
  commercialUsage: CommercialUsageState;
  defects: DefectsState;
};

