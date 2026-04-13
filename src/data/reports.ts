import type { Report } from "../entities/report/types";

/** Local bundled images (no network) for mocks */
import PLACEHOLDER_MAIN from "../assets/logo.png";
import PLACEHOLDER_CAR_1 from "../assets/cars1.jpg";
import PLACEHOLDER_CAR_2 from "../assets/cars2.jpg";

export const reports: Report[] = [
  {
    id: "1",
    price: "67 000 000 ₽",
    title: "Mercedes-Benz GLC AMG 43 AMG II (X254)",
    subtitle: "Active - 1,2 л (115 л.с.) 6MT 2WD - 2025 г.",
    city: "г. Москва",
    imageUrl: PLACEHOLDER_MAIN,
    carouselImages: [
      PLACEHOLDER_CAR_1,
      PLACEHOLDER_CAR_2,
      PLACEHOLDER_MAIN,
      PLACEHOLDER_CAR_1,
    ],
    photosCountText: "67+ фото",
    defects: {
      schemeImageUrl: PLACEHOLDER_CAR_1,
      photoImageUrls: [
        PLACEHOLDER_CAR_2,
        PLACEHOLDER_MAIN,
        PLACEHOLDER_CAR_1,
      ],
      summaryText:
        "Косметические царапины на переднем бампере, без влияния на безопасность.",
    },
    ptsData: [
      { label: "VIN", value: "KNA 204**********" },
      { label: "Марка", value: "Kia" },
      { label: "Модель", value: "Carnival" },
      { label: "Год выпуска", value: "2019г." },
      { label: "Цвет", value: "Белый" },
      { label: "Объём двигателя", value: "2,2 л." },
      { label: "ПТС", value: "Оригинал" },
    ],
    mileageText: "200 000 км",
    owners: {
      jur: {
        title: "Юридическое лицо",
        value: "18 апреля 2023 - 8 октября 2025 (2 года 6 месяцев)",
      },
      phys: {
        title: "Физическое лицо",
        value: "7 октября 2025 - настоящее время (3 месяца)",
      },
    },
    legalCleanliness: {
      badgeText: "Все в порядке",
      items: [
        { text: "Сведения о нахождении в залоге не обнаружены", tone: "ok" },
        {
          text: "Ограничения на регистрационные действия не обнаружены",
          tone: "ok",
        },
        { text: "Сведения о нахождении в розыске не обнаружены", tone: "ok" },
      ],
    },
    commercialUsage: {
      badgeText: "Не используется",
      items: [
        { text: "Не зарегистрировался для работы в каршеринге", tone: "ok" },
        { text: "Не обнаружен в договорах лизинга", tone: "ok" },
      ],
    },
    penalties: [
      {
        amountText: "750 ₽",
        dateText: "9 сентября 2025 - Оплачены",
        descriptionText:
          "Превышение установленной скорости движения транспортного средства на величину более 20, но не более 40 километров в час",
        paid: true,
      },
      {
        amountText: "750 ₽",
        dateText: "9 сентября 2025 - Оплачены",
        descriptionText:
          "Превышение установленной скорости движения транспортного средства на величину более 20, но не более 40 километров в час",
        paid: true,
      },
    ],
    costEstimation: {
      text: "Согласно аналитическим данным INDEP, цена этого автомобиля оценивается в:",
      rangeText: "2 149 000 - 2 487 000 ₽",
    },
    yearText: "2019г.",
    bodyTypeText: "Кроссовер",
  },
  {
    id: "2",
    price: "6 700 000 ₽",
    title: "BMW X5",
    subtitle: "xDrive30d - 3.0 AT 4WD - 2022 г.",
    city: "г. Москва",
    imageUrl: PLACEHOLDER_CAR_2,
    carouselImages: [
      PLACEHOLDER_CAR_2,
      PLACEHOLDER_CAR_1,
      PLACEHOLDER_MAIN,
      PLACEHOLDER_CAR_2,
    ],
    photosCountText: "67+ фото",
    defects: {
      schemeImageUrl: PLACEHOLDER_CAR_2,
      photoImageUrls: [PLACEHOLDER_CAR_1, PLACEHOLDER_MAIN],
      summaryText:
        "Сколы и потертости лакокрасочного покрытия без критических повреждений.",
    },
    ptsData: [
      { label: "VIN", value: "WBAX************" },
      { label: "Марка", value: "BMW" },
      { label: "Модель", value: "X5" },
      { label: "Год выпуска", value: "2022г." },
      { label: "Цвет", value: "Черный" },
      { label: "Объём двигателя", value: "3,0 л." },
      { label: "ПТС", value: "Оригинал" },
    ],
    mileageText: "80 000 км",
    owners: {
      jur: { title: "Юридическое лицо", value: "— (нет данных)" },
      phys: {
        title: "Физическое лицо",
        value: "12 марта 2022 - настоящее время (1 год 3 месяца)",
      },
    },
    legalCleanliness: {
      badgeText: "Все в порядке",
      items: [
        { text: "Сведения о нахождении в залоге не обнаружены", tone: "ok" },
        {
          text: "Ограничения на регистрационные действия не обнаружены",
          tone: "ok",
        },
        { text: "Сведения о нахождении в розыске не обнаружены", tone: "ok" },
      ],
    },
    commercialUsage: {
      badgeText: "Все в порядке",
      items: [
        { text: "Не обнаружен в договорах лизинга", tone: "ok" },
        { text: "Не зарегистрирован для работы в такси", tone: "ok" },
      ],
    },
    penalties: [
      {
        amountText: "750 ₽",
        dateText: "18 апреля 2025 - Оплачены",
        descriptionText:
          "Превышение установленной скорости движения транспортного средства на величину более 20, но не более 40 километров в час",
        paid: true,
      },
    ],
    costEstimation: {
      text: "Согласно аналитическим данным INDEP, цена этого автомобиля оценивается в:",
      rangeText: "1 980 000 - 2 190 000 ₽",
    },
    yearText: "2022г.",
    bodyTypeText: "Кроссовер",
  },
];

export function getReportById(id: string): Report | undefined {
  return reports.find((r) => r.id === id);
}
