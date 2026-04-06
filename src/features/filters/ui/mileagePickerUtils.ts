export const MILEAGE_MIN = 0;
export const MILEAGE_MAX = 1_000_000;
/** Шаг «ленты» для скролла и snap после отпускания. */
export const MILEAGE_SCROLL_SNAP_STEP = 100;
/** Шаг кнопок +/−. */
export const MILEAGE_BUTTON_STEP = 1;

export function clampMileage(value: number): number {
  if (!Number.isFinite(value)) return MILEAGE_MIN;
  return Math.max(
    MILEAGE_MIN,
    Math.min(MILEAGE_MAX, Math.round(value)),
  );
}

/** Целое число километров из строки (только цифры), для контроллера фильтров. */
export function mileageFromDigitString(
  text: string,
  whenEmpty: number,
): number {
  const raw = String(text ?? "").replace(/\D/g, "").slice(0, 7);
  if (!raw) return clampMileage(whenEmpty);
  const n = Number(raw);
  if (!Number.isFinite(n)) return clampMileage(whenEmpty);
  return clampMileage(n);
}

export function mileageToFilterString(value: number): string {
  return String(clampMileage(value));
}

export function snapScrollToStep(value: number): number {
  const c = clampMileage(value);
  const k = Math.round(c / MILEAGE_SCROLL_SNAP_STEP);
  return clampMileage(k * MILEAGE_SCROLL_SNAP_STEP);
}

export function formatMileageRu(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(clampMileage(value));
}

/** Нормализация строки пробега для состояния фильтра (только цифры, clamp). */
export function normalizeMileageText(value: string): string {
  const raw = String(value ?? "").replace(/\D/g, "").slice(0, 7);
  if (!raw) return "";
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return "";
  return String(clampMileage(Math.round(parsed)));
}

/** Отображение в поле ввода с разделителями тысяч. */
export function formatMileageText(value: string): string {
  const normalized = normalizeMileageText(value);
  if (!normalized) return "";
  return new Intl.NumberFormat("ru-RU").format(Number(normalized));
}
