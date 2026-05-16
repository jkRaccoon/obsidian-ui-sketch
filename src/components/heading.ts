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
    let level = typeof props.level === "number" ? Math.round(props.level) : 1;
    if (level < 1) level = 1;
    if (level > 6) level = 6;
    const el = createDiv({
      cls: `uis-heading uis-heading--h${level}`,
      text: typeof props.text === "string" ? props.text : "",
    });
    return el;
  },
};
