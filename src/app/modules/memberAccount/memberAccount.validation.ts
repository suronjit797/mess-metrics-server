import { z } from "zod";

export const createMessAccountCoZod = z.object({
  body: z
    .object({
      totalAmount: z.number(),
      totalCost: z.number(),
      totalMeal: z.number(),
      totalMealCost: z.number(),
      sharedCost: z.number(),
      totalIndividualCost: z.number(),
      mess: z.string(),
      month: z.string(),
    })
    .strict(),
});

export const updateMessAccountCoZod = z.object({
  body: z
    .object({
      totalAmount: z.number().optional(),
      totalCost: z.number().optional(),
      totalMeal: z.number().optional(),
      totalMealCost: z.number().optional(),
      sharedCost: z.number().optional(),
      totalIndividualCost: z.number().optional(),
      mess: z.string().optional(),
      month: z.string().optional(),
    })
    .strict(),
});
