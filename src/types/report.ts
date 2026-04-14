import type { ImageSourcePropType } from "react-native";

/** Domain report model for UI cards/details. */
export type Report = {
  id: string;
  price: string;
  title: string;
  subtitle: string;
  city: string;
  imageUrl: ImageSourcePropType;

  carouselImages: ImageSourcePropType[];
  photosCountText?: string;

  defects: {
    schemeImageUrl: ImageSourcePropType;
    photoImageUrls: ImageSourcePropType[];
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
};
