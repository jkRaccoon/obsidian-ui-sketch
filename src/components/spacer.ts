import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const SpacerSchema = BasePropsSchema.extend({
  size: z.number().optional(),
}).passthrough();

export const SpacerDef: ComponentDef = {
  type: "spacer",
  schema: SpacerSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-spacer";
    const size = typeof props.size === "number" ? props.size : 16;
    el.style.minHeight = `${size}px`;
    el.style.minWidth = `${size}px`;
    return el;
  },
};
