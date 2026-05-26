export type ReportsPackageOption = {
  id: string;
  count: number;
  priceRub: number;
  durationText: string;
};

export const REPORTS_PACKAGE_OPTIONS: ReportsPackageOption[] = [
  { id: "1", count: 1, priceRub: 550, durationText: "действует 1 месяц" },
  { id: "5", count: 5, priceRub: 2000, durationText: "действует 1 месяц" },
  { id: "10", count: 10, priceRub: 4000, durationText: "действует 1 год" },
];

export const REPORTS_PACKAGE_MODAL_INTRO =
  "Выберите удобный пакет и получите доступ к отчётам сразу после оплаты";

const ruPriceFormat = new Intl.NumberFormat("ru-RU");

export function formatReportsPackagePrice(rub: number): string {
  return `${ruPriceFormat.format(rub)} ₽`;
}

/** «1 отчёт», «5 отчётов», «10 отчётов». */
export function formatReportsPackageCountLabel(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} отчёт`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} отчёта`;
  }
  return `${count} отчётов`;
}
