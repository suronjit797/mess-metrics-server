import { z } from "zod";

export const createMessZod = z.object({
  body: z.object({
    name: z.string(),
  }),
});
export const updateMessZod = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
