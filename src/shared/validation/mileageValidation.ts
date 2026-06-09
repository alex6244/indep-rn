export const MILEAGE_MAX = 9_999_999;

/** Digits only, max 7; display with space thousands: 125000 → "125 000". */
export function formatMileageInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 7);
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function parseMileageDigits(value: string): number {
  const digits = value.replace(/\D/g, "");
  if (!digits) return NaN;
  return Number.parseInt(digits, 10);
}

export function validateMileage(value: string):
  | { ok: true; normalized: string }
  | { ok: false; message: string } {
  const digits = value.replace(/\D/g, "");
  if (!digits) {
    return { ok: false, message: "Укажите пробег" };
  }

  const mileage = Number.parseInt(digits, 10);
  if (!Number.isFinite(mileage) || mileage <= 0 || mileage > MILEAGE_MAX) {
    return { ok: false, message: "Некорректный пробег" };
  }

  return { ok: true, normalized: formatMileageInput(digits) };
}
