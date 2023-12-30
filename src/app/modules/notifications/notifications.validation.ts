import { z } from "zod";

export const createNotificationsZod = z.object({
  body: z
    .object({
      message: z.string(),
      user: z.string(),
      isRead: z.boolean().optional(),
    })
    .strict(),
});

export const updateSNotificationsZod = z.object({
  body: z
    .object({
      message: z.string().optional(),
      user: z.string().optional(),
      isRead: z.boolean().optional(),
    })
    .strict(),
});
