import { z } from "zod";

export const zEvaluation = z.object({
  id: z.string(),
  userID: z.string(),
  resourceID: z.string(),
  rating: z.number(),
});

export type Evaluation = z.infer<typeof zEvaluation>;
