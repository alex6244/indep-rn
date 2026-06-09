import {
  CREDIT_TERM_MONTHS_MAX,
  CREDIT_TERM_MONTHS_MIN,
} from "../ui/autoCredit.content";

export function formatRub(value: number): string {
  return `${new Intl.NumberFormat("ru-RU").format(Math.round(value))} ₽`;
}

export function formatRubPerMonth(value: number): string {
  return `${new Intl.NumberFormat("ru-RU").format(Math.round(value))} ₽/мес.`;
}

export function formatTermYears(years: number): string {
  if (years === 1) return "1 год";
  if (years >= 2 && years <= 4) return `${years} года`;
  return `${years} лет`;
}

export function formatTermMonths(months: number): string {
  const base = `${months} мес.`;
  if (months >= 12 && months % 12 === 0) {
    return `${base} (${formatTermYears(months / 12)})`;
  }
  return base;
}

/** Principal after subtracting down payment from the credit amount. */
export function calcLoanPrincipal(creditAmount: number, downPayment: number): number {
  return Math.max(0, creditAmount - downPayment);
}

export function calcMonthlyPayment(loanPrincipal: number, termMonths: number): number {
  if (loanPrincipal <= 0 || termMonths <= 0) return 0;
  return Math.round(loanPrincipal / termMonths);
}

export function snapCreditStep(value: number, step: number, min: number, max: number): number {
  const stepped = Math.round(value / step) * step;
  return Math.min(max, Math.max(min, stepped));
}

export function clampDownPayment(downPayment: number, creditAmount: number): number {
  return Math.min(Math.max(0, downPayment), creditAmount);
}

export function clampTermMonths(months: number): number {
  return Math.min(
    CREDIT_TERM_MONTHS_MAX,
    Math.max(CREDIT_TERM_MONTHS_MIN, Math.round(months)),
  );
}

export function adjustTermMonths(current: number, delta: number): number {
  return clampTermMonths(current + delta);
}

export function canAdjustTermMonths(current: number, delta: number): boolean {
  const next = current + delta;
  return next >= CREDIT_TERM_MONTHS_MIN && next <= CREDIT_TERM_MONTHS_MAX;
}
