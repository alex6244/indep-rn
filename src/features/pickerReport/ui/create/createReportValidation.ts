import type { OwnerFieldErrors } from "../../../../shared/validation/formatDdMmYyyy";
import type { RequiredMediaKey } from "../../../../shared/validation/mediaValidation";
import type { PtsFormFieldErrors } from "../../../../shared/validation/ptsValidation";

export type CreateReportSection = "media" | "pts" | "mileage" | "owners";

export type CreateReportValidationFeedback = {
  scrollTo: CreateReportSection;
  message: string;
  ptsErrors?: PtsFormFieldErrors;
  ownersErrors?: Record<string, OwnerFieldErrors>;
  missingMediaKeys?: RequiredMediaKey[];
  mileageError?: string;
};
