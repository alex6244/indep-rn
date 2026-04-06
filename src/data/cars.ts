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
  /** Подпись привода для карточки (например «Полный»). Иначе маппинг из driveType. */
  driveLabel?: string;
  /** КПП для строки ТС, напр. «AT», «MT». */
  transmission?: string;
  /** Топливо для строки ТС, напр. «Бензин». */
  fuelType?: string;
  address: string;
  images: string[];

  // Optional fields for catalog filters.
  bodyType?: 'Седан' | 'Кроссовер' | 'Хэтчбек';
  features?: string[];
  paymentType?: 'cash' | 'credit';

  // Flags for "pлашки" in catalog filters.
  hasDiscount?: boolean;
  vatReturn?: boolean;
  weeklyOffer?: boolean;
}

export const cars: Car[] = [
  {
    id: "1",
    brand: "Mercedes",
    title: "Mercedes-Benz GLC AMG 43 AMG II (X254)",
    price: 67000000,
    mileage: 2200,
    year: 2024,
    engine: "2.0",
    power: 421,
    driveType: "4WD",
    driveLabel: "Полный",
    transmission: "AT",
    fuelType: "Бензин",
    address: "г. Сочи, ул. Волкова",
    bodyType: "Кроссовер",
    features: ["Без ДТП", "На гарантии"],
    paymentType: "credit",
    hasDiscount: true,
    vatReturn: false,
    weeklyOffer: true,
    images: [
      "https://via.placeholder.com/400x180",
      "https://via.placeholder.com/400x180?2",
      "https://via.placeholder.com/400x180?3",
    ],
  },
  {
    id: "2",
    brand: "BMW",
    title: "BMW X5",
    price: 4200000,
    mileage: 120000,
    year: 2022,
    engine: "3.0",
    power: 249,
    driveType: "4WD",
    driveLabel: "Полный",
    transmission: "AT",
    fuelType: "Бензин",
    address: "г. Москва, ул. Волкова",
    bodyType: "Седан",
    features: ["Отличное состояние", "Маленький пробег"],
    paymentType: "cash",
    hasDiscount: false,
    vatReturn: true,
    weeklyOffer: false,
    images: [
      "https://via.placeholder.com/400x180?4",
      "https://via.placeholder.com/400x180?5",
    ],
  },
];

