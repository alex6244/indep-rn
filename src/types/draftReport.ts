// Pure domain/data types for a picker's draft report.
// These types live here (domain layer) so that services and domain types
// can reference them without importing from the feature UI layer.

export type MediaKey = "salonPhoto" | "bodyPhoto" | "salonVideo" | "bodyVideo";

export type MediaUploadState = Record<MediaKey, boolean>;

export type PtsType = "original" | "nonOriginal";

export type PtsFormState = {
  vin: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  engineVolume: string;
  ptsType: PtsType;
  hasElectronicPts: boolean;
};

export type OwnerType = "jur" | "phys";

export type OwnerDraft = {
  id: string;
  type: OwnerType;
  startDate: string;
  endDate: string;
};

export type LegalCleanlinessState = {
  pledge: boolean;
  registrationRestrictions: boolean;
  wanted: boolean;
};

export type CommercialUsageState = {
  taxiPermission: boolean;
  carSharing: boolean;
  leasing: boolean;
};

export type DefectsMode = "scheme" | "photos";

export type DamageDraft = {
  id: string;
  description: string;
};

export type DefectsState = {
  mode: DefectsMode;
  damages: DamageDraft[];
  activeDamageId: string;
};

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
