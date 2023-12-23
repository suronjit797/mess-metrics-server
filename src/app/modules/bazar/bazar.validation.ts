import { z } from "zod";

export const createBazarZod = z.object({
  body: z
    .object({
      date: z.string(),
      amount: z.number(),
      members: z.array(z.string()),
      list: z.string().optional(),
    })
    .strict(),
});

export const updateBazarZod = z.object({
  body: z
    .object({
      date: z.string().optional(),
      amount: z.number().optional(),
      members: z.array(z.string()).optional(),
      list: z.string().optional(),
    })
    .strict(),
});
