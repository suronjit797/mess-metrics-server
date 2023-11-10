import { z } from "zod";

export const createMonthZod = z.object({
  body: z
    .object({
      name: z.string()
    })
    .strict(),
});

export const updateMonthZod = z.object({
  body: z
    .object({
      name: z.string().optional(),
      year: z.string().optional(),
      isActive: z.string().optional(),
      mess: z.string().optional(),
    })
    .strict(),
});
