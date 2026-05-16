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
    const variant =
      typeof props.variant === "string" && VARIANTS.has(props.variant) ? props.variant : "primary";
    const label = typeof props.label === "string" ? props.label : "";
    const el = createDiv({ cls: `uis-button uis-button--${variant}`, text: label });
    el.setAttribute("role", "button");
    return el;
  },
};
