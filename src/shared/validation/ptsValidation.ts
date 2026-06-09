import { MIN_OWNERSHIP_YEAR } from "./formatDdMmYyyy";

export const YEAR_MIN = Math.max(1980, MIN_OWNERSHIP_YEAR);
export const YEAR_MAX = new Date().getFullYear();

const VIN_INVALID_CHARS = /[^A-HJ-NPR-Z0-9]/gi;
const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;
const ENGINE_VOLUME_PATTERN = /^[1-9]\.[0-9]$/;

export type PtsFormFields = {
  vin: string;
  year: string;
  engineVolume: string;
};

export type PtsFormFieldErrors = Partial<Record<keyof PtsFormFields, string>>;

/** Uppercase, no spaces — for duplicate check (may be partial). */
export function normalizeVinForCompare(vin: string): string {
  return (vin ?? "").toUpperCase().replace(/\s+/g, "");
}

/** Filters input to valid VIN charset, uppercase, max 17 chars. */
export function formatVinInput(raw: string): string {
  return raw.replace(VIN_INVALID_CHARS, "").toUpperCase().slice(0, 17);
}

export const normalizeVinInput = formatVinInput;

export function validateVin(vin: string):
  | { ok: true; normalized: string }
  | { ok: false; message: string } {
  const normalized = formatVinInput(vin);
  if (!normalized) {
    return { ok: false, message: "Укажите VIN" };
  }
  if (normalized.length !== 17) {
    return { ok: false, message: "VIN должен содержать 17 символов" };
  }
  if (!VIN_PATTERN.test(normalized)) {
    return { ok: false, message: "VIN содержит недопустимые символы (I, O, Q запрещены)" };
  }
  return { ok: true, normalized };
}

/** Two digits max; auto dot after first: 16 → 1.6. Leading zero rejected. */
export function formatEngineVolumeInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 2);
  if (!digits) return "";
  if (digits[0] === "0") return "";
  if (digits.length === 1) return digits;
  return `${digits[0]}.${digits[1]}`;
}

export function validateEngineVolume(value: string):
  | { ok: true; normalized: string }
  | { ok: false; message: string } {
  const normalized = formatEngineVolumeInput(value);
  if (!normalized) {
    return { ok: false, message: "Укажите объём двигателя" };
  }
  if (!ENGINE_VOLUME_PATTERN.test(normalized)) {
    return { ok: false, message: "Объём: формат 1.6 (литры)" };
  }
  return { ok: true, normalized };
}

export function validateYear(value: string):
  | { ok: true; normalized: string }
  | { ok: false; message: string } {
  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: false, message: "Укажите год выпуска" };
  }
  const year = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(year)) {
    return { ok: false, message: "Укажите год выпуска" };
  }
  if (year < YEAR_MIN || year > YEAR_MAX) {
    return { ok: false, message: `Год выпуска: от ${YEAR_MIN} до ${YEAR_MAX}` };
  }
  return { ok: true, normalized: String(year) };
}

/** Per-field PTS errors; null when the form is valid. */
export function validatePtsFormFields(pts: PtsFormFields): PtsFormFieldErrors | null {
  const errors: PtsFormFieldErrors = {};

  const vinResult = validateVin(pts.vin);
  if (!vinResult.ok) errors.vin = vinResult.message;

  const yearResult = validateYear(pts.year);
  if (!yearResult.ok) errors.year = yearResult.message;

  const volumeResult = validateEngineVolume(pts.engineVolume);
  if (!volumeResult.ok) errors.engineVolume = volumeResult.message;

  return Object.keys(errors).length > 0 ? errors : null;
}

/** First failing PTS field message, or null if valid. */
export function validatePtsForm(pts: PtsFormFields): string | null {
  const fieldErrors = validatePtsFormFields(pts);
  if (!fieldErrors) return null;
  return fieldErrors.vin ?? fieldErrors.year ?? fieldErrors.engineVolume ?? null;
}

/** Normalized PTS fields for draft storage after validation. */
export function normalizePtsForm<T extends PtsFormFields>(pts: T): T {
  const vinResult = validateVin(pts.vin);
  const yearResult = validateYear(pts.year);
  const volumeResult = validateEngineVolume(pts.engineVolume);

  return {
    ...pts,
    vin: vinResult.ok ? vinResult.normalized : formatVinInput(pts.vin),
    year: yearResult.ok ? yearResult.normalized : pts.year.trim(),
    engineVolume: volumeResult.ok
      ? volumeResult.normalized
      : formatEngineVolumeInput(pts.engineVolume),
  };
}
