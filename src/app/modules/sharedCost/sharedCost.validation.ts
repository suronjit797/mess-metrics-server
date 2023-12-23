import { z } from "zod";

export const createSharedCostZod = z.object({
  body: z
    .object({
      date: z.string(),
      amount: z.number(),
      list: z.string().optional(),
    })
    .strict(),
});

export const updateSharedCostZod = z.object({
  body: z
    .object({
      date: z.string().optional(),
      amount: z.number().optional(),
      list: z.string().optional(),
    })
    .strict(),
});
