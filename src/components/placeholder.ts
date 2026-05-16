import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const PlaceholderSchema = BasePropsSchema.extend({
  label: z.string().optional(),
}).passthrough();

export const PlaceholderDef: ComponentDef = {
  type: "placeholder",
  schema: PlaceholderSchema,
  render(props) {
    const el = createDiv({
      cls: "uis-placeholder",
      text: typeof props.label === "string" ? props.label : "",
    });
    return el;
  },
};
