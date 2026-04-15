export type CarId = string;

export interface Car {
  id: CarId;
  title: string;
  brand: string;
  price: number;
  mileage: number;
  year: number;
  engine: string;
  power: number;
  driveType: string;
  /** Label for drive type on cards, e.g. "Полный". */
  driveLabel?: string;
  /** Transmission alias used in compact car specs line. */
  transmission?: string;
  /** Fuel type alias used in compact car specs line. */
  fuelType?: string;
  address: string;
  images: string[];

  // Optional fields for catalog filters.
  bodyType?: "Седан" | "Кроссовер" | "Хэтчбек";
  features?: string[];
  paymentType?: "cash" | "credit";

  // Flags for catalog filter chips.
  hasDiscount?: boolean;
  vatReturn?: boolean;
  weeklyOffer?: boolean;
}
