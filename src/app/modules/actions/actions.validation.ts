import { z } from "zod";

export const createMessZod = z.object({
  body: z
    .object({
      name: z.string(),
    })
    .strict(),
});

export const updateMessZod = z.object({
  body: z
    .object({
      name: z.string().optional(),
    })
    .strict(),
});

export const removeMemberZod = z.object({
  body: z
    .object({
      ids: z.array(z.string()),
    })
    .strict(),
});

export const addMemberZod = z.object({
  body: z
    .object({
      email: z.string().email().optional(),
      phone: z.string().optional(),
    })
    .strict(),
});

export const changeManagerZod = z.object({
  body: z
    .object({
      managerId: z.string(),
      newManagerId: z.string(),
    })
    .strict(),
});
