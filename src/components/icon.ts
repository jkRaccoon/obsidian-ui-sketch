import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const IconSchema = BasePropsSchema.extend({
  name: z.string().optional(),
  size: z.number().optional(),
}).passthrough();

export const IconDef: ComponentDef = {
  type: "icon",
  schema: IconSchema,
  render(props) {
    const el = document.createElement("span");
    el.className = "uis-icon";
    const size = typeof props.size === "number" ? props.size : 16;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.lineHeight = `${size}px`;
    el.textContent = typeof props.name === "string" && props.name.length > 0 ? props.name[0] : "?";
    return el;
  },
};
