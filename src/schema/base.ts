import { z } from "zod";

export const BasePropsSchema = z
  .object({
    id: z.string().optional(),
    w: z.union([z.number(), z.string()]).optional(),
    h: z.union([z.number(), z.string()]).optional(),
    align: z.enum(["start", "center", "end"]).optional(),
    pad: z.union([z.number(), z.string()]).optional(),
    note: z.string().optional(),
    muted: z.boolean().optional(),
  })
  .passthrough();

export type BasePropsShape = z.infer<typeof BasePropsSchema>;
