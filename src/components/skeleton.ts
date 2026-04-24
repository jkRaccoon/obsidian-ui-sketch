import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const SkeletonSchema = BasePropsSchema.extend({
  width: z.union([z.string(), z.number()]).optional(),
  height: z.union([z.string(), z.number()]).optional(),
}).passthrough();

export const SkeletonDef: ComponentDef = {
  type: "skeleton",
  schema: SkeletonSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-skeleton";
    const w = props.width;
    const h = props.height;
    if (typeof w === "number") el.style.width = `${w}px`;
    else if (typeof w === "string") el.style.width = w;
    if (typeof h === "number") el.style.height = `${h}px`;
    else if (typeof h === "string") el.style.height = h;
    return el;
  },
};
