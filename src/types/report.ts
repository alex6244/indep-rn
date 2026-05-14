import type { ImageSource } from "expo-image";

/** Accepts both static Metro assets (require → number) and expo-image URI objects. */
type ReportImageSource = ImageSource | number;

/** Domain report model for UI cards/details. */
export type Report = {
  id: string;
  price: string;
  title: string;
  subtitle: string;
  city: string;
  imageUrl: ReportImageSource;

  carouselImages: ReportImageSource[];
  photosCountText?: string;

  defects: {
    schemeImageUrl: ReportImageSource;
    photoImageUrls: ReportImageSource[];
    summaryText: string;
  };

  ptsData: { label: string; value: string }[];
  mileageText: string;

  owners: {
    jur: { title: string; value: string };
    phys: { title: string; value: string };
  };

  legalCleanliness: {
    badgeText: string;
    items: { text: string; tone: "ok" | "bad" }[];
  };

  commercialUsage: {
    badgeText: string;
    items: { text: string; tone: "ok" | "bad" }[];
  };

  penalties: {
    amountText: string;
    dateText: string;
    descriptionText: string;
    paid: boolean;
  }[];

  costEstimation: {
    text: string;
    rangeText: string;
  };

  yearText?: string;
  bodyTypeText?: string;
  creditText?: string;
  checks?: { label: string; tone: "info" | "ok" | "bad" }[];
};
