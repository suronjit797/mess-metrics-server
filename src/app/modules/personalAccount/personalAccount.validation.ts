import { z } from "zod";

export const createPersonalAccountZod = z.object({
  body: z
    .object({
      name: z.string(),
      phone: z.string(),
    })
    .strict(),
});

export const updatePersonalAccountZod = z.object({
  body: z
    .object({
      name: z.string().optional(),
      phone: z.string().optional(),
    })
    .strict(),
});
