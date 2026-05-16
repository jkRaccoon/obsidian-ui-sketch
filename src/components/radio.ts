import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const RadioSchema = BasePropsSchema.extend({
  label: z.string().optional(),
  selected: z.boolean().optional(),
}).passthrough();

export const RadioDef: ComponentDef = {
  type: "radio",
  schema: RadioSchema,
  render(props) {
    const el = createDiv({ cls: "uis-radio" });
    if (props.selected === true) el.className += " uis-radio--selected";
    el.createSpan({ cls: "uis-radio__circle" });
    if (typeof props.label === "string") {
      el.createSpan({ cls: "uis-radio__label", text: props.label });
    }
    return el;
  },
};
