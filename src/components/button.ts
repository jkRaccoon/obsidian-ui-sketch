import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const ButtonSchema = BasePropsSchema.extend({
  label: z.string().optional(),
  variant: z.enum(["primary", "secondary", "ghost", "danger"]).optional(),
  icon: z.string().optional(),
}).passthrough();

const VARIANTS = new Set(["primary", "secondary", "ghost", "danger"]);

export const ButtonDef: ComponentDef = {
  type: "button",
  schema: ButtonSchema,
  render(props) {
    const el = document.createElement("div");
    const variant =
      typeof props.variant === "string" && VARIANTS.has(props.variant) ? props.variant : "primary";
    el.className = `uis-button uis-button--${variant}`;
    const label = typeof props.label === "string" ? props.label : "";
    el.textContent = label;
    el.setAttribute("role", "button");
    return el;
  },
};
