import { z } from "zod";

const reportListItemSchema = z
  .object({
    text: z.string(),
    tone: z.enum(["ok", "bad"]),
  })
  .passthrough();

const reportOwnerSchema = z
  .object({
    title: z.string(),
    value: z.string(),
  })
  .passthrough();

const reportPenaltySchema = z
  .object({
    amountText: z.string(),
    dateText: z.string(),
    descriptionText: z.string(),
    paid: z.boolean(),
  })
  .passthrough();

export const apiReportSchema = z
  .object({
    id: z.string(),
    price: z.string(),
    title: z.string(),
    subtitle: z.string(),
    city: z.string(),
    imageUrl: z.string(),
    carouselImages: z.array(z.string()),
    photosCountText: z.string().optional(),
    defects: z
      .object({
        schemeImageUrl: z.string(),
        photoImageUrls: z.array(z.string()),
        summaryText: z.string(),
      })
      .passthrough(),
    ptsData: z.array(
      z
        .object({
          label: z.string(),
          value: z.string(),
        })
        .passthrough(),
    ),
    mileageText: z.string(),
    owners: z
      .object({
        jur: reportOwnerSchema,
        phys: reportOwnerSchema,
      })
      .passthrough(),
    legalCleanliness: z
      .object({
        badgeText: z.string(),
        items: z.array(reportListItemSchema),
      })
      .passthrough(),
    commercialUsage: z
      .object({
        badgeText: z.string(),
        items: z.array(reportListItemSchema),
      })
      .passthrough(),
    penalties: z.array(reportPenaltySchema),
    costEstimation: z
      .object({
        text: z.string(),
        rangeText: z.string(),
      })
      .passthrough(),
    yearText: z.string().optional(),
    bodyTypeText: z.string().optional(),
  })
  .passthrough();

export const apiReportsListSchema = z.array(apiReportSchema);

export type ApiReport = z.infer<typeof apiReportSchema>;

