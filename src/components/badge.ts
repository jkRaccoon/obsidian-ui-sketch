import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const BadgeSchema = BasePropsSchema.extend({
  label: z.string().optional(),
  variant: z.enum(["default", "primary", "success", "warning", "danger"]).optional(),
}).passthrough();

export const BadgeDef: ComponentDef = {
  type: "badge",
  schema: BadgeSchema,
  render(props) {
    const el = document.createElement("span");
    const variant = typeof props.variant === "string" ? props.variant : "default";
    el.className = `uis-badge uis-badge--${variant}`;
    el.textContent = typeof props.label === "string" ? props.label : "";
    return el;
  },
};
