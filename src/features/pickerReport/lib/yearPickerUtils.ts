import { YEAR_MAX, YEAR_MIN } from "../../../shared/validation/ptsValidation";

export { YEAR_MAX, YEAR_MIN };

export const YEAR_VALUES: readonly number[] = (() => {
  const out: number[] = [];
  for (let year = YEAR_MAX; year >= YEAR_MIN; year -= 1) {
    out.push(year);
  }
  return out;
})();

export function yearTextToIndex(yearText: string): number {
  const trimmed = yearText.trim();
  if (!trimmed) return 0;
  const year = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(year)) return 0;
  const idx = YEAR_VALUES.indexOf(year);
  return idx >= 0 ? idx : 0;
}

export function indexToYearText(index: number): string {
  const clamped = Math.max(0, Math.min(YEAR_VALUES.length - 1, index));
  return String(YEAR_VALUES[clamped] ?? YEAR_MAX);
}

export function formatYearRu(year: number): string {
  return String(year);
}
