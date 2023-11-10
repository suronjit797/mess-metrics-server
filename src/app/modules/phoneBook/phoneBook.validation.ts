import { z } from "zod";

export const createPhoneBookZod = z.object({
  body: z
    .object({
      name: z.string(),
      number: z.string(),
      mess: z.string(),
    })
    .strict(),
});

export const updatePhoneBookZod = z.object({
  body: z
    .object({
      name: z.string().optional(),
      number: z.string().optional(),
      mess: z.string().optional(),
    })
    .strict(),
});
