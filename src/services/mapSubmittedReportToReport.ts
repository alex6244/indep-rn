import type { ImageSource } from "expo-image";
import type { DraftReport } from "../types/draftReport";
import type { Report } from "../types/report";
import type { SubmittedReport } from "../types/submittedReport";

const PLACEHOLDER_CAR_IMAGE = require("../assets/cars1.jpg");

function toImageSource(uri: string | null | undefined): ImageSource | number {
  if (uri && uri.trim()) return { uri: uri.trim() };
  return PLACEHOLDER_CAR_IMAGE;
}

function statusPriceLabel(status: SubmittedReport["status"]): string {
  switch (status) {
    case "completed":
      return "Опубликован";
    case "pending":
      return "На проверке";
    case "draft":
      return "Черновик";
    default:
      return "—";
  }
}

function buildTitle(pts: DraftReport["pts"]): string {
  const brand = pts.brand.trim();
  const model = pts.model.trim();
  if (brand && model) return `${brand} ${model}`;
  if (brand) return brand;
  if (model) return model;
  if (pts.vin.trim()) return pts.vin.trim();
  return "Отчёт подборщика";
}

function buildSubtitle(pts: DraftReport["pts"], status: SubmittedReport["status"]): string {
  const parts: string[] = [];
  if (pts.year.trim()) parts.push(pts.year.trim());
  if (pts.engineVolume.trim()) parts.push(`${pts.engineVolume.trim()} л`);
  parts.push(statusPriceLabel(status));
  return parts.join(" · ") || statusPriceLabel(status);
}

function buildLegalItems(data: DraftReport) {
  const { legalCleanliness: lc } = data;
  return [
    { text: "Залог", tone: lc.pledge ? ("bad" as const) : ("ok" as const) },
    {
      text: "Ограничения регистрации",
      tone: lc.registrationRestrictions ? ("bad" as const) : ("ok" as const),
    },
    { text: "Розыск", tone: lc.wanted ? ("bad" as const) : ("ok" as const) },
  ];
}

function buildCommercialItems(data: DraftReport) {
  const { commercialUsage: cu } = data;
  return [
    { text: "Разрешение на такси", tone: cu.taxiPermission ? ("bad" as const) : ("ok" as const) },
    { text: "Каршеринг", tone: cu.carSharing ? ("bad" as const) : ("ok" as const) },
    { text: "Лизинг", tone: cu.leasing ? ("bad" as const) : ("ok" as const) },
  ];
}

function countOwners(owners: DraftReport["owners"], type: "jur" | "phys"): number {
  return owners.filter((o) => o.type === type).length;
}

/** Maps picker submitted report (draft payload) into shared Report UI model. */
export function mapSubmittedReportToReport(submitted: SubmittedReport): Report {
  const { data } = submitted;
  const { pts } = data;
  const heroImage = toImageSource(data.media.bodyPhoto ?? data.media.salonPhoto);
  const carouselImages: (ImageSource | number)[] = [
    data.media.bodyPhoto,
    data.media.salonPhoto,
    data.media.bodyVideo,
    data.media.salonVideo,
  ]
    .filter((uri): uri is string => Boolean(uri?.trim()))
    .map((uri) => ({ uri }));

  const legalItems = buildLegalItems(data);
  const commercialItems = buildCommercialItems(data);
  const legalBad = legalItems.some((i) => i.tone === "bad");
  const commercialBad = commercialItems.some((i) => i.tone === "bad");

  const defectPhotos =
    data.defects.mode === "photos"
      ? data.defects.damages
          .map((d) => d.photoUri)
          .filter((uri): uri is string => Boolean(uri?.trim()))
          .map((uri) => ({ uri }))
      : [];

  const summaryText =
    data.defects.damages
      .map((d) => d.description.trim())
      .filter(Boolean)
      .join("; ") || "Данные о дефектах указаны в отчёте.";

  return {
    id: submitted.id,
    price: statusPriceLabel(submitted.status),
    title: buildTitle(pts),
    subtitle: buildSubtitle(pts, submitted.status),
    city: pts.color.trim() || "—",
    imageUrl: heroImage,
    carouselImages: carouselImages.length > 0 ? carouselImages : [heroImage],
    photosCountText:
      carouselImages.length > 0 ? `${carouselImages.length} фото` : undefined,
    defects: {
      schemeImageUrl: PLACEHOLDER_CAR_IMAGE,
      photoImageUrls: defectPhotos,
      summaryText,
    },
    ptsData: [
      { label: "VIN", value: pts.vin.trim() || "—" },
      { label: "Марка", value: pts.brand.trim() || "—" },
      { label: "Модель", value: pts.model.trim() || "—" },
      { label: "Год", value: pts.year.trim() || "—" },
      { label: "Цвет", value: pts.color.trim() || "—" },
      {
        label: "Объём двигателя",
        value: pts.engineVolume.trim() ? `${pts.engineVolume.trim()} л` : "—",
      },
      {
        label: "ПТС",
        value: pts.ptsType === "original" ? "Оригинал" : "Не оригинал",
      },
    ],
    mileageText: data.mileage.trim() ? `${data.mileage.trim()} км` : "—",
    owners: {
      jur: {
        title: "Юридические лица",
        value: String(countOwners(data.owners, "jur")),
      },
      phys: {
        title: "Физические лица",
        value: String(countOwners(data.owners, "phys")),
      },
    },
    legalCleanliness: {
      badgeText: legalBad ? "Есть риски" : "Чисто",
      items: legalItems,
    },
    commercialUsage: {
      badgeText: commercialBad ? "Использовалось" : "Не использовалось",
      items: commercialItems,
    },
    penalties: [],
    costEstimation: {
      text: "Оценка стоимости",
      rangeText: "—",
    },
    yearText: pts.year.trim() || undefined,
    bodyTypeText: undefined,
  };
}
