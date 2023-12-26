import { z } from "zod";

export const createIndividualCostZod = z.object({
  body: z
    .object({
      date: z.string(),
      amount: z.number(),
      list: z.string().optional(),
      user: z.string(),
    })
    .strict(),
});

export const updateIndividualCostZod = z.object({
  body: z
    .object({
      date: z.string().optional(),
      amount: z.number().optional(),
      list: z.string().optional(),
      user: z.string(),
    })
    .strict(),
});
