const ANNUAL_RATE = 0.119;

export function formatRub(value: number): string {
  return `${new Intl.NumberFormat("ru-RU").format(Math.round(value))} ₽`;
}

export function formatRubPerMonth(value: number): string {
  return `${new Intl.NumberFormat("ru-RU").format(Math.round(value))} ₽/мес.`;
}

export function calcDownPayment(carPrice: number, downPaymentPercent: number): number {
  return Math.round((carPrice * downPaymentPercent) / 100);
}

export function calcLoanAmount(carPrice: number, downPaymentPercent: number): number {
  return Math.max(0, carPrice - calcDownPayment(carPrice, downPaymentPercent));
}

export function calcMonthlyPayment(loanAmount: number, termYears: number): number {
  if (loanAmount <= 0 || termYears <= 0) return 0;
  const months = termYears * 12;
  const monthlyRate = ANNUAL_RATE / 12;
  if (monthlyRate === 0) return Math.round(loanAmount / months);
  const factor = (1 + monthlyRate) ** months;
  return Math.round((loanAmount * monthlyRate * factor) / (factor - 1));
}

export function formatTermYears(years: number): string {
  if (years === 1) return "1 год";
  if (years >= 2 && years <= 4) return `${years} года`;
  return `${years} лет`;
}
