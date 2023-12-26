import { z } from "zod";

export const createDepositZod = z.object({
  body: z
    .object({
      date: z.string(),
      amount: z.number(),
      user: z.string(),
    })
    .strict(),
});

export const updateDepositZod = z.object({
  body: z
    .object({
      date: z.string().optional(),
      amount: z.number().optional(),
      user: z.string().optional(),
    })
    .strict(),
});
