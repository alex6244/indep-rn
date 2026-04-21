import { z } from "zod";

export const apiCarSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    brand: z.string(),
    price: z.number(),
    mileage: z.number(),
    year: z.number(),
    engine: z.string(),
    power: z.number(),
    driveType: z.string(),
    driveLabel: z.string().optional(),
    transmission: z.string().optional(),
    fuelType: z.string().optional(),
    address: z.string(),
    images: z.array(z.string()),
    bodyType: z.enum(["Седан", "Кроссовер", "Хэтчбек"]).optional(),
    features: z.array(z.string()).optional(),
    paymentType: z.enum(["cash", "credit"]).optional(),
    hasDiscount: z.boolean().optional(),
    vatReturn: z.boolean().optional(),
    weeklyOffer: z.boolean().optional(),
  })
  .passthrough();

export const apiCarsListSchema = z.array(apiCarSchema);

export type ApiCar = z.infer<typeof apiCarSchema>;

