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
    const size = typeof props.size === "number" ? props.size : 16;
    const el = createSpan({
      cls: "uis-icon",
      text: typeof props.name === "string" && props.name.length > 0 ? props.name[0] : "?",
    });
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.lineHeight = `${size}px`;
    return el;
  },
};
