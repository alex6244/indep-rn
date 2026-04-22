export const MILEAGE_MIN = 0;
export const MILEAGE_MAX = 1_000_000;

/**
 * 5 000 km per step → 201 items (0…1 000 000).
 * Rationale: granular enough to distinguish city vs highway use,
 * yet short enough scroll for a wheel UI (~20 cm of finger travel).
 */
export const MILEAGE_STEP = 5_000;

/** Full list of discrete km values used in the wheel picker. */
export const MILEAGE_VALUES: readonly number[] = (() => {
  const out: number[] = [];
  for (let v = MILEAGE_MIN; v <= MILEAGE_MAX; v += MILEAGE_STEP) {
    out.push(v);
  }
  return out;
})();

export function clampMileage(value: number): number {
  if (!Number.isFinite(value)) return MILEAGE_MIN;
  return Math.max(MILEAGE_MIN, Math.min(MILEAGE_MAX, Math.round(value)));
}

/** Parse a digit-only string into a km number. Falls back to `whenEmpty`. */
export function mileageFromDigitString(text: string, whenEmpty: number): number {
  const raw = String(text ?? "").replace(/\D/g, "").slice(0, 7);
  if (!raw) return clampMileage(whenEmpty);
  const n = Number(raw);
  if (!Number.isFinite(n)) return clampMileage(whenEmpty);
  return clampMileage(n);
}

export function mileageToFilterString(value: number): string {
  return String(clampMileage(value));
}

export function formatMileageRu(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(clampMileage(value));
}

export function normalizeMileageText(value: string): string {
  const raw = String(value ?? "").replace(/\D/g, "").slice(0, 7);
  if (!raw) return "";
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return "";
  return String(clampMileage(Math.round(parsed)));
}

export function formatMileageText(value: string): string {
  const normalized = normalizeMileageText(value);
  if (!normalized) return "";
  return new Intl.NumberFormat("ru-RU").format(Number(normalized));
}

/** Nearest index in MILEAGE_VALUES for a given km amount. */
export function valueToNearestIndex(km: number): number {
  const clamped = clampMileage(km);
  const idx = Math.round(clamped / MILEAGE_STEP);
  return Math.max(0, Math.min(MILEAGE_VALUES.length - 1, idx));
}

/** Convert a filter text string to a MILEAGE_VALUES index. */
export function filterTextToIndex(text: string, defaultKm: number): number {
  const km = mileageFromDigitString(text, defaultKm);
  return valueToNearestIndex(km);
}

/** Human-readable summary of the active mileage range for the trigger row. */
export function formatMileageRange(fromText: string, toText: string): string {
  const hasFrom = fromText.trim() !== "";
  const hasTo = toText.trim() !== "";
  if (!hasFrom && !hasTo) return "Любой пробег";
  if (hasFrom && hasTo) {
    return `${formatMileageText(fromText)} — ${formatMileageText(toText)} км`;
  }
  if (hasFrom) return `от ${formatMileageText(fromText)} км`;
  return `до ${formatMileageText(toText)} км`;
}
