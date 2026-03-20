export type Report = {
  id: string;
  price: string;
  title: string;
  subtitle: string;
  city: string;
  imageUrl: string;

  // Detailed report fields (for /reports/[id]).
  carouselImages: string[];
  photosCountText?: string;

  defects: {
    schemeImageUrl: string;
    photoImageUrls: string[];
    summaryText: string;
  };

  ptsData: Array<{ label: string; value: string }>;
  mileageText: string;

  owners: {
    jur: { title: string; value: string };
    phys: { title: string; value: string };
  };

  legalCleanliness: {
    badgeText: string;
    items: Array<{ text: string; tone: "ok" | "bad" }>;
  };

  commercialUsage: {
    badgeText: string;
    items: Array<{ text: string; tone: "ok" | "bad" }>;
  };

  penalties: Array<{
    amountText: string;
    dateText: string;
    descriptionText: string;
    paid: boolean;
  }>;

  costEstimation: {
    text: string;
    rangeText: string;
  };

  // Optional fields to enrich the top section.
  yearText?: string;
  bodyTypeText?: string;
};

export const reports: Report[] = [
  {
    id: "1",
    price: "67 000 000 ₽",
    title: "Mercedes-Benz GLC AMG 43 AMG II (X254)",
    subtitle: "Active - 1,2 л (115 л.с.) 6MT 2WD - 2025 г.",
    city: "г. Москва",
    imageUrl: "https://via.placeholder.com/400x180",
    carouselImages: [
      "https://via.placeholder.com/800x420",
      "https://via.placeholder.com/200x120?1",
      "https://via.placeholder.com/200x120?2",
      "https://via.placeholder.com/200x120?3",
    ],
    photosCountText: "67+ фото",
    defects: {
      schemeImageUrl: "https://via.placeholder.com/520x260",
      photoImageUrls: [
        "https://via.placeholder.com/200x120?scheme1",
        "https://via.placeholder.com/200x120?scheme2",
        "https://via.placeholder.com/200x120?scheme3",
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
      jur: { title: "Юридическое лицо", value: "18 апреля 2023 - 8 октября 2025 (2 года 6 месяцев)" },
      phys: { title: "Физическое лицо", value: "7 октября 2025 - настоящее время (3 месяца)" },
    },
    legalCleanliness: {
      badgeText: "Все в порядке",
      items: [
        { text: "Сведения о нахождении в залоге не обнаружены", tone: "ok" },
        { text: "Ограничения на регистрационные действия не обнаружены", tone: "ok" },
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
    imageUrl: "https://via.placeholder.com/400x180?2",
    carouselImages: [
      "https://via.placeholder.com/800x420?2",
      "https://via.placeholder.com/200x120?4",
      "https://via.placeholder.com/200x120?5",
      "https://via.placeholder.com/200x120?6",
    ],
    photosCountText: "67+ фото",
    defects: {
      schemeImageUrl: "https://via.placeholder.com/520x260?def2",
      photoImageUrls: [
        "https://via.placeholder.com/200x120?def2a",
        "https://via.placeholder.com/200x120?def2b",
      ],
      summaryText: "Сколы и потертости лакокрасочного покрытия без критических повреждений.",
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
      phys: { title: "Физическое лицо", value: "12 марта 2022 - настоящее время (1 год 3 месяца)" },
    },
    legalCleanliness: {
      badgeText: "Все в порядке",
      items: [
        { text: "Сведения о нахождении в залоге не обнаружены", tone: "ok" },
        { text: "Ограничения на регистрационные действия не обнаружены", tone: "ok" },
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

