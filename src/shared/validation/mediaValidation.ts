export type RequiredMediaKey = "salonPhoto" | "bodyPhoto";

export type MediaUploadFields = {
  salonPhoto: string | null;
  bodyPhoto: string | null;
  salonVideo: string | null;
  bodyVideo: string | null;
};

const REQUIRED_MEDIA: readonly RequiredMediaKey[] = ["salonPhoto", "bodyPhoto"];

const MEDIA_LABELS: Record<RequiredMediaKey, string> = {
  salonPhoto: "фото салона",
  bodyPhoto: "фото кузова",
};

/** Returns user-facing error or null when required photos are present. */
export function validateMediaUpload(media: MediaUploadFields): string | null {
  const missing = REQUIRED_MEDIA.filter((key) => !media[key]);
  if (missing.length === 0) return null;

  if (missing.length === REQUIRED_MEDIA.length) {
    return "Загрузите фото салона и фото кузова";
  }

  return `Загрузите ${MEDIA_LABELS[missing[0]!]}`;
}

export function getMissingRequiredMediaKeys(media: MediaUploadFields): RequiredMediaKey[] {
  return REQUIRED_MEDIA.filter((key) => !media[key]);
}
