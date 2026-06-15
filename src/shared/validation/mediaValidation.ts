export type RequiredMediaKey = "salonPhoto" | "bodyPhoto";

export type MediaUploadFields = {
  salonPhoto: string[];
  bodyPhoto: string[];
  salonVideo: string[];
  bodyVideo: string[];
};

export const MEDIA_MIN_FILES: Record<RequiredMediaKey, number> = {
  bodyPhoto: 10,
  salonPhoto: 5,
};

const REQUIRED_MEDIA: readonly RequiredMediaKey[] = ["bodyPhoto", "salonPhoto"];

const MEDIA_LABELS: Record<RequiredMediaKey, string> = {
  salonPhoto: "фото салона",
  bodyPhoto: "фото кузова",
};

/** Returns user-facing error or null when required photos meet minimum counts. */
export function validateMediaUpload(media: MediaUploadFields): string | null {
  for (const key of REQUIRED_MEDIA) {
    const min = MEDIA_MIN_FILES[key];
    if (media[key].length < min) {
      return `Загрузите минимум ${min} ${MEDIA_LABELS[key]}`;
    }
  }
  return null;
}

export function getMissingRequiredMediaKeys(media: MediaUploadFields): RequiredMediaKey[] {
  return REQUIRED_MEDIA.filter((key) => media[key].length < MEDIA_MIN_FILES[key]);
}
