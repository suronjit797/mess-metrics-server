import { z } from "zod";

export const getMembersAccountZod = z.object({
  query: z
    .object({
      userId: z.string(),
      monthId: z.string(),
      messId: z.string().optional(),
    })
    .strict(),
});
