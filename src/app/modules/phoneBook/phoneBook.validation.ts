import { z } from "zod";

export const createPhoneBookZod = z.object({
  body: z
    .object({
      name: z.string(),
      phone: z.string(),
    })
    .strict(),
});

export const updatePhoneBookZod = z.object({
  body: z
    .object({
      name: z.string().optional(),
      phone: z.string().optional(),
    })
    .strict(),
});
