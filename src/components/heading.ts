import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const HeadingSchema = BasePropsSchema.extend({
  text: z.string().optional(),
  level: z.number().optional(),
}).passthrough();

export const HeadingDef: ComponentDef = {
  type: "heading",
  schema: HeadingSchema,
  render(props) {
    const el = document.createElement("div");
    let level = typeof props.level === "number" ? Math.round(props.level) : 1;
    if (level < 1) level = 1;
    if (level > 6) level = 6;
    el.className = `uis-heading uis-heading--h${level}`;
    el.textContent = typeof props.text === "string" ? props.text : "";
    return el;
  },
};
