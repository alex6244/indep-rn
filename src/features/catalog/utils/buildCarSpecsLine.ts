import type { Car } from "../../../types/car";

export function driveDisplay(car: Car): string {
  const label = car.driveLabel?.trim();
  if (label) return label;
  if (car.driveType === "4WD") return "Полный";
  if (car.driveType === "2WD") return "Передний";
  return car.driveType;
}

/** Одна строка ТС: пробег — двигатель/КПП/мощность — топливо — привод. */
export function buildCarSpecsLine(car: Car): string {
  const km = new Intl.NumberFormat("ru-RU").format(car.mileage);
  const trans = car.transmission?.trim() ?? "";
  const powerStr = `${car.power} л.с.`;
  const engineBlock = trans
    ? `${car.engine} ${trans} ${powerStr}`
    : `${car.engine} л (${powerStr})`;
  const fuel = car.fuelType?.trim();
  const drive = driveDisplay(car);
  const tail = fuel
    ? `${engineBlock} - ${fuel} - ${drive}`
    : `${engineBlock} - ${drive}`;
  return `${km} км - ${tail}`;
}

export function buildCarModelLine(car: Car): string {
  return `${car.title}, ${car.year}`;
}
