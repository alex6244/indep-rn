import type { Car } from "../../../types/car";
import type { AutoCreditVehicle } from "../ui/autoCredit.content";

export function mapCarToCreditVehicle(car: Car): AutoCreditVehicle {
  const model = car.title.replace(car.brand, "").trim() || car.title;

  return {
    id: String(car.id),
    brand: car.brand,
    model,
    title: car.title,
    price: car.price,
    oldPrice: car.hasDiscount ? Math.round(car.price * 1.12) : undefined,
    year: car.year,
    images: [...car.images],
    vin: "Уточняется",
    color: "—",
    engineVolume: `${car.engine} л.`,
    ptsStatus: "Уточняется",
  };
}
